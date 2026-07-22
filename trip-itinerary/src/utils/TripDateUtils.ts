import type {Trip} from "../types/Trip.ts";

const today = new Date()
    //.toISOString().split('T')[0]; // "YYYY-MM-DD"

export const formatDate= (date: Date | undefined): string => {
    return date ? date.toLocaleDateString("en-GB", {weekday: "short", month: "short", day: "numeric"}) : '';
}

export function futureTrips(tripList: Trip[]): Trip[] {
    const newTripList: Trip[] = [];
    tripList.forEach(trip => {
        if (trip.startDate >= today) {
            newTripList.push(trip);
        }
    });
    return newTripList;
}

export function pastTrips(tripList: Trip[]): Trip[] {
    const newTripList: Trip[] = [];
    tripList.forEach(trip => {
        if (trip.endDate <= today) {
            newTripList.push(trip);
        }
    });
    return newTripList;
}