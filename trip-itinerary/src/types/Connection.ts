export interface Connection {
    userId: string;
    connectionId: string;
    status: "pending" | "accepted";
    updatedAt: string;
    createdAt: string;
}