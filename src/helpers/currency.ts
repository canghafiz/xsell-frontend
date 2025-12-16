const CURRENCY_LOCALE_MAP: Record<string, string> = {
    IDR: "id-ID",
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
    CNY: "zh-CN",
    INR: "en-IN",
    KRW: "ko-KR",
    BRL: "pt-BR",
    MXN: "es-MX",
    CAD: "en-CA",
    AUD: "en-AU",
    NZD: "en-NZ",
    CHF: "de-CH",
    RUB: "ru-RU",
    TRY: "tr-TR",
    ZAR: "en-ZA",
};

const ZERO_DECIMAL = new Set([
    "BHD", "CLP", "COP", "CRC", "DJF", "GNF", "ISK", "JPY", "KMF", "KRW",
    "LYD", "MGA", "PYG", "RWF", "UGX", "UYI", "VND", "XAF", "XOF", "XPF",
    "IDR", "HUF", "TND", "KWD", "OMR",
]);

const getCurrencyConfig = () => {
    const code = (process.env.NEXT_PUBLIC_CURRENCY || "IDR").toUpperCase();

    return {
        code,
        locale: CURRENCY_LOCALE_MAP[code] || "en-US",
        zeroDecimal: ZERO_DECIMAL.has(code),
    };
};

export const formatCurrency = (amount: number): string => {
    const { code, locale, zeroDecimal } = getCurrencyConfig();

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: code,
        minimumFractionDigits: zeroDecimal ? 0 : 2,
        maximumFractionDigits: zeroDecimal ? 0 : 2,
    }).format(amount);
};

export const getCurrencySymbol = (): string => {
    const { code, locale } = getCurrencyConfig();

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(0)
        .replace(/[\d\s.,]/g, "")
        .trim();
};
