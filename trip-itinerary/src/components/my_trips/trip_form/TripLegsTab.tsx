import { useSearchParams } from "react-router-dom";
import type { TripLeg } from "../../../types/Trip.ts";
import TripLegsDetails from "./TripLegsDetails.tsx";
import { useContextMenu } from "../../../hooks/useContextMenu.ts";
import { useState } from "react";

import { IconButton } from "../TripPreview.tsx";
import edit from '/assets/my_trips/edit.svg';
// import trash from '/assets/my_trips/trash.svg';
import RenameTripPopup from "../RenameTripLegPopup.tsx";

interface Props {
    tripLegs: TripLeg[];
    onRenameLeg: (legId: string, title: string) => Promise<void>
    tripStart: Date;
    tripEnd: Date;
    legLabel?: (leg: TripLeg, index: number) => string;
}

export default function TripLegsTab({ tripLegs, onRenameLeg, tripStart, tripEnd }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedId = searchParams.get("leg");
    const selected = tripLegs.find(l => l.legId === selectedId) ?? tripLegs[0];

    const { menu, open } = useContextMenu<TripLeg>();
    const [renamingLeg, setRenamingLeg] = useState<TripLeg | null>(null);

    function selectLeg(id: string) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("leg", id);
            return next;
        });
    }

    const details = selected && (
        <div className="flex-1 min-w-0">
            <TripLegsDetails 
                key={selected.legId} 
                tripLeg={selected} 
                tripStart={tripStart}
                tripEnd={tripEnd}
            />
        </div>
    );

    return (
        <div>
            <div className="text-right">
                <button className="cursor-not-allowed border-[0.1em] border-(--primary-colour-alt) bg-transparent text-black hover:bg-(--background-colour)">
                    + Add Trip Leg
                </button>
            </div>

            {tripLegs.length === 0 ? (
                <p className="text-black py-6">No trip legs yet. I don't even know how you got here.</p>
            ) : tripLegs.length === 1 ? (
                <div className="p-5">{details}</div>
            ) : (
                <div className="flex flex-row gap-5 p-5">
                    <nav className="flex flex-col gap-1 w-[15%] shrink-0">
                        {tripLegs.map((leg, i) => (
                            <button
                                key={leg.legId}
                                onContextMenu={(e) => open(e, leg)} 
                                onClick={() => selectLeg(leg.legId)}
                                className={`w-35 rounded-lg text-left h-10 py-0 px-4 truncate text-white
                                    ${selected.legId === leg.legId
                                        ? "bg-[#595959]"
                                        : "text-black hover:bg-(--background-colour)"}`}
                            >
                                {i + 1}. {leg.locationLabel}
                            </button>
                        ))}
                    </nav>

                    <div className="flex-1 min-w-0">
                        <TripLegsDetails
                            key={selected.legId} 
                            tripLeg={selected} 
                            tripStart={tripStart}
                            tripEnd={tripEnd}
                        />
                    </div>
                </div>
            )}

            {menu && (
                <ul className="fixed z-50 bg-gray-200 py-2" 
                    style={{ top: menu.y, left: menu.x }} onClick={(e) => e.stopPropagation()}>
                    <li><IconButton main={edit} label="Rename" onClick={() => setRenamingLeg(menu.data)} /></li>
                    <li role="separator" className="my-1 border-t border-gray-400" />
                    {/* <li><IconButton main={trash} label="Delete" onClick={(handleDelete)} danger /></li> */}
                </ul>
            )}

            {renamingLeg && (
                <RenameTripPopup 
                    leg={renamingLeg}
                    onClose={() => setRenamingLeg(null)}
                    onSave={title => onRenameLeg(renamingLeg.legId, title)}
                />
            )}
        </div>
    );
}