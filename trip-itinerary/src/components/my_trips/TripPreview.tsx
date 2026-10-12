import '../../styles/MyTrips.css';
import placeholder from '../../assets/trip_preview/placeholder.jpg';
import edit from '../../assets/trip_preview/edit.svg';
import editHover from '../../assets/trip_preview/edit-hover.svg';
import share from '../../assets/trip_preview/share.svg';
import shareHover from '../../assets/trip_preview/share-hover.svg';
import trash from '../../assets/trip_preview/trash.svg';
import trashHover from '../../assets/trip_preview/trash-hover.svg';
import { useNavigate } from "react-router-dom";
import type { Trip } from "../../types/Trip.ts";
import PreviewTripPopup from "./PreviewTripPopup.tsx";
import {useState} from "react";
import {deleteTrip} from "../../utils/TripStorage.ts";

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

    async function handleDelete() {
        if (confirm("Are you sure you want to delete this trip?")) {
            try {
                await deleteTrip(tripDetails);
                window.location.reload();
            } catch (error) {
                console.error("Failed to delete trip:", error);
                alert("Something went wrong deleting this trip.");
            }
        }
    }

    return (
        <div style={{width: "280px", margin: "0 0 25px 0"}}>
            <div>
                <div className="flex flex-col w-[200px]">
                    <div onClick={openPreview} className="relative group overflow-hidden shadow-lg cursor-pointer bg-white flex justify-center text-center rounded-2xl">
                        <img src={placeholder} alt="placeholder" className="rounded-xl"/>
                        <div className="rounded-xl absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <p className="text-[var(--background-colour)] text-lg font-bold translate-y-5 group-hover:translate-y-0 transition-transform duration-300">
                                {tripDetails.title}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-around [&>img]:flex [&>img]:rounded-none">
                        <button className="alt" onClick={() => navigate(`/my-trips/edit-trip/${tripDetails.id}`)}>
                            <div className="image-container">
                                <img className="img-main" src={edit} alt="Edit"/>
                                <img className="img-hover" src={editHover} alt="Edit Hovered"/>
                            </div>
                        </button>
                        <button className="alt delete" onClick={handleDelete}>
                            <div className="image-container">
                                <img className="img-main" src={trash} alt="Delete"/>
                                <img className="img-hover" src={trashHover} alt="Delete Hovered"/>
                            </div>
                        </button>
                        <button className="alt">
                            <div className="image-container">
                                <img className="img-main" src={share} alt="Share"/>
                                <img className="img-hover" src={shareHover} alt="Share Hovered"/>
                            </div>
                        </button>
                    </div>
                </div>
                {/* <h3>{tripDetails.title}</h3> */}
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