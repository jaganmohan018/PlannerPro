import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (!amount) return "$0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long", 
    day: "numeric",
  });
}

export function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatPercentage(value: number | string | null | undefined): string {
  if (!value) return "0%";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `${num.toFixed(1)}%`;
}

export function calculateSalesTrend(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
