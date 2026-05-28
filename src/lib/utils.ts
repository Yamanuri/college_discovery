// src/lib/utils.ts

export function formatFees(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatPackage(amountInRupees: number): string {
  const lpa = amountInRupees / 100000
  return `${lpa.toFixed(1)} LPA`
}
