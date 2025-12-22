'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import wishlistService from '@/services/wishlist_service';
import { WishlistPayload } from '@/types/wishlist';
import { User } from '@/types/user';
import cookiesService from '@/services/cookies_service';
import Toast from '@/components/toast';

interface WishlistBtnProps {
    productId: number;
    initialWishlist?: boolean;
    onWishlistToggled?: () => void; // 🔹 callback to refetch parent data
}

export default function WishlistBtn({
                                        productId,
                                        initialWishlist = false,
                                        onWishlistToggled,
                                    }: WishlistBtnProps) {
    const [isWishlisted, setIsWishlisted] = useState(initialWishlist);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    // 🔹 Fetch authenticated user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const { user } = await res.json();
                setUser(user);
            } catch {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    // 🔹 Check wishlist status
    useEffect(() => {
        const checkWishlist = async () => {
            if (!user) return;

            const loginData = cookiesService.getCookie('login_data');
            if (!loginData) return;

            const payload: WishlistPayload = {
                user_id: user.user_id,
                product_id: productId,
            };

            try {
                const res = await wishlistService.checkWishlist(payload, loginData);
                if (res.success) setIsWishlisted(res.data);
            } catch (error) {
                console.warn('Failed to check wishlist', error);
            }
        };
        checkWishlist();
    }, [user, productId]);

    // 🔹 Toggle wishlist
    const toggleWishlist = async () => {
        if (!user) {
            setToast({ type: 'error', message: 'Please sign in first to use wishlist' });
            return;
        }

        if (loading) return;

        const loginData = cookiesService.getCookie('login_data');
        if (!loginData) {
            setToast({ type: 'error', message: 'Session expired, please login again' });
            return;
        }

        const payload: WishlistPayload = { user_id: user.user_id, product_id: productId };
        const previousState = isWishlisted;

        setIsWishlisted(!previousState); // optimistic UI
        setLoading(true);

        try {
            const res = await wishlistService.updateWishlist(payload, loginData);
            if (!res.success) {
                setIsWishlisted(previousState);
                setToast({ type: 'error', message: 'Failed to update wishlist' });
                return;
            }

            setToast({
                type: 'success',
                message: previousState ? 'Removed from wishlist' : 'Added to wishlist',
            });

            // 🔹 Call parent callback to refetch favorites
            if (onWishlistToggled) onWishlistToggled();

        } catch (error) {
            console.error('Wishlist error:', error);
            setIsWishlisted(previousState);
            setToast({ type: 'error', message: 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <button
                type="button"
                disabled={loading}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist();
                }}
                className="cursor-pointer p-1 rounded-full bg-white/80 backdrop-blur-sm shadow hover:bg-white transition-colors disabled:opacity-60"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <Heart
                    size={24}
                    className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                />
            </button>
        </>
    );
}
