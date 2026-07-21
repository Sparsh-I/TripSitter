export interface Trip {
    id: string;
    lat: number;
    lng: number;
    startDate: string;
    endDate: string;
    notes?: string;
}