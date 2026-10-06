import { useThemeStore } from '../../stores/themeStore';
import Icon from '../Icon/Icon';

export default function ThemeToggle() {
    const theme = useThemeStore((s) => s.theme);
    const toggle = useThemeStore((s) => s.toggle);

    return (
        <button
            type="button"
            onClick={toggle}
            className="flex items-center justify-center w-9 h-9 rounded-lg
                     bg-farm-accent-alt/60 hover:bg-farm-accent-alt
                     border border-farm-border/30
                     text-farm-text
                     transition-all duration-200 cursor-pointer
                     hover:scale-105 active:scale-95 shadow-sm backdrop-blur-sm"
        >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
        </button>
    );
}
