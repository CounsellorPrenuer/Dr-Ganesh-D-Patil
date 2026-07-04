const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  try {
    return inr.format(amount);
  } catch {
    return `Rs. ${amount.toLocaleString("en-IN")}`;
  }
}
