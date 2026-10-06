import {InterestType} from "./InterestType.ts";

export interface PointOfInterest {
    name: string;
    interestType: InterestType;
    createData: Date;
    updateData: Date;
    deleteFlag: boolean;
    description: string;
    icon: string;
    lat: number;
    lng: number;
}
