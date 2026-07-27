import '../../styles/MyTrips.css';
import placeholder from '../../assets/trip_preview/placeholder.jpg';
import eye from '../../assets/trip_preview/eye.svg';
import eyeHover from '../../assets/trip_preview/eye-hover.svg';
import edit from '../../assets/trip_preview/edit.svg';
import editHover from '../../assets/trip_preview/edit-hover.svg';
// import share from '../../assets/trip_preview/share.svg';
// import shareHover from '../../assets/trip_preview/share-hover.svg';
import trash from '../../assets/trip_preview/trash.svg';
import trashHover from '../../assets/trip_preview/trash-hover.svg';
import { useNavigate } from "react-router-dom";
import type { Trip } from "../../types/Trip.ts";
import PreviewTripPopup from "./PreviewTripPopup.tsx";
import {useState} from "react";
import {getTrips, saveTrips} from "../../utils/TripStorage.ts";

interface TripPreviewProps {
    tripDetails: Trip
}

export default function TripPreview({ tripDetails }: TripPreviewProps ) {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    function openPreview() {
        setShowPopup(true);
    }

    function closePopup() {
        setShowPopup(false);
    }

    function deleteTrip(): void {
        const trips = getTrips();
        if (confirm("Are you sure you want to delete this trip?")) {
            const newTrips = trips.filter(trip => trip.id !== tripDetails.id);
            saveTrips(newTrips);
        } else {
            return;
        }
        location.reload();
    }

    return (
        <div style={{width: "280px", margin: "0 0 25px 0"}}>
            <div>
                <div className="trip-preview">
                    <img src={placeholder} alt="placeholder"/>
                    <div className="trip-options">
                        <button className="alt" onClick={openPreview}>
                            <div className="image-container">
                                <img className="img-main" src={eye} alt="Preview"/>
                                <img className="img-hover" src={eyeHover} alt="Preview Hovered"/>
                            </div>
                        </button>
                        <button className="alt" onClick={() => navigate(`/edit-trip/${tripDetails.id}`)}>
                            <div className="image-container">
                                <img className="img-main" src={edit} alt="Edit"/>
                                <img className="img-hover" src={editHover} alt="Edit Hovered"/>
                            </div>
                        </button>
                        <button className="alt delete" onClick={deleteTrip}>
                            <div className="image-container">
                                <img className="img-main" src={trash} alt="Delete"/>
                                <img className="img-hover" src={trashHover} alt="Delete Hovered"/>
                            </div>
                        </button>
                    </div>
                </div>
                <h3>{tripDetails.title}</h3>
            </div>

            {showPopup && (
                <PreviewTripPopup
                    trip={tripDetails}
                    onClose={closePopup}
                />
            )}
        </div>
    );
}