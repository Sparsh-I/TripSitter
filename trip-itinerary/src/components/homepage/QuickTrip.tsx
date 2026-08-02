import DatePicker from "../global/DatePicker.tsx";
import { useState } from "react";
import type {DateRange} from "react-day-picker";
// import { formatDate } from "../utils/DateUtils.tsx";
import QuickTripPopup from "./QuickTripPopup.tsx";
import {useIsMobile} from "../../hooks/useIsMobile.ts";

export default function QuickTrip() {
    const [range, setRange] = useState<DateRange | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const isFilled = title.trim() !== "" && range?.from && range?.to;

    function submitTrip() {
        if (!isFilled) return;
        setShowPopup(true);
    }

    function closePopup() {
        setShowPopup(false);
        setTitle("");
        setRange(undefined);
    }

    const isMobile = useIsMobile();

    return (
        <div className="new-trip" style={{ position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column"}}>
                <div className="label black">
                    <h3>Title</h3>
                </div>
                <input
                    className="title-input"
                    id="title-input-home"
                    type="text"
                    placeholder="What are we calling this?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column"}}>
                <div className="label black">
                    <h3>Dates</h3>
                </div>
                <DatePicker selected={range} onSelect={setRange} fieldSize={21} numMonths={isMobile ? 1 : 2}/>
            </div>
            <div style={{ textAlign: "start" }}>
                <button className="submit-button" onClick={submitTrip}>Submit</button>
            </div>

            {showPopup && (
                <QuickTripPopup
                    title={title}
                    dateLabel={range}
                    onClose={closePopup}
                />
            )}
        </div>
    );
}