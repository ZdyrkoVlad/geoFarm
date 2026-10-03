/** Properties attached to each farm-field polygon. */
export interface FieldProperties {
  id: string;
  name: string;
  area: number;
  crop: string;
}

/** A single GeoJSON Feature representing a farm field. */
export interface FieldFeature {
  type: 'Feature';
  properties: FieldProperties;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

/** A GeoJSON FeatureCollection of farm fields. */
export interface FieldsCollection {
  type: 'FeatureCollection';
  features: FieldFeature[];
}
