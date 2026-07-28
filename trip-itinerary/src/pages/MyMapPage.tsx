import NavBar from '../components/global/NavBar.tsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {getTrips} from "../utils/TripStorage.ts";
import type { Map as LeafletMap } from "leaflet";
import {useEffect, useRef, useState} from "react";
import '../styles/MyMap.css';

type Place = { lat: number; lng: number; title: string };

export default function MyMapPage() {
    const mapRef = useRef<LeafletMap | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        getTrips()
            .then(trips => {
                if (cancelled) return;
                setPlaces(trips.map(({ lat, lng, title }) => ({ lat, lng, title })));
            })
            .catch(err => {
                console.error("Failed to load trips: ", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    function handleMarkerClick(lat: number, lng: number) {
        mapRef.current?.setView([lat, lng], 10)
    }

    return (
        <div>
            <NavBar/>
            <MapContainer
                ref={mapRef}
                center={[20, 0] as [number, number]}
                zoom={3}
                minZoom={2}
                className="my-map-container"
                maxBounds={[[-90, -180], [90, 180]]}
                maxBoundsViscosity={1.0}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true}/>
                    {places.map((place) => (
                        <Marker
                            key={place.title}
                            position={[place.lat, place.lng]}
                            eventHandlers={{click: () => handleMarkerClick(place.lat, place.lng)}}
                        >
                            <Popup>{place.title}</Popup>
                        </Marker>
                    ))}
            </MapContainer>
        </div>
    );
}