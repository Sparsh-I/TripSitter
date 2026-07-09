import DatePicker from "./DatePicker.tsx";
import {useState} from "react";
import type {DateRange} from "react-day-picker";

interface NewTripPopupProps {
    title: string;
    dateLabel: DateRange | undefined;
    onClose: () => void;
}

export default function NewTripPopup({ title, dateLabel, onClose }: NewTripPopupProps) {
    const [range, setRange] = useState<DateRange | undefined>(dateLabel);

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="popup-close">x</button>
                <h2>Basic Trip Information</h2>

                <table style={{marginLeft: "auto", marginRight: "auto"}}>
                    <tbody>
                        <tr>
                            <td><p className="popup-labels"><strong>Title</strong></p></td>
                            <td><input type="text" value={title} size={40}></input></td>
                        </tr>
                        <tr>
                            <td><p className="popup-labels"><strong>Dates</strong></p></td>
                            <td><DatePicker selected={range} onSelect={setRange} variant="popup"/></td>
                        </tr>
                        <tr>
                            <td><p className="popup-labels"><strong>Location</strong></p></td>
                            <td><input type="text" size={40}></input></td>
                        </tr>
                        <tr>
                            <td><p className="popup-labels"><strong>Location</strong></p></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <textarea cols={30} style={{ width: "100%" }}></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{marginTop: "20px"}}>
                    <button onClick={onClose}>Save</button>
                </div>
            </div>
        </div>
    );
}