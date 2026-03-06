import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shareUrl = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch (error) {
    console.error("Copy failed", error);
    return false;
  }
};

export const convertMinutesToHours = (minutes: number) => {
  if (!minutes && minutes !== 0) return "";

  const duration = moment.duration(minutes, "minutes");
  const hours = Math.floor(duration.asHours());
  const mins = duration.minutes();

  return `${hours}h ${mins}m`;
};

export const convertToUTC = (date: string, time: string) => {
  return moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").utc().toISOString();
};

export const routePointDisplay = (
  point:
    | string
    | { display?: string; mainLocation?: string; location?: string }
    | undefined
): string => {
  if (point == null) return "";
  if (typeof point === "string") return point;
  return point.display ?? point.mainLocation ?? point.location ?? "";
};
