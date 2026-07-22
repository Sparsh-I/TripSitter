import NavBar from '../components/global/NavBar.tsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const places = [
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
]

export default function MyMapPage() {
    return (
        <div>
            <NavBar/>
            <MapContainer center={[20, 0] as [number, number]} zoom={2} style={{ height: '400px' , width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <>
                    {places.map((place) => (
                        <Marker key={place.name} position={[place.lat, place.lng]}>
                            <Popup>{place.name}</Popup>
                        </Marker>
                    ))}
                </>
            </MapContainer>
        </div>
    );
}