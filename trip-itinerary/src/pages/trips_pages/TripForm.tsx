import SplashScreen from "../../components/global/SplashScreen.tsx";

import { useAuthContext } from "../../context/AuthContext.tsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile.ts";
import { useLoading } from "../../context/LoadingContext.tsx";
import { useTabParam } from "../../hooks/useTabParam.ts";

import DatePicker from "../../components/global/DatePicker.tsx";
import type { DateRange } from "react-day-picker";

import type { TripLocation } from "../../components/global/LocationSearch.tsx";
import { addTrip, getTripById, getTripLegs, updateTrip, updateTripLeg, uploadPhoto } from "../../utils/TripStorage.ts";
import type { Trip, TripLeg } from "../../types/Trip.ts";

import placeholder from '/assets/my_trips/placeholder.jpg'

import { TabButton } from "../../components/global/TabButton.tsx";
import PhotoPopup from "../../components/my_trips/PhotoPopup.tsx";
import TripLegsTab from "../../components/my_trips/trip_form/TripLegsTab.tsx";
import MembersList from "../../components/my_trips/trip_form/MembersList.tsx";


const TABS = ["General", "Trip Legs", "Members"] as const;

export default function TripFormPage() {
    const { session } = useAuthContext();
    const userId = session?.user.id;

    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const [activeTab, openTab] = useTabParam("tab", TABS, "General");
    const [saveDisabled, setSaveDisabled] = useState(true);
    
    const [tripDetails, setTripDetails] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(isEditing);
    const [title, setTitle] = useState("");
    const [links, setLinks] = useState<string[]>([""]);
    const [range, setRange] = useState<DateRange | undefined>();
    const [location, setLocation] = useState<TripLocation | null>(null);
    const [notes, setNotes] = useState("");
    const [banner, setBanner] = useState(placeholder);
    
    const [tripLegs, setTripLegs] = useState<TripLeg[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const { track } = useLoading();

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
        })
        .catch(e => console.error("Failed to load trip:", e))
        .finally(() => setLoading(false));
    }, [id]);
    
    const ownerId = tripDetails?.ownerId;

    // useEffect(() => {
    //     if (!tripDetails?.id) return;
    //     let cancelled = false;

    //     getTripLegs(tripDetails.id)
    //         .then(legs => { if (!cancelled) setTripLegs(legs); })
    //         .catch(e => console.error("Failed to load trip legs:", e));
            
    //     return () => { cancelled = true; };
    // }, [tripDetails?.id]);

    useEffect(() => {
        setTripLegs([
            {
                id: "test-1",
                legId: "test-1",
                locationLabel: "Test leg",
                photos: [
                    "https://i.pinimg.com/736x/51/d0/be/51d0bee2f524d4ded52831ba446e3620.jpg",
                    "https://i.pinimg.com/736x/37/a1/aa/37a1aa9b33ad6710b0d3dcf3ae759c16.jpg",
                    "https://i.pinimg.com/736x/82/fd/9c/82fd9caa6e595ce294861923be8b344f.jpg",
                    "https://i.pinimg.com/736x/48/d6/fd/48d6fda15ce21a7d8707ad6d7249d266.jpg",
                ],
            } as any,
        ]);
    }, []);

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
            photo: banner !== placeholder ? banner : undefined,
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
    const updateLinkAt = (i: number, v: string) => setLinks(prev => prev.map((l, idx) => (idx === i ? v : l)));
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

    function saveTitle() {
        const trimmed = title.trim();

        if (!tripDetails || trimmed == tripDetails.title) return;
        if (trimmed === "") return;

        try {
            const updatedDetails = {...tripDetails, title: trimmed};
            updateTrip(updatedDetails);
            setTripDetails(updatedDetails);
            setTitle(trimmed);
        } catch (e) {
            console.error("Failed to update trip title: ", e);
        }
    }

    const galleryPhotos = tripLegs.flatMap(leg => 
        (leg.photos ?? []).map((url, i) => ({
            key: `${leg.legId}-${i}`,
            url,
            alt: `${leg.locationLabel} photo ${i + 1}`,
        }))
    )

    function updateBanner(url: string) {
        if (!tripDetails) return;
        if (url === tripDetails.photo) return;

        try {
            const updatedDetails = {...tripDetails, photo: url};
            updateTrip(updatedDetails);
            setTripDetails(updatedDetails);
            setBanner(url);
        } catch (e) {
            console.error("Failed to update trip banner: ", e);
        }
    }

    async function renameLeg(legId: string, title: string) {
        const leg = tripLegs.find(l => l.legId === legId);
        if (!leg) return;

        const updated = { ...leg, title };
        await updateTripLeg(updated);
        setTripLegs(prev => prev.map(l => l.legId === legId ? updated : l));
    }

    function addPhoto(file: File) {
        if (!tripDetails) return;
        const path = `trip_${tripDetails.id}/${crypto.randomUUID()}_${file.name}`;
        uploadPhoto(file, path);
    }

    return (
        <div className="mb-15">
            <div className="w-full h-60 max-md:h-132 bg-cover bg-[calc(50%)_calc(40%)] p-8 box-border flex justify-between items-start"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={saveTitle}
                    size={Math.max(title.length, 10)}
                    defaultValue="Untitled Trip"
                    placeholder="Give this trip a name!"
                    className="bg-transparent text-2xl font-bold rounded-lg px-2 max-w-full
                                border-2 border-transparent outline-none cursor-text
                                hover:bg-white/70 hover:border-gray-300
                                focus:bg-white focus:border-(--primary-colour-alt)"

                >
                </input>
                <button className="rounded-full" onClick={() => navigate("/my-trips")}>Return to My Trips</button>
            </div>
            <div className="flex justify-center gap-0 mt-3">
                <TabButton active={activeTab === "General"} tab onClick={() => openTab("General")}>General</TabButton>
                <TabButton active={activeTab === "Trip Legs"} tab onClick={() => openTab("Trip Legs")}>Trip Legs</TabButton>
                <TabButton active={activeTab === "Members"} tab onClick={() => openTab("Members")}>Members</TabButton>
            </div>
            <div className="border-t-5 border-(--primary-colour-alt)">
                <div className="m-10">
                    {activeTab === "General" && (
                        <div className="flex flex-col items-start gap-2">
                            <h3>Gallery</h3>
                            {galleryPhotos.length === 0 ? (
                                <p className="text-gray-500">No photos available.</p>
                            ) : (
                                <div className="flex gap-5 overflow-x-auto w-full py-3">
                                    {galleryPhotos.map(photo => (
                                        <div key={photo.key} className="group relative">
                                            <img src={photo.url} alt={photo.alt} className="w-100 h-60 object-cover" />
                                            
                                            <div className="absolute inset-0 bg-gray-900/10 opacity-0 group-hover:opacity-100 flex items-start justify-end transition-opacity">
                                                <button 
                                                    onClick={() => setSelectedPhoto(photo.url)}
                                                    className="flex-shrink-0 w-full h-full p-0 bg-transparent rounded-lg overflow-hidden">
                                                </button>

                                                <button 
                                                    className="absolute m-3 bg-white text-black text-sm hover:bg-gray-200 translate-y-5 group-hover:translate-y-0 transition-transform duration-300"
                                                    onClick={() => updateBanner(photo.url)}
                                                >
                                                    Set Banner Photo
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {selectedPhoto && (
                                        <PhotoPopup photoUrl={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Trip Legs" && <TripLegsTab tripLegs={tripLegs} onRenameLeg={renameLeg} />}

                    {activeTab === "Members" && tripDetails && <MembersList trip={tripDetails} />}
                </div>
            </div>
            {activeTab != "Members" && (
                <div className="flex justify-center gap-15">
                    {!saveDisabled && (
                        <button className="bg-gray-300 text-black">Discard</button>
                    )}
                    
                    <button 
                        disabled={saveDisabled}
                        className={`${saveDisabled
                                    ? "bg-[#9a9a9a] border-[#9a9a9a] cursor-not-allowed"
                                    : "bg-(--primary-colour-alt) border-(--primary-colour-alt) cursor-pointer"}`}
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}