import DatePicker from "./DatePicker.tsx";
import { useState } from "react";
import type {DateRange} from "react-day-picker";
// import { formatDate } from "../utils/DateUtils.tsx";
import NewTripPopup from "./NewTripPopup.tsx";

export default function NewTrip() {
    const [range, setRange] = useState<DateRange | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    // function parseDateRange(dateRange: DateRange | undefined): string {
    //     if (!dateRange) return "";
    //     return `${formatDate(dateRange.from)} ➜ ${formatDate(dateRange.to)}`;
    // }

    const isFilled = title.trim() !== "" && range?.from && range?.to;

    function submitTrip() {
        // const title = document.getElementById("title-input-home") as HTMLInputElement;
        // console.log(`Title: ${title.value}, Dates: ${parseDateRange(range)}`);
        // title.value = "";
        // setRange(undefined);

        if (!isFilled) return;
        setShowPopup(true);
    }

    function closePopup() {
        setShowPopup(false);
        setTitle("");
        setRange(undefined);
    }

    return (
        <div className="new-trip">
            <div style={{ display: "flex", flexDirection: "column"}}>
                <div className="black-label">
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
                <button style={{ margin: "30px 0" }} onClick={submitTrip}>Submit</button>
            </div>
            <div>
                <div className="black-label">
                    <h3>Dates</h3>
                </div>
                <DatePicker selected={range} onSelect={setRange}/>
            </div>

            {showPopup && (
                <NewTripPopup
                    title={title}
                    dateLabel={range}
                    onClose={closePopup}
                />
            )}
        </div>
    );
}