import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Minus, Plus } from 'lucide-react';

interface BottomBarProps {
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitToScreen: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ zoom, onZoomIn, onZoomOut, onFitToScreen }) => {
    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center space-x-4 z-20">
            <div className="flex items-center space-x-2">
                <button
                    onClick={onZoomOut}
                    className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium w-12 text-center select-none">
                    {Math.round(zoom * 100)}%
                </span>
                <button
                    onClick={onZoomIn}
                    className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-4 bg-gray-200" />

            <button
                onClick={onFitToScreen}
                className="flex items-center space-x-1.5 text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-md text-xs font-medium"
            >
                <Maximize className="w-3 h-3" />
                <span>Fit</span>
            </button>
        </div>
    );
};
