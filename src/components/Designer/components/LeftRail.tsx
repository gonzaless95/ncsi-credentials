import {
    LayoutTemplate, Shapes, Type, Upload, Shield,
    Layers, Settings, Briefcase, Award, Database
} from 'lucide-react';
import { useDesignerStore } from '../store/useDesignerStore';
import { DesignerState } from '../types';

interface RailItemProps {
    id: DesignerState['activePanel'];
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
}

const RailItem = ({ icon: Icon, label, active, onClick }: RailItemProps) => (
    <button
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center py-4 px-2 transition-all group relative ${active
            ? 'text-blue-600 bg-white'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
    >
        {active && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
        )}
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-bold mt-1.5 uppercase tracking-tighter">{label}</span>

        {/* Tooltip on hover */}
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            {label}
        </div>
    </button>
);

export const LeftRail = () => {
    const { activePanel, setActivePanel } = useDesignerStore();

    const menuItems: { id: DesignerState['activePanel']; icon: any; label: string }[] = [
        { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
        { id: 'elements', icon: Shapes, label: 'Elements' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'fields', icon: Database, label: 'Fields' },
        { id: 'uploads', icon: Upload, label: 'Uploads' },
        { id: 'brand', icon: Briefcase, label: 'Brand' },
        { id: 'layers', icon: Layers, label: 'Layers' },
        { id: 'security', icon: Shield, label: 'Security' },
        { id: 'governance', icon: Award, label: 'Gov' },
    ];

    return (
        <div className="w-20 bg-slate-100 border-r border-slate-200 flex flex-col items-center py-2 flex-shrink-0 z-30">
            <div className="mb-4 p-2">
                {/* Brand Logo Placeholder */}
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
                    A
                </div>
            </div>

            <div className="flex-1 w-full space-y-1">
                {menuItems.map((item) => (
                    <RailItem
                        key={item.id}
                        id={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={activePanel === item.id}
                        onClick={() => setActivePanel(item.id)}
                    />
                ))}
            </div>

            <div className="mt-auto pb-4 w-full">
                <RailItem
                    id="templates" // Settings? 
                    icon={Settings}
                    label="Settings"
                    active={false}
                    onClick={() => { }}
                />
            </div>
        </div>
    );
};
