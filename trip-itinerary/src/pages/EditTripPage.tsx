import "../styles/EditTrip.css";
import DatePicker from "../components/DatePicker.tsx";
import {useState} from "react";
import type {DateRange} from "react-day-picker";

export default function EditTripPage() {
    const [range, setRange] = useState<DateRange | undefined>(undefined);

    return (
        <div>
            <button className="back-button">← Return to My Trips</button>
            <div style={{ margin: "0 25%", justifyContent: "space-around", backgroundColor: "#A0A0A0" }}>
                <h1 className="input-labels">Edit Trip</h1>

                <h3 className="input-labels">Title</h3>
                <input type="text" placeholder="What are we calling this?" style={{width: "100%", display: "flex", margin: "10px 0"}}></input>

                <h3 className="input-labels">Dates</h3>
                <div style={{display: "flex"}}>
                    <DatePicker selected={range} onSelect={setRange}/>
                </div>

                <h3 className="input-labels">Location</h3>
                <input type="text" placeholder="What are we calling this?" style={{width: "100%%", display: "flex", margin: "10px 0"}}></input>

                <button style={{marginTop: "3%"}}>+ Add Another Location</button>
            </div>
        </div>
    );
}