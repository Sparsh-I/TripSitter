export interface Trip {
    id: string;
    ownerId: string;
    title: string;
    lat: number;
    lng: number;
    locationLabel: string;
    startDate: Date;
    endDate: Date;
    notes?: string;
    links?: string[];
    photo?: string;
    archived: boolean;
}

export interface TripLeg {
    tripId: string;
    legId: string;
    legTitle: string;
    lat: number;
    lng: number;
    locationLabel: string;
    startDate: Date;
    endDate: Date;
    links?: string[];
    documents?: string[];
    photos?: string[];
    notes?: string;
}

export interface TripMember {
    tripId: string;
    userId: string;
    status: "pending" | "accepted";
    invitedBy: string;
}

export interface TripInvite {
    tripId: string;
    title: string;
    invitedAt: string;
    inviter: { id: string; username: string; firstName: string | null; lastName: string | null } | null;
}