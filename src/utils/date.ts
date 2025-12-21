export const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);

    const locale =
        process.env.NEXT_PUBLIC_DATE_LOCALE || "en-US";

    const timeZone =
        process.env.NEXT_PUBLIC_TIMEZONE || "Asia/Jakarta";

    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone,
    }).format(date);
};