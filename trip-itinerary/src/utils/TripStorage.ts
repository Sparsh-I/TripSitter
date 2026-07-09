import type {Trip} from '../types/Trip';

const STORAGE_KEY = 'trips';

export function getTrips(): Trip[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function saveTrips(trips: Trip[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}