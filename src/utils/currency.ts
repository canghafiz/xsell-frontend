export function formatCurrency(amount: number): string {
    // Get currency code from environment variable; default to IDR
    const currencyCode = (process.env.NEXT_PUBLIC_CURRENCY?.trim() || 'IDR').toUpperCase();

    // Set of currencies that do not use fractional units (0 decimal places)
    const zeroDecimalCurrencies = new Set([
        'BHD', 'CLP', 'COP', 'CRC', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW',
        'LYD', 'MGA', 'PYG', 'RWF', 'UGX', 'UYI', 'VND', 'XAF', 'XOF', 'XPF',
        'IDR', 'HUF', 'TND', 'KWD', 'OMR'
    ]);

    // Map common currencies to their most appropriate locale
    const currencyLocaleMap: Record<string, string> = {
        IDR: 'id-ID',
        USD: 'en-US',
        EUR: 'de-DE',
        GBP: 'en-GB',
        JPY: 'ja-JP',
        CNY: 'zh-CN',
        INR: 'en-IN',
        KRW: 'ko-KR',
        BRL: 'pt-BR',
        MXN: 'es-MX',
        CAD: 'en-CA',
        AUD: 'en-AU',
        NZD: 'en-NZ',
        CHF: 'de-CH',
        RUB: 'ru-RU',
        TRY: 'tr-TR',
        ZAR: 'en-ZA',
        // Add more as needed
    };

    // Use mapped locale or fall back to en-US
    const locale = currencyLocaleMap[currencyCode] || 'en-US';

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: zeroDecimalCurrencies.has(currencyCode) ? 0 : 2,
            maximumFractionDigits: zeroDecimalCurrencies.has(currencyCode) ? 0 : 2,
        }).format(amount);
    } catch (error) {
        // Fallback if currency is invalid or unsupported
        console.warn(`Unsupported or invalid currency code: ${currencyCode} error on ${error}`);
        return `${amount.toLocaleString(locale)} ${currencyCode}`;
    }
}