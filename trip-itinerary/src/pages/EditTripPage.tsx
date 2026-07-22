import "../styles/EditTrip.css";
import DatePicker from "../components/global/DatePicker.tsx";
import {useEffect, useRef, useState} from "react";
import type {DateRange} from "react-day-picker";
import { useNavigate } from "react-router-dom";
import LocationSearch, { type TripLocation } from "../components/global/LocationSearch.tsx";
import { useParams } from "react-router-dom";
import {getTrips, saveTrips} from "../utils/TripStorage";
import { type Trip } from "../types/Trip";

// interface LocationEntry {
//     range: DateRange | undefined;
//     location: string;
// }

export default function EditTripPage() {
    const [location, setLocation] = useState<TripLocation | null>(null);
    const [title, setTitle] = useState("");
    const [range, setRange] = useState<DateRange | undefined>(undefined);
    const { id } = useParams<{ id: string }>();
    const [tripDetails, setTripDetails] = useState<Trip | null>(null);
    const notesRef = useRef<HTMLTextAreaElement>(null);

    // const [entries, setEntries] = useState<LocationEntry[]>([
    //     { range: undefined, location: "" },
    // ]);

    const navigate = useNavigate();

    useEffect(() => {
        const trips = getTrips();
        const found = trips.find(t => t.id === id);
        setTripDetails(found ?? null);
    }, [id]);

    useEffect(() => {
        if (tripDetails) {
            setTitle(tripDetails.title);
            setRange({
                from: new Date(tripDetails.startDate),
                to: new Date(tripDetails.endDate),
            });
            setLocation({
                lat: tripDetails.lat,
                lng: tripDetails.lng,
                label: tripDetails.locationLabel,
            });
        }
    }, [tripDetails]);

    if (!tripDetails) return <div className="no-trip-found"><h1>No Trip Found :(</h1></div>

    function saveEdit(): void {
        if (!tripDetails || !location || !range?.from || !range.to) {
            alert("Please fill in dates and a location before saving.");
            return;
        }

        const updatedTrip: Trip = {
            ...tripDetails,
            title: title,
            lat: location.lat,
            lng: location.lng,
            locationLabel: location.label,
            startDate: range.from,
            endDate: range.to,
            notes: notesRef.current?.value
        }

        const trips = getTrips();
        const updatedList = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t);
        saveTrips(updatedList);

        navigate("/my-trips");
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
            <div style={{ margin: "0 25%", justifyContent: "space-around"}}>
                <h1 className="input-labels">Edit Trip</h1>

                <h3 className="input-labels">Title</h3>
                <input
                    type="text"
                    placeholder="What are we calling this?"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{width: "95%", margin: "10px 0"}}
                />
                <br/>
                <hr/>

                <h3 className="input-labels">Dates</h3>
                <div>
                    <DatePicker
                        selected={range}
                        onSelect={setRange}
                        fieldSize={21}
                    />
                </div>

                <h3 className="input-labels">Location</h3>
                <LocationSearch onLocationSelect={setLocation} defaultVal={tripDetails.locationLabel} />

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
                <textarea style={{width: "100%", margin: "10px 0"}} ref={notesRef} placeholder="Anything extra...">
                    {tripDetails.notes ? tripDetails.notes : ""}
                </textarea>

                <div style={{marginTop: "20px"}}>
                    <button className="edit-trip-button" onClick={saveEdit}>Save</button>
                </div>
            </div>
        </div>
    );
}