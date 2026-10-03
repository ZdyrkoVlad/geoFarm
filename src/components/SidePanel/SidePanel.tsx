import { useState } from 'react';
import { useThemeStore } from '../../stores/themeStore';
import Icon from '../Icon/Icon';

export default function SidePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggle } = useThemeStore();

  return (
    <aside
      className={`
        shrink-0 bg-farm-surface border-farm-border/40 transition-all duration-300 ease-in-out
        flex flex-col z-20 overflow-clip border-r
        ${isOpen ? 'w-72' : 'w-12'}
      `}
    >
      <div
        className={`flex items-center shrink-0 h-12 ${isOpen ? 'px-2 justify-end' : ''}`}
        style={!isOpen ? { justifyContent: 'center' } : undefined}
      >
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? 'Close side-panel' : 'Open side-panel'}
          className="flex items-center justify-center w-8 h-8 rounded-md
                     hover:bg-farm-accent-alt/60 text-farm-text
                     transition-all duration-200 cursor-pointer
                     hover:scale-105 active:scale-95"
        >
          <Icon
            name="menu"
            size={20}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          />
        </button>
      </div>

      {/* ── Panel content (visible only when open) ──── */}
      <div
        className={`
          flex-1 flex flex-col overflow-y-auto px-3 pb-3 gap-3 transition-opacity duration-200
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <p className="text-sm text-farm-text-muted">
          hello from side-panel
        </p>

        <div className="flex-1" />

        <div className="flex flex-row justify-center items-center gap-2 mb-2">
          <h4>GeoFarm</h4>
          <button
            type="button"
            onClick={toggle}
            className="flex items-center justify-center w-9 h-9 rounded-lg
                     bg-farm-accent-alt/60 hover:bg-farm-accent-alt
                     border border-farm-border/30
                     text-farm-text
                     transition-all duration-200 cursor-pointer
                     hover:scale-105 active:scale-95"
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
