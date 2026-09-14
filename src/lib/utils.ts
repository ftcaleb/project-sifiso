export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const EASE_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];
export const EASE_CUBIC: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

export function pad(n: number, width = 2) {
  return String(n).padStart(width, '0');
}
