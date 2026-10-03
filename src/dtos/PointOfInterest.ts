import {InterestType} from "./InterestType.ts";

export interface PointOfInterest {
    interestType: InterestType,
    createData: Date,
    updateData: Date,
    deleteFlag: boolean,
    description: string,
    icon: string,
}
