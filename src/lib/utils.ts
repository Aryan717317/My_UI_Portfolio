import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssetUrl(fileName: string): string {
  if (typeof window === 'undefined') {
    return `/${fileName}`;
  }
  const pathname = window.location.pathname;
  if (pathname.includes('/My_UI_Portfolio')) {
    return `/My_UI_Portfolio/${fileName}`;
  }
  return `/${fileName}`;
}
