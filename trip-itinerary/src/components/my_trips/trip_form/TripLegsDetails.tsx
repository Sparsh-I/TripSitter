import { useIsMobile } from "../../../hooks/useIsMobile.ts";
import { useEffect, useState } from 'react';

import addFile from '/assets/my_trips/add-file.svg';
import addSquare from '/assets/my_trips/add-square.svg';
import { countryFlag, getCountryCode } from '../../../utils/LocationUtils.ts';
import type { TripLeg } from '../../../types/Trip.ts';

import DatePicker from "../../../components/global/DatePicker.tsx";
import type { DateRange } from "react-day-picker";
import PhotoPopup from "../PhotoPopup.tsx";
import EmbedWidget from "../EmbedWidget.tsx";
import LocationSearch, { type TripLocation } from "../../global/LocationSearch.tsx";

interface TripLegsDetailsProps {
    tripLeg: TripLeg;
    onChange: (patch: Partial<TripLeg>) => void;
    tripStart: Date;
    tripEnd: Date;
}

type LinkType = "airbnb" | "custom";
const AIRBNB_HOSTS = /(^|\/\/)(www\.)?airbnb\.[a-z.]+/i;

interface LinkEntry {
    url: string;
    type: LinkType;
    label?: string;
}

// interface LegPhoto {
//     id: string;
//     path: string;
//     url: string;
// }

function detectLinkType(url: string): LinkType {
    return AIRBNB_HOSTS.test(url.trim()) ? "airbnb" : "custom";
}

function toSafeHref(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
        const u = new URL(withProtocol);
        return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
    } catch {
        return null;
    }
}

