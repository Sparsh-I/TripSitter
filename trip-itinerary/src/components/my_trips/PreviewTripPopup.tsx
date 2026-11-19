import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { type TripLocation } from "../global/LocationSearch.tsx";
import type { Trip } from "../../types/Trip.ts";
import { formatDate } from "../../utils/TripDateUtils.ts";
import { createPortal } from "react-dom";
import EmbedWidget from "./EmbedWidget.tsx";
import {useIsMobile} from "../../hooks/useIsMobile.ts";

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

    const isMobile = useIsMobile();

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="popup-close">x</button>
                <h2>{trip.title}</h2>

                <div className={`w-full h-80 bg-(--primary-colour-alt) bg-cover bg-center mt-1.25 mb-2.5
                                ${trip.photo ?? "bg-[url(/assets/my_trips/placeholder.jpg)]"}`}
                />
                <table className="mx-auto [&_td]:p-4">
                    <tbody>
                        <tr className="odd:bg-gray-200 even:bg-white">
                            <td className="min-w-40"><p className="popup-labels"><strong>Dates</strong></p></td>
                            <td><p>{formatDate(trip.startDate)} ➜ {formatDate(trip.endDate)}</p></td>
                        </tr>
                        <tr className="odd:bg-gray-200 even:bg-white">
                            <td><p className="popup-labels"><strong>Location</strong></p></td>
                            <td><p>{trip.locationLabel}</p></td>
                        </tr>
                        <tr className="odd:bg-gray-200 even:bg-white">
                            <td><p className="popup-labels"><strong>Notes</strong></p></td>
                            <td><p>{trip.notes}</p></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>,
        document.body
    );
}