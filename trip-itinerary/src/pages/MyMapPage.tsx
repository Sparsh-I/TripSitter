import NavBar from '../components/global/NavBar.tsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {getTrips} from "../utils/TripStorage.ts";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import React, {useEffect, useRef, useState} from "react";
import '../styles/MyMap.css';
import Footer from "../components/Footer.tsx";
import {currentTrips, futureTrips, pastTrips} from "../utils/TripDateUtils.ts";
import type {Trip} from "../types/Trip.ts";
import currentPin from "../assets/my_map/current-pin.svg";
import upcomingPin from "../assets/my_map/upcoming-pin.svg";
import pastPin from "../assets/my_map/past-pin.svg";

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
        mapRef.current?.setView([lat, lng], 10)
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

    return (
        <div>
            <NavBar/>
            <div className="map-filter">
                {places && (
                    <p>Number of trips: {places.length}</p>
                )}
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <div className="radio-group">
                        <input
                            type="radio" name="map-filter" id="map-filter-all"
                            value="all" onChange={handleFilterChange} defaultChecked/>
                        <label htmlFor="map-filter-all">All</label>
                    </div>
                    <div className="radio-group">
                        <input type="radio" name="map-filter" id="map-filter-current"
                               value="current" onChange={handleFilterChange} />
                        <label htmlFor="map-filter-current">Current</label>
                    </div>
                    <div className="radio-group">
                        <input type="radio" name="map-filter" id="map-filter-upcoming"
                               value="upcoming" onChange={handleFilterChange} />
                        <label htmlFor="map-filter-upcoming">Upcoming</label>
                    </div>
                    <div className="radio-group">
                        <input type="radio" name="map-filter" id="map-filter-past"
                               value="past" onChange={handleFilterChange} />
                        <label htmlFor="map-filter-past">Past</label>
                    </div>
                </div>
            </div>

            <MapContainer
                ref={mapRef}
                center={[20, 0] as [number, number]}
                zoom={2}
                minZoom={2}
                className="my-map-container"
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
                        }
                    )};
            </MapContainer>
            <Footer/>
        </div>
    );
}