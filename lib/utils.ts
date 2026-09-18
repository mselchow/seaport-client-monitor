import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function secToTime(seconds: number | undefined) {
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

    const sign = hours < 0 ? "-" : "";
    const totalMinutes = Math.round(Math.abs(hours) * 60);
    const wholeHours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${sign}${wholeHours}h ${minutes}m`;
}

export function formatHoursCompact(hours: number) {
    if (!Number.isFinite(hours)) {
        return "0h";
    }

    const totalMinutes = Math.round(Math.abs(hours) * 60);
    const wholeHours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (wholeHours === 0) {
        return `${minutes}m`;
    }

    if (minutes === 0) {
        return `${wholeHours}h`;
    }

    return `${wholeHours}h ${minutes}m`;
}

export function secToHours(seconds: number | undefined) {
    if (seconds === undefined) {
        return 0;
    }

    const hours = (seconds / (60 * 60)).toFixed(2);

    return Number(hours);
}

export function parseDayNumber(dayOfWeek: string) {
    return Number(format(parse(dayOfWeek, "EEEE", new Date()), "e")) - 1;
}
