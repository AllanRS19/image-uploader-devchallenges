import multer from "multer";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter(_req, file, cb) {
        if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
            return cb(new Error("INVALID_FILE_TYPE"));
        }
        cb(null, true);
    },
}).single("file");