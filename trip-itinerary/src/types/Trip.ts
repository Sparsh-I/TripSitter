export interface Trip {
    id: string;
    title: string;
    photos?: string[];
    lat: number;
    lng: number;
    locationLabel: string;
    startDate: Date;
    endDate: Date;
    link?: string;
    notes?: string;
}