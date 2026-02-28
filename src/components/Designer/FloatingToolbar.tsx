import React from 'react';
import { fabric } from 'fabric';
import {
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
    Trash2, Copy, Layers, ChevronDown, Type
} from 'lucide-react';

interface FloatingToolbarProps {
    selectedObject: fabric.Object | null;
    position: { top: number; left: number } | null;
    onUpdate: (values: any) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onLayerUp: () => void;
    onLayerDown: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
    selectedObject,
    position,
    onUpdate,
    onDelete,
    onDuplicate,
    onLayerUp,
    onLayerDown
}) => {
    if (!selectedObject || !position) return null;

    const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text';
    const isImage = selectedObject.type === 'image';

    // Calculate position to be above the object
    const style = {
        top: Math.max(10, position.top - 60), // Ensure it doesn't go off-screen top
        left: Math.max(10, position.left),
    };

    return (
        <div
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-1.5 flex items-center space-x-1 animate-in fade-in zoom-in-95 duration-200"
            style={style}
        >
            {isText && (
                <>
                    <div className="relative group">
                        <button className="flex items-center space-x-1 px-2 py-1.5 hover:bg-gray-100 rounded text-xs font-medium text-gray-700">
                            <span>{(selectedObject as any).fontFamily || 'Inter'}</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </button>
                        {/* Font Dropdown (simplified for now) */}
                    </div>

                    <div className="w-px h-4 bg-gray-200 mx-1" />

                    <div className="flex items-center space-x-1 bg-gray-50 rounded p-0.5">
                        <button
                            onClick={() => onUpdate({ fontSize: ((selectedObject as any).fontSize || 12) - 2 })}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white hover:shadow-sm rounded text-gray-600 text-xs"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={(selectedObject as any).fontSize || 12}
                            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                            className="w-8 text-center bg-transparent text-xs outline-none"
                        />
                        <button
                            onClick={() => onUpdate({ fontSize: ((selectedObject as any).fontSize || 12) + 2 })}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white hover:shadow-sm rounded text-gray-600 text-xs"
                        >
                            +
                        </button>
                    </div>

                    <div className="w-px h-4 bg-gray-200 mx-1" />

                    <input
                        type="color"
                        value={(selectedObject as any).fill as string}
                        onChange={(e) => onUpdate({ fill: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-none bg-transparent p-0"
                        title="Text Color"
                    />

                    <div className="w-px h-4 bg-gray-200 mx-1" />

                    <div className="flex space-x-0.5">
                        <button
                            onClick={() => onUpdate({ fontWeight: (selectedObject as any).fontWeight === 'bold' ? 'normal' : 'bold' })}
                            className={`p-1.5 rounded hover:bg-gray-100 ${(selectedObject as any).fontWeight === 'bold' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                            title="Bold"
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onUpdate({ fontStyle: (selectedObject as any).fontStyle === 'italic' ? 'normal' : 'italic' })}
                            className={`p-1.5 rounded hover:bg-gray-100 ${(selectedObject as any).fontStyle === 'italic' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                            title="Italic"
                        >
                            <Italic className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onUpdate({ underline: !(selectedObject as any).underline })}
                            className={`p-1.5 rounded hover:bg-gray-100 ${(selectedObject as any).underline ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                            title="Underline"
                        >
                            <Underline className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="w-px h-4 bg-gray-200 mx-1" />

                    <div className="flex space-x-0.5">
                        {['left', 'center', 'right'].map((align) => (
                            <button
                                key={align}
                                onClick={() => onUpdate({ textAlign: align })}
                                className={`p-1.5 rounded hover:bg-gray-100 ${(selectedObject as any).textAlign === align ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                            >
                                {align === 'left' && <AlignLeft className="w-4 h-4" />}
                                {align === 'center' && <AlignCenter className="w-4 h-4" />}
                                {align === 'right' && <AlignRight className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {!isText && (
                <div className="px-2 text-xs font-medium text-gray-500">
                    {isImage ? 'Image' : 'Shape'} Properties
                </div>
            )}

            <div className="w-px h-4 bg-gray-200 mx-1" />

            <div className="flex space-x-0.5">
                <button onClick={onLayerUp} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Bring Forward">
                    <Layers className="w-4 h-4" />
                </button>
                <button onClick={onLayerDown} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Send Backward">
                    <Layers className="w-4 h-4 rotate-180" />
                </button>
            </div>

            <div className="w-px h-4 bg-gray-200 mx-1" />

            <button onClick={onDuplicate} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Duplicate">
                <Copy className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Delete">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};
