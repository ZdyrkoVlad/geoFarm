import { useMapStore } from '../../stores/MapStore';
import type { FieldFeature } from '../../dtos/FarmFeature';

export default function InfoCard() {
    const selectedField = useMapStore((state) => state.selectedField);

    if (!selectedField) return null;

    return (
        <div
            className="bg-farm-surface rounded-lg
                 border border-farm-border
                 w-72 p-3 shadow-lg shrink-0"
        >
            <h3 className="text-farm-text text-base font-semibold mb-2">
                {selectedField.properties.name}
            </h3>

            <div className="flex flex-col gap-1 text-sm text-farm-text-muted">
                {(
                    <>
                        <div className="flex justify-between">
                            <span>Культура</span>
                            <span className="text-farm-text">{(selectedField as FieldFeature).properties.crop}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Площа</span>
                            <span className="text-farm-text">{(selectedField as FieldFeature).properties.area} га</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
