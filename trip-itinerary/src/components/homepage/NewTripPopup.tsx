import DatePicker from "../global/DatePicker.tsx";
import {useRef, useState} from "react";
import type { DateRange } from "react-day-picker";
import '../../styles/PopupWindow.css';
import LocationSearch, {type TripLocation} from "../global/LocationSearch.tsx";
import {getTrips, saveTrips} from "../../utils/TripStorage.ts";
import type {Trip} from "../../types/Trip.ts";

interface NewTripPopupProps {
    title: string;
    dateLabel: DateRange | undefined;
    onClose: () => void;
}

export default function NewTripPopup({ title, dateLabel, onClose }: NewTripPopupProps) {
    const [range, setRange] = useState<DateRange | undefined>(dateLabel);
    const [tripTitle, setTitle] = useState<string>(title);
    const [location, setLocation] = useState<TripLocation | null>(null);
    const notesRef = useRef<HTMLTextAreaElement>(null);

    function addTrip(): void {
        if (!location || !range?.from || !range?.to) {
            alert("Please fill in dates and a location before saving!");
            return;
        }

        const trip: Trip = {
            id: new Date().toISOString(),
            title: tripTitle,
            lat: location.lat,
            lng: location.lng,
            locationLabel: location.label,
            startDate: range.from,
            endDate: range.to,
            notes: notesRef.current?.value || undefined,
        }
        const tripList = getTrips();
        tripList.push(trip);
        saveTrips(tripList);

        onClose();
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="popup-close">x</button>
                <h2>Basic Trip Information</h2>

                <table style={{marginLeft: "auto", marginRight: "auto"}}>
                    <tbody>
                        <tr>
                            <td><p className="popup-labels"><strong>Title</strong></p></td>
                            <td>
                                <input
                                    type="text"
                                    value={tripTitle}
                                    onChange={e => setTitle(e.target.value)}
                                    size={37}
                                    placeholder="Where are we going?"
                                >
                                </input>
                            </td>
                        </tr>
                        <tr>
                            <td><p className="popup-labels"><strong>Dates</strong></p></td>
                            <td>
                                <DatePicker
                                    selected={range}
                                    onSelect={setRange}
                                    variant="popup"
                                    fieldSize={37}
                                    numMonths={1}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><p className="popup-labels"><strong>Location</strong></p></td>
                            <td>
                                <LocationSearch onLocationSelect={setLocation} />
                            </td>
                        </tr>
                        <tr>
                            <td><p className="popup-labels"><strong>Notes</strong></p></td>
                        </tr>
                    </tbody>
                </table>

                <textarea ref={notesRef} placeholder="Anything extra..." style={{width: "460px", height: "170px"}}></textarea>

                <div style={{marginTop: "20px"}}>
                    <button onClick={addTrip}>Save</button>
                </div>
            </div>
        </div>
    );
}