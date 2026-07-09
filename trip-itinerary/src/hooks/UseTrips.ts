import { useState, useEffect } from "react";
import type { Trip } from '../types/Trip';
import { getTrips, saveTrips } from "../utils/TripStorage.ts";

export function useTrips() {
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        setTrips(getTrips());
    }, []);

    useEffect(() => {
        saveTrips(trips);
    }, [trips]);

    function addTrip(trip: Omit<Trip, 'id'>) {
        const newTrip: Trip = { id: Date.now().toString(), ...trip};
        setTrips(prev => [...prev, newTrip]);
    }

    function deleteTrip(id: string) {
        setTrips(prev => prev.filter(t => t.id !== id));
    }

    return { trips, addTrip, deleteTrip };
}