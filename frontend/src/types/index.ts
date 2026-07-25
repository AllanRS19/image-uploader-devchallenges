export type ServerUploadResponse = {
    success: boolean;
    message: string;
    data: {
        url: string;
        key: string;
        name: string;
    }
}