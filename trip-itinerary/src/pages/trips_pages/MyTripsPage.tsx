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
        <div className="min-h-screen flex flex-col">
            <NavBar/>
            <main className="flex-1 p-10">
                <div className="mx-[100px] my-[10px] max-md:mx-[50px]">
                    <div className="flex justify-between align-center max-md:flex-col max-md:mb-[30px]">
                        <h2 style={{textAlign: "left", padding: "20px 0", margin: "0"}}>My Trips</h2>
                        <button onClick={() => navigate("/my-trips/new-trip")}>+ New trip</button>
                    </div>
                    <div>
                        <h3 className="px-[18px] w-fit bg-(--primary-colour) rounded-xl !mx-0">
                            Current
                        </h3>
                        {current.length === 0 ? (
                            <div className="no-content-display">
                                <h4>No trips to show</h4>
                            </div>
                        ) : (
                            <TripCarousel trips={current} />
                        )}
                    </div>
                    <div>
                        <h3 className="!text-(--background-colour) px-[18px] w-fit bg-(--secondary-colour) rounded-xl !mx-0">
                            Upcoming
                        </h3>
                        {upcoming.length === 0 ? (
                            <div className="no-content-display">
                                <h4>No trips to show</h4>
                            </div>
                        ) : (
                            <TripCarousel trips={upcoming} />
                        )}
                    </div>
                    <div>
                        <h3 className="px-[18px] w-fit bg-(--background-colour-alt) rounded-xl !mx-0">
                            Past
                        </h3>
                        {past.length === 0 ? (
                            <div className="no-content-display">
                                <h4>No trips to show</h4>
                            </div>
                        ) : (
                            <TripCarousel trips={past} />
                        )}
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}