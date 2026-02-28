import React from 'react';
import { X, Type, Image as ImageIcon, Box } from 'lucide-react';

interface SidePanelProps {
    type: string | null;
    onClose: () => void;
    onSelect: (item: any) => void;
    onSelectPreset: (id: string) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ type, onClose, onSelect, onSelectPreset }) => {
    if (!type) return null;

    const titles: Record<string, string> = {
        templates: 'Templates',
        text: 'Typography',
        elements: 'Elements',
        media: 'My Media',
        qr: 'QR Codes',
    };

    return (
        <div className="absolute right-16 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">{titles[type]}</h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                {type === 'templates' && (
                    <div className="space-y-4">
                        <div onClick={() => onSelectPreset('modern')} className="cursor-pointer group">
                            <div className="aspect-video bg-gray-100 rounded-lg mb-2 relative overflow-hidden border border-gray-200 group-hover:border-blue-500 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50"></div>
                                <div className="absolute top-2 left-2 w-1/4 h-full bg-slate-800 rounded-l"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Modern Professional</span>
                        </div>
                        <div onClick={() => onSelectPreset('offsec')} className="cursor-pointer group">
                            <div className="aspect-video bg-gray-100 rounded-lg mb-2 relative overflow-hidden border border-gray-200 group-hover:border-red-500 transition-all">
                                <div className="absolute inset-2 border border-red-500 rounded-sm"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">OffSec Red</span>
                        </div>
                        <div onClick={() => onSelectPreset('cloud')} className="cursor-pointer group">
                            <div className="aspect-video bg-gray-100 rounded-lg mb-2 relative overflow-hidden border border-gray-200 group-hover:border-blue-400 transition-all">
                                <div className="absolute top-0 w-full h-3 bg-blue-600"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Cloud Architect</span>
                        </div>
                        <div onClick={() => onSelectPreset('hex')} className="cursor-pointer group">
                            <div className="aspect-square bg-gray-100 rounded-lg mb-2 relative flex items-center justify-center border border-gray-200 group-hover:border-orange-500 transition-all">
                                <div className="w-16 h-16 border-4 border-orange-500 rotate-45"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">Hex Badge</span>
                        </div>
                    </div>
                )}

                {type === 'text' && (
                    <div className="space-y-3">
                        <button
                            onClick={() => onSelect({ type: 'text', subtype: 'heading' })}
                            className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group"
                        >
                            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700">Add Heading</h3>
                        </button>
                        <button
                            onClick={() => onSelect({ type: 'text', subtype: 'subheading' })}
                            className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group"
                        >
                            <h4 className="text-lg font-semibold text-gray-700 group-hover:text-blue-700">Add Subheading</h4>
                        </button>
                        <button
                            onClick={() => onSelect({ type: 'text', subtype: 'body' })}
                            className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group"
                        >
                            <p className="text-sm text-gray-600 group-hover:text-blue-700">Add body text</p>
                        </button>
                    </div>
                )}

                {type === 'elements' && (
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => onSelect({ type: 'shape', subtype: 'rect' })} className="aspect-square bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 flex items-center justify-center transition-all">
                            <div className="w-10 h-8 bg-gray-400 rounded-sm"></div>
                        </button>
                        <button onClick={() => onSelect({ type: 'shape', subtype: 'circle' })} className="aspect-square bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 flex items-center justify-center transition-all">
                            <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                        </button>
                        <button onClick={() => onSelect({ type: 'shape', subtype: 'triangle' })} className="aspect-square bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 flex items-center justify-center transition-all">
                            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[34px] border-b-gray-400"></div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
