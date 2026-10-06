import {InterestType, InterestPointTranslation} from '../../dtos/InterestType';
import {useMapStore} from '../../stores/MapStore';
import type { PointFeature } from '../../dtos/FarmFeature';
import * as mgrs from 'mgrs';
import { formatMGRS } from '../../utils/formatMGRS';

interface ActivityPopupProps {
    lat: number;
    lng: number;
    onClose: () => void;
}

export default function ActivityPopup({ lat, lng, onClose }: ActivityPopupProps) {
    const addActiveItems = useMapStore((s) => s.addActiveItems);

    const handleSubmit = (formData: FormData) => {
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const type = formData.get('type') as InterestType;

        if (!name.trim()) return;

        const newPoint: PointFeature = {
            type: 'Feature',
            properties: {
                id: crypto.randomUUID(),
                name: name.trim(),
                type: type,
                description: description.trim(),
                createDate: new Date()
            },
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            }
        };

        addActiveItems([newPoint]);
        onClose();
    };

    return (
        <form action={handleSubmit} className="p-1 min-w-[240px] font-sans text-farm-text">
            <h3 className="text-base font-semibold mb-1 text-farm-accent">Нова точка</h3>
            
            <div className="flex flex-col gap-0.5 mb-3">
                <div className="text-[12px] text-base font-mono tracking-tight flex gap-3">
                    <span>Lat: {lat.toFixed(5)}</span>
                    <span>Lng: {lng.toFixed(5)}</span>
                </div>
                <div className="text-[12px] text-base font-mono tracking-tight flex gap-3">
                    <span>MGRS: {formatMGRS(mgrs.forward([lng, lat], 5))}</span>
                </div>
            </div>
            
            <label className="flex flex-col gap-1 mb-2 text-xs font-medium text-farm-text-muted">
                Назва
                <input
                    name="name"
                    required
                    autoFocus
                    placeholder="Введіть назву..."
                    className="bg-farm-bg border border-farm-border rounded text-sm text-farm-text placeholder-farm-text-muted outline-none px-2 py-1.5 focus:border-farm-accent"
                />
            </label>

            <label className="flex flex-col gap-1 mb-2 text-xs font-medium text-farm-text-muted">
                Тип
                <select name="type" className="bg-farm-bg border border-farm-border rounded text-sm text-farm-text outline-none px-2 py-1.5 focus:border-farm-accent cursor-pointer">
                    {Object.values(InterestType).map(t => (
                        <option key={t} value={t}>{InterestPointTranslation[t]}</option>
                    ))}
                </select>
            </label>

            <label className="flex flex-col gap-1 mb-4 text-xs font-medium text-farm-text-muted">
                Опис
                <textarea
                    name="description"
                    placeholder="Додаткові нотатки..."
                    rows={2}
                    className="bg-farm-bg border border-farm-border rounded text-sm text-farm-text placeholder-farm-text-muted outline-none px-2 py-1.5 resize-y focus:border-farm-accent"
                />
            </label>

            <div className="flex justify-end gap-2 mt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 rounded text-sm font-medium hover:bg-farm-surface-alt transition-colors cursor-pointer"
                >
                    Скасувати
                </button>
                <button
                    type="submit"
                    className="px-3 py-1.5 rounded text-sm font-medium bg-farm-accent dark:text-farm-bg text-white hover:opacity-90 transition-opacity cursor-pointer"
                >
                    Зберегти
                </button>
            </div>
        </form>
    );
}

