import NavBar from '../components/global/NavBar.tsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {getTrips} from "../utils/TripStorage.ts";
import type { Map as LeafletMap } from "leaflet";
import {useRef} from "react";

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
                style={{ display: 'inline-flex', height: '750px' , width: '1020px' }}
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