import { useRouter } from 'next/navigation';

export default function EmptyStateMyAds() {
    const router = useRouter();
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'XSELL';

    return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
            <div className="w-full max-w-2xl bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                    Want to see your items here?
                </h2>

                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                    Earn extra money now by selling items in your community.
                    <br />
                    Start selling on <span className="font-semibold">{appName}</span>, it&#39;s fast and easy.
                </p>

                <button
                    onClick={() => router.push('/post')}
                    className="
                        cursor-pointer bg-white text-red-600
                        font-semibold text-lg
                        px-8 py-4 
                        rounded-xl
                        hover:bg-red-50
                        active:scale-95
                        transition-all duration-200
                        shadow-lg
                        border-2 border-white
                        w-full max-w-md
                    "
                >
                    Post ad
                </button>
            </div>
        </div>
    );
}