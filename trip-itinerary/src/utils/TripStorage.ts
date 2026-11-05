import type { Trip } from '../types/Trip';
import type { TripLeg } from '../types/TripLeg';
import type { TripMember } from '../types/TripMember';
import {supabase} from "./SupabaseClient";

// const STORAGE_KEY = 'trips';

function fromTripRow(row: any): Trip {
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
    return data.map(fromTripRow);
}

export async function getTripById(id: string): Promise<Trip | null> {
    const {data, error} = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return fromTripRow(data);
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

function fromLegRow(row: any): TripLeg {
    return {
        tripId: row.trip_id,
        legId: row.leg_id,
        lat: row.lat,
        lng: row.lng,
        locationLabel: row.location_label,
        startDate: row.start_date,
        endDate: row.end_date,
        links : row.links ?? undefined,
        documents : row.links ?? undefined,
        photos : row.links ?? undefined,
        notes: row.notes ?? undefined,
    }
}

function toLegRow(leg: Omit<TripLeg, 'id'>) {
    return {
        trip_id: leg.tripId,
        location_label: leg.locationLabel,
        lat: leg.lat,
        lng: leg.lng,
        start_date: leg.startDate,
        end_date: leg.endDate,
        notes: leg.notes ?? null,
    };
}

export async function getTripLegs(tripId: string): Promise<TripLeg[]> {
    const { data, error } = await supabase
        .from('trip_legs')
        .select('*')
        .eq('trip_id', tripId)
        .order('start_date').order('end_date').order('created_at');
    if (error) throw error;
    return data.map(fromLegRow);
}


export async function getLegsForTrips(tripIds: string[]): Promise<TripLeg[]> {
    if (tripIds.length === 0) return [];
    const { data, error } = await supabase
        .from('trip_legs')
        .select('*')
        .in('trip_id', tripIds)
        .order('start_date');
    if (error) throw error;
    return data.map(fromLegRow);
}

export async function addTripLeg(leg: Omit<TripLeg, 'id'>): Promise<TripLeg> {
    const { data, error } = await supabase
        .from('trip_legs')
        .insert(toLegRow(leg))
        .select()
        .single();
    if (error) throw error;
    return fromLegRow(data);
}

export async function updateTripLeg(leg: TripLeg): Promise<void> {
    const { error } = await supabase
        .from('trip_legs')
        .update(toLegRow(leg))
        .eq('id', leg.legId);
    if (error) throw error;
}

export async function deleteTripLeg(legId: string): Promise<void> {
    const { error } = await supabase.from('trip_legs').delete().eq('id', legId);
    if (error) throw error;
}

export async function uploadPhoto(file: File, path: string): Promise<string> {
    const { error } = await supabase.storage.from('gallery').upload(path, file);
    if (error) throw error;

    const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path);
    return urlData.publicUrl;
}