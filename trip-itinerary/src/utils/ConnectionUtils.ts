import type { Connection } from '../types/Connection';
import type { Profile } from '../types/Profile';
import {supabase} from "./SupabaseClient";

function fromRow(row: any): Connection {
    return {
        userId: row.user_id,
        connectionId: row.connection_id,
        status: row.status,
        updatedAt: row.updated_at,
        createdAt: row.created_at,
    }
}

async function requireUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");
    return user;
}   

export async function getConnections(): Promise<Connection[]> {
    const user = await requireUser();
    const {data, error} = await supabase
        .from('connections')
        .select('*')
        .or(`user_id.eq.${user.id},connection_id.eq.${user.id}`);
    
        if (error) throw error;
    return data.map(fromRow);
}

// Functions pertaining to returning connection statuses

function pendingRequests(connections: Connection[]): Connection[] {
    return connections.filter(c => c.status === 'pending');
}

export function incomingRequests(connections: Connection[], currentUserId: string): Connection[] {
    return pendingRequests(connections).filter(c => c.connectionId === currentUserId);
}

export function outgoingRequests(connections: Connection[], currentUserId: string): Connection[] {
    return pendingRequests(connections).filter(c => c.userId === currentUserId);
}

export function currentConnections(connections: Connection[]): Connection[] {
    return connections.filter(c => c.status === 'accepted');
}

// Functions related to adding/view connections

export async function sendConnectionRequest(currentUserId: string, otherUserId: string): Promise<Connection> {
    if (currentUserId === otherUserId) {
        throw new Error("Cannot send connection request to self");
    }
    
    try {
        const userExists = await checkUserExists(otherUserId);
        if (!userExists) {
            throw new Error("User does not exist");
        }
    } catch (e: any) {
        throw new Error(`Failed to check if user exists: ${e.message}`);
    }
    
    const { data, error } = await supabase
        .from('connections')
        .insert([
            { user_id: currentUserId, connection_id: otherUserId, status: 'pending' }
        ]);

    if (error) {
        throw new Error(`Failed to send connection request: ${error.message}`);
    }

    return fromRow(data);
}

async function checkUserExists(userId: string): Promise<boolean> {
    const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId);
        
        if (error) throw error;

        return data.length != 0;
}

export async function ignoreRequest(otherUserId: string): Promise<void> {
    const user = await requireUser();
    const { error } = await supabase
        .from('connections')
        .delete()
        .or(`user_id.eq.${user.id},connection_id.eq.${user.id}`)
        .eq('status', 'pending')
        .eq('user_id', otherUserId)
        .eq('connection_id', user.id);
    
    if (error) throw new Error(`Failed to ignore connection request: ${error.message}`);
}

export async function acceptRequest(otherUserId: string): Promise<void> {
    const user = await requireUser();
    const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('status', 'pending')
        .eq('user_id', otherUserId)
        .eq('connection_id', user.id);
    
    if (error) throw new Error(`Failed to accept connection request: ${error.message}`);
}

export async function cancelRequest(otherUserId: string): Promise<void> {
    const user = await requireUser();
    const { error } = await supabase
        .from('connections')
        .delete()
        .eq('status', 'pending')
        .eq('user_id', user.id)
        .eq('connection_id', otherUserId);
    
    if (error) throw new Error(`Failed to cancel connection request: ${error.message}`);
}

export async function viewProfile(otherUserId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .single();
    
    if (error) throw new Error(`Failed to view profile: ${error.message}`);
    return data;
}

export function otherUserId(connection: Connection, currentUserId: string): string {
    return connection.userId === currentUserId 
        ? connection.connectionId 
        : connection.userId;
}

