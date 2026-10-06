import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type MapState, useMapStore } from '../../stores/MapStore';
import { useThemeStore } from '../../stores/themeStore';

import { fieldsRender } from "./FieldsRender.ts";
import { pointRender } from "./PointRender.tsx";
import type { FarmFeature, FieldFeature } from "../../dtos/FarmFeature.ts";

import '../../Leaflet_DumbMGRS/L.DumbMGRS.scss';
import { generateGZDGrids, generate100kGrids, generate1000meterGrids } from '../../Leaflet_DumbMGRS/L.DumbMGRS.js';


import ActivityPopup from '../ActivityPopup/ActivityPopup.tsx';
import PoiDetailsPopup from '../PoiPopup/PoiDetailsPopup.tsx';
import { createPortal } from 'react-dom';
import { InterestPointTranslation } from '../../dtos/InterestType.ts';
import type { PointFeature } from '../../dtos/FarmFeature.ts';
import { isFeatureVisible } from '../../utils/filterUtils';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

const UKRAINE_CENTER: L.LatLngExpression = [48.3794, 31.1656];
const UKRAINE_ZOOM = 6;

type ActivePopup = {
    type: 'field' | 'point';
    latlng: L.LatLng;
    feature: FarmFeature;
} | null;

export default function MainMap() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    const fieldsLayerRef = useRef<L.GeoJSON | null>(null);
    const pointLayerRef = useRef<L.GeoJSON | null>(null);

    const popupContainerRef = useRef<HTMLDivElement>(document.createElement('div'));
    const popupInstanceRef = useRef<L.Popup | null>(null);
    const initialBoundsSetRef = useRef(false);

    const [mapReady, setMapReady] = useState(false);
    const [activePopup, setActivePopup] = useState<ActivePopup>(null);

    const activeItems = useMapStore((s) => s.activeItems);

    const selectField = useMapStore((s) => s.selectField);
    const selectedField = useMapStore((s: MapState): FieldFeature | null => s.selectedField);
    const searchQuery = useMapStore((s) => s.searchQuery);
    const selectedInterestType = useMapStore((s) => s.selectedInterestType);

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

        // MGRS Grids
        generateGZDGrids.addTo(map);
        generate100kGrids.addTo(map);
        generate1000meterGrids.addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

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
        if (pointLayerRef.current) {
            pointLayerRef.current.remove();
            pointLayerRef.current = null;
        }

        if (!activeItems.length) return;

        // render fields
        const geoJsonLayer = fieldsRender(map, activeItems, (feature: FarmFeature, latlng: L.LatLng) => {
            selectField(feature as FieldFeature);
            setActivePopup({ type: 'field', feature, latlng });
        });

        const pLayer = pointRender(map, activeItems, (feature: FarmFeature, latlng: L.LatLng) => {
            setActivePopup({ type: 'point', feature, latlng });
        });

        fieldsLayerRef.current = geoJsonLayer;
        pointLayerRef.current = pLayer;

        // position to target area only on initial load
        if (!initialBoundsSetRef.current) {
            const bounds = geoJsonLayer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
                initialBoundsSetRef.current = true;
            }
        }

        return () => {
            geoJsonLayer.remove();
            fieldsLayerRef.current = null;
            if (pointLayerRef.current) {
                pointLayerRef.current.remove();
                pointLayerRef.current = null;
            }
        };
    }, [activeItems, mapReady]); // Removed searchQuery from here

    // Другий useEffect тільки для пошуку, щоб не перестворювати шари
    useEffect(() => {
        if (!pointLayerRef.current) return;

        pointLayerRef.current.eachLayer((layer: L.Layer) => {
            const feature = (layer as L.Layer & { feature?: FarmFeature }).feature;
            if (!feature) return;

            const isMatch = isFeatureVisible(feature, searchQuery, selectedInterestType);


            const markerLayer = layer as unknown as L.Marker;
            if (markerLayer.getElement) {
                const icon = markerLayer.getElement() as HTMLElement;
                if (icon) {
                    icon.style.display = isMatch ? '' : 'none';
                }
            }

            // Також ховаємо тінь, якщо вона є
            const shadow = (layer as L.Layer & { _shadow?: HTMLElement })._shadow;
            if (shadow) {
                shadow.style.display = isMatch ? '' : 'none';
            }
        });
    }, [searchQuery, selectedInterestType, activeItems, mapReady]);

    // Третій useEffect для підсвічування виділеного поля
    const theme = useThemeStore((s) => s.theme);

    useEffect(() => {
        if (!fieldsLayerRef.current) return;

        const geoJsonLayer = fieldsLayerRef.current;
        const selectedId = selectedField?.properties.id;

        const highlightStyle = theme === 'dark'
            ? {
                color: '#2a2b26',      // --farm-accent (dark theme)
                weight: 4,
                fillColor: '#697565',  // light beige fill
                fillOpacity: 0.4,
            }
            : {
                color: '#8EACCD',      // --farm-text (light theme)
                weight: 4,
                fillColor: '#D2E0FB',  // --farm-accent (light theme)
                fillOpacity: 0.6,
            };

        geoJsonLayer.eachLayer((_layer: L.Layer) => {
            const layer = _layer as L.Path;
            const feature = (layer as L.Path & { feature?: FarmFeature }).feature;
            if (!feature) return;

            if (selectedId && feature.properties.id === selectedId) {
                layer.setStyle(highlightStyle);

                if (layer.bringToFront) {
                    layer.bringToFront();
                }
            } else {
                geoJsonLayer.resetStyle(layer);
            }
        });
    }, [selectedField, activeItems, mapReady, theme]);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        if (!activePopup) {
            if (popupInstanceRef.current) {
                map.closePopup(popupInstanceRef.current);
                popupInstanceRef.current = null;
            }
            return;
        }

        if (!popupInstanceRef.current) {
            popupInstanceRef.current = L.popup({ minWidth: 220, className: 'custom-poi-popup' })
                .setContent(popupContainerRef.current);
        }

        popupInstanceRef.current.setLatLng(activePopup.latlng).openOn(map);

        const handlePopupClose = (e: L.PopupEvent) => {
            if (e.popup === popupInstanceRef.current) {
                setActivePopup(null);
            }
        };

        map.on('popupclose', handlePopupClose);
        return () => {
            map.off('popupclose', handlePopupClose);
        };
    }, [activePopup]);

    return (
        <div className="relative w-full h-full">
            <div
                ref={mapContainerRef}
                id="main-map"
                className="absolute inset-0 z-0"
            />
            {activePopup && createPortal(
                activePopup.type === 'field'
                    ? <ActivityPopup
                        lat={activePopup.latlng.lat}
                        lng={activePopup.latlng.lng}
                        onClose={() => setActivePopup(null)}
                    />
                    : <PoiDetailsPopup
                        name={activePopup.feature.properties.name}
                        type={InterestPointTranslation[(activePopup.feature as PointFeature).properties.type] || 'Невідомо'}
                        description={(activePopup.feature as PointFeature).properties.description}
                        dateStr={(activePopup.feature as PointFeature).properties.createDate ? new Date((activePopup.feature as PointFeature).properties.createDate).toLocaleDateString() : ''}
                        lat={activePopup.latlng.lat}
                        lng={activePopup.latlng.lng}
                        onDelete={() => {
                            useMapStore.getState().setPointToDelete(activePopup.feature as PointFeature);
                            setActivePopup(null);
                        }}
                    />,
                popupContainerRef.current
            )}
        </div>
    );
}
