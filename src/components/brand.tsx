"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Brand() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "App";
    const router = useRouter();

    function onClick() {
        router.push("/");
    }

    return (
        <div onClick={onClick} className="flex-shrink-0 cursor-pointer">
            <Image
                src="/brand.png"
                alt={appName + " Logo"}
                width={124}
                height={124}
                className="hidden sm:block"
                priority
                style={{ width: 'auto', height: 'auto' }}
            />
            <Image
                src="/brand-small.png"
                alt={appName + " Logo"}
                width={40}
                height={40}
                className="sm:hidden"
                priority
                style={{ width: 'auto', height: 'auto' }}
            />
        </div>
    );
}