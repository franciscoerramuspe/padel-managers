import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUruguayDateTime(dateStr: string) {
  // La fecha viene en UTC, vamos a mantenerla así
  const date = new Date(dateStr);
  
  return {
    date: new Intl.DateTimeFormat('es-UY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'  // Mantener UTC
    }).format(date),
    time: new Intl.DateTimeFormat('es-UY', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'  // Mantener UTC
    }).format(date)
  };
}
