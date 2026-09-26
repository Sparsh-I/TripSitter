import type { Connection } from '../types/Connection';
import {supabase} from "./SupabaseClient";

function fromRow(row: any): Connection {
    return {
        userId: row.user_id,
        connectionId: row.owner_id,
        status: row.status,
        updatedAt: row.updated_at,
        createdAt: row.created_at,
    }
}

export async function getConnections(): Promise<Connection[]> {
    const {data, error} = await supabase.from('connections').select('*');
    if (error) throw error;
    return data.map(fromRow);
}

export function pendingRequests(connections: Connection[]): Connection[] {
    return connections.filter(connection => connection.status === 'pending');
}

export function currentConnections(connections: Connection[]): Connection[] {
    return connections.filter(connection => connection.status === 'accepted');
}