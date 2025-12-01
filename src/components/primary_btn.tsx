import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
    "cursor-pointer font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
                secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
                outline: "border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500",
                ghost: "text-red-600 hover:bg-red-50 focus:ring-red-500",
                danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
            },
            size: {
                sm: "px-3 py-1.5 text-xs rounded",
                md: "px-4 py-2 rounded-lg",
                lg: "px-6 py-3 text-base rounded-lg",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

interface PrimaryBtnProps extends VariantProps<typeof buttonVariants> {
    icon: React.ElementType;
    title: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    ariaLabel?: string;
}

export default function PrimaryBtn({
                                       icon: Icon,
                                       title,
                                       onClick,
                                       disabled = false,
                                       loading = false,
                                       className,
                                       type = "button",
                                       variant,
                                       size,
                                       ariaLabel,
                                   }: PrimaryBtnProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            aria-label={ariaLabel || title} // ✅ Accessibility fix
            className={buttonVariants({ variant, size, className })}
        >
            {loading ? (
                <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : (
                <Icon className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="sr-only sm:not-sr-only">
                {loading ? "Loading..." : title}
            </span>
        </button>
    );
}