class CookiesService {
    setCookie(key: string, value: string, minutes = 60) {
        if (typeof document === "undefined") return;

        const expires = new Date();
        expires.setTime(expires.getTime() + minutes * 60 * 1000);

        document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
    }

    getCookie(key: string): string | null {
        if (typeof document === "undefined") return null;

        const cookies = document.cookie.split("; ");
        const found = cookies.find(c => c.startsWith(`${key}=`));

        return found ? decodeURIComponent(found.split("=")[1]) : null;
    }

    clearCookie(key: string) {
        if (typeof document === "undefined") return;

        document.cookie = `${key}=; Max-Age=0; path=/`;
    }
}

export const cookiesService = new CookiesService();
export default cookiesService;