import type { Trip } from '../types/Trip';
import {supabase} from "./SupabaseClient";

// const STORAGE_KEY = 'trips';

function fromRow(row: any): Trip {
    return {
        id: row.id,
        ownerId: row.owner_id,
        title: row.title,
        lat: row.lat,
        lng: row.lng,
        locationLabel: row.location_label,
        startDate: row.start_date,
        endDate: row.end_date,
        notes: row.notes ?? undefined,
        links : row.links ?? undefined,
    }
}

export async function getTrips(): Promise<Trip[]> {
    const {data, error} = await supabase.from('trips').select('*');
    if (error) throw error;
    return data.map(fromRow);

    // const raw = localStorage.getItem(STORAGE_KEY);
    // return raw ? JSON.parse(raw) : [];
    // return [
    //     {
    //         id: "2026-07-22T10:00:00.000Z",
    //         title: "Tokyo Adventure",
    //         lat: 35.6762,
    //         lng: 139.6503,
    //         locationLabel: "Tokyo, Japan",
    //         startDate: new Date("2026-09-10"),
    //         endDate: new Date("2026-09-20"),
    //         notes: "Cherry blossom season, remember to book teamLab tickets in advance",
    //     },
    //     {
    //         id: "2026-07-22T10:05:00.000Z",
    //         title: "Family Reunion",
    //         lat: 43.6532,
    //         lng: -79.3832,
    //         locationLabel: "Toronto, Ontario, Canada",
    //         startDate: new Date("2026-08-01"),
    //         endDate: new Date("2026-08-05"),
    //         notes: "Staying at Aunt Rosa's place",
    //     },
    //     {
    //         id: "2026-07-22T10:10:00.000Z",
    //         title: "Solo Backpacking",
    //         lat: -8.3405,
    //         lng: 115.0920,
    //         locationLabel: "Ubud, Bali, Indonesia",
    //         startDate: new Date("2025-11-15"),
    //         endDate: new Date("2025-11-30"),
    //         notes: "Yoga retreat first week, then explore rice terraces"
    //     },
    //     {
    //         id: "2026-07-22T10:15:00.000Z",
    //         title: "Ski Trip",
    //         lat: 51.1784,
    //         lng: -115.5708,
    //         locationLabel: "Banff, Alberta, Canada",
    //         startDate: new Date("2027-01-05"),
    //         endDate: new Date("2027-01-12")
    //     },
    //     {
    //         id: "2026-07-22T10:20:00.000Z",
    //         title: "European Summer",
    //         lat: 48.8566,
    //         lng: 2.3522,
    //         locationLabel: "Paris, France",
    //         startDate: new Date("2026-06-01"),
    //         endDate: new Date("2026-06-15"),
    //         notes: "Museum passes, Eiffel Tower at sunset"
    //     }
    // ];
}

export async function getTripById(id: string): Promise<Trip | null> {
    const {data, error} = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return fromRow(data);
}

export async function addTrip(trip: Omit<Trip, 'id' | 'ownerId'>): Promise<void> {
    const {data : {user}} = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in!");

    const { error } = await supabase
        .from('trips')
        .insert({
            owner_id: user.id,
            title: trip.title,
            lat: trip.lat,
            lng: trip.lng,
            location_label: trip.locationLabel,
            start_date: trip.startDate,
            end_date: trip.endDate,
            notes: trip.notes ?? undefined,
            links: trip.links ?? undefined,
        });
    if (error) throw error;
}

export async function updateTrip(trip: Trip): Promise<void> {
    const { error } = await supabase
        .from('trips')
        .update({
            title: trip.title,
            lat: trip.lat,
            lng: trip.lng,
            location_label: trip.locationLabel,
            start_date: trip.startDate,
            end_date: trip.endDate,
            notes: trip.notes ?? undefined,
            links: trip.links ?? undefined,
        })
        .eq('id', trip.id);
    if (error) throw error;
}

export async function deleteTrip(trip: Trip): Promise<void> {
    const { error } = await supabase.from('trips').delete().eq('id', trip.id);
    if (error) throw error;
}

// export function saveTrips(trips: Trip[]): void {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
// }