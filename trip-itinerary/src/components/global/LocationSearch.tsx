import React, { useState, useRef } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";

export interface TripLocation {
    lat: number;
    lng: number;
    label: string;
}

interface SearchSuggestion {
    x: number;
    y: number;
    label: string;
}

interface LocationSearchProps {
    onLocationSelect: (location: TripLocation) => void;
    defaultVal?: string;
}

export default function LocationSearch({ onLocationSelect, defaultVal = "" }: LocationSearchProps) {
    const [query, setQuery] = useState(defaultVal);
    const [results, setResults] = useState<SearchSuggestion[]>([]);
    const [open, setOpen] = useState(false);
    const provider = useRef(new OpenStreetMapProvider());
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function runSearch(value: string) {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.trim().length < 3) {
            setResults([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            const res = await provider.current.search({ query: value });
            setResults(res as SearchSuggestion[]);
            setOpen(true);
        }, 300);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setQuery(value);
        runSearch(value);
    }

    function handleSelect(result: SearchSuggestion) {
        onLocationSelect({ lat: result.y, lng: result.x, label: result.label });
        setQuery(result.label);
        setOpen(false);
        setResults([]);
    }

    return (
        <div style={{ position: "relative" }}>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={() => results.length > 0 && setOpen(true)}
                onBlur={() => setOpen(false)}
                placeholder="Search for a location..."
                size={37}
            />

            {open && results.length > 0 && (
                <ul className="location-search-dropdown">
                    {results.map((result, i) => (
                        <li
                            key={i}
                            onMouseDown={e => {
                                e.preventDefault();
                                handleSelect(result);
                            }}
                        >
                            {result.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}