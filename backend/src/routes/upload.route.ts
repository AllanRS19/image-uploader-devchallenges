import { Router, type NextFunction, type Request, type Response } from "express";
import { downloadImage, uploadImage } from "../controllers/upload.controller";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { sendResponse } from "../lib/utils";

const uploadRouter = Router();

const handleUpload = (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: any) => {
        if (err) {
            if (err.message === 'INVALID_FILE_TYPE') {
                return sendResponse(res, 400, false, "Only JPG, PNG or GIF files are allowed");
            }

            if (err.code === 'LIMIT_FILE_SIZE') {
                return sendResponse(res, 400, false, "File exceeds the 2MB limit");
            }

            return sendResponse(res, 400, false, "Upload error")
        }
        next();
    });
}

// GET: /api/v1/uploads/download:filename
uploadRouter.get('/download/:filename', downloadImage);

// POST: /api/v1/uploads
uploadRouter.post('/', handleUpload, uploadImage);

export default uploadRouter;