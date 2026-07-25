import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import uploadRouter from "./routes/upload.route";

const app = express();
const PORT = process.env.PORT || 3000;
const API_ROUTE = '/api/v1';

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173"
}));
app.use(express.json());

// Setting up API routes
app.use(`${API_ROUTE}/uploads`, uploadRouter);

app.get("/", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});