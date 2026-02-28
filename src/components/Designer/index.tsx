import { useEffect, useState } from 'react';
import { useDesignerStore } from './store/useDesignerStore';
import {
    CanvasArea, LeftRail, ToolPanel,
    Inspector, TopBar
} from './components';

interface DesignerProps {
    initialConfig?: any;
    onSave: (config: any) => void;
    onClose: () => void;
    organizationName?: string;
    type?: 'certificate' | 'badge';
}

export default function Designer({ initialConfig, onSave, onClose, organizationName, type = 'certificate' }: DesignerProps) {
    const { loadTemplate, setDesignType } = useDesignerStore();
    const [isInspectorOpen, setIsInspectorOpen] = useState(true);

    useEffect(() => {
        if (type) {
            setDesignType(type);
        }
    }, [type]);

    useEffect(() => {
        if (initialConfig) {
            loadTemplate(initialConfig);
        }
    }, [initialConfig]);

    return (
        <div className="flex flex-col h-screen bg-[#f8f9fa] overflow-hidden font-sans text-slate-900 select-none">
            <TopBar
                onClose={onClose}
                onSave={() => onSave(useDesignerStore.getState().serializeState())}
                orgName={organizationName}
            />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Region 1: Slim Left Rail */}
                <LeftRail />

                {/* Region 2: Expandable Tool Panel */}
                <div className="w-80 bg-white border-r border-slate-200 flex-shrink-0 z-20 shadow-sm overflow-y-auto">
                    <ToolPanel />
                </div>

                {/* Region 3: Centered Workspace */}
                <main className="flex-1 relative overflow-hidden flex flex-col items-center justify-center bg-slate-100/50">
                    <CanvasArea />
                </main>

                {/* Region 4: Collapsible Inspector Panel */}
                <div
                    className={`transition-all duration-300 ease-in-out border-l border-slate-200 bg-white z-20 shadow-sm overflow-y-auto flex-shrink-0 ${isInspectorOpen ? 'w-80' : 'w-0'
                        } relative overflow-hidden`}
                >
                    <Inspector />
                </div>

                {/* Collapse Toggle Handle - Moved outside to prevent hiding */}
                <button
                    onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                    className={`absolute top-1/2 -translate-y-1/2 -ml-3 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 transition-all duration-300 z-30 ${isInspectorOpen ? 'right-[320px]' : 'right-0 -translate-x-full mr-4' // Adjust position based on panel state
                        }`}
                    style={{ right: isInspectorOpen ? '320px' : '0px', transform: isInspectorOpen ? 'translate(50%, -50%)' : 'translate(-50%, -50%)' }}
                    title={isInspectorOpen ? "Collapse Inspector" : "Expand Inspector"}
                >
                    <div className={`w-4 h-4 flex items-center justify-center transition-transform duration-300 ${isInspectorOpen ? 'rotate-0' : 'rotate-180'}`}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-500">
                            <path d="M6 11L9 7.5L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );
}
