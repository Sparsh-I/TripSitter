import NavBar from '../components/global/NavBar.tsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {getTrips} from "../utils/TripStorage.ts";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import React, {useEffect, useRef, useState} from "react";
import Footer from "../components/global/Footer.tsx";
import {currentTrips, futureTrips, pastTrips} from "../utils/TripDateUtils.ts";
import type {Trip} from "../types/Trip.ts";
import currentPin from "/assets/my_map/current-pin.svg";
import upcomingPin from "/assets/my_map/upcoming-pin.svg";
import pastPin from "/assets/my_map/past-pin.svg";

const iconOptions = {
    iconSize: [80, 80] as [number, number],
    iconAnchor: [40, 60] as [number, number],
    popupAnchor: [0, -40] as [number, number],
};

const currentIcon = L.icon({...iconOptions, iconUrl: currentPin});
const upcomingIcon = L.icon({...iconOptions, iconUrl: upcomingPin});
const pastIcon = L.icon({...iconOptions, iconUrl: pastPin});

type FilterType = "all" | "current" | "upcoming" | "past";

export default function MyMapPage() {
    const mapRef = useRef<LeafletMap | null>(null);
    const [allTrips, setAllTrips] = useState<Trip[]>([]);
    const [filter, setFilter] = useState<FilterType>("all");
    const [, setLoading] = useState(true);

    // use this for when supabase storage is being used
    useEffect(() => {
        let cancelled = false;

        getTrips()
          .then(setAllTrips)
          .catch(err => {
            console.error("Failed to load trips: ", err);
          }).finally(() => {
            if (!cancelled) setLoading(false);
          });
      return () => {
        cancelled = true;
      };
    }, []);

    const places =
        filter === "current" ? currentTrips(allTrips)
        : filter === "upcoming" ? futureTrips(allTrips)
        : filter === "past" ? pastTrips(allTrips)
        : allTrips;

    function handleMarkerClick(lat: number, lng: number) {
        mapRef.current?.flyTo([lat, lng], 10, {
            duration: 1,
        })
    }

    function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFilter(e.target.value as FilterType);
    }

    function getTripCategory(trip: Trip): FilterType {
        const now = new Date();
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);

        if (now >= start && now <= end) return "current";
        if (start > now) return "upcoming";
        return "past";
    }

    const iconMap: Record<FilterType, L.Icon> = {
        current: currentIcon,
        upcoming: upcomingIcon,
        past: pastIcon,
        all: currentIcon,
    }

    const FILTER_COLOURS: Record<FilterType, string> = {
        all: "before:border-(--primary-colour) checked:before:bg-(--primary-colour)",
        current: "before:border-(--green-pin) checked:before:bg-(--green-pin)",
        upcoming: "before:border-(--red-pin) checked:before:bg-(--red-pin)",
        past: "before:border-(--blue-pin) checked:before:bg-(--blue-pin)",
    };

    interface FilterButtonProps {
        text: string;
        selected: FilterType;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }

    function FilterButton({ text, selected, onChange }: FilterButtonProps) {
        const type = text.toLowerCase() as FilterType;
        const id = `map-filter-${type}`;

        return (
            <div className="flex justify-around items-center gap-2">
                <input
                    type="radio" 
                    name="map-filter" 
                    id={id}
                    value={type} 
                    onChange={onChange} 
                    checked={selected == type} 
                    className={`appearance-none size-5 rounded-full border-2 cursor-pointer ${FILTER_COLOURS[type]}`}
                />
                <label htmlFor={`map-filter-${type}`} className="cursor-pointer">{text}</label>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar/>
            <main className="flex-1 p-10">
                <div className="flex flex-col align-center max-md:flex-col-reverse gap-4">
                    <div className="inline-flex justify-center gap-10 w-[1/2] max-md:flex-col-reverse w-full">
                        {places && (
                            <p>Number of trips: {places.length}</p>
                        )}
                        <div className="flex justify-around gap-3">
                            <FilterButton text="All" selected={filter} onChange={handleFilterChange} />
                            <FilterButton text="Current" selected={filter} onChange={handleFilterChange} />
                            <FilterButton text="Upcoming" selected={filter} onChange={handleFilterChange} />
                            <FilterButton text="Past" selected={filter} onChange={handleFilterChange} />
                        </div>
                    </div>

                    <MapContainer
                        ref={mapRef}
                        center={[20, 0] as [number, number]}
                        zoom={2}
                        minZoom={2}
                        className="mx-auto h-[750px] w-full max-md:h-[800px]"
                        maxBounds={[[-90, -180], [90, 180]]}
                        maxBoundsViscosity={1.0}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true}/>
                            {places.map((place) => {
                                const category = getTripCategory(place);
                                return (
                                    <Marker
                                        key={place.title}
                                        title={place.title}
                                        position={[place.lat, place.lng]}
                                        icon={iconMap[category]}
                                        eventHandlers={{click: () => handleMarkerClick(place.lat, place.lng)}}
                                    >
                                        <Popup>{place.title}</Popup>
                                    </Marker>
                                )
                            })};
                    </MapContainer>
                </div>
            </main>
            <Footer/>
        </div>
    );
}