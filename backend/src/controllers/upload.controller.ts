import type { Request, Response } from "express"
import { sendResponse } from "../lib/utils";
import { utapi } from "../lib/uploadthing";

export const uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
        return sendResponse(res, 400, false, "No file provided");
    }

    try {
        const file = new File([req.file.buffer], req.file.originalname, {
            type: req.file.mimetype
        });

        const response = await utapi.uploadFiles(file);

        if (response.error) {
            return sendResponse(res, 500, false, response.error.message);
        }

        return sendResponse(
            res,
            200,
            true,
            "File uploaded successfully",
            {
                url: response.data.ufsUrl,
                key: response.data.key,
                name: response.data.name,
            }
        )
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Upload failed");
    }
}

export const downloadImage = async (req: Request, res: Response) => {

    const { filename } = req.params;

    try {
        if (!filename) return sendResponse(res, 400, false, "Missing file to download");

        if (!process.env.UPLOADTHING_APP_ID) {
            return sendResponse(res, 500, false, "APP ID is not configured");
        }

        const fileUrl = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${filename}`;
        const fileRes = await fetch(fileUrl);

        if (!fileRes.ok) {
            return sendResponse(res, 404, false, "File not found");
        }

        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader(
            "Content-Type",
            fileRes.headers.get("Content-Type") || "application/octet-stream"
        );

        const buffer = Buffer.from(await fileRes.arrayBuffer());
        return res.status(200).send(buffer);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, "Download failed");
    }
}