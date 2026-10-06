import type {FarmFeature} from "../../dtos/FarmFeature.ts";

import L from 'leaflet';
import * as mgrs from 'mgrs';
import { formatMGRS } from '../../utils/formatMGRS';

export function fieldsRender(map: L.Map, fields: FarmFeature[],
                             onFieldClick?: (feature: FarmFeature, latlng: L.LatLng) => void): L.GeoJSON {
    const geoJsonLayer = L.geoJSON(fields as unknown as GeoJSON.Feature[], {
        filter: (feature: GeoJSON.Feature) => {
            return feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon';
        },
        style: () => ({
            color: '#f59e0b',
            weight: 2,
            fillColor: '#fbbf24',
            fillOpacity: 0.3,
        }),
        onEachFeature: (_feature: GeoJSON.Feature, layer: L.Layer) => {
            const props = _feature.properties as {
                name: string;
                crop: string;
                area: number;
            };

            const getTooltipHtml = (lat?: string, lng?: string) => {
                let coordHtml = '';
                if (lat && lng) {
                    const mgrsStr = formatMGRS(mgrs.forward([parseFloat(lng), parseFloat(lat)], 5));
                    coordHtml = `<br/><div style="font-family: monospace; font-size: 10px; margin-top: 4px; opacity: 0.8; display: flex; flex-direction: column; gap: 2px;">
                        <div style="display: flex; gap: 8px;"><span>Lat: ${lat}</span><span>Lng: ${lng}</span></div>
                        <div>MGRS: ${mgrsStr}</div>
                    </div>`;
                }
                
                return `
                <div style="font-family: sans-serif; line-height: 1.5; min-width: 140px;">
                    <strong>${props.name}</strong><br/>
                    ${props.crop}<br/>
                    ${props.area} га
                    ${coordHtml}
                </div>
                `;
            };

            layer.bindTooltip(getTooltipHtml(), {sticky: true, direction: 'top', opacity: 0.95});

            layer.on({
                mousemove: (e: L.LeafletEvent) => {
                    const mouseEvent = e as L.LeafletMouseEvent;
                    if (mouseEvent.latlng) {
                        const tooltip = layer.getTooltip();
                        if (tooltip) {
                            tooltip.setContent(
                                getTooltipHtml(
                                    mouseEvent.latlng.lat.toFixed(5),
                                    mouseEvent.latlng.lng.toFixed(5)
                                )
                            );
                        }
                    }
                },
                click: (e: L.LeafletEvent) => {
                    const mouseEvent = e as L.LeafletMouseEvent;
                    if (!mouseEvent.latlng) return;

                    if (onFieldClick) {
                        onFieldClick(_feature as FarmFeature, mouseEvent.latlng);
                    }
                },
            });
        },
    }).addTo(map);

    return geoJsonLayer;
}
