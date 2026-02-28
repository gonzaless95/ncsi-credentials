import React, { useState } from 'react';
import { Layout, Type, Image as ImageIcon, Box, Grid, Settings } from 'lucide-react';

type Tab = 'templates' | 'text' | 'media' | 'elements' | 'settings';

interface SidebarProps {
    onAddText: (type: string) => void;
    onAddShape: (type: 'rect' | 'circle' | 'triangle') => void;
    onAddImage: (file: File) => void;
    onSelectPreset: (presetId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddText, onAddShape, onAddImage, onSelectPreset }) => {
    const [activeTab, setActiveTab] = useState<Tab>('text');

    const tabs: { id: Tab; icon: React.ElementType; label: string }[] = [
        { id: 'templates', icon: Layout, label: 'Templates' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'media', icon: ImageIcon, label: 'Media' },
        { id: 'elements', icon: Box, label: 'Elements' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onAddImage(file);
        }
    };

    return (
        <div className="flex bg-white h-full border-r border-gray-200">
            {/* Icon Bar */}
            <div className="w-16 flex flex-col items-center py-4 border-r border-gray-100 bg-gray-50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-10 h-10 mb-4 rounded-xl flex items-center justify-center transition-all ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                            }`}
                        title={tab.label}
                    >
                        <tab.icon className="w-5 h-5" />
                    </button>
                ))}
            </div>

            {/* Content Panel */}
            <div className="w-72 flex flex-col bg-white">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeTab === 'templates' && (
                        <div className="space-y-3">
                            <button
                                onClick={() => onSelectPreset('modern')}
                                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                            >
                                <div className="aspect-video bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50"></div>
                                    <div className="absolute top-2 left-2 w-1/4 h-full bg-slate-800 rounded-l"></div>
                                </div>
                                <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600">Modern Professional</span>
                                <p className="text-[10px] text-gray-500">Clean, side-bar layout</p>
                            </button>

                            <button
                                onClick={() => onSelectPreset('offsec')}
                                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-red-500 hover:shadow-md transition-all group"
                            >
                                <div className="aspect-video bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                                    <div className="absolute inset-2 border border-red-500 rounded-sm"></div>
                                </div>
                                <span className="text-sm font-bold text-gray-800 group-hover:text-red-600">OffSec Red</span>
                                <p className="text-[10px] text-gray-500">Technical certification style</p>
                            </button>

                            <button
                                onClick={() => onSelectPreset('cloud')}
                                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
                            >
                                <div className="aspect-video bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                                    <div className="absolute top-0 w-full h-3 bg-blue-600"></div>
                                </div>
                                <span className="text-sm font-bold text-gray-800 group-hover:text-blue-500">Cloud Architect</span>
                                <p className="text-[10px] text-gray-500">Modern tech style</p>
                            </button>

                            <button
                                onClick={() => onSelectPreset('hex')}
                                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
                            >
                                <div className="aspect-square bg-gray-100 rounded-lg mb-2 relative flex items-center justify-center">
                                    <div className="w-16 h-16 border-4 border-orange-500 rotate-45"></div>
                                </div>
                                <span className="text-sm font-bold text-gray-800 group-hover:text-orange-600">Hex Badge</span>
                                <p className="text-[10px] text-gray-500">Open Badge Optimized</p>
                            </button>
                        </div>
                    )}
                    {activeTab === 'text' && (
                        <div className="space-y-3">
                            <button
                                onClick={() => onAddText('heading')}
                                className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all group"
                            >
                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600">Add Heading</h3>
                            </button>
                            <button
                                onClick={() => onAddText('subheading')}
                                className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all group"
                            >
                                <h4 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600">Add Subheading</h4>
                            </button>
                            <button
                                onClick={() => onAddText('body')}
                                className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all group"
                            >
                                <p className="text-sm text-gray-600 group-hover:text-blue-600">Add body text</p>
                            </button>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="text-xs text-gray-500 font-medium">Click to upload image</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                    )}

                    {activeTab === 'elements' && (
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => onAddShape('rect')} className="aspect-square bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <div className="w-10 h-8 bg-gray-400 rounded-sm"></div>
                            </button>
                            <button onClick={() => onAddShape('circle')} className="aspect-square bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                            </button>
                            <button onClick={() => onAddShape('triangle')} className="aspect-square bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[34px] border-b-gray-400"></div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
