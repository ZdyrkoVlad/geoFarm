import * as L from 'leaflet';
// connection to DumbMGRS lib
export const generateGZDGrids: L.LayerGroup & { addTo: (map: L.Map) => void, remove: () => void };
export const generate100kGrids: L.LayerGroup & { addTo: (map: L.Map) => void, remove: () => void };
export const generate1000meterGrids: L.LayerGroup & { addTo: (map: L.Map) => void, remove: () => void };
export function LLtoUTM(lat: number, lon: number): any;
export function UTMtoMGRS(zone: number, band: string, easting: number, northing: number): string;

