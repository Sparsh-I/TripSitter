import {supabase} from "./SupabaseClient.ts";
import type {Profile} from "../types/Profile.ts";

export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;

    return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.username,
        photoUrl: data.photo_url,
        email: data.email,
    };
}

export async function updateProfile(profile: Partial<Profile> & {id: string}): Promise<void> {
    const { error } = await supabase
        .from('profiles')
        .update({
            first_name: profile.firstName,
            last_name: profile.lastName,
            username: profile.username,
            photo_url: profile.photoUrl,
        })
        .eq('id', profile.id);

    if (error) throw error;
}
