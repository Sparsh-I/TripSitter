import type { Trip } from '../types/Trip';
import type { TripMember } from '../types/TripMember';
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

export async function getTripMembers(tripId: string): Promise<TripMember[]> {
    const { data, error } = await supabase
        .from("trip_members")
        .select("*")
        .eq("trip_id", tripId);
    
    if (error) throw error;

    return data.map(r => ({ tripId: r.trip_id, userId: r.user_id, status: r.status }));

}

export async function inviteTripMember(tripId: string, userId: string): Promise<void> {
    const { error } = await supabase
        .from("trip_members")
        .insert({ trip_id: tripId, user_id: userId, status: "pending" });

    if (error) throw new Error(error.code === "23505" ? "Already invited" : error.message);
}

export async function acceptTripInvite(tripId: string): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase
        .from("trip_members").update({ status: "accepted" })
        .eq("trip_id", tripId).eq("user_id", user.id);

    if (error) throw error;
}

export async function removeTripMember(tripId: string, userId: string): Promise<void> {
    const { error } = await supabase
        .from("trip_members")
        .delete()
        .eq("trip_id", tripId)
        .eq("user_id", userId);

    if (error) throw error;
}