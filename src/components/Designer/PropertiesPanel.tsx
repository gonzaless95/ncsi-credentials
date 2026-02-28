import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Trash2, Copy, Layers, Move, Type } from 'lucide-react';
import { fabric } from 'fabric';

interface PropertiesPanelProps {
    selectedObject: fabric.Object | null;
    onUpdate: (values: any) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onLayerUp: () => void;
    onLayerDown: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    selectedObject,
    onUpdate,
    onDelete,
    onDuplicate,
    onLayerUp,
    onLayerDown
}) => {
    if (!selectedObject) {
        return (
            <div className="w-72 bg-white border-l border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                    <Type className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">No Selection</h3>
                <p className="text-xs text-gray-500 mt-1">Select an element on the canvas to edit its properties.</p>
            </div>
        );
    }

    const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text';
    const isImage = selectedObject.type === 'image';

    return (
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full font-sans">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Properties</h2>
                <div className="flex space-x-1">
                    <button onClick={onDuplicate} className="p-2 hover:bg-gray-100 rounded text-gray-500" title="Duplicate">
                        <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded text-red-500" title="Delete">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Dimensions & Position - Common for all */}
                <section className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Layout</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] text-gray-500 font-medium mb-1 block">X Position</label>
                            <input
                                type="number"
                                value={Math.round(selectedObject.left || 0)}
                                onChange={(e) => onUpdate({ left: Number(e.target.value) })}
                                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-medium mb-1 block">Y Position</label>
                            <input
                                type="number"
                                value={Math.round(selectedObject.top || 0)}
                                onChange={(e) => onUpdate({ top: Number(e.target.value) })}
                                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-medium mb-1 block">Width</label>
                            <input
                                type="number"
                                value={Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    const scale = val / (selectedObject.width || 1);
                                    onUpdate({ scaleX: scale, scaleY: scale });
                                }}
                                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-medium mb-1 block">Rotation</label>
                            <input
                                type="number"
                                value={Math.round(selectedObject.angle || 0)}
                                onChange={(e) => onUpdate({ angle: Number(e.target.value) })}
                                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </section>

                {isText && (
                    <section className="space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Typography</h3>

                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] text-gray-500 font-medium mb-1 block">Font Family</label>
                                <select
                                    value={(selectedObject as any).fontFamily}
                                    onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                                    className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                >
                                    <option value="Inter">Inter</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Open Sans">Open Sans</option>
                                    <option value="Space Grotesk">Space Grotesk</option>
                                    <option value="Playfair Display">Playfair Display</option>
                                </select>
                            </div>

                            <div className="flex space-x-2">
                                <div className="flex-1">
                                    <label className="text-[10px] text-gray-500 font-medium mb-1 block">Size</label>
                                    <input
                                        type="number"
                                        value={(selectedObject as any).fontSize}
                                        onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                                        className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] text-gray-500 font-medium mb-1 block">Color</label>
                                    <div className="flex items-center space-x-2 border border-gray-200 rounded px-2 py-1 bg-gray-50">
                                        <input
                                            type="color"
                                            value={(selectedObject as any).fill as string}
                                            onChange={(e) => onUpdate({ fill: e.target.value })}
                                            className="w-6 h-6 rounded cursor-pointer border-none bg-transparent p-0"
                                        />
                                        <span className="text-[10px] text-gray-600">{(selectedObject as any).fill}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                                <button
                                    onClick={() => onUpdate({ fontWeight: (selectedObject as any).fontWeight === 'bold' ? 'normal' : 'bold' })}
                                    className={`flex-1 p-1 rounded hover:bg-white hover:shadow-sm flex justify-center ${(selectedObject as any).fontWeight === 'bold' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                                >
                                    <Bold className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onUpdate({ fontStyle: (selectedObject as any).fontStyle === 'italic' ? 'normal' : 'italic' })}
                                    className={`flex-1 p-1 rounded hover:bg-white hover:shadow-sm flex justify-center ${(selectedObject as any).fontStyle === 'italic' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                                >
                                    <Italic className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onUpdate({ underline: !(selectedObject as any).underline })}
                                    className={`flex-1 p-1 rounded hover:bg-white hover:shadow-sm flex justify-center ${(selectedObject as any).underline ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                                >
                                    <Underline className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => onUpdate({ textAlign: align })}
                                        className={`flex-1 p-1 rounded hover:bg-white hover:shadow-sm flex justify-center ${(selectedObject as any).textAlign === align ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                                    >
                                        {align === 'left' && <AlignLeft className="w-4 h-4" />}
                                        {align === 'center' && <AlignCenter className="w-4 h-4" />}
                                        {align === 'right' && <AlignRight className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Appearance</h3>
                    <div>
                        <label className="text-[10px] text-gray-500 font-medium mb-1 block">Opacity</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={selectedObject.opacity || 1}
                            onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
                            className="w-full"
                        />
                    </div>

                    {!isImage && (
                        <div>
                            <label className="text-[10px] text-gray-500 font-medium mb-1 block">Stroke Width</label>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={selectedObject.strokeWidth || 0}
                                onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    )}
                </section>

                <section className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Layering</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={onLayerUp} className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-xs font-medium text-gray-700">
                            <Layers className="w-3 h-3" />
                            <span>Bring Forward</span>
                        </button>
                        <button onClick={onLayerDown} className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-xs font-medium text-gray-700">
                            <Layers className="w-3 h-3" />
                            <span>Send Backward</span>
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
};
