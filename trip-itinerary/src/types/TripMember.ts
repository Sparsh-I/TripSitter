export interface TripMember {
    tripId: string;
    userId: string;
    status: "pending" | "accepted"; 
}