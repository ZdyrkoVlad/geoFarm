import {create} from 'zustand';
import type {FarmFeature, PointFeature, FieldFeature} from "../dtos/FarmFeature.ts";
import type {InterestType} from "../dtos/InterestType.ts";

export interface MapState {
    activeItems: FarmFeature[];
    pointToDelete: PointFeature | null;
    selectedField: FieldFeature | null;
    searchQuery: string;
    selectedInterestType: InterestType | null;

    addActiveItems: (newItems: FarmFeature[]) => void;
    removeActiveItems: (ids: string[]) => void;
    setPointToDelete: (point: PointFeature | null) => void;
    selectField: (field: FieldFeature | null) => void;
    setSearchQuery: (query: string) => void;
    toggleSelectedInterestType: (type: InterestType) => void;
}

export const useMapStore = create<MapState>((set) => ({
    activeItems: [],
    pointToDelete: null,
    selectedField: null,
    searchQuery: '',
    selectedInterestType: null,

    setPointToDelete: (point) => set({ pointToDelete: point }),
    selectField: (field) => set({ selectedField: field }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    toggleSelectedInterestType: (type) => set((s) => ({ selectedInterestType: s.selectedInterestType === type ? null : type })),

    addActiveItems: (newItems) =>
        set((s) => {
            const existingIds = new Set(s.activeItems.map((i) => i.properties.id));
            const unique = newItems.filter((i) => !existingIds.has(i.properties.id));
            return unique.length ? { activeItems: [...s.activeItems, ...unique] } : s;
        }),

    removeActiveItems: (ids) =>
        set((s) => {
            const toRemove = new Set(ids);
            return {
                activeItems: s.activeItems.filter((i) => !toRemove.has(i.properties.id)),
            };
        }),
}));
