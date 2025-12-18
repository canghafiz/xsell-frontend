'use client';

import LayoutTemplate from "@/components/layout";
import TopPost from "@/components/post/top_post";
import Toast from "@/components/toast";
import {useState} from "react";

export default function PostAttribute() {
    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    /**
     * Proceed to next step if a category is selected.
     */
    const onClickNext = () => {
    };

    return (
        <LayoutTemplate>
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <TopPost onCLickNext={onClickNext} />

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    Select Category
                </h2>

            </div>
        </LayoutTemplate>
    );
}
