import DatePicker from "./DatePicker.tsx";
import {useState} from "react";
import type { DateRange } from "react-day-picker";
import '../styles/PopupWindow.css';
import LocationSearch from "./LocationSearch.tsx";

interface NewTripPopupProps {
    title: string;
    dateLabel: DateRange | undefined;
    onClose: () => void;
}

interface Location {
    lat: number;
    lng: number;
    label: string;
}

export default function NewTripPopup({ title, dateLabel, onClose }: NewTripPopupProps) {
    const [range, setRange] = useState<DateRange | undefined>(dateLabel);
    const [tripTitle, setTitle] = useState<string>(title);
    const [, setLocation] = useState<Location | null>(null);

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

                <textarea placeholder="Anything extra..." style={{width: "460px", height: "170px"}}></textarea>

                <div style={{marginTop: "20px"}}>
                    <button onClick={onClose}>Save</button>
                </div>
            </div>
        </div>
    );
}