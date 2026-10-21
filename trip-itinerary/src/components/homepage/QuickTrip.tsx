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
        <div className="flex flex-col">
            <div className="flex flex-row gap-[1.3em] pt-[4em] max-md:flex-col max-md:p-0" style={{ position: "relative" }}>
                <div className="flex flex-col gap-2">
                    <h3 className="!text-(--background-colour) px-[18px] w-fit bg-(--secondary-colour) rounded-xl !mx-0">
                        Title
                    </h3>
                    <input
                        className="w-65"
                        type="text"
                        placeholder="What are we calling this?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="!text-(--background-colour) px-[18px] w-fit bg-(--secondary-colour) rounded-xl !mx-0">
                        Dates
                    </h3>
                    <DatePicker selected={range} onSelect={setRange} fieldSize={21} numMonths={isMobile ? 1 : 2}/>
                </div>
            </div>

            <button className="mt-[1.5em]" onClick={submitTrip}>Submit</button>

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