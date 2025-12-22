'use client';

interface ModalDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ModalDialog({
                                        open,
                                        title = "Confirmation",
                                        description = "Are you sure?",
                                        confirmText = "Delete",
                                        cancelText = "Cancel",
                                        onConfirm,
                                        onCancel,
                                        loading = false,
                                    }: ModalDialogProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => {
                if (!loading) {
                    onCancel();
                }
            }}
        >
            {/* Modal Content */}
            <div
                className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()} // ❗ prevent close when clicking inside
            >
                {/* Title */}
                <h2 className="text-lg font-semibold text-red-600 mb-2">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6">
                    {description}
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="
                            px-4 py-2 text-sm rounded-md
                            border border-gray-300
                            text-gray-700
                            hover:bg-gray-100
                            disabled:opacity-50
                        "
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="
                            px-4 py-2 text-sm rounded-md
                            bg-red-600 text-white
                            hover:bg-red-700
                            disabled:opacity-50
                        "
                    >
                        {loading ? "Deleting..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
