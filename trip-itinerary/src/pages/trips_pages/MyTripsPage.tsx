import NavBar from '../../components/global/NavBar.tsx';
import TripPreview, { IconButton } from "../../components/my_trips/TripPreview.tsx";
import type { Trip, TripInvite } from "../../types/Trip.ts";
import { currentItems, futureItems, pastItems } from "../../utils/TripDateUtils.ts";
import { acceptTripInvite, archiveTrip, deleteTrip, getTripInvites, getTrips, inviterLabel, removeTripMember, unarchiveTrip } from "../../utils/TripStorage.ts";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../../components/global/Footer.tsx";
import { useLoading } from '../../context/LoadingContext.tsx';

import edit from '/assets/my_trips/edit.svg';
import share from '/assets/my_trips/share.svg';
import archive from '/assets/my_trips/archive.svg';
import trash from '/assets/my_trips/trash.svg';
import { useAuthContext } from '../../context/AuthContext.tsx';

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
    const [invites, setInvites] = useState<TripInvite[]>([]);
    const { track } = useLoading();

    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    const { session } = useAuthContext();
    const userId = session?.user.id;

    const loadTrips = useCallback(async () => {
        try { setTrips(await track(getTrips())); }
        catch (e) { console.error("Failed to load trips:", e); }
    }, []);

    const loadInvites = useCallback(async () => {
        try { setInvites(await getTripInvites()); }
        catch (e) { console.error("Failed to load invites:", e); }
    }, []);

    useEffect(() => { void loadTrips(); }, [loadTrips]);
    useEffect(() => { if (userId) void loadInvites(); }, [userId, loadInvites]);


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

    const active = trips.filter(t => !t.archived);

    const tripsByTab: Record<Exclude<TabName, "Requests">, Trip[]> = {
        All: [...pastItems(active), ...currentItems(active), ...futureItems(active)],
        Ongoing: currentItems(active),
        Upcoming: futureItems(active),
        History: pastItems(active),
        Archive: trips.filter(t => t.archived),
    };

    const counts: Record<TabName, number> = {
        All: tripsByTab.All.length,
        Ongoing: tripsByTab.Ongoing.length,
        Upcoming: tripsByTab.Upcoming.length,
        History: tripsByTab.History.length,
        Archive: tripsByTab.Archive.length,
        Requests: invites.length,
    };

    const visibleTrips = activeTab === "Requests" ? [] : tripsByTab[activeTab];

    async function respondToInvite(tripId: string, accept: boolean) {
        if (!userId) return;
        try {
            if (accept) await acceptTripInvite(tripId);
            else await removeTripMember(tripId, userId);
            await Promise.all([loadInvites(), loadTrips()]);
        } catch (e) {
            console.error(e);
            alert("Something went wrong. Please try again.");
        }
    }

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
                setSelectedTrip(null);
                await loadTrips();
            } catch (error) {
                console.error("Failed to delete trip:", error);
                alert("Something went wrong deleting this trip.");
            }
        }
    }
    
    async function handleArchive(isArchived: boolean) {
            if (isArchived) {
                try {
                    await unarchiveTrip(selectedTrip!);
                    setSelectedTrip(null);
                    await loadTrips();
                } catch (error) {
                    console.error("Failed to unarchive trip:", error);
                    alert("Something went wrong unarchiving this trip.");
                }
            } else {
                try {
                    await archiveTrip(selectedTrip!);
                    setSelectedTrip(null);
                    await loadTrips();
                } catch (error) {
                    console.error("Failed to archive trip:", error);
                    alert("Something went wrong archiving this trip.");
                }
            }
    }

    const ACTION_BASE = "mx-[5px] cursor-pointer bg-transparent px-3 py-[5px]";
    const ACTION_GREEN = `${ACTION_BASE} border-2 border-(--custom-green) text-(--custom-green) hover:bg-(--custom-green) hover:text-(--background-colour)`;
    const ACTION_RED = `${ACTION_BASE} border-2 border-(--custom-red) text-(--custom-red) hover:bg-(--custom-red) hover:text-(--background-colour)`;

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
                                        const count = counts[tab];
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
                                <div data-trip-actions className="flex flex-row gap-7 items-center bg-gray-200 rounded-xl px-3">
                                    <div className="px-3">
                                        <p><strong>{selectedTrip.title} </strong></p>
                                    </div>
                                    <div className="flex flex-row">
                                        <IconButton main={edit} label="Edit" onClick={() => navigate(`/my-trips/${selectedTrip.id}/edit`)} notext/>
                                        <IconButton main={share} label="Share" onClick={() => undefined} notext />
                                        <IconButton main={archive} label="Archive" onClick={() => handleArchive(selectedTrip.archived)} notext />
                                        <IconButton main={trash} label="Delete" onClick={handleDelete} danger notext />
                                    </div>
                                </div>
                            )}
                        </div>

                        {activeTab === "Requests" ? (
                            invites.length === 0 ? (
                                <p>{EMPTY_MSGS.Requests}</p>
                            ) : (
                                <ul className="w-[95%] overflow-y-auto">
                                    {invites.map(inv => (
                                        <li key={inv.tripId} className="flex items-center justify-between p-3 odd:bg-(--background-colour)">
                                            <div className="text-left">
                                                <strong>{inv.title}</strong>
                                                <div className="text-[#909090] text-[0.8rem]">
                                                    Invited by {inviterLabel(inv.inviter)}
                                                </div>
                                            </div>
                                            <div>
                                                <button className={ACTION_GREEN} onClick={() => respondToInvite(inv.tripId, true)}>✓</button>
                                                <button className={ACTION_RED} onClick={() => respondToInvite(inv.tripId, false)}>✘</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )
                        ) : visibleTrips.length == 0 ? (
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