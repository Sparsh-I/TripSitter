import placeholder from '/assets/trip_preview/placeholder.jpg';
import eye from '/assets/trip_preview/eye.svg';
import edit from '/assets/trip_preview/edit.svg';
// import share from '/assets/trip_preview/share.svg';
import trash from '/assets/trip_preview/trash.svg';
import { useNavigate } from "react-router-dom";
import type { Trip } from "../../types/Trip.ts";
import PreviewTripPopup from "./PreviewTripPopup.tsx";
import {useContext, useState} from "react";
import {deleteTrip} from "../../utils/TripStorage.ts";
import { useContextMenu } from '../../hooks/useContextMenu.ts';

interface IconButtonProps {
    main: string;
    label: string;
    onClick: () => void;
    danger?: boolean;
}

function IconButton({ main, label, onClick, danger = false }: IconButtonProps) {
    const colour = danger
        ? "text-(--custom-red)"
        : "";

    return (
        <button className={`flex flex-row w-full gap-10 justify-between rounded-none bg-gray-200 hover:bg-gray-300`} onClick={onClick} aria-label={label}>
            <p className={`${colour}`}>{label}</p>
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
    const { menu, open } = useContextMenu<Trip>();
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
        <div className="w-full px-3">
            <div onContextMenu={(e) => open(e, tripDetails)} className="bg-gray-300 hover:bg-gray-200 cursor-pointer p-2 rounded-xl">
                <div className="flex flex-row w-full justify-between items-center mb-1 gap-3">
                    <p className="text-left font-lg min-w-0 flex-1 truncate">{tripDetails.title}</p>
                    <button
                        className="w-6 p-0 shrink-0 rounded-full bg-transparent leading-none text-black hover:bg-gray-100/80"
                        onClick={(e) => {
                            e.stopPropagation();
                            open(e, tripDetails);
                        }}
                        aria-label="More options"
                    >
                        ⋯
                    </button>
                </div>
                <div className="w-fit rounded-md bg-(--background-colour) max-md:w-[225px]">
                    <img
                        src={placeholder}
                        alt="placeholder"
                        className="w-full rounded-md object-contain max-md:h-[150px]"
                    />
                </div>
            </div>

            {menu && (
                <ul className="fixed z-50 bg-gray-200 py-2" 
                    style={{ top: menu.y, left: menu.x }} onClick={(e) => e.stopPropagation()}>
                    <li><IconButton main={eye} label="Preview" onClick={openPreview} /></li>
                    <li><IconButton main={edit} label="Edit" onClick={() => navigate(`/my-trips/edit-trip/${tripDetails.id}`)} /></li>
                    <li><IconButton main={trash} label="Delete" onClick={handleDelete} danger /></li>
                </ul>
            )}

            {showPopup && (
                <PreviewTripPopup
                    trip={tripDetails}
                    onClose={closePopup}
                />
            )}
        </div>
    );
}