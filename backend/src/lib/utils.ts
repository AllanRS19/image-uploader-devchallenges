import type { Response } from "express"

export const sendResponse = (
    res: Response,
    status: number,
    success: boolean,
    message: string,
    data: unknown = null

) => res.status(status).json({ success, message, data });