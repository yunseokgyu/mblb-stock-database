export function formatBilingual(korean: string, english: string): string {
    return `${korean} (${english})`;
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
}
