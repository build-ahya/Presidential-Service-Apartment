import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fDate(date: string) {
  const dateObj = parseISO(date);
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }
  return format(new Date(date), 'MMMM dd, yyyy');
}

/**
 * Returns a human-readable time-ago string.
 * @param date - The date to compare to now
 * @returns string like "5 minutes ago" or "2 days ago"
 */
export function fDateNow(date: Date | string): string {
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch {
    return '';
  }
}

/**
 * Fixes Firebase Storage URLs by ensuring they have proper download tokens
 * @param url - The Firebase Storage URL to fix
 * @returns A properly formatted Firebase Storage URL or the original URL if not a Firebase Storage URL
 */
export function fixFirebaseStorageUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Check if it's a Firebase Storage URL
  if (!url.includes('firebasestorage.googleapis.com')) {
    return url;
  }

  // If it already has alt=media, it should be working
  if (url.includes('alt=media')) {
    return url;
  }

  // Try to extract the bucket and object path from the URL
  const match = url.match(/firebasestorage\.googleapis\.com\/v0\/b\/([^\/]+)\/o\/(.+?)(\?|$)/);
  if (match) {
    const bucket = match[1];
    const objectPath = match[2];
    // Return URL with alt=media parameter for public access
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${objectPath}?alt=media`;
  }

  // If we can't parse it, try to add alt=media to the existing URL
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}alt=media`;
}
