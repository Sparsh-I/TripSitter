import DatePicker from "../../components/global/DatePicker.tsx";
import { useCallback, useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import type { TripLocation } from "../../components/global/LocationSearch.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile.ts";
import { useLoading } from "../../context/LoadingContext.tsx";
import { addTrip, getTripById, updateTrip } from "../../utils/TripStorage.ts";
import SplashScreen from "../../components/global/SplashScreen.tsx";
import type { Trip } from "../../types/Trip.ts";
import LocationSearch from "../../components/global/LocationSearch.tsx";
import placeholder from '/assets/trip_preview/placeholder.jpg'
import { TabButton } from "../../components/global/TabButton.tsx";
import { useTabParam } from "../../hooks/useTabParam.ts";
import { displayName, getProfileSummaries, type ProfileSummary } from "../../utils/ConnectionUtils.ts";

const TABS = ["General", "Trip Legs", "Members"] as const;
// const SUB_TABS = ["Incoming", "Outgoing"] as const;

export default function TripFormPage() {
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

    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const { track } = useLoading();

    const [profiles, setProfiles] = useState<Record<string, ProfileSummary>>({});

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

                const memberIds = [trip.ownerId /*, ...trip.members */];
                setProfiles(await getProfileSummaries(memberIds));
            })
            .catch(e => console.error("Failed to load trip:", e))
            .finally(() => setLoading(false));
    }, [id]);

    const ownerId = tripDetails?.ownerId;

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
                            <button>+ Add Member</button>
                        </div>

                        <ul className="w-[90%] [&_li]:odd:bg-(--background-colour) [&_li]:even:bg-white">
                            <li className="p-3">
                                <div className="flex items-center gap-2">
                                    <span>{displayName(ownerId ? profiles[ownerId] : undefined)}</span>
                                    <span className="shrink-0 rounded-full bg-(--primary-colour-alt2) px-2 py-0.5 text-xs">
                                        Admin
                                    </span>
                                </div>
                            </li>
                            {/* {tripDetails.members.map(m => 
                                <li key={m.id} className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-2">
                                        <span>{displayName(m.id ? profiles[m.id] : undefined)}</span>
                                        <span className="shrink-0 rounded-full bg-(--background-colour-alt) px-2 py-0.5 text-xs">
                                            Member
                                        </span>
                                    </div>
                                    <button className="text-xs rounded-full">Add connection</button>
                                </li>
                            )} */}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );

    return (
            <div>
                <button className="flex mt-5 ml-5 w-52.5 justify-around" onClick={() => navigate("/my-trips")}>← Return to My Trips</button>
                <div className="mx-[25%] justify-around max-md:mx-[5%]">
                    <h1 className="text-(--secondary-colour-alt) text-left mt-5">{isEditing ? "Edit Trip" : "New Trip"}</h1>
    
                    <h3 className="text-(--secondary-colour-alt) text-left mt-5">Title</h3>
                    <input
                        type="text"
                        placeholder="What are we calling this?"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-[95%] my-2.5 max-md:w-[80%]"
                    />
    
                    <br/>
                    <hr/>
    
                    <h3 className="text-(--secondary-colour-alt) text-left mt-5">Dates</h3>
                    <div>
                        <DatePicker
                            selected={range}
                            onSelect={setRange}
                            fieldSize={21}
                            numMonths={isMobile ? 1 : 2}
                        />
                    </div>
    
                    <h3 className="text-(--secondary-colour-alt) text-left mt-5">Location</h3>
                    <LocationSearch onLocationSelect={setLocation} defaultVal={tripDetails?.locationLabel} />
    
                    <br/>
                    <hr/>
    
                    <h3 className="text-(--secondary-colour-alt) text-left mt-5">Relevant Links</h3>
                    {links.map((link, index) => (
                        <div key={index} className="flex gap-2 my-4">
                            <input
                                type="text"
                                placeholder="Any bookings you'd like to store?"
                                value={link}
                                onChange={e => updateLinkAt(index, e.target.value)}
                                className="w-[95%] my-2.5 max-md:w-[80%]"
                            />
                            {links.length > 1 && (
                                <button onClick={() => removeLinkAt(index)}>Remove</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addLink}>+ Add Another Link</button>
    
                    <br/>
                    <br/>
                    <hr/>
    
                    {/*{entries.map((entry, index) => (*/}
                    {/*    <div key={index}>*/}
                    {/*        <h3 className="text-(--secondary-colour-alt) text-left mt-5">Dates{entries.length > 1 ? ` #${index + 1}` : ""}</h3>*/}
                    {/*        <div>*/}
                    {/*            <DatePicker selected={entry.range} onSelect={(range) => {setRangeAt(index, range);}} fieldSize={20}/>*/}
                    {/*        </div>*/}
    
                    {/*        <h3 className="text-(--secondary-colour-alt) text-left mt-5">Location{entries.length > 1 ? ` #${index + 1}` : ""}</h3>*/}
                    {/*        <LocationSearch onLocationSelect={setLocation} />*/}
                    {/*        {index > 0 && (*/}
                    {/*            <button className="my-[3%]" onClick={() => removeEntry(index)}>- Remove</button>*/}
                    {/*        )}*/}
                    {/*        <br/>*/}
                    {/*        <hr/>*/}
                    {/*    </div>*/}
                    {/*))}*/}
    
                    {/*<button className="editmy-[3%]" onClick={addEntry}>+ Add Another Location</button>*/}
    
                    <h3 className="text-(--secondary-colour-alt) text-left mt-5">Additional Notes</h3>
                    <textarea className="w-full my-2.5" value={notes} placeholder="Anything extra...">
                        {tripDetails?.notes ? tripDetails?.notes : ""}
                    </textarea>
    
                    <div className="mt-5">
                        <button className="my-[3%]" onClick={save}>Save</button>
                    </div>
                </div>
            </div>
        );
}