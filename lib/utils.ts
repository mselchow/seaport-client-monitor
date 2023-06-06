import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function secToTime(seconds: number) {
    const minutes = Math.floor((seconds / 60) % 60);
    const hours = Math.floor(seconds / (60 * 60));
    let result = "";

    if (hours >= 1) {
        result += hours + "h";
        if (minutes >= 1) {
            result += " ";
        }
    }
    if (minutes >= 1) {
        result += minutes + "m";
    }

    return result;
}
