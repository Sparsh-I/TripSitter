import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import type L from "leaflet";

interface SearchResult {
    lng: number;
    lat: number;
    label: string;
    bounds: [[number, number], [number, number]] | null;
    raw: unknown;   // raw provider response, shape not used
}

interface GeoSearchShowLocationEvent {
    location: SearchResult;
    marker: L.Marker;
}

interface SearchFieldProps {
    onLocationSelect: (location: { lat: number; lng: number; label: string }) => void;
}

const SearchField = ({ onLocationSelect }: SearchFieldProps) => {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const searchControl = new (GeoSearchControl as any)({
            provider: provider,
            style: "bar",
            autoComplete: true,
            autoCompleteDelay: 250,
            showMarker: true,
            showPopup: false,
            marker: { draggable: false },
            maxMarkers: 1,
            retainZoomLevel: false,
            animateZoom: true,
        });

        map.addControl(searchControl);

        function handleShowLocation(e: GeoSearchShowLocationEvent) {
            onLocationSelect({
                lat: e.location.lat,
                lng: e.location.lng,
                label: e.location.label,
            });
        }

        map.on("geosearch/showlocation", handleShowLocation as unknown as L.LeafletEventHandlerFn);

        return () => {
            map.removeControl(searchControl);
            map.off("geosearch/showlocation", handleShowLocation as unknown as L.LeafletEventHandlerFn);
        };
    }, [map, onLocationSelect]);

    return null;
};

export default SearchField;