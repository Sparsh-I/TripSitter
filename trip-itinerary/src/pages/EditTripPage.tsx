import "../styles/EditTrip.css";
import DatePicker from "../components/DatePicker.tsx";
import {useState} from "react";
import type {DateRange} from "react-day-picker";
import { useNavigate } from "react-router-dom";

interface LocationEntry {
    range: DateRange | undefined;
    location: string;
}

export default function EditTripPage() {
    const [title, setTitle] = useState("");
    const [entries, setEntries] = useState<LocationEntry[]>([
        { range: undefined, location: "" },
    ]);

    const navigate = useNavigate();

    function addEntry() {
        setEntries(prev => [...prev, { range: undefined, location: "" }]);
    }

    function removeEntry(index: number) {
        setEntries(prev => prev.filter((_, i) => i !== index));
    }

    function setRangeAt(index: number, range: DateRange | undefined) {
        setEntries(prev =>
            prev.map((entry, i) => (i === index ? { ...entry, range } : entry))
        );
    }

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
                    style={{width: "90%", display: "flex", margin: "10px 0"}}
                />
                <br/>
                <hr/>

                {entries.map((entry, index) => (
                    <div key={index}>
                        <h3 className="input-labels">Dates{entries.length > 1 ? ` #${index + 1}` : ""}</h3>
                        <div style={{display: "flex"}}>
                            <DatePicker selected={entry.range} onSelect={(range) => {setRangeAt(index, range);}} fieldSize={20}/>
                        </div>

                        <h3 className="input-labels">Location{entries.length > 1 ? ` #${index + 1}` : ""}</h3>
                        <input
                            type="text"
                            placeholder="Where are we going?"
                            style={{width: "90%", display: "flex", margin: "10px 0"}}
                        />
                        {index > 0 && (
                            <button className="edit-trip-button" onClick={() => removeEntry(index)}>- Remove</button>
                        )}
                        <br/>
                        <hr/>
                    </div>
                ))}

                <button className="edit-trip-button" onClick={addEntry}>+ Add Another Location</button>

                <h3 className="input-labels">Additional Notes</h3>
                <textarea style={{width: "90%", margin: "10px 0"}} placeholder="Anything extra..."></textarea>

                <div style={{marginTop: "20px"}}>
                    <button className="edit-trip-button" onClick={() => {}}>Save</button>
                </div>
            </div>
        </div>
    );
}