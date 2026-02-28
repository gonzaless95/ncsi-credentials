import React from 'react';
import { useDesignerStore } from '../store/useDesignerStore';

export const RightSidebar = () => {
    const { selectedIds, elements, updateElement, canvas, setCanvasConfig } = useDesignerStore();

    // Simple single selection support for now
    const selectedId = selectedIds.length === 1 ? selectedIds[0] : null;
    const selectedElement = selectedId ? elements.find(el => el.id === selectedId) : null;

    if (!selectedElement) {
        return (
            <div className="p-4">
                <h3 className="font-bold text-gray-700 mb-4">Canvas Settings</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Width</label>
                        <input
                            type="number"
                            value={canvas.width}
                            onChange={(e) => setCanvasConfig({ width: parseInt(e.target.value) })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Height</label>
                        <input
                            type="number"
                            value={canvas.height}
                            onChange={(e) => setCanvasConfig({ height: parseInt(e.target.value) })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Background</label>
                        <input
                            type="color"
                            value={canvas.backgroundColor || '#ffffff'}
                            onChange={(e) => setCanvasConfig({ backgroundColor: e.target.value })}
                            className="mt-1 block w-full h-10 p-1 bg-white border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={canvas.gridOn}
                            onChange={(e) => setCanvasConfig({ gridOn: e.target.checked })}
                            className="mr-2"
                        />
                        <label className="text-sm">Show Grid</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={canvas.snapToGrid}
                            onChange={(e) => setCanvasConfig({ snapToGrid: e.target.checked })}
                            className="mr-2"
                        />
                        <label className="text-sm">Snap to Grid</label>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h3 className="font-bold text-gray-700 mb-4">Properties</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-gray-500 uppercase">ID</label>
                    <div className="text-xs text-gray-400 font-mono overflow-hidden text-ellipsis">{selectedElement.id}</div>
                </div>

                {/* Common Layout Props */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">X</label>
                        <input
                            type="number"
                            value={Math.round(selectedElement.x)}
                            onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                            className="block w-full border-gray-300 rounded-md shadow-sm p-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Y</label>
                        <input
                            type="number"
                            value={Math.round(selectedElement.y)}
                            onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                            className="block w-full border-gray-300 rounded-md shadow-sm p-1"
                        />
                    </div>
                </div>

                {/* Type Specific Props */}
                {selectedElement.type === 'text' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content</label>
                            <textarea
                                value={selectedElement.content}
                                onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Font</label>
                            <select
                                value={selectedElement.fontFamily}
                                onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Color</label>
                            <input
                                type="color"
                                value={selectedElement.fill}
                                onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                                className="block w-full h-8"
                            />
                        </div>
                    </>
                )}

                {(selectedElement.type === 'rect' || selectedElement.type === 'circle') && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fill Color</label>
                            <input
                                type="color"
                                value={selectedElement.fill}
                                onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                                className="block w-full h-8"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stroke</label>
                            <input
                                type="color"
                                value={selectedElement.stroke}
                                onChange={(e) => updateElement(selectedElement.id, { stroke: e.target.value })}
                                className="block w-full h-8"
                            />
                        </div>
                    </>
                )}

                <div className="pt-4 border-t">
                    <button
                        className="w-full py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        onClick={() => {
                            // Delete
                            const { removeElement } = useDesignerStore.getState();
                            removeElement(selectedElement.id);
                        }}
                    >
                        Delete Element
                    </button>
                </div>
            </div>
        </div>
    );
};