export default function TripLegsDetails({ tripLeg, onChange, tripStart, tripEnd }: TripLegsDetailsProps) {
    const [flag, setFlag] = useState("");
    const [range, setRange] = useState<DateRange | undefined>({
        from: new Date(tripLeg.startDate),
        to: new Date(tripLeg.endDate),
    });
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [linkEntries, setLinkEntries] = useState<LinkEntry[]>(
        () => (tripLeg.links ?? []).map(url => ({ url, type: detectLinkType(url) }))
    );
    const isMobile = useIsMobile();

    useEffect(() => {
        let cancelled = false;
        getCountryCode(tripLeg.lat, tripLeg.lng)
            .then(code => { if (!cancelled) setFlag(countryFlag(code)); })
            .catch(() => { if (!cancelled) setFlag(""); });
        return () => { cancelled = true; };
    }, [tripLeg.lat, tripLeg.lng]);

    const tripLegPhotos = (tripLeg.photos ?? []).map((p, i) => ({
        key: p.id,
        id: p.id,
        path: p.path,
        url: p.url,
        alt: `${tripLeg.legTitle ?? tripLeg.locationLabel} photo ${i + 1}`,
    }));

    function commit(next: LinkEntry[]) {
        setLinkEntries(next);
        onChange({ links: next.map(l => l.url).filter(u => u.trim() !== "") });
    }

    function updateUrl(i: number, url: string) {
        commit(linkEntries.map((l, idx) =>
            idx === i
                ? { url, type: detectLinkType(url) === "airbnb" ? "airbnb" : l.type }
                : l
        ));
    }

    function updateType(i: number, type: LinkType) {
        commit(linkEntries.map((l, idx) => (idx === i ? { ...l, type } : l)));
    }

    const addLink = () => commit([...linkEntries, { url: "", type: "custom" }]);
    const removeLink = (i: number) => commit(linkEntries.filter((_, idx) => idx !== i));

    function handleLocationSelect(loc: TripLocation | null) {
        if (!loc) return;
        onChange({
            lat: loc.lat,
            lng: loc.lng,
            locationLabel: loc.label,
        });
    }

    return (
        <div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col items-start gap-2 mb-7">
                    <h3 className="text-(--secondary-colour-alt) text-left mt-5">Dates</h3>
                    <div>
                        <DatePicker
                            selected={range}
                            onSelect={r => {
                                setRange(r);
                                if (r?.from && r?.to) onChange({ startDate: r.from, endDate: r.to });
                            }}
                            fieldSize={21}
                            numMonths={isMobile ? 1 : 2}
                            minDate={tripStart}
                            maxDate={tripEnd}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <h1 className="font-xl">
                        {flag}
                    </h1>
                </div>
            </div>
            <div className="flex flex-col gap-10">
                <div>
                    <h3 className="text-left pb-3">Location</h3>
                    <LocationSearch onLocationSelect={handleLocationSelect} />
                </div>

                <div>
                    <h3 className="text-left pb-3">Plan/Notes</h3>
                    <textarea
                        className="w-full h-40"
                        value={tripLeg.notes ?? ""}
                        onChange={e => onChange({ notes: e.target.value })}
                    />
                </div>

                <div>
                    <h3 className="text-left pb-3">Links</h3>
                    {linkEntries.map((link, i) => {
                        const href = link.type === "custom" ? toSafeHref(link.url) : null;

                        return (
                            <div key={i} className="my-4">
                                <div className="flex gap-2 items-center">
                                    <select
                                        value={link.type}
                                        onChange={e => updateType(i, e.target.value as LinkType)}
                                        className="appearance-none text-center rounded-l-xl rounded-r-none"
                                    >
                                        <option value="airbnb">Airbnb</option>
                                        <option value="custom">Custom</option>
                                    </select>

                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={e => updateUrl(i, e.target.value)}
                                        placeholder={link.type === "airbnb" ? "Paste an Airbnb listing link" : "Paste a link"}
                                        className="w-full rounded-none"
                                    />

                                    <button onClick={() => removeLink(i)} aria-label="Remove link" className="rounded-l-none">✕</button>
                                </div>

                                {/* preview */}
                                {link.type === "airbnb" && link.url.trim() !== "" && (
                                    <div className="mt-2">
                                        <EmbedWidget link={link.url} />
                                    </div>
                                )}

                                {link.type === "custom" && href && (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block text-(--primary-colour-alt) hover:underline break-all"
                                    >
                                        {new URL(href).hostname}
                                    </a>
                                )}

                                {link.type === "custom" && link.url.trim() !== "" && !href && (
                                    <p className="mt-2 text-sm text-(--custom-red)">That doesn't look like a valid link.</p>
                                )}
                            </div>
                        );
                    })}
                    <button type="button"
                            className="text-(--primary-colour-alt) bg-transparent hover:underline flex p-0"
                            onClick={addLink}>
                        + Add Link
                    </button>
                </div>

                <div>
                    <h3 className="text-left pb-3">Files</h3>
                    <button className="flex flex-col justify-center gap-3 items-center w-35 h-35 bg-gray-200 hover:bg-gray-300">
                        <span className="block size-6">
                            <img src={addFile} alt="" className="object-cover"/>
                        </span>
                        <p>Upload file</p>
                    </button>
                </div>

                <div>
                    <h3 className="text-left pb-3">Photos</h3>
                    <div className="flex gap-5 overflow-x-auto w-full py-3">
                        {tripLegPhotos && (
                            <div className="flex gap-5 overflow-x-auto">
                                {tripLegPhotos.map(photo => (
                                    <div key={photo.key} className="group relative">
                                        <img src={photo.url} alt={photo.alt} className="w-100 h-60 object-cover" />
                                        
                                        <div className="absolute inset-0 bg-gray-900/10 opacity-0 group-hover:opacity-100 flex items-start justify-end transition-opacity">
                                            <button 
                                                onClick={() => setSelectedPhoto(photo.url)}
                                                className="flex-shrink-0 w-full h-full p-0 bg-transparent rounded-lg overflow-hidden">
                                            </button>

                                            {/* <button 
                                                className="absolute m-3 bg-white text-black text-sm hover:bg-gray-200 translate-y-5 group-hover:translate-y-0 transition-transform duration-300"
                                                onClick={() => updateBanner(photo.url)}
                                            >
                                                Set Banner Photo
                                            </button> */}
                                        </div>
                                    </div>
                                ))}
                                {selectedPhoto && (
                                    <PhotoPopup photoUrl={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
                                )}
                            </div>
                        )}
                        <button className="flex flex-col justify-center gap-3 items-center w-100 h-60 bg-gray-200 hover:bg-gray-300">
                            <span className="block size-10">
                                <img src={addSquare} alt="" className="object-cover"/>
                            </span>
                            <p>Upload photo</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}