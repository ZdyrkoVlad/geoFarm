import type { Feature, Polygon, Point, FeatureCollection } from 'geojson';
import type { FieldProperties } from "./FarmField.ts";
import type { InterestType } from "./InterestType.ts";

/** A single GeoJSON Feature representing a farm field. */
export type FieldFeature = Feature<Polygon, FieldProperties>;

export interface PointProperties {
    id: string;
    name: string;
    type: InterestType;
    description: string;
    createDate: Date;
}

/** A single GeoJSON Feature representing a point of interest. */
export type PointFeature = Feature<Point, PointProperties>;

export type FarmFeature = FieldFeature | PointFeature;

export interface FarmFeatureCollection extends FeatureCollection {
    type: 'FeatureCollection';
    features: FarmFeature[];
}
