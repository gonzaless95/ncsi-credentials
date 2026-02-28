import React from 'react';
import { Save, Download, ArrowLeft, Undo, Redo, Plus } from 'lucide-react';

interface HeaderProps {
    onClose: () => void;
    onSave: () => void;
    onDownload: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onAddVariable: (variable: string) => void;
    canUndo: boolean;
    canRedo: boolean;
    title: string;
}

export const Header: React.FC<HeaderProps> = ({
    onClose,
    onSave,
    onDownload,
    onUndo,
    onRedo,
    onAddVariable,
    canUndo,
    canRedo,
    title
}) => {
    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-30 relative">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-gray-200"></div>
                <div>
                    <h1 className="text-base font-semibold text-gray-900">{title}</h1>
                    <span className="text-xs text-gray-500">Draft</span>
                </div>
            </div>

            {/* Variable Chips like in Screenshot 2 */}
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Variables:</span>
                <button
                    onClick={() => onAddVariable('recipient_name')}
                    className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-50 transition-colors flex items-center shadow-sm"
                >
                    <Plus className="w-3 h-3 mr-1" />
                    Name
                </button>
                <button
                    onClick={() => onAddVariable('issued_date')}
                    className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-50 transition-colors flex items-center shadow-sm"
                >
                    <Plus className="w-3 h-3 mr-1" />
                    Date
                </button>
                <button
                    onClick={() => onAddVariable('certificate_id')}
                    className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-50 transition-colors flex items-center shadow-sm"
                >
                    <Plus className="w-3 h-3 mr-1" />
                    ID
                </button>
            </div>

            <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gray-50 rounded-lg p-1 mr-2">
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className={`p-1.5 rounded-md transition-colors ${canUndo ? 'hover:bg-white hover:shadow-sm text-gray-700' : 'text-gray-300'
                            }`}
                        title="Undo"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className={`p-1.5 rounded-md transition-colors ${canRedo ? 'hover:bg-white hover:shadow-sm text-gray-700' : 'text-gray-300'
                            }`}
                        title="Redo"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                </div>

                <button
                    onClick={onDownload}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm"
                >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </button>

                <button
                    onClick={onSave}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                </button>
            </div>
        </div>
    );
};
