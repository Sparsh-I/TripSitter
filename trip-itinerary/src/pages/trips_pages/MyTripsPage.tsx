import NavBar from '../../components/global/NavBar.tsx';
import TripCarousel from "../../components/my_trips/TripCarousel.tsx";
import TripPreview from "../../components/my_trips/TripPreview.tsx";
import type { Trip } from "../../types/Trip.ts";
import { currentTrips, futureTrips, pastTrips } from "../../utils/TripDateUtils.ts";
import { getTrips } from "../../utils/TripStorage.ts";
import { act, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../../components/global/Footer.tsx";

const TABS = ["All", "Ongoing", "Upcoming", "History", "Archive", "Requests"] as const;
type TabName = typeof TABS[number];

const SIDEBAR_GROUPS: TabName[][] = [
    ["All", "Ongoing", "Upcoming", "History"],
    ["Archive", "Requests"],
]

const EMPTY_MSGS: Record<TabName, string> = {
    All: "You have no trips yet! Create one?",
    Ongoing: "",
    Upcoming: "",
    History: "",
    Archive: "",
    Requests: "",
}

const NO_NEW_TRIP_BUTTON: TabName[] = ["Archive", "Requests"]

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

    const tripsByTab: Record<TabName, Trip[]> = {
        All: [...past, ...current, ...upcoming],
        Ongoing: current,
        Upcoming: upcoming,
        History: past,
        Archive: [],
        Requests: [],
    }

    const visibleTrips = tripsByTab[activeTab];

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
                <div className="page-content flex flex-row justify-between">
                    <div className="flex flex-col justify-between h-80 w-[10%]">
                        {SIDEBAR_GROUPS.map((group, i) => (
                            <div key={i}>
                                {group.map(tab => (
                                    <button
                                        key={tab}
                                        className={`w-full text-right ${activeTab === tab ? "tab-button-active" : "tab-button"}`}
                                        onClick={() => openTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                        
                    {visibleTrips.length == 0 ? (
                        <div className="flex flex-col w-full justify-center items-center gap-5">
                            <p>{EMPTY_MSGS[activeTab]}</p>
                            {!NO_NEW_TRIP_BUTTON.includes(activeTab) && (
                                <button onClick={() => navigate("/my-trips/new-trip")}>+ New trip</button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 px-10 h-100 w-[90%] overflow-y-auto">
                            {visibleTrips.map(trip =>
                                <div key={trip.id}>
                                    <TripPreview tripDetails={trip}/>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* <div className="page-content">
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
            </div> */}
            <Footer/>
        </div>
    );
}