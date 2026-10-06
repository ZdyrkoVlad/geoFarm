import * as mgrs from 'mgrs';
import { formatMGRS } from '../../utils/formatMGRS';

interface PoiDetailsPopupProps {
    name: string;
    type: string;
    description?: string;
    dateStr: string;
    lat: number;
    lng: number;
    onDelete: () => void;
}

export default function PoiDetailsPopup({ name, type, description, dateStr, lat, lng, onDelete }: PoiDetailsPopupProps) {
    return (
        <div className="font-sans p-1 text-farm-text flex flex-col min-w-[220px]">
            <h3 className="font-bold text-base text-farm-accent mb-1">{name}</h3>
            <div className="flex flex-col gap-0.5 mb-2">
                <div className="text-[12px] text-base font-mono tracking-tight flex gap-3">
                    <span>Lat: {lat.toFixed(5)}</span>
                    <span>Lng: {lng.toFixed(5)}</span>
                </div>
                <div className="text-[12px] text-base font-mono tracking-tight flex gap-3">
                    <span>MGRS: {formatMGRS(mgrs.forward([lng, lat], 4))}</span>
                </div>
            </div>
            <div className="text-sm text-base mb-2">Тип: {type}</div>
            <div className="text-sm mb-2">{description || 'Немає опису'}</div>
            <div className="text-xs text-farm-text-muted mt-2 mb-3">{dateStr}</div>
            <button 
                onClick={onDelete}
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium cursor-pointer border border-red-200 py-1.5 px-3 transition-colors"
            >
                Видалити точку
            </button>
        </div>
    );
}
