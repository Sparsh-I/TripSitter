    import DatePicker from "../../components/global/DatePicker.tsx";
    import { useEffect, useState } from "react";
    import type { DateRange } from "react-day-picker";
    import type { TripLocation } from "../../components/global/LocationSearch.tsx";
    import { useNavigate, useParams } from "react-router-dom";
    import { useIsMobile } from "../../hooks/useIsMobile.ts";
    import { useLoading } from "../../context/LoadingContext.tsx";
    import { addTrip, getTripById, getTripMembers, updateTrip } from "../../utils/TripStorage.ts";
    import SplashScreen from "../../components/global/SplashScreen.tsx";
    import type { Trip } from "../../types/Trip.ts";
    import LocationSearch from "../../components/global/LocationSearch.tsx";
    import placeholder from '/assets/trip_preview/placeholder.jpg'
    import { TabButton } from "../../components/global/TabButton.tsx";
    import { useTabParam } from "../../hooks/useTabParam.ts";
    import * as ConnUtils from "../../utils/ConnectionUtils.ts";
    import TripMembersPopup from "../../components/my_trips/TripMembersPopup.tsx";
    import { supabase } from "../../utils/SupabaseClient.ts";
    import type { TripMember } from "../../types/TripMember.ts";
import { useAuthContext } from "../../context/AuthContext.tsx";

    const TABS = ["General", "Trip Legs", "Members"] as const;

    export default function TripFormPage() {
        const { session } = useAuthContext();
        const userId = session?.user.id;

        const { id } = useParams<{ id: string }>();
        const isEditing = !!id;

        const [activeTab, openTab] = useTabParam("tab", TABS, "General");
        
        const [tripDetails, setTripDetails] = useState<Trip | null>(null);
        const [loading, setLoading] = useState(isEditing);
        const [title, setTitle] = useState("");
        const [links, setLinks] = useState<string[]>([""]);
        const [range, setRange] = useState<DateRange | undefined>();
        const [location, setLocation] = useState<TripLocation | null>(null);
        const [notes, setNotes] = useState("");
        const [photo, /*setPhoto*/] = useState(placeholder);
        
        const [showPopup, setShowPopup] = useState(false);
        const [tripMembers, setTripMembers] = useState<TripMember[]>([]);
        const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

        const navigate = useNavigate();
        const isMobile = useIsMobile();
        const { track } = useLoading();

        const [profiles, setProfiles] = useState<Record<string, ConnUtils.ProfileSummary>>({});

        useEffect(() => {
            if (!id) return;
            
            track(getTripById(id))
            .then(async trip => {
                if (!trip) return;
                setTripDetails(trip);
                setTitle(trip.title);
                setRange({ from: new Date(trip.startDate), to: new Date(trip.endDate) });
                setLocation({ lat: trip.lat, lng: trip.lng, label: trip.locationLabel });
                setNotes(trip.notes ?? "");
                if (trip.links?.length) setLinks(trip.links);
                
                const tripMembers = await getTripMembers(trip.id);
                setTripMembers(tripMembers);
                const tripMemberIds = tripMembers.map(m => m.userId);
                const memberIds = [trip.ownerId, ...tripMemberIds];
                setProfiles(await ConnUtils.getProfileSummaries(memberIds));
            })
            .catch(e => console.error("Failed to load trip:", e))
            .finally(() => setLoading(false));
        }, [id]);
        
        const ownerId = tripDetails?.ownerId;

        useEffect(() => {
            if (!userId) return;

            ConnUtils.getConnections()
                .then(conns => setConnectedIds(new Set(conns.map(c => ConnUtils.otherUserId(c, userId)))))
                .catch(e => console.error("Failed to load connections:", e));
        }, [userId]);

        if (loading) return <SplashScreen />;
        if (isEditing && !tripDetails) {
            return <div className="flex justify-center items-center min-h-screen"><h1>No Trip Found :(</h1></div>;
        }

        async function save() {
            if (!location || !range?.from || !range?.to) {
                alert("Please fill in dates and a location before saving.");
                return;
            }

            const values = {
                title,
                lat: location.lat,
                lng: location.lng,
                locationLabel: location.label,
                startDate: range.from,
                endDate: range.to,
                notes: notes || undefined,
                links: links.filter(l => l.trim() !== ""),
            };

            try {
                if (isEditing) await updateTrip({ ...tripDetails!, ...values });
                else await addTrip(values);
                navigate("/my-trips");
            } catch (e) {
                console.error(e);
                alert("Something went wrong saving your trip. Please try again.");
            }
        }

        const addLink = () => setLinks(prev => [...prev, ""]);
        const updateLinkAt = (i: number, v: string) =>
            setLinks(prev => prev.map((l, idx) => (idx === i ? v : l)));
        const removeLinkAt = (i: number) => setLinks(prev => prev.filter((_, idx) => idx !== i));

        // function addEntry() {
        //     setEntries(prev => [...prev, { range: undefined, location: "" }]);
        // }
        //
        // function removeEntry(index: number) {
        //     setEntries(prev => prev.filter((_, i) => i !== index));
        // }
        //
        // function setRangeAt(index: number, range: DateRange | undefined) {
        //     setEntries(prev =>
        //         prev.map((entry, i) => (i === index ? { ...entry, range } : entry))
        //     );
        // }

        function openMemberPopup() {
            setShowPopup(true);
        }

        function closePopup() {
            setShowPopup(false);
        }

        async function addTripMember(userId: string): Promise<void> {
            if (!tripDetails) return;
            const { data, error } = await supabase.from("trips").select("members").eq("id", tripDetails.id).single();
            if (error) throw error;

            const members: string[] = data.members ?? [];
            if (members.includes(userId)) return;

            const { error: updateError } = await supabase
                .from("trips")
                .update({ members: [...members, userId] })
                .eq("id", tripDetails.id);
            if (updateError) throw updateError;
        }

        return (
            <div>
                <div className="w-full h-60 max-md:h-132 bg-cover bg-[calc(50%)_calc(40%)] p-8 box-border"
                    style={{ backgroundImage: `url(${photo})` }}
                >
                    <h2 className="px-[18px] w-fit bg-(--background-colour) rounded-xl !mx-0 max-md:!mb-4 max-md:!leading-[1.6]">
                        {tripDetails?.title}
                    </h2>
                </div>
                <div className="flex justify-center gap-0 mt-3">
                    <TabButton active={activeTab === "General"} tab onClick={() => openTab("General")}>General</TabButton>
                    <TabButton active={activeTab === "Trip Legs"} tab onClick={() => openTab("Trip Legs")}>Trip Legs</TabButton>
                    <TabButton active={activeTab === "Members"} tab onClick={() => openTab("Members")}>Members</TabButton>
                </div>
                <div className="border-t-5 border-(--primary-colour-alt)">
                    {activeTab === "General" && (
                        <div>
                        Does
                        </div>
                    )}

                    {activeTab === "Trip Legs" && (
                        <div>
                        This
                        </div>
                    )}

                    {activeTab === "Members" && (
                        <div className="flex flex-col items-center w-full">
                            <div className="flex w-[90%] items-center justify-between py-6">
                                <h3 className="m-0">Members</h3>
                                <button onClick={openMemberPopup}>+ Add Member</button>
                            </div>

                            <ul className="w-[90%] [&_li]:odd:bg-(--background-colour) [&_li]:even:bg-white">
                                <li className="p-3">
                                    <div className="flex items-center gap-2">
                                        <span>{ConnUtils.displayName(ownerId ? profiles[ownerId] : undefined)}</span>
                                        <span className="shrink-0 rounded-full bg-(--primary-colour-alt2) px-2 py-0.5 text-xs">
                                            Admin
                                        </span>
                                    </div>
                                </li>
                                {tripMembers.map(m => 
                                    <li key={m.userId} className="flex items-center justify-between p-3">
                                        <div className="flex items-center gap-2">
                                            <span>{ConnUtils.displayName(m ? profiles[m.userId] : undefined)}</span>
                                            <span className="shrink-0 rounded-full bg-(--background-colour-alt) px-2 py-0.5 text-xs">
                                                Member
                                            </span>
                                        </div>
                                        {m.userId !== userId && !connectedIds.has(m.userId) && (
                                            <button 
                                                className="text-xs rounded-full"
                                                onClick={async () => {
                                                    try {
                                                        await ConnUtils.sendConnectionRequest(profiles[m.userId].username);
                                                        setConnectedIds(prev => new Set(prev).add(m.userId));
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}
                                            >
                                                    Add connection
                                            </button>
                                        )}
                                    </li>
                                )}
                            </ul>

                            {showPopup && (
                                <TripMembersPopup
                                    trip={tripDetails!}
                                    members={tripMembers}
                                    onClose={closePopup}
                                    onAddMember={addTripMember}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }