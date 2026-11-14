import { useSearchParams } from "react-router-dom";
import type { TripLeg } from "../../../types/Trip.ts";
import TripLegsDetails from "./TripLegsDetails.tsx";
import { useContextMenu } from "../../../hooks/useContextMenu.ts";
import { useState } from "react";

import { IconButton } from "../TripPreview.tsx";
import edit from '/assets/my_trips/edit.svg';
import RenameTripPopup from "../RenameTripLegPopup.tsx";

interface Props {
    tripLegs: TripLeg[];
    onUpdateLeg: (legId: string, patch: Partial<TripLeg>) => void;
    onAddLeg: () => Promise<TripLeg | undefined>;
    tripStart: Date;
    tripEnd: Date;
}

export default function TripLegsTab({ tripLegs, onUpdateLeg, onAddLeg, tripStart, tripEnd }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { menu, open } = useContextMenu<TripLeg>();
    const [renamingLeg, setRenamingLeg] = useState<TripLeg | null>(null);
    const [adding, setAdding] = useState(false);

    const selectedId = searchParams.get("leg");
    const selected = tripLegs.find(l => l.legId === selectedId) ?? tripLegs[0];

    function selectLeg(id: string) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("leg", id);
            return next;
        });
    }

    async function handleAdd() {
        setAdding(true);
        try {
            const newLeg = await onAddLeg();
            if (newLeg) selectLeg(newLeg.legId);
        } finally {
            setAdding(false);
        }
    }

    const addButton = (
        <button
            disabled={adding}
            onClick={handleAdd}
            className="border-[0.1em] p-1 w-full border-(--primary-colour-alt) bg-transparent text-black hover:bg-(--background-colour)"
        >
            {adding ? "Adding..." : "+ Add Trip Leg"}
        </button>
    );

    if (tripLegs.length === 0) {
        return (
            <div className="py-6">
                <p className="text-black pb-4">No trip legs yet.</p>
                {addButton}
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-row gap-5 p-5">
                <nav className="flex flex-col gap-1 w-[15%] mr-4 shrink-0">
                    {tripLegs.length > 1 && tripLegs.map((leg, i) => (
                        <button
                            key={leg.legId}
                            onContextMenu={e => open(e, leg)}
                            onClick={() => selectLeg(leg.legId)}
                            className={`w-full rounded-lg text-left h-10 py-0 px-2 truncate ${
                                selected.legId === leg.legId
                                    ? "bg-[#595959] text-white"
                                    : "!text-black bg-transparent hover:bg-(--background-colour-alt)"
                            }`}
                        >
                            {i + 1}. {leg.legTitle ?? leg.locationLabel}
                        </button>
                    ))}
                    {addButton}
                </nav>

                <div className="flex-1 min-w-0">
                    <TripLegsDetails
                        key={selected.legId}
                        tripLeg={selected}
                        onChange={patch => onUpdateLeg(selected.legId, patch)}
                        tripStart={tripStart}
                        tripEnd={tripEnd}
                    />
                </div>
            </div>

            {menu && (
                <ul
                    className="fixed z-50 bg-gray-200 py-2"
                    style={{ top: menu.y, left: menu.x }}
                    onClick={e => e.stopPropagation()}
                >
                    <li><IconButton main={edit} label="Rename" onClick={() => setRenamingLeg(menu.data)} /></li>
                </ul>
            )}

            {renamingLeg && (
                <RenameTripPopup
                    leg={renamingLeg}
                    onClose={() => setRenamingLeg(null)}
                    onSave={async title => onUpdateLeg(renamingLeg.legId, { legTitle: title })}
                />
            )}
        </div>
    );
}