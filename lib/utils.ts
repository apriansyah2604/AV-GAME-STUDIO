import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Konfigurasi WhatsApp Admin
export const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '62895327025015';
