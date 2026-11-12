import placeholder from '/assets/my_trips/placeholder.jpg';
import eye from '/assets/my_trips/eye.svg';
import edit from '/assets/my_trips/edit.svg';
import share from '/assets/my_trips/share.svg';
import archive from '/assets/my_trips/archive.svg';
import trash from '/assets/my_trips/trash.svg';
import { useNavigate } from "react-router-dom";
import type { Trip } from "../../types/Trip.ts";
import PreviewTripPopup from "./PreviewTripPopup.tsx";
import { useState } from "react";
import { archiveTrip, deleteTrip, unarchiveTrip } from "../../utils/TripStorage.ts";
import { useContextMenu } from '../../hooks/useContextMenu.ts';

interface IconButtonProps {
    main: string;
    label: string;
    onClick: () => void;
    danger?: boolean;
    notext?: boolean;
}

export function IconButton({ main, label, onClick, danger = false, notext = false }: IconButtonProps) {
    const colour = danger
        ? "text-(--custom-red)"
        : "";
    if (notext) {
        return (
            <button className={`flex flex-row justify-center rounded-2xl bg-transparent hover:bg-gray-200 cursor-pointer`} onClick={onClick} aria-label={label}>
                <span className="block size-5">
                    <img src={main} alt="" className="object-cover"/>
                </span>
            </button>
        );
    } else {
        return (
            <button className={`flex flex-row w-full gap-10 justify-between rounded-none bg-gray-200 hover:bg-gray-300`} onClick={onClick} aria-label={label}>
                <p className={`${colour}`}>{label}</p>
                <span className="block size-5">
                    <img src={main} alt="" className="object-cover"/>
                </span>
            </button>
        );
    }
}

interface TripPreviewProps {
    tripDetails: Trip;
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

    async function handleArchive(isArchived: boolean) {
        if (isArchived) {
            try {
                await unarchiveTrip(tripDetails);
                window.location.reload();
            } catch (error) {
                console.error("Failed to unarchive trip:", error);
                alert("Something went wrong unarchiving this trip.");
            }
        } else {
            try {
                await archiveTrip(tripDetails);
                window.location.reload();
            } catch (error) {
                console.error("Failed to archive trip:", error);
                alert("Something went wrong archiving this trip.");
            }
        }
    }

    return (
        <div className="w-60 px-3">
            <div onContextMenu={(e) => open(e, tripDetails)} 
                 className="bg-gray-300 hover:bg-gray-200 cursor-pointer p-2 rounded-xl"
                 onDoubleClick={openPreview}>
                <div className="flex flex-row w-full justify-between items-center mb-1 gap-3">
                    <p className="text-left font-lg min-w-0 flex-1 truncate">{tripDetails.title}</p>
                    <button
                        className="p-0 shrink-0 rounded-full bg-transparent leading-none text-black hover:bg-gray-100/80"
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
                    <li><IconButton main={edit} label="Edit" onClick={() => navigate(`/my-trips/${tripDetails.id}/edit`)} /></li>
                    <li role="separator" className="my-1 border-t border-gray-400" />
                    <li><IconButton main={share} label="Share" onClick={() => undefined} /></li>
                    <li><IconButton main={archive} label="Archive" onClick={() => handleArchive(tripDetails.archived)} /></li>
                    <li role="separator" className="my-1 border-t border-gray-400" />
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