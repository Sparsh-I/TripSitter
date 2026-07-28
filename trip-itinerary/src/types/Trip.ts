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
}