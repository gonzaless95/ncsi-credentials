import React from 'react';
import { useDesignerStore } from '../store/useDesignerStore';
import {
    Type, Layout, Palette, Shield,
    ChevronDown, ChevronUp, Trash2, Copy,
    Layers, MousePointer2, Database, Upload,
    PanelLeft, Square, Maximize, Award, Circle,
    List, Clock, Tags
} from 'lucide-react';

const Section = ({ title, icon: Icon, children, defaultOpen = true }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    return (
        <div className="border-b border-slate-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center space-x-2 text-slate-800">
                    {Icon && <Icon size={16} className="text-slate-400" />}
                    <span className="text-xs font-black uppercase tracking-widest">{title}</span>
                </div>
                {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
            </button>
            {isOpen && <div className="px-4 pb-5 space-y-4">{children}</div>}
        </div>
    );
};

export const Inspector = () => {
    const {
        canvas, setCanvasConfig, setDesignType,
        setLayout, updateSection,
        selectedIds, elements, updateElement,
        removeElement, duplicateElement, governance,
        fields, setFieldBinding, availableFonts, loadFont
    } = useDesignerStore();

    const selectedElement = elements.find(el => selectedIds.includes(el.id));

    const copySelected = () => {
        duplicateElement();
    };

    if (!selectedElement) {
        return (
            <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-200 bg-white sticky top-0 z-10">
                    <h2 className="font-black text-lg text-slate-800">Global Settings</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Canvas & Environment</p>
                </div>

                <div className="flex-1 overflow-y-auto pb-20">
                    <Section title="Structure & Layout" icon={Layout}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Layout Preset</label>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {[
                                        { id: 'none', icon: Square, label: 'None' },
                                        { id: 'sidebar-left', icon: PanelLeft, label: 'Sidebar L' },
                                        { id: 'sidebar-right', icon: PanelLeft, label: 'Sidebar R', rotate: 180 },
                                        { id: 'logo-tray', icon: Layout, label: 'Header' }
                                    ].map(layout => (
                                        <button
                                            key={layout.id}
                                            onClick={() => setLayout(layout.id as any)}
                                            className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${(!canvas.sections && layout.id === 'none') || (canvas.sections && canvas.sections[0]?.id === (layout.id === 'logo-tray' ? 'tray' : (layout.id === 'sidebar-left' ? 'sidebar' : (layout.id === 'sidebar-right' ? 'main' : 'none')))) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
                                            title={layout.label}
                                        >
                                            {layout.icon && <layout.icon size={18} className={layout.rotate ? `rotate-${layout.rotate}` : ''} />}
                                            <span className="text-[8px] font-black uppercase mt-1 truncate w-full text-center">{layout.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {canvas.sections && canvas.sections.length > 0 && (
                                <div className="space-y-4 pt-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Sections</label>
                                    {canvas.sections.map(section => (
                                        <div key={section.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-700 uppercase">{section.name}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="color"
                                                        value={section.backgroundColor || '#ffffff'}
                                                        onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                                                        className="w-6 h-6 rounded-md overflow-hidden border-none p-0 cursor-pointer shadow-sm"
                                                    />
                                                    <span className="text-[9px] font-mono text-slate-500 uppercase">{section.backgroundColor}</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const input = document.createElement('input');
                                                        input.type = 'file';
                                                        input.accept = 'image/*';
                                                        input.onchange = (e: any) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (f) => {
                                                                    updateSection(section.id, { backgroundImage: f.target?.result as string });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        };
                                                        input.click();
                                                    }}
                                                    className="flex items-center justify-center space-x-1 px-2 py-1 bg-white border border-slate-200 rounded-md hover:border-blue-300 hover:text-blue-600 transition-colors"
                                                >
                                                    <Upload size={10} />
                                                    <span className="text-[9px] font-bold uppercase">Img</span>
                                                </button>
                                            </div>

                                            {section.backgroundImage && (
                                                <div className="relative group">
                                                    <img src={section.backgroundImage} className="w-full h-10 object-cover rounded-md border border-slate-200" alt="" />
                                                    <button
                                                        onClick={() => updateSection(section.id, { backgroundImage: undefined })}
                                                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={8} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Section>

                    <Section title="Design Mode" icon={Maximize}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Canvas Preset</label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button
                                        onClick={() => setDesignType('certificate')}
                                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${canvas.designType === 'certificate' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
                                    >
                                        <Layout size={24} className="mb-2" />
                                        <span className="text-[10px] font-black uppercase">Certificate</span>
                                    </button>
                                    <button
                                        onClick={() => setDesignType('badge')}
                                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${canvas.designType === 'badge' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
                                    >
                                        <Award size={24} className="mb-2" />
                                        <span className="text-[10px] font-black uppercase">Badge</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="Credential Intelligence" icon={Shield}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Description</label>
                                <textarea
                                    value={canvas.description || ''}
                                    onChange={(e) => setCanvasConfig({ description: e.target.value })}
                                    className="w-full mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    rows={3}
                                    placeholder="Detailed achievement description..."
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                                    <Clock size={10} className="mr-1" /> Expiration Rule
                                </label>
                                <input
                                    type="text"
                                    value={canvas.expiresOn || ''}
                                    onChange={(e) => setCanvasConfig({ expiresOn: e.target.value })}
                                    className="w-full mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Lifetime / 1 Year / etc."
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center">
                                    <Tags size={10} className="mr-1" /> Target Skills
                                </label>
                                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 min-h-[40px]">
                                    {canvas.skills?.map((skill, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md flex items-center">
                                            {skill}
                                            <button
                                                onClick={() => setCanvasConfig({ skills: canvas.skills?.filter((_, idx) => idx !== i) })}
                                                className="ml-1.5 hover:text-blue-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value.trim();
                                                if (val) {
                                                    setCanvasConfig({ skills: [...(canvas.skills || []), val] });
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                        className="flex-1 bg-transparent border-none outline-none text-[10px] font-bold p-1"
                                        placeholder="Add skill..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center">
                                    <List size={10} className="mr-1" /> Earning Criteria
                                </label>
                                <div className="space-y-2">
                                    {canvas.earningCriteria?.map((criteria, i) => (
                                        <div key={criteria.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 relative group">
                                            <input
                                                className="bg-transparent border-none font-bold text-[10px] uppercase text-slate-700 w-full focus:outline-none"
                                                value={criteria.label}
                                                onChange={(e) => {
                                                    const newCriteria = [...(canvas.earningCriteria || [])];
                                                    newCriteria[i] = { ...newCriteria[i], label: e.target.value };
                                                    setCanvasConfig({ earningCriteria: newCriteria });
                                                }}
                                            />
                                            <textarea
                                                className="bg-transparent border-none text-[10px] text-slate-500 w-full mt-1 focus:outline-none resize-none"
                                                value={criteria.description}
                                                rows={2}
                                                onChange={(e) => {
                                                    const newCriteria = [...(canvas.earningCriteria || [])];
                                                    newCriteria[i] = { ...newCriteria[i], description: e.target.value };
                                                    setCanvasConfig({ earningCriteria: newCriteria });
                                                }}
                                            />
                                            <button
                                                onClick={() => setCanvasConfig({ earningCriteria: canvas.earningCriteria?.filter((_, idx) => idx !== i) })}
                                                className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setCanvasConfig({
                                            earningCriteria: [...(canvas.earningCriteria || []), {
                                                id: Math.random().toString(36).substr(2, 9),
                                                type: 'Course',
                                                label: 'New Requirement',
                                                description: 'Description of criteria...'
                                            }]
                                        })}
                                        className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all"
                                    >
                                        + Add Criteria
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="Dimensions" icon={Layout}>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Width</label>
                                <input
                                    type="number"
                                    value={canvas.width}
                                    onChange={(e) => setCanvasConfig({ width: parseInt(e.target.value) })}
                                    className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Height</label>
                                <input
                                    type="number"
                                    value={canvas.height}
                                    onChange={(e) => setCanvasConfig({ height: parseInt(e.target.value) })}
                                    className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                                />
                            </div>
                        </div>
                    </Section>

                    <Section title="Appearance" icon={Palette}>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Background Color</label>
                            <div className="flex items-center space-x-2 mt-2">
                                <input
                                    type="color"
                                    value={canvas.backgroundColor}
                                    onChange={(e) => setCanvasConfig({ backgroundColor: e.target.value })}
                                    className="w-10 h-10 rounded-lg overflow-hidden border-none p-0 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={canvas.backgroundColor}
                                    onChange={(e) => setCanvasConfig({ backgroundColor: e.target.value })}
                                    className="flex-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-xs font-mono uppercase"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Background Image</label>
                            <div className="mt-2 space-y-2">
                                {canvas.backgroundImage ? (
                                    <div className="relative group">
                                        <img
                                            src={canvas.backgroundImage}
                                            className="w-full aspect-[1.41] object-cover rounded-xl border border-slate-200"
                                            alt="Background"
                                        />
                                        <button
                                            onClick={() => setCanvasConfig({ backgroundImage: undefined })}
                                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.onchange = (e: any) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (f) => {
                                                        setCanvasConfig({ backgroundImage: f.target?.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            };
                                            input.click();
                                        }}
                                        className="w-full flex items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all group"
                                    >
                                        <Upload size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Upload Image</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </Section>

                    <Section title="Governance" icon={Shield}>
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <p className="text-xs font-bold text-blue-800 mb-1 italic">Governance Active</p>
                            <p className="text-[10px] text-blue-600 font-medium">Status: {governance.status}</p>
                            <p className="text-[10px] text-blue-600 font-medium">Version: v{governance.version}</p>
                        </div>
                    </Section>
                </div>

                <div className="p-4 border-t border-slate-200 italic text-[10px] text-slate-400 text-center">
                    Select an element to view properties
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-200 bg-white sticky top-0 z-10 flex items-center justify-between">
                <div>
                    <h2 className="font-black text-lg text-slate-800 truncate max-w-[150px]">
                        {selectedElement.name || selectedElement.type}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Element Properties</p>
                </div>
                <div className="flex space-x-1">
                    <button onClick={copySelected} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Copy size={16} />
                    </button>
                    <button onClick={() => removeElement(selectedElement.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-20">
                <Section title="Layout" icon={Layout}>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">X Position</label>
                            <input
                                type="number"
                                value={Math.round(selectedElement.x)}
                                onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                                className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Y Position</label>
                            <input
                                type="number"
                                value={Math.round(selectedElement.y)}
                                onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                                className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Rotation</label>
                            <input
                                type="number"
                                value={Math.round(selectedElement.rotation || 0)}
                                onChange={(e) => updateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
                                className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Opacity</label>
                            <input
                                type="number"
                                min="0" max="1" step="0.1"
                                value={selectedElement.opacity}
                                onChange={(e) => updateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                                className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                            />
                        </div>
                    </div>
                </Section>

                {selectedElement.type === 'text' && (
                    <Section title="Typography" icon={Type}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Content</label>
                                <textarea
                                    value={(selectedElement as any).content}
                                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-medium h-20 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Font Family</label>
                                    <select
                                        value={(selectedElement as any).fontFamily}
                                        onChange={(e) => {
                                            const font = e.target.value;
                                            loadFont(font);
                                            updateElement(selectedElement.id, { fontFamily: font });
                                        }}
                                        className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                                    >
                                        {availableFonts.map(font => (
                                            <option key={font} value={font}>{font}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Size</label>
                                    <input
                                        type="number"
                                        value={(selectedElement as any).fontSize}
                                        onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                                        className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Weight</label>
                                    <select
                                        value={(selectedElement as any).fontWeight}
                                        onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                                    >
                                        <option value="normal">Regular</option>
                                        <option value="600">SemiBold</option>
                                        <option value="bold">Bold</option>
                                        <option value="900">Black</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </Section>
                )}

                {selectedElement.type === 'image' && (
                    <Section title="Badge Intelligence" icon={Award}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dynamic Integrity</label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button
                                        onClick={() => updateElement(selectedElement.id, { fieldBinding: undefined })}
                                        className={`px-3 py-2 rounded-lg border-2 text-[10px] font-black uppercase transition-all ${!selectedElement.fieldBinding ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        Static Asset
                                    </button>
                                    <button
                                        onClick={() => updateElement(selectedElement.id, { fieldBinding: 'f5' })}
                                        className={`px-3 py-2 rounded-lg border-2 text-[10px] font-black uppercase transition-all ${selectedElement.fieldBinding === 'f5' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        Dynamic Badge
                                    </button>
                                </div>
                                <p className="text-[9px] text-slate-400 mt-2 italic">
                                    {selectedElement.fieldBinding === 'f5'
                                        ? "This image is linked to the achievement badge field."
                                        : "This image is a fixed part of the design."}
                                </p>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Badge Masking</label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button
                                        onClick={() => updateElement(selectedElement.id, { borderRadius: 0 })}
                                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${(selectedElement as any).borderRadius === 0 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400'}`}
                                    >
                                        <Square size={20} className="mb-1" />
                                        <span className="text-[9px] font-black uppercase">Square</span>
                                    </button>
                                    <button
                                        onClick={() => updateElement(selectedElement.id, { borderRadius: 999 })}
                                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${(selectedElement as any).borderRadius === 999 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400'}`}
                                    >
                                        <Circle size={20} className="mb-1" />
                                        <span className="text-[9px] font-black uppercase">Circular</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Section>
                )}

                {selectedElement.type === 'image' && (
                    <Section title="Digital Asset" icon={Database}>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Source Identity</label>
                            <div className="relative group overflow-hidden rounded-xl border border-slate-200">
                                <img
                                    src={(selectedElement as any).src}
                                    className="w-full h-32 object-contain bg-slate-50"
                                    alt="Logo Preview"
                                />
                                <button
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (e: any) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (f) => {
                                                    updateElement(selectedElement.id, { src: f.target?.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        };
                                        input.click();
                                    }}
                                    className="absolute inset-0 bg-blue-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-black uppercase text-xs tracking-widest"
                                >
                                    <Upload size={16} className="mr-2" />
                                    Replace Logo
                                </button>
                            </div>
                        </div>
                    </Section>
                )}

                {selectedElement.type === 'qr' && (
                    <Section title="QR Security" icon={Shield}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verification Link / Data</label>
                                <input
                                    type="text"
                                    value={(selectedElement as any).content}
                                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                                />
                                <p className="text-[9px] text-slate-400 mt-2 italic flex items-center">
                                    <Shield size={10} className="mr-1 text-blue-500" />
                                    This QR code redirects to the specified identity.
                                </p>
                            </div>
                        </div>
                    </Section>
                )}

                {(selectedElement.type === 'rect' || selectedElement.type === 'circle' || selectedElement.type === 'text' || selectedElement.type === 'image') && (
                    <Section title="Appearance" icon={Palette}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter font-black">
                                    {selectedElement.type === 'image' ? 'Backdrop Color' : 'Color System'}
                                </label>

                                <div className="flex bg-slate-100 p-1 rounded-lg mt-2 mb-3">
                                    <button
                                        onClick={() => updateElement(selectedElement.id, { fill: typeof (selectedElement as any).fill === 'object' ? '#3b82f6' : (selectedElement as any).fill })}
                                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${typeof (selectedElement as any).fill !== 'object' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Solid
                                    </button>
                                    <button
                                        onClick={() => updateElement(selectedElement.id, {
                                            fill: {
                                                type: 'linear',
                                                rotation: 0,
                                                stops: [
                                                    { offset: 0, color: '#3b82f6' },
                                                    { offset: 1, color: '#1d4ed8' }
                                                ]
                                            }
                                        })}
                                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${typeof (selectedElement as any).fill === 'object' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Gradient
                                    </button>
                                </div>

                                {typeof (selectedElement as any).fill === 'object' ? (
                                    <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Linear Stops</span>
                                            <div className="flex space-x-1">
                                                {(selectedElement as any).fill.stops.map((stop: any, idx: number) => (
                                                    <input
                                                        key={idx}
                                                        type="color"
                                                        value={stop.color}
                                                        onChange={(e) => {
                                                            const newStops = [...(selectedElement as any).fill.stops];
                                                            newStops[idx] = { ...stop, color: e.target.value };
                                                            updateElement(selectedElement.id, { fill: { ...(selectedElement as any).fill, stops: newStops } });
                                                        }}
                                                        className="w-6 h-6 rounded-md overflow-hidden border-none p-0 cursor-pointer shadow-sm"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase">Angle</label>
                                            <input
                                                type="range"
                                                min="0" max="360"
                                                value={(selectedElement as any).fill.rotation || 0}
                                                onChange={(e) => updateElement(selectedElement.id, { fill: { ...(selectedElement as any).fill, rotation: parseInt(e.target.value) } })}
                                                className="w-full mt-1 accent-blue-600"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            value={typeof (selectedElement as any).fill === 'string' ? (selectedElement as any).fill : '#000000'}
                                            onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                                            className="w-8 h-8 rounded-lg overflow-hidden border-none p-0 cursor-pointer shadow-sm"
                                        />
                                        <div className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-600">
                                            {(selectedElement as any).fill ? (typeof (selectedElement as any).fill === 'string' ? (selectedElement as any).fill.toUpperCase() : 'GRADIENT') : 'TRANSPARENT'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Section>
                )}

                {(selectedElement.type === 'text' || selectedElement.type === 'image') && (
                    <Section title="Data Binding" icon={Database}>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {selectedElement.type === 'image' ? 'Dynamic Asset Source' : 'Dynamic Content Source'}
                                </label>
                                <select
                                    value={selectedElement.fieldBinding || ''}
                                    onChange={(e) => setFieldBinding(selectedElement.id, e.target.value || undefined)}
                                    className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                                >
                                    <option value="">{selectedElement.type === 'image' ? 'None (Static Asset)' : 'None (Static Text)'}</option>
                                    {fields.map(f => (
                                        <option key={f.id} value={f.id}>{f.label}</option>
                                    ))}
                                </select>
                            </div>
                            {selectedElement.fieldBinding && (
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-tight">Active Binding</p>
                                    <p className="text-[11px] text-emerald-600 mt-0.5 leading-tight">
                                        This {selectedElement.type} will dynamically pull from <span className="font-bold underline text-emerald-700">
                                            {fields.find(f => f.id === selectedElement.fieldBinding)?.label}
                                        </span> during issuance.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Section>
                )}

                {selectedElement.type === 'serial' && (
                    <Section title="Serial Formatting" icon={Shield}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Format Template</label>
                                <input
                                    type="text"
                                    value={(selectedElement as any).format}
                                    onChange={(e) => updateElement(selectedElement.id, { format: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-mono"
                                />
                                <p className="text-[9px] text-slate-400 mt-1 italic">Use {"{{YEAR}}"}, {"{{CODE}}"}, etc.</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Preview Content</label>
                                <input
                                    type="text"
                                    value={(selectedElement as any).content}
                                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                                />
                            </div>
                        </div>
                    </Section>
                )}

                {selectedElement.type === 'signature' && (
                    <Section title="Signatory Details" icon={Shield}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Signer Name</label>
                                <input
                                    type="text"
                                    value={(selectedElement as any).signerName}
                                    onChange={(e) => updateElement(selectedElement.id, { signerName: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Signer Role</label>
                                <input
                                    type="text"
                                    value={(selectedElement as any).signerRole}
                                    onChange={(e) => updateElement(selectedElement.id, { signerRole: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 bg-slate-100 border-none rounded-lg text-sm font-medium"
                                />
                            </div>
                        </div>
                    </Section>
                )}

                <Section title="Advanced" icon={Layers}>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="text-xs font-bold text-slate-600 flex items-center">
                                <Shield size={14} className="mr-2 text-blue-500" />
                                Locked Layer
                            </span>
                            <div
                                onClick={() => updateElement(selectedElement.id, { locked: !selectedElement.locked })}
                                className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${selectedElement.locked ? 'bg-blue-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${selectedElement.locked ? 'left-6' : 'left-1'}`} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="text-xs font-bold text-slate-600 flex items-center">
                                <MousePointer2 size={14} className="mr-2 text-blue-500" />
                                Draggable
                            </span>
                            <div
                                onClick={() => updateElement(selectedElement.id, { draggable: !selectedElement.draggable })}
                                className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${selectedElement.draggable ? 'bg-blue-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${selectedElement.draggable ? 'left-6' : 'left-1'}`} />
                            </div>
                        </div>
                    </div>
                </Section>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">v.1.0.0-PRO</p>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
        </div>
    );
};
