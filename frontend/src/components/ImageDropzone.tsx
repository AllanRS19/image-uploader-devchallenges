import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { MAX_SIZE, type ALLOWED_FILE_TYPES } from "../constants";
import { cn } from "../lib/utils";

const ACCEPTED_FILES: Record<(typeof ALLOWED_FILE_TYPES)[number], string[]> = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
};

const codeErrorMessages: Record<string, string> = {
    "file-too-large": "File is greater than 2 MB",
    "file-invalid-type": "File type is not valid",
    "too-many-files": "Only can file can be selected"
}

const getErrorMessage = (code: string) => codeErrorMessages[code] ?? "This file couldn't be uploaded";

const ImageDropzone = () => {

    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps, isDragActive, open, fileRejections } = useDropzone({
        noClick: true,
        accept: ACCEPTED_FILES,
        maxSize: MAX_SIZE,
        multiple: false
    });

    return (
        <section
            className={cn(
                "dropzone-container",
                isUploading ? "h-36" : "h-110"
            )}
        >
            {!isUploading ? (
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
        </section>
    )
}

export default ImageDropzone;