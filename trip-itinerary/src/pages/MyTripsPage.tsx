import NavBar from '../components/global/NavBar.tsx';
import TripCarousel from "../components/my_trips/TripCarousel.tsx";
import type { Trip } from "../types/Trip.ts";
import { futureTrips, pastTrips } from "../utils/TripDateUtils";
import { getTrips } from "../utils/TripStorage.ts";
import { useEffect, useState } from "react";

export default function MyTripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        setTrips(getTrips());
    }, [])

    const upcoming = futureTrips(trips);
    const past = pastTrips(trips);

    const tripList: Trip[] = [
        {
            id: "2026-07-22T10:00:00.000Z",
            title: "Tokyo Adventure",
            lat: 35.6762,
            lng: 139.6503,
            locationLabel: "Tokyo, Japan",
            startDate: new Date("2026-09-10"),
            endDate: new Date("2026-09-20"),
            notes: "Cherry blossom season, remember to book teamLab tickets in advance"
        },
        {
            id: "2026-07-22T10:05:00.000Z",
            title: "Family Reunion",
            lat: 43.6532,
            lng: -79.3832,
            locationLabel: "Toronto, Ontario, Canada",
            startDate: new Date("2026-08-01"),
            endDate: new Date("2026-08-05"),
            notes: "Staying at Aunt Rosa's place"
        },
        {
            id: "2026-07-22T10:10:00.000Z",
            title: "Solo Backpacking",
            lat: -8.3405,
            lng: 115.0920,
            locationLabel: "Ubud, Bali, Indonesia",
            startDate: new Date("2025-11-15"),
            endDate: new Date("2025-11-30"),
            notes: "Yoga retreat first week, then explore rice terraces"
        },
        {
            id: "2026-07-22T10:15:00.000Z",
            title: "Ski Trip",
            lat: 51.1784,
            lng: -115.5708,
            locationLabel: "Banff, Alberta, Canada",
            startDate: new Date("2027-01-05"),
            endDate: new Date("2027-01-12")
        },
        {
            id: "2026-07-22T10:20:00.000Z",
            title: "European Summer",
            lat: 48.8566,
            lng: 2.3522,
            locationLabel: "Paris, France",
            startDate: new Date("2026-06-01"),
            endDate: new Date("2026-06-15"),
            notes: "Museum passes, Eiffel Tower at sunset"
        }
    ];

    return (
        <div>
            <NavBar/>
            <div className="trips-carousels">
                <h2 style={{textAlign: "left", padding: "20px 0"}}>My Trips</h2>
                <div className="upcoming-trips">
                    <div className="green-label">
                        <h3 className="black-text">Upcoming</h3>
                    </div>
                    {upcoming.length === 0 ? (
                        <div className="no-trips-display">
                            <h3>No trips to show</h3>
                        </div>
                    ) : (
                        <TripCarousel trips={tripList} />
                    )}
                </div>
                <div className="past-trips">
                    <div className="black-label">
                        <h3>Past</h3>
                    </div>
                    {past.length === 0 ? (
                        <div className="no-trips-display">
                            <h3>No trips to show</h3>
                        </div>
                    ) : (
                        <TripCarousel trips={past} />
                    )}
                </div>
            </div>
        </div>
    );
}