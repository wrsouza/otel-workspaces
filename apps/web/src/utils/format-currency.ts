export function formatCurrency(
  amount: number,
  currencyCode: string,
  locale: string = "en-US"
): string {
  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);

  return formattedAmount;
}
