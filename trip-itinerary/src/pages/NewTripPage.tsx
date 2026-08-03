import "../styles/EditTrip.css";
import DatePicker from "../components/global/DatePicker.tsx";
import {useRef, useState} from "react";
import type {DateRange} from "react-day-picker";
import { useNavigate } from "react-router-dom";
import LocationSearch, { type TripLocation } from "../components/global/LocationSearch.tsx";
import {addTrip} from "../utils/TripStorage";
import { type Trip } from "../types/Trip";
import {useIsMobile} from "../hooks/useIsMobile.ts";

// interface LocationEntry {
//     range: DateRange | undefined;
//     location: string;
// }

export default function NewTripPage() {
    const [location, setLocation] = useState<TripLocation | null>(null);
    const [title, setTitle] = useState("");
    const [links, setLinks] = useState<string[]>([""]);
    const [range, setRange] = useState<DateRange | undefined>(undefined);
    const notesRef = useRef<HTMLTextAreaElement>(null);

    // const [entries, setEntries] = useState<LocationEntry[]>([
    //     { range: undefined, location: "" },
    // ]);

    const navigate = useNavigate();
    const isMobile = useIsMobile();

    async function saveEdit(): Promise<void> {
        if (!location || !range?.from || !range?.to) {
            alert("Please fill in dates and a location before saving!");
            return;
        }

        const trip: Omit<Trip, 'id' | 'ownerId'> = {
            title: title,
            lat: location.lat,
            lng: location.lng,
            locationLabel: location.label,
            startDate: range.from,
            endDate: range.to,
            notes: notesRef.current?.value || undefined,
            links: links.filter(l => l.trim() !== ""),
        }

        try {
            await addTrip(trip);
            navigate("/my-trips");
        } catch (error) {
            console.error("Failed to save trip: ", error);
            alert("Something went wrong saving your trip. Please try again.");
        }
    }

    function addLink() {
        setLinks(prev => [...prev, ""]);
    }

    function updateLinkAt(index: number, value: string) {
        setLinks(prev => prev.map((link, i) => (i === index ? value : link)));
    }

    function removeLinkAt(index: number) {
        setLinks(prev => prev.filter((_, i) => i !== index));
    }

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
            <button className="back-button" onClick={() => navigate("/my-trips")}>← Return to My Trips</button>
            <div className="edit-trip-layout">
                <h1 className="input-labels">New Trip</h1>

                <h3 className="input-labels">Title</h3>
                <input
                    type="text"
                    placeholder="What are we calling this?"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="text-input"
                />

                {/*<h3 className="input-labels">Photos</h3>*/}
                {/*<input type="file" id="photo-upload" multiple />*/}
                <br/>
                <hr/>

                <h3 className="input-labels">Dates</h3>
                <div>
                    <DatePicker
                        selected={range}
                        onSelect={setRange}
                        fieldSize={21}
                        numMonths={isMobile ? 1 : 2}
                    />
                </div>

                <h3 className="input-labels">Location</h3>
                <LocationSearch onLocationSelect={setLocation} />

                <br/>
                <hr/>

                <h3 className="input-labels">Relevant Links</h3>
                {links.map((link, index) => (
                    <div key={index} style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
                        <input
                            type="text"
                            placeholder="Any bookings you'd like to store?"
                            value={link}
                            onChange={e => updateLinkAt(index, e.target.value)}
                            className="text-input"
                        />
                        {links.length > 1 && (
                            <button onClick={() => removeLinkAt(index)}>Remove</button>
                        )}
                    </div>
                ))}
                <button onClick={addLink}>+ Add Another Link</button>

                <br/>
                <hr/>

                {/*{entries.map((entry, index) => (*/}
                {/*    <div key={index}>*/}
                {/*        <h3 className="input-labels">Dates{entries.length > 1 ? ` #${index + 1}` : ""}</h3>*/}
                {/*        <div>*/}
                {/*            <DatePicker selected={entry.range} onSelect={(range) => {setRangeAt(index, range);}} fieldSize={20}/>*/}
                {/*        </div>*/}

                {/*        <h3 className="input-labels">Location{entries.length > 1 ? ` #${index + 1}` : ""}</h3>*/}
                {/*        <LocationSearch onLocationSelect={setLocation} />*/}
                {/*        {index > 0 && (*/}
                {/*            <button className="edit-trip-button" onClick={() => removeEntry(index)}>- Remove</button>*/}
                {/*        )}*/}
                {/*        <br/>*/}
                {/*        <hr/>*/}
                {/*    </div>*/}
                {/*))}*/}

                {/*<button className="edit-trip-button" onClick={addEntry}>+ Add Another Location</button>*/}

                <h3 className="input-labels">Additional Notes</h3>
                <textarea style={{width: "100%", margin: "10px 0"}} ref={notesRef} placeholder="Anything extra..."></textarea>

                <div style={{marginTop: "20px"}}>
                    <button className="edit-trip-button" onClick={saveEdit}>Save</button>
                </div>
            </div>
        </div>
    );
}