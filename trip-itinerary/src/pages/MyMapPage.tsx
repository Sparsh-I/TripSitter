import NavBar from '../components/global/NavBar.tsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {getTrips} from "../utils/TripStorage.ts";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import {useEffect, useRef, useState} from "react";
import '../styles/MyMap.css';
import Footer from "../components/Footer.tsx";
import customPin from "../assets/logo/logo-pin.svg";
import {currentTrips, futureTrips, pastTrips} from "../utils/TripDateUtils.ts";
import type {Trip} from "../types/Trip.ts";

const customIcon = L.icon({
    iconUrl: customPin,
    iconSize: [90, 90],
    iconAnchor: [45, 65],
    popupAnchor: [0, -40],
});

type FilterType = "all" | "current" | "upcoming" | "past";

export default function MyMapPage() {
    const mapRef = useRef<LeafletMap | null>(null);
    const [allTrips, setAllTrips] = useState<Trip[]>([]);
    const [filter, setFilter] = useState<FilterType>("all");

    // use this for when supabase storage is being used
    // useEffect(() => {
    //     getTrips().then(setAllTrips).catch(console.error);
    // }, []);

    useEffect(() => {
        setAllTrips(getTrips());
    }, []);

    const filteredTrips =
        filter === "current" ? currentTrips(allTrips)
        : filter === "upcoming" ? futureTrips(allTrips)
        : filter === "past" ? pastTrips(allTrips)
        : allTrips;

    const places = filteredTrips.map(({ lat, lng, title }) => ({ lat, lng, title }));

    function handleMarkerClick(lat: number, lng: number) {
        mapRef.current?.setView([lat, lng], 10)
    }

    function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFilter(e.target.value as FilterType);
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
                    {places.map((place) => (
                        <Marker
                            key={place.title}
                            title={place.title}
                            position={[place.lat, place.lng]}
                            icon={customIcon}
                            eventHandlers={{click: () => handleMarkerClick(place.lat, place.lng)}}
                        >
                            <Popup>{place.title}</Popup>
                        </Marker>
                    ))}
            </MapContainer>
            <Footer/>
        </div>
    );
}