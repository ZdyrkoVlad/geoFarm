import L from 'leaflet';
import {Icon as ExtraMarkerIcon, PinTeardropBorder} from 'leaflet-extra-markers';
import type {FarmFeature, PointFeature} from "../../dtos/FarmFeature.ts";
import {InterestType, InterestTypesIcons} from "../../dtos/InterestType.ts";

export function pointRender(
    map: L.Map,
    points: FarmFeature[],
    onPointClick?: (feature: FarmFeature, latlng: L.LatLng) => void
): L.GeoJSON {
    const geoJsonLayer = L.geoJSON(points as unknown as GeoJSON.Feature[], {
        filter: (feature: GeoJSON.Feature) => {
            return feature.geometry.type === 'Point';
        },


        pointToLayer: (feature: GeoJSON.Feature, latlng: L.LatLng) => {
            const props = feature.properties as PointFeature['properties'];

            const iconName = props.type ? InterestTypesIcons[props.type as InterestType] : InterestTypesIcons.Other;

            const customIcon = new ExtraMarkerIcon({
                color: 'var(--farm-accent)',
                svg: PinTeardropBorder,
                contentHtml: `<div style="width: 18px; height: 18px; background-color: var(--farm-bg); mask-image: url('/icons/${iconName}.svg'); mask-size: contain; mask-repeat: no-repeat; mask-position: center; -webkit-mask-image: url('/icons/${iconName}.svg'); -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; margin-top: 5px; display: inline-block;"></div>`,
                scale: 1.2
            });

            return L.marker(latlng, {icon: customIcon});
        },

        onEachFeature: (feature: GeoJSON.Feature, layer: L.Layer) => {
            const props = feature.properties as PointFeature['properties'];

            layer.bindTooltip(
                `<div class="font-sans">
                    <strong>${props.name}</strong>
                </div>`,
                {direction: 'top', sticky: true, opacity: 0.9}
            );

            layer.on('click', (e: L.LeafletEvent) => {
                if (onPointClick) {
                    const mouseEvent = e as L.LeafletMouseEvent;
                    if (mouseEvent.latlng) {
                        onPointClick(feature as FarmFeature, mouseEvent.latlng);
                    }
                }
            });
        }
    }).addTo(map);

    return geoJsonLayer;
}
