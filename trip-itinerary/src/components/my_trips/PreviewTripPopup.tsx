import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import '../../styles/PopupWindow.css';
import { type TripLocation } from "../global/LocationSearch.tsx";
import type { Trip } from "../../types/Trip.ts";
import { formatDate } from "../../utils/TripDateUtils.ts";
import { createPortal } from "react-dom";
import '../../styles/PopupWindow.css';
import image from '../../assets/trip_preview/placeholder.jpg';
import EmbedWidget from "./EmbedWidget.tsx";

interface PreviewPopupProps {
    trip: Trip;
    onClose: () => void;
}

export default function PreviewTripPopup({ trip, onClose }: PreviewPopupProps) {
    const [, setLocation] = useState<TripLocation | null>(null);
    const [, setTitle] = useState("");
    const [, setRange] = useState<DateRange | undefined>(undefined);

    useEffect(() => {
        setTitle(trip.title);
        setRange({
            from: new Date(trip.startDate),
            to: new Date(trip.endDate),
        });
        setLocation({
            lat: trip.lat,
            lng: trip.lng,
            label: trip.locationLabel,
        });
    }, [trip]);

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="popup-close">x</button>
                <h2>{trip.title}</h2>

                <div className="trip-preview-photo"
                     style={{backgroundImage: `url(${image})`}}
                />
                <table style={{marginLeft: "auto", marginRight: "auto"}}>
                    <tbody>
                        <tr>
                            <td width="120"><p className="popup-labels"><strong>Dates</strong></p></td>
                            <td><p>{formatDate(trip.startDate)} ➜ {formatDate(trip.endDate)}</p></td>
                        </tr>
                        <tr>
                            <td><p className="popup-labels"><strong>Location</strong></p></td>
                            <td><p>{trip.locationLabel}</p></td>
                        </tr>
                        <tr>
                            <td><p className="popup-labels"><strong>Notes</strong></p></td>
                            <td><p>{trip.notes}</p></td>
                        </tr>
                        <tr>
                            <td><p className="popup-labels"><strong>Relevant Links</strong></p></td>
                            <td><EmbedWidget link={trip.link}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>,
        document.body
    );
}