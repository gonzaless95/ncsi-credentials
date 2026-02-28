import React from 'react';
import { fabric } from 'fabric';
import { Layers, Eye, EyeOff, Lock, Unlock, GripVertical } from 'lucide-react';

interface LayersPanelProps {
    isOpen: boolean;
    canvas: fabric.Canvas | null;
    onClose: () => void;
    onSelect: (object: fabric.Object) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({ isOpen, canvas, onClose, onSelect }) => {
    const [objects, setObjects] = React.useState<fabric.Object[]>([]);
    const [refreshKey, setRefreshKey] = React.useState(0);

    React.useEffect(() => {
        if (!canvas) return;

        const updateLayers = () => {
            setObjects([...canvas.getObjects().reverse()]);
        };

        canvas.on('object:added', updateLayers);
        canvas.on('object:removed', updateLayers);
        canvas.on('object:modified', updateLayers);

        updateLayers();

        return () => {
            canvas.off('object:added', updateLayers);
            canvas.off('object:removed', updateLayers);
            canvas.off('object:modified', updateLayers);
        };
    }, [canvas, refreshKey]);

    if (!isOpen) return null;

    const getObjectLabel = (obj: fabric.Object) => {
        if (obj.type === 'i-text' || obj.type === 'text') {
            return (obj as fabric.IText).text?.substring(0, 20) || 'Text Layer';
        }
        if (obj.type === 'image') return 'Image Layer';
        if (obj.type === 'rect') return 'Rectangle';
        if (obj.type === 'circle') return 'Circle';
        return 'Layer';
    };

    const toggleVisibility = (e: React.MouseEvent, obj: fabric.Object) => {
        e.stopPropagation();
        obj.visible = !obj.visible;
        canvas?.requestRenderAll();
        setRefreshKey(prev => prev + 1);
    };

    const toggleLock = (e: React.MouseEvent, obj: fabric.Object) => {
        e.stopPropagation();
        obj.lockMovementX = !obj.lockMovementX;
        obj.lockMovementY = !obj.lockMovementY;
        obj.selectable = !obj.selectable;
        canvas?.discardActiveObject();
        canvas?.requestRenderAll();
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="fixed right-20 top-20 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-30 flex flex-col max-h-[calc(100vh-200px)]">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-gray-900">Layers</span>
                </div>
                <span className="text-xs text-gray-400">{objects.length} items</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {objects.map((obj, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(obj)}
                        className="group flex items-center p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer transition-all active:scale-95"
                    >
                        <GripVertical className="w-4 h-4 text-gray-300 mr-2 opacity-0 group-hover:opacity-100 cursor-grab" />
                        <span className="flex-1 text-xs font-medium text-gray-700 truncate">
                            {getObjectLabel(obj)}
                        </span>

                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => toggleLock(e, obj)}
                                className="p-1 hover:bg-gray-200 rounded text-gray-500"
                            >
                                {obj.lockMovementX ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            </button>
                            <button
                                onClick={(e) => toggleVisibility(e, obj)}
                                className="p-1 hover:bg-gray-200 rounded text-gray-500"
                            >
                                {obj.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                        </div>
                    </div>
                ))}

                {objects.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-xs">
                        No layers yet
                    </div>
                )}
            </div>
        </div>
    );
};
