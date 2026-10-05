import { InterestType, InterestTypesIcons } from '../../dtos/InterestType';
import Icon from '../Icon/Icon';

const activities = Object.values(InterestType);

export default function ActivityPanel() {
    return (
        <div
            className="absolute top-3 right-3 z-10 flex flex-col gap-2
                 bg-farm-surface rounded-lg
                 border border-farm-border
                 p-2"
        >
            {activities.map((type) => (
                <button
                    key={type}
                    type="button"
                    className={`flex items-center justify-center w-9 h-9 rounded-md
                        text-farm-text transition-all duration-200 cursor-pointer
                        hover:scale-105 active:scale-95`}
                >
                    <Icon name={InterestTypesIcons[type]} size={20} />
                </button>
            ))}
        </div>
    );
}
