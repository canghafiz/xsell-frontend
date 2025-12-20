import PrimaryBtn from "@/components/primary_btn";
import {ArrowRightIcon} from "lucide-react";

interface TopPostProps {
    onCLickNext?: () => void;
}

export default function TopPost({onCLickNext}: TopPostProps) {
    return <>
        {/* Header with back button and action buttons */}
        <div className="flex items-center justify-between mb-2">
            <button
                onClick={() => window.history.back()}
                className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1"
                aria-label="Go back"
            >
                ← Back
            </button>
            {onCLickNext && (
                <div className="flex gap-2">
                    <PrimaryBtn icon={ArrowRightIcon}
                                title="Next"
                                onClick={onCLickNext}
                                ariaLabel={`Next`}/>
                </div>
            )}
        </div>
    </>
}