import { useDesignerStore } from '../store/useDesignerStore';
import {
    Undo, Redo, Download,
    Save, ShieldCheck,
    Eye, EyeOff, Shield, Layout
} from 'lucide-react';

interface DesignerTopBarProps {
    onClose: () => void;
    onSave: () => void;
    orgName?: string;
}

export const TopBar = ({ onClose, onSave, orgName }: DesignerTopBarProps) => {
    const {
        undo, redo, history, canvas, setZoom,
        governance, previewMode, setPreviewMode,
        toggleBleed, exportToPDF
    } = useDesignerStore();

    return (
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50 relative shadow-sm">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <ShieldCheck className="text-blue-600" size={24} />
                    <div className="flex flex-col">
                        <span className="font-black text-sm uppercase tracking-tighter leading-none">
                            {orgName || "Antigravity"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                            Credential Engine
                        </span>
                    </div>
                </div>

                <div className="h-8 w-px bg-slate-200" />

                <div className="flex items-center space-x-1">
                    <button
                        onClick={undo}
                        disabled={history.past.length === 0}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-20 transition-colors"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo size={18} />
                    </button>
                    <button
                        onClick={redo}
                        disabled={history.future.length === 0}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-20 transition-colors"
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo size={18} />
                    </button>
                </div>

                <div className="flex items-center space-x-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Auto-saved</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                    <button onClick={() => setZoom(canvas.zoom - 0.1)} className="p-1 px-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600 font-bold">-</button>
                    <span className="text-[10px] font-black w-10 text-center text-slate-700">{Math.round(canvas.zoom * 100)}%</span>
                    <button onClick={() => setZoom(canvas.zoom + 0.1)} className="p-1 px-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600 font-bold">+</button>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => useDesignerStore.getState().toggleGrid()}
                        className={`p-2 rounded-lg transition-colors border ${canvas.gridOn ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-inner' : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
                        title="Toggle Alignment Grid"
                    >
                        <Layout size={18} />
                    </button>
                    <button
                        onClick={() => toggleBleed()}
                        className={`p-2 rounded-lg transition-colors border ${canvas.showBleed ? 'bg-red-50 text-red-600 border-red-100 shadow-inner' : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
                        title="Toggle Bleed Visualization"
                    >
                        <Shield size={18} />
                    </button>
                    <button
                        onClick={() => setPreviewMode(previewMode === 'design' ? 'placeholder' : 'design')}
                        className={`flex items-center px-4 py-2 rounded-xl transition-all font-bold text-xs ${previewMode === 'placeholder'
                            ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-inner ring-2 ring-amber-50'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        title={previewMode === 'placeholder' ? "Back to Design" : "Preview with Data"}
                    >
                        {previewMode === 'placeholder' ? (
                            <>
                                <EyeOff size={16} className="mr-2" />
                                Design Mode
                            </>
                        ) : (
                            <>
                                <Eye size={16} className="mr-2" />
                                Live Preview
                            </>
                        )}
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-1" />

                <div className="flex items-center space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        Exit
                    </button>
                    <button
                        onClick={async () => {
                            const { stageRef } = useDesignerStore.getState();
                            await exportToPDF(stageRef);
                        }}
                        className="flex items-center px-5 py-2.5 text-xs font-black bg-slate-800 text-white rounded-xl hover:bg-slate-900 shadow-lg shadow-slate-200 transition-all uppercase tracking-widest hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Download size={16} className="mr-2" />
                        Export PDF
                    </button>
                    <button
                        onClick={onSave}
                        className="flex items-center px-5 py-2.5 text-xs font-black bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all uppercase tracking-widest hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Save size={16} className="mr-2" />
                        {governance.status === 'published' ? 'Update Template' : 'Publish Design'}
                    </button>
                </div>
            </div>
        </div>
    );
};
