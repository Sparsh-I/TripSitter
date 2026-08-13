import NavBar from '../../components/global/NavBar.tsx';
import TripCarousel from "../../components/my_trips/TripCarousel.tsx";
import type { Trip } from "../../types/Trip.ts";
import { currentTrips, futureTrips, pastTrips } from "../../utils/TripDateUtils.ts";
import { getTrips } from "../../utils/TripStorage.ts";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import Footer from "../../components/global/Footer.tsx";

export default function MyTripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        getTrips()
            .then(trips => setTrips(trips))
            .catch(e => {
                console.error("Failed to load trips: ", e);
        });
    }, [])

    const current = currentTrips(trips);
    const upcoming = futureTrips(trips);
    const past = pastTrips(trips);

    const navigate = useNavigate();

    return (
        <div>
            <NavBar/>
            <div className="trips-carousels">
                <div className="my-trips-header">
                    <h2 style={{textAlign: "left", padding: "20px 0", margin: "0"}}>My Trips</h2>
                    <button onClick={() => navigate("/my-trips/new-trip")}>+ New trip</button>
                </div>
                <div className="current-trips">
                    <div className="label primary">
                        <h3>Current</h3>
                    </div>
                    {current.length === 0 ? (
                        <div className="no-trips-display">
                            <h3>No trips to show</h3>
                        </div>
                    ) : (
                        <TripCarousel trips={current} />
                    )}
                </div>
                <div className="upcoming-trips">
                    <div className="label black">
                        <h3>Upcoming</h3>
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
                    <div className="label grey">
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
            <Footer/>
        </div>
    );
}