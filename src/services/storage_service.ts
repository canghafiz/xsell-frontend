import {StorageDeleteApiResponse, StorageUploadApiResponse} from "@/types/storage";

class StorageService {
    async uploadFiles(files: File[]): Promise<StorageUploadApiResponse> {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
            if (!baseUrl) {
                throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
            }

            // Validasi files
            if (!files || files.length === 0) {
                return {
                    success: false,
                    code: 400,
                    data: undefined,
                };
            }

            // Buat FormData
            const formData = new FormData();
            files.forEach(file => {
                formData.append("files", file);
            });

            const res = await fetch(`${baseUrl}/api/storage`, {
                method: "POST",
                body: formData,
            });

            const responseData: StorageUploadApiResponse = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    code: responseData.code ?? res.status,
                    data: undefined,
                };
            }

            return {
                success: true,
                code: responseData.code ?? 200,
                data: responseData.data,
            };
        } catch (error) {
            console.error("Upload files error:", error);

            return {
                success: false,
                code: 500,
                data: undefined,
            };
        }
    }
    async deleteFiles(fileUrls: string[]): Promise<StorageDeleteApiResponse> {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
            if (!baseUrl) {
                throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
            }

            if (!fileUrls || fileUrls.length === 0) {
                return {
                    success: false,
                    code: 400,
                    message: "No file URLs provided",
                };
            }

            let successCount = 0;
            let failedCount = 0;

            for (const fileUrl of fileUrls) {
                try {
                    const res = await fetch(`${baseUrl}/api/storage?url=${encodeURIComponent(fileUrl)}`, {
                        method: "DELETE",
                    });

                    const responseData = await res.json();

                    if (res.ok) {
                        successCount++;
                    } else {
                        failedCount++;
                        console.error(`Failed to delete ${fileUrl}:`, responseData.data);
                    }
                } catch (error) {
                    const errorMsg = error instanceof Error ? error.message : "Network error";
                    failedCount++;
                    console.error(`Failed to delete ${fileUrl}:`, errorMsg);
                }
            }

            return {
                success: failedCount === 0,
                code: failedCount === 0 ? 200 : (successCount > 0 ? 207 : 500), // 207 = partial success
                message: `Deleted ${successCount} of ${fileUrls.length} files`,
            };
        } catch (error) {
            console.error("Delete files error:", error);

            const message =
                error instanceof Error
                    ? error.message
                    : "Network error";

            return {
                success: false,
                code: 500,
                message: message,
            };
        }
    }
}

export const storageService = new StorageService();
export default storageService;