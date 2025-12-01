import { bannerService } from '@/services/banner_service';
import BannersClient from '@/components/banners_client';

export default async function Banners() {
    const banners = await bannerService.getBanners();

    if (!banners || banners.length === 0) {
        return null;
    }

    const imagePrefixUrl = process.env.NEXT_PUBLIC_STORAGE_URL || '';

    return <BannersClient initialBanners={banners} imagePrefixUrl={imagePrefixUrl} />;
}