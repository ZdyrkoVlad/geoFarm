import {useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useMapStore} from '../../stores/MapStore';


// Fix for default marker icons in bundled environments
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {fieldsRender} from "./FiledRender.ts";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


const UKRAINE_CENTER: L.LatLngExpression = [48.3794, 31.1656];
const UKRAINE_ZOOM = 6;


export default function MainMap() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const fieldsLayerRef = useRef<L.GeoJSON | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const activeItems = useMapStore((s) => s.activeItems);

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: UKRAINE_CENTER,
            zoom: UKRAINE_ZOOM,
            preferCanvas: true,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        L.control.zoom({position: 'bottomright'}).addTo(map);

        mapInstanceRef.current = map;
        setMapReady(true);


        return () => {
            map.remove();
            mapInstanceRef.current = null;
            setMapReady(false);
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!mapReady || !map) return;

        if (fieldsLayerRef.current) {
            fieldsLayerRef.current.remove();
            fieldsLayerRef.current = null;
        }

        if (!activeItems.length) return;

        // render fields
        const geoJsonLayer = fieldsRender(map, {
            type: 'FeatureCollection',
            features: activeItems,
        });



        fieldsLayerRef.current = geoJsonLayer;

        // position to target area
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds, {padding: [50, 50], maxZoom: 14});
        }

        return () => {
            geoJsonLayer.remove();
            fieldsLayerRef.current = null;
        };

    }, [activeItems, mapReady]);

    return (
        <div className="relative w-full h-full">
            <div
                ref={mapContainerRef}
                id="main-map"
                className="absolute inset-0 z-0"
            />
        </div>
    );
}
