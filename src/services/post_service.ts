import {CreatePostApiResponse, ProductListingPayload} from "@/types/post";

class PostService {
    async createPost(token: string, payload: ProductListingPayload): Promise<CreatePostApiResponse> {
        try {
            const res = await fetch("/api/post/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const responseData: CreatePostApiResponse= await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    code: responseData.code ?? res.status,
                    data: responseData.data,
                };
            }

            return {
                success: true,
                code: responseData.code ?? 200,
            };
        } catch (error) {
            console.error("Create post error:", error);

            return {
                success: false,
                code: 500,
            };
        }
    }
}

export const postService = new PostService();
export default postService;