import {InterestPointTranslation, InterestType, InterestTypesIcons} from '../../dtos/InterestType';
import {useMapStore} from '../../stores/MapStore';
import Icon from '../Icon/Icon';

const activities = Object.values(InterestType);

export default function ActivityPanel() {
    const selectedInterestType = useMapStore((s) => s.selectedInterestType);
    const toggleSelectedInterestType = useMapStore((s) => s.toggleSelectedInterestType);

    return (
        <div
            className="absolute top-14 right-3 z-10 flex flex-col gap-2
                 bg-farm-surface rounded-lg
                 w-fit
                 border border-farm-border
                 p-2"
        >
            <h3 className="text-farm-text text-base font-semibold mb-2">
               Легенда/активація фільтрів
            </h3>
            {activities.map((type) => {
                const selected = selectedInterestType === type;

                return (
                    <button
                        key={type}
                        type="button"
                        aria-pressed={selected}
                        aria-label={type}
                        onClick={() => toggleSelectedInterestType(type)}
                        className={`flex items-center justify-center w-fit h-9 rounded-md flex-row justify-between
                            text-farm-text transition-all duration-200 cursor-pointer gap-3 px-3
                            hover:scale-105 active:scale-95
                            ${selected ? 'bg-farm-accent dark:text-farm-bg text-white shadow-sm' : 'hover:bg-farm-surface-alt'}
                            `}
                    >
                        <Icon name={InterestTypesIcons[type]} size={20}/>

                        <div>{InterestPointTranslation[type]}</div>
                    </button>
                );
            })}
        </div>
    );
}
