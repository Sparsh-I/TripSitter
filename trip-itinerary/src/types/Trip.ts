export interface Trip {
    id: string;
    title: string;
    lat: number;
    lng: number;
    locationLabel: string;
    startDate: Date;
    endDate: Date;
    notes?: string;
}