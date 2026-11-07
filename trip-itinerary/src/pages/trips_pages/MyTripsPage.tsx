import NavBar from '../../components/global/NavBar.tsx';
import TripPreview, { IconButton } from "../../components/my_trips/TripPreview.tsx";
import type { Trip } from "../../types/Trip.ts";
import { currentItems, futureItems, futureTrips, pastItems } from "../../utils/TripDateUtils.ts";
import { archiveTrip, deleteTrip, getTrips } from "../../utils/TripStorage.ts";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../../components/global/Footer.tsx";
import { useLoading } from '../../context/LoadingContext.tsx';

import edit from '/assets/my_trips/edit.svg';
import share from '/assets/my_trips/share.svg';
import archive from '/assets/my_trips/archive.svg';
import trash from '/assets/my_trips/trash.svg';

const TABS = ["All", "Ongoing", "Upcoming", "History", "Archive", "Requests"] as const;
type TabName = typeof TABS[number];

const SIDEBAR_GROUPS: TabName[][] = [
    ["All", "Ongoing", "Upcoming", "History"],
    ["Archive", "Requests"],
]

const EMPTY_MSGS: Record<TabName, string> = {
    All: "You have no trips yet! Create one?",
    Ongoing: "You have no ongoing trips! Did you miss one?",
    Upcoming: "You have no upcoming trips! Remedy this?",
    History: "You have no old trips! Start making a new memory?",
    Archive: "You have no archived trips!",
    Requests: "You have no incoming trip requests! Send one instead?",
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
    const { track } = useLoading();

    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    useEffect(() => {
        track(getTrips())
            .then(trips => setTrips(trips))
            .catch(e => {
                console.error("Failed to load trips: ", e);
        });
    }, [])

    useEffect(() => {
        if (!selectedTrip) return;

        const onDown = (e: MouseEvent) => {
            const el = e.target as HTMLElement;

            if (el.closest("[data-trip-card], [data-trip-actions]")) return;
            setSelectedTrip(null);
        };

        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [selectedTrip]);

    const current = currentItems(trips);
    const upcoming = futureItems(trips);
    const past = pastItems(trips);
    const archived = trips.filter(t => t.archived);

    const tripsByTab: Record<TabName, Trip[]> = {
        All: [...past, ...current, ...upcoming],
        Ongoing: current,
        Upcoming: upcoming,
        History: past,
        Archive: archived,
        Requests: [],
    }

    const visibleTrips = tripsByTab[activeTab];

    const navigate = useNavigate();
    
    function openTab(tabName: TabName) {
        setSearchParams({tab: tabName})
    }

    function chooseSelectedTrip(trip: Trip | null) {
        setSelectedTrip(trip);
    }

    async function handleDelete() {
        if (confirm("Are you sure you want to delete this trip?")) {
            try {
                await deleteTrip(selectedTrip!);
                window.location.reload();
            } catch (error) {
                console.error("Failed to delete trip:", error);
                alert("Something went wrong deleting this trip.");
            }
        }
    }
    
    async function handleArchive() {
        try {
            await archiveTrip(selectedTrip!);
            window.location.reload();
        } catch (error) {
            console.error("Failed to archive trip:", error);
            alert("Something went wrong archiving this trip.");
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-(--background-colour)">
            <NavBar/>
            <main className="flex-1 pr-5 py-2">
                <div className="page-content flex flex-row justify-between">
                    <div className="flex flex-col gap-5 w-[12%] mx-5">
                        <div className="align-start">
                            <button className="bg-(--primary-colour) hover:bg-(--primary-colour-alt2) text-black" onClick={() => navigate("/my-trips/new")}>+ New</button>
                        </div>
                        <div className="flex flex-col justify-between h-100">
                            {SIDEBAR_GROUPS.map((group, i) => (
                                <div key={i} className="flex flex-col gap-1 text-right">
                                    {group.map(tab => {
                                        const count = tripsByTab[tab].length;
                                        const showBadge = tab === "Requests" && count > 0;

                                        return (
                                            <button
                                                key={tab}
                                                className={`w-full rounded-full text-left h-10 py-0 flex justify-between items-center
                                                            ${activeTab === tab ? "bg-(--primary-colour-alt)" : "bg-transparent text-black hover:bg-(--primary-colour-alt2)"}`}
                                                onClick={() => openTab(tab)}
                                            >
                                                <span>{tab}</span>
                                                <span
                                                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-xs
                                                                ${showBadge
                                                                    ? "bg-(--custom-red) text-white"
                                                                    : activeTab === tab ? "text-gray-100" : "text-gray-400"}`}
                                                >
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-10 p-5 h-[85vh] w-[90%] bg-white rounded-xl">
                        <div className="flex flex-row justify-between items-center">
                            <h2 className="m-0 text-left">My Trips</h2>
                            {selectedTrip && (
                                <div data-trip-actions className="flex flex-row gap-5 items-center">
                                    <div className="px-3">
                                        <p><strong>{selectedTrip.title} </strong></p>
                                    </div>
                                    <IconButton main={edit} label="Edit" onClick={() => navigate(`/my-trips/${selectedTrip.id}/edit`)} notext/>
                                    <IconButton main={share} label="Share" onClick={() => undefined} notext />
                                    <IconButton main={archive} label="Archive" onClick={() => undefined} notext />
                                    <IconButton main={trash} label="Delete" onClick={handleDelete} danger notext />
                                </div>
                            )}
                        </div>
                        {visibleTrips.length == 0 ? (
                            <div className="flex flex-col w-full justify-center items-center gap-5">
                                <p>{EMPTY_MSGS[activeTab]}</p>
                                {!NO_NEW_TRIP_BUTTON.includes(activeTab) && (
                                    <button onClick={() => navigate("/my-trips/new")}>+ New trip</button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] h-full w-[95%] overflow-y-auto justify-items-center gap-5">
                                {visibleTrips.map(trip =>
                                    <span 
                                        key={trip.id}
                                        data-trip-card
                                        onClick={() => chooseSelectedTrip(trip)}
                                        className="w-60" 
                                    >
                                        <TripPreview tripDetails={trip} />
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>


            <Footer/>
        </div>
    );
}