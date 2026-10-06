import React from 'react';
import type { PointFeature } from '../../dtos/FarmFeature';

interface DeletePointConfirmProps {
    point: PointFeature;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeletePointConfirm: React.FC<DeletePointConfirmProps> = ({ point, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-farm-bg border border-farm-border rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
                <h3 className="text-lg font-bold text-farm-accent mb-2">Видалення точки</h3>
                <p className="text-farm-text mb-6">
                    Ви впевнені, що хочете видалити точку <strong>{point.properties.name}</strong>?
                </p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 rounded font-medium text-farm-text bg-farm-surface hover:bg-farm-surface-alt transition-colors cursor-pointer border border-farm-border"
                    >
                        Відміна
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 rounded font-medium text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer border-none shadow-sm"
                    >
                        Підтвердити
                    </button>
                </div>
            </div>
        </div>
    );
};
