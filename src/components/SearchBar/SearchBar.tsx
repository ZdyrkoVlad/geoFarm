import {useState, useEffect} from 'react';
import Icon from '../Icon/Icon';
import {type MapState, useMapStore} from '../../stores/MapStore';

export default function SearchBar() {
    const globalQuery = useMapStore((state: MapState) => state.searchQuery);
    const setSearchQuery = useMapStore((state: MapState) => state.setSearchQuery);
    
    const [localQuery, setLocalQuery] = useState(globalQuery);
    const [focused, setFocused] = useState(false);

    // standart debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(localQuery);
        }, 200);

        return () => clearTimeout(handler);
    }, [localQuery, setSearchQuery]);

    return (
        <div
            className="absolute top-3 left-3 z-10 flex flex-row items-center
                 bg-farm-surface rounded-lg
                 border border-farm-border
                 w-72"
        >

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center
                    ${focused ? 'w-0 opacity-0 ml-0' : 'w-6 opacity-100 ml-2'}`}
            >
                <Icon name="search" size={16}/>
            </div>


            <input
                id="map-search-input"
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Пошук:назва,опис"
                className="flex-1 bg-transparent border-none outline-none
                   text-lg text-farm-text placeholder-farm-text-muted
                   py-2 px-2"
            />
        </div>
    );
}
