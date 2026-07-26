import NavBar from '../components/global/NavBar.tsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {getTrips} from "../utils/TripStorage.ts";
import type { Map as LeafletMap } from "leaflet";
import { useRef } from "react";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import '../styles/MyMap.css';

interface IconDefaultPrototype {
    _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

const places = getTrips().map(({ lat, lng, title }) => ({ lat, lng, title }));

export default function MyMapPage() {
    const mapRef = useRef<LeafletMap | null>(null);

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