import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function secToTime(seconds: number) {
    if (seconds === undefined) {
        return "0h 0m";
    }

    const hours = Math.floor(seconds / (60 * 60));
    const minutes = Math.floor((seconds / 60) % 60);

    return `${hours}h ${minutes}m`;
}
