'use client';

import LayoutTemplate from "@/components/layout";
import TopPost from "@/components/post/top_post";
import Toast from "@/components/toast";
import {useState} from "react";
import PostListingForm from "@/components/post/post_listing_form";

export default function PostAttribute() {
    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    return (
        <LayoutTemplate>
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <TopPost />
            <PostListingForm/>
        </LayoutTemplate>
    );
}
