import type {Trip} from "../types/Trip.ts";

// const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

export const formatDate= (date: Date | undefined): string => {
    return date ? date.toLocaleDateString("en-GB", {weekday: "short", month: "short", day: "numeric"}) : '';
}

export function closestUpcomingTrip(tripList: Trip[]): Trip | null {
    const upcoming = futureTrips(tripList);

    if (upcoming.length === 0) return null;

    return upcoming.reduce((closest, trip) =>
        new Date(trip.startDate) < new Date(closest.startDate) ? trip : closest);
}

export function futureTrips(tripList: Trip[]): Trip[] {
    const today = new Date();
    return tripList.filter(trip => new Date(trip.startDate) >= today);
}

export function pastTrips(tripList: Trip[]): Trip[] {
    const today = new Date();
    return tripList.filter(trip => new Date(trip.endDate) <= today);
}