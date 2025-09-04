import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleString();
}

export function calculateConfidence(scores: number[]): number {
  if (scores.length === 0) return 0;
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.max(0, Math.min(1, average));
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}