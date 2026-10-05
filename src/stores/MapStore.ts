import {create} from 'zustand';
import type {FieldFeature} from '../dtos/FarmField';

interface MapState {
    items: FieldFeature[];

    activeItems: FieldFeature[];



    addItems: (newItems: FieldFeature[]) => void;

    removeItems: (ids: string[]) => void;


    addActiveItems: (newItems: FieldFeature[]) => void;

    removeActiveItems: (ids: string[]) => void;
}

export const useMapStore = create<MapState>((set) => ({
    items: [],
    activeItems: [],

    addItems: (newItems) =>
        set((s) => {
            const existingIds = new Set(s.items.map((i) => i.properties.id));
            const unique = newItems.filter((i) => !existingIds.has(i.properties.id));
            return unique.length ? {items: [...s.items, ...unique]} : s;
        }),

    removeItems: (ids) =>
        set((s) => {
            const toRemove = new Set(ids);
            return {
                items: s.items.filter((i) => !toRemove.has(i.properties.id)),
                activeItems: s.activeItems.filter((i) => !toRemove.has(i.properties.id)),
            };
        }),

    addActiveItems: (newItems) =>
        set((s) => {
            const existingIds = new Set(s.activeItems.map((i) => i.properties.id));
            const unique = newItems.filter((i) => !existingIds.has(i.properties.id));
            return unique.length ? {activeItems: [...s.activeItems, ...unique]} : s;
        }),

    removeActiveItems: (ids) =>
        set((s) => {
            const toRemove = new Set(ids);
            return {
                activeItems: s.activeItems.filter((i) => !toRemove.has(i.properties.id)),
            };
        }),
}));
