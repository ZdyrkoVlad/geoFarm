import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fieldsData } from '../../../mockData/fields';

// Fix for default marker icons in bundled environments
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: UKRAINE_CENTER,
      zoom: UKRAINE_ZOOM,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Resize observer to invalidate map size when container changes
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (fieldsLayerRef.current) {
      fieldsLayerRef.current.remove();
    }

    const geoJsonLayer = L.geoJSON(fieldsData as GeoJSON.FeatureCollection, {
      style: () => ({
        color: '#f59e0b',
        weight: 2,
        fillColor: '#fbbf24',
        fillOpacity: 0.3,
      }),
      onEachFeature: (_feature, layer) => {
        const props = _feature.properties as {
          name: string;
          crop: string;
          area: number;
        };

        layer.bindTooltip(
          `<div style="font-family: sans-serif; line-height: 1.5;">
            <strong>${props.name}</strong><br/>
            ${props.crop}<br/>
            ${props.area} га
          </div>`,
          { sticky: true, direction: 'top', opacity: 0.95 },
        );

        layer.on({
          mouseover: (e) => {
            const target = e.target as L.Path;
            target.setStyle({
              weight: 3,
              fillOpacity: 0.5,
            });
          },
          mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target as L.Layer);
          },
        });
      },
    }).addTo(map);

    fieldsLayerRef.current = geoJsonLayer;

    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, []);

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
