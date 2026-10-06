import type { FarmFeature } from '../dtos/FarmFeature';
import type { InterestType } from '../dtos/InterestType';

export function isFeatureVisible(
    feature: FarmFeature, 
    query: string, 
    selectedType: InterestType | null
): boolean {
    const props = feature.properties;
    const lowerQ = query.toLowerCase().trim();
    
    const matchName = props.name.toLowerCase().includes(lowerQ);
    const matchDesc = 'description' in props && props.description.toLowerCase().includes(lowerQ);
    const isTextMatch = !lowerQ || matchName || matchDesc;
    
    const isTypeMatch = !selectedType || ('type' in props && props.type === selectedType);
    
    return isTextMatch && isTypeMatch;
}
