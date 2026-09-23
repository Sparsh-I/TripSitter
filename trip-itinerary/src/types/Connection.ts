export type ConnectionStatus = "pending" | "accepted" | "rejected";

export interface Connection {
    userId: string;
    connectionId: string;
    status: ConnectionStatus;
    updatedAt: string;
    createdAt: string;
}