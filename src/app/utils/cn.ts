import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * TailwindCSS sınıf isimlerini birleştirmek için kullanılan yardımcı fonksiyon.
 * clsx ile sınıfları birleştirir ve tailwind-merge ile çakışan sınıfları çözer.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 