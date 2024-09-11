import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
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

export function hoursToTime(hours: number) {
    if (hours === undefined) {
        return "0h 0m";
    }

    const time = hours.toString().split(".");
    const minutes = ((hours - Number(time[0])) * 60).toFixed(0);

    return `${time[0]}h ${minutes}m`;
}

export function secToHours(seconds: number) {
    if (seconds === undefined) {
        return 0;
    }

    const hours = (seconds / (60 * 60)).toFixed(2);

    return Number(hours);
}

export function parseDayNumber(dayOfWeek: string) {
    return Number(format(parse(dayOfWeek, "EEEE", new Date()), "e")) - 1;
}
