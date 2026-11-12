import type { Trip } from "../types/Trip.ts";
import type { TripLeg } from "../types/Trip.ts";

type Dated = { startDate: Date, endDate: Date };

export const formatDate= (date: Date | undefined): string => {
    return date ? new Date(date).toLocaleDateString("en-GB", {weekday: "short", month: "short", day: "numeric"}) : '';
}

export function closestUpcomingTrip(tripList: Trip[]): Trip | null {
    const upcoming = futureTrips(tripList);

    if (upcoming.length === 0) return null;

    return upcoming.reduce((closest, trip) =>
        new Date(trip.startDate) < new Date(closest.startDate) ? trip : closest);
}

// export function currentTrips(tripList: Trip[]): Trip[] {
//     const today = new Date();
//     return tripList.filter(trip => new Date(trip.startDate) < today && new Date(trip.endDate) > today);
// }

export function futureTrips(tripList: Trip[]): Trip[] {
    const today = new Date();
    return tripList.filter(trip => new Date(trip.startDate) >= today);
}

// export function pastTrips(tripList: Trip[]): Trip[] {
//     const today = new Date();
//     return tripList.filter(trip => new Date(trip.endDate) <= today);
// }

export function currentItems<T extends Dated>(items: T[]): T[] {
    const today = new Date();
    return items.filter(item => new Date(item.startDate) < today && new Date(item.endDate) > today);
}

export function futureItems<T extends Dated>(items: T[]): T[] {
    const today = new Date();
    return items.filter(item => new Date(item.startDate) >= today);
}

export function pastItems<T extends Dated>(items: T[]): T[] {
    const today = new Date();
    return items.filter(item => new Date(item.endDate) <= today);
}

export function legsForTrips(trips: Trip[], legs: TripLeg[]): TripLeg[] {
    const ids = new Set(trips.map(t => t.id));
    return legs.filter(l => ids.has(l.tripId));
}