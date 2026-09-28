import type { Connection } from '../types/Connection';
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

export function otherUserId(connection: Connection, currentUserId: string): string {
    return connection.userId === currentUserId ? connection.connectionId : connection.userId;
}