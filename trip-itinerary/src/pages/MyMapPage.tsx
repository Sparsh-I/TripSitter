import NavBar from '../components/global/NavBar.tsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {getTrips} from "../utils/TripStorage.ts";

const places = getTrips().map(({ lat, lng, title }) => ({ lat, lng, title }));

export default function MyMapPage() {
    return (
        <div>
            <NavBar/>
            <MapContainer center={[20, 0] as [number, number]} zoom={2} style={{ height: '400px' , width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <>
                    {places.map((place) => (
                        <Marker key={place.title} position={[place.lat, place.lng]}>
                            <Popup>{place.title}</Popup>
                        </Marker>
                    ))}
                </>
            </MapContainer>
        </div>
    );
}