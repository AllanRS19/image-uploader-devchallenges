import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Link, Loader2, Upload } from "lucide-react";
import { ALLOWED_FILE_TYPES, MAX_SIZE } from "../constants";
import { cn } from "../lib/utils";
import type { ServerUploadResponse } from "../types";
import { sileo } from "sileo";
import { Button } from "./ui/button";

const ACCEPTED_FILES: Record<(typeof ALLOWED_FILE_TYPES)[number], string[]> = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
};

const codeErrorMessages: Record<string, string> = {
    "file-too-large": "File is greater than 2 MB",
    "file-invalid-type": "File type is not valid",
    "too-many-files": "Only one file can be selected"
}

const getErrorMessage = (code: string) => codeErrorMessages[code] ?? "This file couldn't be uploaded";

const ImageDropzone = () => {

    const [isUploading, setIsUploading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [uploadedFileData, setUploadedFileData] = useState<{ url: string; key: string; name: string; } | null>(null);

    const handleImageUpload = async (acceptedFiles: File[]) => {

        if (acceptedFiles.length <= 0) {
            return;
        }

        try {

            setIsUploading(true);

            const file = acceptedFiles[0];

            const formData = new FormData();

            formData.append('file', file);

            const request = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/uploads`, {
                method: 'POST',
                body: formData,
            });

            if (!request.ok) {
                sileo.error({
                    title: 'Failed to upload file',
                    description: "There was an error uploading your file. Please try again"
                });
                return;
            }

            const response: ServerUploadResponse = await request.json();

            sileo.success({
                title: "Upload successful",
                description: "Your file was uploaded successfully and can be shared or downloaded now"
            });

            setUploadedFileData(response.data);

        } catch {
            sileo.error({
                title: 'Failed to upload file',
                description: "There was an error uploading your file. Please try again"
            });
        } finally {
            setIsUploading(false);
        }
    }

    const handleFileShare = async () => {
        if (!uploadedFileData) return;

        try {
            await navigator.clipboard.writeText(uploadedFileData.url);
            sileo.success({ title: "Link copied to clipboard" });
        } catch {
            sileo.error({ title: "Could not copy link to clipboard" });
        }
    }

    const handleFileDownload = async () => {
        if (!uploadedFileData) return;

        try {
            setIsDownloading(true);

            const request = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/uploads/download/${uploadedFileData.key}`);

            if (!request.ok) {
                sileo.error({
                    title: "Could not download image",
                    description: "There was an error downloading your image. Please try again later"
                })
                return;
            }

            const blob = await request.blob();
            const objectUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = uploadedFileData.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(objectUrl);

            sileo.success({
                title: "Your image is ready to download",
                description: "Your image has been retrieved successfully and is ready to be saved on your device"
            });

        } catch {
            sileo.error({
                title: "Could not download image",
                description: "There was an error downloading your image. Please try again later"
            });
        } finally {
            setIsDownloading(false);
        }
    }

    const { getRootProps, getInputProps, isDragActive, open, fileRejections } = useDropzone({
        noClick: true,
        accept: ACCEPTED_FILES,
        maxSize: MAX_SIZE,
        multiple: false,
        onDrop: handleImageUpload
    });

    return (
        <section className="dropzone-container">
            <div
                className={cn(
                    "dropzone-container-inner",
                    isUploading ? "h-36" : "h-110"
                )}
            >
                {!isUploading ? (
                    <>
                        {uploadedFileData ? (
                            <div className="dropzone-image-preview">
                                <img
                                    src={uploadedFileData.url}
                                    alt={uploadedFileData.name}
                                />
                            </div>
                        ) : (
                            <div
                                {...getRootProps({ className: cn("dropzone", fileRejections.length > 0 && "border-red-600") })}
                            >
                                <input {...getInputProps()} />
                                <Upload className="size-8 text-blue-700" />
                                <p className="font-semibold mt-6 mb-2">
                                    {isDragActive ? "Drop the file " : "Drag & drop a file or"} <span className={cn("text-blue-700", isDragActive ? "cursor-default" : "cursor-pointer")} onClick={() => isDragActive ? {} : open()}>{isDragActive ? " here" : " browse files"}</span>
                                </p>
                                <span className="text-sm font-light">JPG, PNG or GIF - Max file size 2MB</span>

                                {!isDragActive && fileRejections.length > 0 && fileRejections.map(({ file, errors }) => (
                                    <div
                                        key={file.name}
                                        role="alert"
                                    >
                                        {errors.map(({ code }) => (
                                            <p
                                                className="text-red-600 mt-2 text-sm"
                                                key={code}
                                            >
                                                {getErrorMessage(code)}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="size-full flex flex-col items-center justify-center gap-4">
                        <p className="font-semibold text-[15px] sm:text-base text-center">
                            Uploading,
                            <span className="font-light"> please wait...</span>
                        </p>
                        <div className="relative w-full sm:w-[70%] h-2 bg-border-color dark:bg-grey-400 rounded-full overflow-hidden">
                            <div className="absolute top-0 bottom-0 w-[15%] bg-blue-700 animate-upload-loader rounded-full" />
                        </div>
                    </div>
                )}
            </div>

            {uploadedFileData && (
                <div className="uploaded-image-btns">
                    <Button
                        onClick={handleFileShare}
                    >
                        <Link />
                        Share
                    </Button>
                    <Button
                        onClick={handleFileDownload}
                        disabled={isDownloading}
                    >
                        {isDownloading ? <Loader2 className="animate-spin" /> : <Download />}
                        {isDownloading ? "Downloading..." : "Download"}
                    </Button>
                </div>
            )}
        </section>
    )
}

export default ImageDropzone;