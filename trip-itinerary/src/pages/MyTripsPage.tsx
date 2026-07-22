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
                        <TripCarousel trips={upcoming} />
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