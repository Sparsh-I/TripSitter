import { useSearchParams } from "react-router-dom";
import type { TripLeg } from "../../../types/Trip.ts";
import TripLegsDetails from "./TripLegsDetails.tsx";

interface Props {
    tripLegs: TripLeg[];
    legLabel?: (leg: TripLeg, index: number) => string;
}

export default function TripLegsTab({ tripLegs }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedId = searchParams.get("leg");
    const selected = tripLegs.find(l => l.legId === selectedId) ?? tripLegs[0];

    function selectLeg(id: string) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("leg", id);
            return next;
        });
    }

    if (tripLegs.length === 0) {
        return <p className="text-[#909090] py-6">No trip legs yet.</p>;
    }

    return (
        <div className="flex flex-row gap-5 p-5">
            <nav className="flex flex-col gap-1 w-[15%] shrink-0">
                {tripLegs.map((leg, i) => (
                    <button
                        key={leg.legId}
                        onClick={() => selectLeg(leg.legId)}
                        className={`w-35 rounded-lg text-left h-10 py-0 px-4 truncate
                            ${selected.legId === leg.legId
                                ? "bg-(--primary-colour-alt)"
                                : "bg-transparent text-black hover:bg-(--primary-colour-alt2)"}`}
                    >
                        {i + 1}. {leg.locationLabel}
                    </button>
                ))}
            </nav>

            <div className="flex-1 min-w-0">
                <TripLegsDetails key={selected.legId} tripLeg={selected} />
            </div>
        </div>
    );
}