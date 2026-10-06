import { useState, useMemo } from 'react';
import { useMapStore } from '../../stores/MapStore';
import type { PointFeature } from '../../dtos/FarmFeature';
import { InterestPointTranslation, InterestType, InterestTypesIcons } from '../../dtos/InterestType';
import Icon from '../Icon/Icon';
import { isFeatureVisible } from '../../utils/filterUtils';
import * as mgrs from 'mgrs';

export default function PointsList() {
    const activeItems = useMapStore((s) => s.activeItems);
    const searchQuery = useMapStore((s) => s.searchQuery);
    const selectedInterestType = useMapStore((s) => s.selectedInterestType);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    
    const points = useMemo(() => {
        return activeItems
            .filter((item): item is PointFeature => 
                item.geometry.type === 'Point' && 
                isFeatureVisible(item, searchQuery, selectedInterestType)
            )
            .sort((a, b) => {
                const dateA = a.properties.createDate ? new Date(a.properties.createDate).getTime() : 0;
                const dateB = b.properties.createDate ? new Date(b.properties.createDate).getTime() : 0;
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });
    }, [activeItems, searchQuery, selectedInterestType, sortOrder]);

    if (points.length === 0) return null;

    return (
        <div className="bg-farm-surface rounded-lg border border-farm-border w-72 shadow-lg flex flex-col min-h-0 shrink">
            <div className="p-3 border-b border-farm-border shrink-0 flex items-center justify-between">
                <h3 className="text-farm-text text-base font-semibold">
                    Активні точки ({points.length})
                </h3>
                <button
                    onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="p-1 rounded hover:bg-farm-surface-alt transition-colors cursor-pointer text-farm-text"
                    title={sortOrder === 'desc' ? 'Спочатку новіші' : 'Спочатку старіші'}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                         className={`transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}>
                        <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                </button>
            </div>
            
            <div className="overflow-y-auto p-2 flex flex-col gap-2 min-h-0">
                {points.map(point => {
                    const type = point.properties.type as InterestType;
                    const date = point.properties.createDate ? new Date(point.properties.createDate).toLocaleDateString() : '';
                    const [lng, lat] = point.geometry.coordinates;
                    
                    return (
                        <div key={point.properties.id} className="bg-farm-bg border border-farm-border rounded p-2 flex flex-col gap-1 shrink-0 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Icon name={InterestTypesIcons[type]} size={16} />
                                <span className="text-farm-text font-medium text-sm truncate">{point.properties.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-farm-text-muted mt-1">
                                <span>{InterestPointTranslation[type]}</span>
                                <span>{date}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 mt-0.5">
                                <div className="text-[10px] text-farm-text-muted/70 font-mono tracking-tight flex gap-3">
                                    <span>Lat: {lat.toFixed(5)}</span>
                                    <span>Lng: {lng.toFixed(5)}</span>
                                </div>
                                <div className="text-[10px] text-farm-text-muted/70 font-mono tracking-tight">
                                    MGRS: {mgrs.forward([lng, lat], 5)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
