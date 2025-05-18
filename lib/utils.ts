import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import colors from "tailwindcss/colors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHexFromTailwindClass(twClass: string) {
  const match = twClass.match(/(?:bg|text|border)-([a-z]+)-(\d{3})/);
  if (!match) return null;

  const [, colorName, shade] = match;
  const tailwindColor = colors[colorName];

  return tailwindColor?.[shade] || null;
}
