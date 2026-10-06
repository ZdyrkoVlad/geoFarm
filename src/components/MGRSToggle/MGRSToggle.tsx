import Icon from '../Icon/Icon';
import { useMGRSStorage } from '../../hooks/useMGRSStorage';

export default function MGRSToggle() {
    const { isMGRSEnabled, toggleMGRS } = useMGRSStorage();

    return (
        <button
            type="button"
            onClick={toggleMGRS}
            className={`flex items-center justify-center w-9 h-9 rounded-lg
                     border transition-all duration-200 cursor-pointer
                     hover:scale-105 active:scale-95 shadow-sm backdrop-blur-sm
                     ${isMGRSEnabled 
                        ? 'bg-farm-accent border-farm-accent text-white' 
                        : 'bg-farm-accent-alt/60 hover:bg-farm-accent-alt border-farm-border/30 text-farm-text'}`}
            title="Перемикач MGRS сітки"
        >
            <Icon name="grid" size={18} />
        </button>
    );
}
