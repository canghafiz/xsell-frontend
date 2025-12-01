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
                width={0}
                height={0}
                className="hidden sm:block h-10 w-auto"
                priority
                sizes="100vw"
                style={{width: 'auto', height: '2.5rem'}}
            />
            <Image
                src="/brand-small.png"
                alt={appName + " Logo"}
                width={0}
                height={0}
                className="sm:hidden h-10 w-auto"
                priority
                sizes="100vw"
                style={{width: 'auto', height: '2.5rem'}}
            />
        </div>
    );
}