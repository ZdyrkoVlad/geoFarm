import type {FieldsCollection} from "../../dtos/FarmField.ts";
import L from 'leaflet';

export function fieldsRender(map: L.Map, fields: FieldsCollection): L.GeoJSON {
    const geoJsonLayer = L.geoJSON(fields, {
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

    return geoJsonLayer;
}
