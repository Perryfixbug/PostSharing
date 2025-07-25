import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toIsoDate(localeString: string) {
  const [day, month, year] = localeString.split('/').map(Number);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function aliasFullname(fullname: string) {
  const word = fullname.split(' ');
  return word.length >= 2
    ? (word[0] + word[word.length - 1]).toUpperCase()
    : word[0].slice(0, 2).toUpperCase();
}
