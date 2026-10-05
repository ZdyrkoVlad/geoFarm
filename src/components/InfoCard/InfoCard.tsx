import type {FieldProperties} from '../../dtos/FarmField';

interface InfoCardProps {
    field?: FieldProperties | null;
}

export default function InfoCard({field}: InfoCardProps) {
    if (!field) return null;

    return (
        <div
            className="absolute top-16 left-3 z-10
                 bg-farm-surface rounded-lg
                 border border-farm-border
                 w-72 p-3"
        >
            <h3 className="text-farm-text text-base font-semibold mb-2">
                {field.name}
            </h3>

            <div className="flex flex-col gap-1 text-sm text-farm-text-muted">
                <div className="flex justify-between">
                    <span>Культура</span>
                    <span className="text-farm-text">{field.crop}</span>
                </div>
                <div className="flex justify-between">
                    <span>Площа</span>
                    <span className="text-farm-text">{field.area} га</span>
                </div>

                <div className="flex-col ">
                    <div>Опис</div>
                    <div className="text-farm-text">qui dolorem ipsum, quia dolor sit amet consectetur adipisci velit,
                        sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat
                        voluptatem
                    </div>
                </div>

                <div>

                </div><span>11.01.2026</span>
            </div>
        </div>
    );
}
