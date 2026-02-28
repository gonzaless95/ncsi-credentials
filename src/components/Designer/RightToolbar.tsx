import React from 'react';
import { Type, Image as ImageIcon, Box, Layout, QrCode, PenTool, Layers } from 'lucide-react';

interface RightToolbarProps {
    onToolSelect: (tool: string) => void;
    activeTool: string | null;
}

export const RightToolbar: React.FC<RightToolbarProps> = ({ onToolSelect, activeTool }) => {
    const tools = [
        { id: 'templates', icon: Layout, label: 'Templates' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'elements', icon: Box, label: 'Elements' },
        { id: 'media', icon: ImageIcon, label: 'Images' },
        { id: 'qr', icon: QrCode, label: 'QR Code' },
        { id: 'layers', icon: Layers, label: 'Layers' },
        { id: 'draw', icon: PenTool, label: 'Draw' },
    ];

    return (
        <div className="w-16 bg-white border-l border-gray-200 flex flex-col items-center py-4 space-y-4 shadow-sm z-20">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => onToolSelect(tool.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${activeTool === tool.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                >
                    <tool.icon className="w-5 h-5" />
                    <span className="absolute right-full mr-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {tool.label}
                    </span>
                </button>
            ))}
        </div>
    );
};
