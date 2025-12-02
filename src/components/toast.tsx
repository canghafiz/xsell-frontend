"use client";
import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // auto close 3s
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-slide-in
        ${type === "success" ? "bg-green-100 border-green-300 text-green-700" : "bg-red-100 border-red-300 text-red-700"}
      `}
        >
            <span className="font-medium">{type === "success" ? "Success" : "Error"}</span>
            <span>{message}</span>
        </div>
    );
}
