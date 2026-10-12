import NavBar from '../../components/global/NavBar.tsx';
import TripCarousel from "../../components/my_trips/TripCarousel.tsx";
import TripPreview from "../../components/my_trips/TripPreview.tsx";
import type { Trip } from "../../types/Trip.ts";
import { currentTrips, futureTrips, pastTrips } from "../../utils/TripDateUtils.ts";
import { getTrips } from "../../utils/TripStorage.ts";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../../components/global/Footer.tsx";

const TABS = ["All", "Ongoing", "Upcoming", "History", "Archive", "Requests"] as const;
type TabName = typeof TABS[number];

function parseParams<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
    return value !== null && (allowed as readonly string[]).includes(value)
        ? (value as T)
        : fallback;
}

export default function MyTripsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = parseParams<TabName>(searchParams.get("tab"), TABS, "All");
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
    const all = [...past, ...current, ...upcoming];

    const navigate = useNavigate();
    
    function openTab(tabName: TabName) {
        setSearchParams({tab: tabName})
    }

    return (
        <div className="page-layout">
            <NavBar/>
            <div className="p-10">
                <div className="my-trips-header">
                    <h2 style={{textAlign: "left", padding: "20px 0", margin: "0"}}>My Trips</h2>
                    <button onClick={() => navigate("/my-trips/new-trip")}>+ New trip</button>
                </div>
                <div className="page-content flex flex-row">
                    <div className="flex flex-col justify-between">
                        <div>
                            <button
                                className={`w-full text-right ${activeTab === "All" ? "tab-button-active" : "tab-button"}`}
                                onClick={() => openTab("All")}
                                >
                                All
                            </button>
                            <button
                                className={`w-full text-right ${activeTab === "Ongoing" ? "tab-button-active" : "tab-button"}`}
                                onClick={() => openTab("Ongoing")}
                                >
                                Ongoing
                            </button>
                            <button
                                className={`w-full text-right ${activeTab === "Upcoming" ? "tab-button-active" : "tab-button"}`}
                                onClick={() => openTab("Upcoming")}
                                >
                                Upcoming
                            </button>
                            <button
                                className={`w-full text-right ${activeTab === "History" ? "tab-button-active" : "tab-button"}`}
                                onClick={() => openTab("History")}
                                >
                                History
                            </button>
                        </div>
                        <div>
                            <button
                                className={`w-full text-right ${activeTab === "Archive" ? "tab-button-active" : "tab-button"}`}
                                onClick={() => openTab("Archive")}
                                >
                                Archive
                            </button>
                            <button
                                className={`w-full text-right ${activeTab === "Requests" ? "tab-button-active" : "tab-button"}`}
                                onClick={() => openTab("Requests")}
                                >
                                Requests
                            </button>
                        </div>
                    </div>
                    {activeTab == "All" && (
                        all.length == 0 ? (
                            <div className="flex flex-col justify-center items-center">
                                <p>You have no trips yet!</p>
                                <button onClick={() => navigate("/my-trips/new-trip")}>+ New trip</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 p-10 h-100 w-full overflow-y-auto">
                                {all.map(trip =>
                                    <div key={trip.id}>
                                        <TripPreview tripDetails={trip}/>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>




            
            <div className="page-content">
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
                            <div className="no-content-display">
                                <h4>No trips to show</h4>
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
                            <div className="no-content-display">
                                <h4>No trips to show</h4>
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
                            <div className="no-content-display">
                                <h4>No trips to show</h4>
                            </div>
                        ) : (
                            <TripCarousel trips={past} />
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}