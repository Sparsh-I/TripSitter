export interface Trip {
    tripId: string;
    legId: string;
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