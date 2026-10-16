import placeholder from '/assets/trip_preview/placeholder.jpg';
import eye from '/assets/trip_preview/eye.svg';
// import eyeHover from '/assets/trip_preview/eye-hover.svg';
import edit from '/assets/trip_preview/edit.svg';
// import editHover from '/assets/trip_preview/edit-hover.svg';
// import share from '/assets/trip_preview/share.svg';
// import shareHover from '/assets/trip_preview/share-hover.svg';
import trash from '/assets/trip_preview/trash.svg';
// import trashHover from '/assets/trip_preview/trash-hover.svg';
import { useNavigate } from "react-router-dom";
import type { Trip } from "../../types/Trip.ts";
import PreviewTripPopup from "./PreviewTripPopup.tsx";
import {useState} from "react";
import {deleteTrip} from "../../utils/TripStorage.ts";

interface IconButtonProps {
    main: string;
    label: string;
    onClick: () => void;
    danger?: boolean;
}

function IconButton({ main, label, onClick, danger = false }: IconButtonProps) {
    const colour = danger
        ? "border-(--custom-red) hover:bg-(--custom-red)"
        : "border-(--primary-colour) hover:bg-(--primary-colour)";

    return (
        <button className={`!bg-(--background-colour) ${colour}`} onClick={onClick} aria-label={label}>
            <span className="block size-5">
                <img src={main} alt="" className="object-cover"/>
            </span>
        </button>
    );
}

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
        <div className="w-[280px] mb-[25px]">
            <div>
                <div className="flex my-[15px] border border-(--secondary-colour) rounded-2xl w-[275px] bg-(--background-colour) justify-evenly
                                max-md:w-[225px] max-md:flex-col">
                    <img src={placeholder} alt="placeholder" className="size-[175px] rounded-2xl object-contain max-md:w-225[px] max-md:h-[150px]"/>
                    <div className="flex flex-col justify-around max-md:my-[5px] max-md:flex-row">
                        <IconButton main={eye} label="Preview" onClick={openPreview} />
                        <IconButton main={edit} label="Edit" onClick={() => navigate(`/my-trips/edit-trip/${tripDetails.id}`)} />
                        <IconButton main={trash} label="Delete" onClick={handleDelete} danger />
                    </div>
                </div>
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