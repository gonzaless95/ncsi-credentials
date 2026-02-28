import React, { useRef, useState } from 'react';
import { useDesignerStore } from '../store/useDesignerStore';
import {
    Type, Square, Circle as CircleIcon, Image as ImageIcon,
    LayoutTemplate, Shapes, Shield, Award, Medal, Lock, Key, CheckCircle
} from 'lucide-react';
import { SAMPLE_TEMPLATES } from '../data/sampleTemplates';

export const LeftSidebar = () => {
    const { addElement, loadTemplate } = useDesignerStore();
    const [activeTab, setActiveTab] = useState<'elements' | 'templates' | 'badges'>('elements');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddText = () => {
        addElement({
            type: 'text',
            content: 'Double click to edit',
            fontSize: 24,
            width: 200,
            fill: '#000000'
        });
    };

    const handleAddShape = (type: 'rect' | 'circle', fill = '#cccccc') => {
        addElement({
            type,
            width: 100,
            height: 100,
            fill,
            stroke: '#000000',
            strokeWidth: 1
        });
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    addElement({
                        type: 'image',
                        src: event.target.result as string,
                        width: 200,
                        height: 200
                    });
                }
            };
            reader.readAsDataURL(file);
        }
        // Reset input for same file selection
        if (e.target) e.target.value = '';
    };

    // Placeholder for adding an SVG/Icon (Badge)
    const handleAddBadge = (iconName: string) => {
        addElement({
            type: 'circle',
            width: 120,
            height: 120,
            fill: '#f59e0b', // Gold
            stroke: '#b45309',
            strokeWidth: 4,
            name: iconName // Use name to identify
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Tabs */}
            <div className="flex border-b bg-gray-50">
                <button
                    onClick={() => setActiveTab('elements')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'elements' ? 'bg-white border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Tools
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'templates' ? 'bg-white border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Templates
                </button>
                <button
                    onClick={() => setActiveTab('badges')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'badges' ? 'bg-white border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Badges
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {activeTab === 'elements' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-700 text-sm mb-2">Basic Elements</h3>

                        <button onClick={handleAddText} className="w-full flex items-center p-3 bg-white border rounded hover:bg-gray-50 transition shadow-sm">
                            <Type className="mr-3 h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium">Add Text</span>
                        </button>

                        <button onClick={() => handleAddShape('rect')} className="w-full flex items-center p-3 bg-white border rounded hover:bg-gray-50 transition shadow-sm">
                            <Square className="mr-3 h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium">Rectangle</span>
                        </button>

                        <button onClick={() => handleAddShape('circle')} className="w-full flex items-center p-3 bg-white border rounded hover:bg-gray-50 transition shadow-sm">
                            <CircleIcon className="mr-3 h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium">Circle</span>
                        </button>

                        <button onClick={handleUploadClick} className="w-full flex items-center p-3 bg-white border rounded hover:bg-gray-50 transition shadow-sm">
                            <ImageIcon className="mr-3 h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium">Upload Image</span>
                        </button>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-700 text-sm mb-2">Preset Designs</h3>
                        {SAMPLE_TEMPLATES.map(template => (
                            <div
                                key={template.id}
                                onClick={() => {
                                    if (confirm('Load this template? Current work will be replaced.')) {
                                        loadTemplate(template);
                                    }
                                }}
                                className="cursor-pointer group border rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition"
                            >
                                <div className="aspect-video bg-gray-200 relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <LayoutTemplate className="w-8 h-8" />
                                    </div>
                                    <div
                                        className="absolute inset-0 opacity-50 block"
                                        style={{ background: template.canvas.background }}
                                    ></div>
                                </div>
                                <div className="p-2 bg-white">
                                    <div className="font-medium text-sm text-gray-800">{template.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'badges' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-700 text-sm mb-2">Security Badges</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleAddBadge('Shield')} className="flex flex-col items-center justify-center p-4 bg-white border rounded hover:bg-blue-50 hover:border-blue-200 transition">
                                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                                <span className="text-xs text-gray-600">Shield</span>
                            </button>
                            <button onClick={() => handleAddBadge('Award')} className="flex flex-col items-center justify-center p-4 bg-white border rounded hover:bg-blue-50 hover:border-blue-200 transition">
                                <Award className="h-8 w-8 text-amber-500 mb-2" />
                                <span className="text-xs text-gray-600">Award</span>
                            </button>
                            <button onClick={() => handleAddBadge('Medal')} className="flex flex-col items-center justify-center p-4 bg-white border rounded hover:bg-blue-50 hover:border-blue-200 transition">
                                <Medal className="h-8 w-8 text-yellow-500 mb-2" />
                                <span className="text-xs text-gray-600">Medal</span>
                            </button>
                            <button onClick={() => handleAddBadge('Security')} className="flex flex-col items-center justify-center p-4 bg-white border rounded hover:bg-blue-50 hover:border-blue-200 transition">
                                <Lock className="h-8 w-8 text-emerald-600 mb-2" />
                                <span className="text-xs text-gray-600">Secure</span>
                            </button>
                            <button onClick={() => handleAddBadge('Verified')} className="flex flex-col items-center justify-center p-4 bg-white border rounded hover:bg-blue-50 hover:border-blue-200 transition">
                                <CheckCircle className="h-8 w-8 text-blue-600 mb-2" />
                                <span className="text-xs text-gray-600">Verified</span>
                            </button>
                            <button onClick={() => handleAddBadge('Access')} className="flex flex-col items-center justify-center p-4 bg-white border rounded hover:bg-blue-50 hover:border-blue-200 transition">
                                <Key className="h-8 w-8 text-purple-600 mb-2" />
                                <span className="text-xs text-gray-600">Access</span>
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
