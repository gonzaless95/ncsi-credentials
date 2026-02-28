import { useRef } from 'react';
import { useDesignerStore } from '../store/useDesignerStore';
import {
    Search, X, Plus, Image as ImageIcon,
    LayoutTemplate, Type, Shapes, Shield, Award, Briefcase, Layers, Database
} from 'lucide-react';
import { SAMPLE_TEMPLATES } from '../data/sampleTemplates';

// Simplified sub-panels for now, we will refine these in later phases
const TemplatesPanel = () => {
    const { loadTemplate } = useDesignerStore();
    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Search templates..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>
            <div className="grid grid-cols-1 gap-4">
                {SAMPLE_TEMPLATES.map(template => (
                    <div
                        key={template.id}
                        onClick={() => {
                            if (confirm('Load template? Current work will be replaced.')) {
                                loadTemplate(template);
                            }
                        }}
                        className="cursor-pointer group rounded-xl border border-slate-200 overflow-hidden hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all shadow-sm"
                    >
                        <div className="aspect-[1.4/1] bg-slate-200 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center opacity-20 text-slate-600">
                                <LayoutTemplate size={48} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="p-3 bg-white">
                            <p className="text-xs font-bold text-slate-800 truncate">{template.name}</p>
                            <p className="text-[10px] text-slate-500 mt-1">Professional Certificate</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ElementsPanel = () => {
    const { addElement } = useDesignerStore();
    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Basic Shapes</h3>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => addElement({ type: 'rect', fill: '#3b82f6', width: 100, height: 100 })}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <div className="w-8 h-8 bg-slate-200 rounded-sm mb-2" />
                        <span className="text-[10px] font-medium">Square</span>
                    </button>
                    <button
                        onClick={() => addElement({ type: 'circle', fill: '#ef4444', width: 100, height: 100 })}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <div className="w-8 h-8 bg-slate-200 rounded-full mb-2" />
                        <span className="text-[10px] font-medium">Circle</span>
                    </button>
                    <button
                        onClick={() => addElement({ type: 'rect', fill: '#10b981', width: 150, height: 2, name: 'Line' })}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <div className="w-8 h-[2px] bg-slate-300 my-4" />
                        <span className="text-[10px] font-medium">Line</span>
                    </button>
                    <button
                        onClick={() => addElement({ type: 'hexagon', fill: '#6366f1', width: 100, height: 100 })}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <div className="w-8 h-8 bg-slate-200 mb-2" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
                        <span className="text-[10px] font-medium">Hexagon</span>
                    </button>
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Badges & Seals</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => addElement({
                            type: 'circle',
                            fill: '#fbbf24',
                            width: 120,
                            height: 120,
                            stroke: '#b45309',
                            strokeWidth: 4,
                            name: 'Gold Badge'
                        } as any)}
                        className="flex items-center p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all text-left group"
                    >
                        <Award className="w-5 h-5 text-amber-600 mr-3 group-hover:scale-110 transition-transform" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter text-amber-900">Gold Seal</p>
                            <p className="text-[9px] text-amber-700">Premium quality</p>
                        </div>
                    </button>
                    <button
                        onClick={() => addElement({
                            type: 'hexagon',
                            fill: 'transparent',
                            width: 120,
                            height: 120,
                            stroke: '#1e40af',
                            strokeWidth: 4,
                            name: 'Modern Badge'
                        } as any)}
                        className="flex items-center p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                    >
                        <Shield className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter text-blue-900">Modern Seal</p>
                            <p className="text-[9px] text-blue-700">Hexagon security</p>
                        </div>
                    </button>
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Badge & Seal Bases</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => addElement({
                            type: 'circle',
                            fill: {
                                type: 'linear',
                                rotation: 45,
                                stops: [
                                    { offset: 0, color: '#fbbf24' },
                                    { offset: 1, color: '#f59e0b' }
                                ]
                            } as any,
                            width: 150,
                            height: 150,
                            stroke: '#92400e',
                            strokeWidth: 4,
                            name: 'Classic Seal'
                        })}
                        className="flex items-center p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all text-left group"
                    >
                        <Award className="w-5 h-5 text-amber-600 mr-3 group-hover:scale-110 transition-transform" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter text-amber-900">Classic Seal</p>
                            <p className="text-[9px] text-amber-700">Gold gradient</p>
                        </div>
                    </button>
                    <button
                        onClick={() => addElement({
                            type: 'rect',
                            fill: '#1e40af',
                            width: 150,
                            height: 150,
                            cornerRadius: 20,
                            name: 'Modern Badge'
                        })}
                        className="flex items-center p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                    >
                        <Shield className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter text-blue-900">Modern Base</p>
                            <p className="text-[9px] text-blue-700">Rounded square</p>
                        </div>
                    </button>
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Trust Elements</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => addElement({
                            type: 'serial',
                            content: 'SN-000000',
                            format: 'SN-{{YEAR}}{{CODE}}',
                            fontSize: 14,
                            fontFamily: 'monospace',
                            fontWeight: 'normal',
                            fill: '#000000'
                        } as any)}
                        className="flex items-center p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                        <Shield className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter">Serial No.</p>
                            <p className="text-[9px] text-slate-500">Auto-generating ID</p>
                        </div>
                    </button>
                    <button
                        onClick={() => addElement({ type: 'signature', name: 'Signature', width: 200, height: 80 })}
                        className="flex items-center p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                        <Award className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter">Signature</p>
                            <p className="text-[9px] text-slate-500">Official Sign-off</p>
                        </div>
                    </button>
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">QR Codes</h3>
                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={() => addElement({ type: 'qr', width: 120, height: 120, content: '{{VerifyLink}}' } as any)}
                        className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
                            <Plus className="text-slate-400" size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Dynamic Verification QR</p>
                            <p className="text-[10px] text-slate-500">Real-time trust validation</p>
                        </div>
                    </button>
                </div>
            </section>
        </div>
    );
};

const TextPanel = () => {
    const { addElement, availableFonts } = useDesignerStore();
    return (
        <div className="space-y-6">
            <section className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Presets</h3>
                <button
                    onClick={() => addElement({ type: 'text', content: 'Add a heading', fontSize: 48, fontWeight: 'bold' })}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-slate-50 transition-all"
                >
                    <h1 className="text-2xl font-black">Add a heading</h1>
                </button>
                <button
                    onClick={() => addElement({ type: 'text', content: 'Add a subheading', fontSize: 24, fontWeight: 'semibold' })}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-slate-50 transition-all"
                >
                    <h2 className="text-lg font-bold">Add a subheading</h2>
                </button>
                <button
                    onClick={() => addElement({ type: 'text', content: 'Add a body text', fontSize: 16 })}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-slate-50 transition-all"
                >
                    <p className="text-sm">Add a body text</p>
                </button>
            </section>

            <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Available Fonts</h3>
                <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    {availableFonts.map(font => (
                        <button
                            key={font}
                            onClick={() => addElement({ type: 'text', content: font, fontFamily: font, fontSize: 24 })}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors group flex items-center justify-between"
                        >
                            <span className="text-sm font-medium" style={{ fontFamily: font }}>{font}</span>
                            <Plus size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                    ))}
                </div>
                <button className="w-full mt-4 py-3 px-4 rounded-xl border border-dashed border-slate-300 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                    + Discover More Google Fonts
                </button>
            </section>
        </div>
    );
};

const Header = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Icon size={20} />
            </div>
            <h2 className="font-black text-lg text-slate-800">{title}</h2>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
            <X size={20} />
        </button>
    </div>
);

const FieldsPanel = () => {
    const { fields, addElement } = useDesignerStore();
    return (
        <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start space-x-3 mb-4">
                <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-tight">
                    Dynamic fields are placeholders that get replaced with real data when certificates are issued.
                </p>
            </div>

            <div className="space-y-2">
                {fields.map(field => (
                    <button
                        key={field.id}
                        onClick={() => {
                            if (field.id === 'f5') {
                                // Special handling for Badge image field
                                addElement({
                                    type: 'image',
                                    src: field.defaultValue,
                                    fieldBinding: field.id,
                                    width: 120,
                                    height: 120,
                                    name: field.label
                                });
                            } else {
                                addElement({
                                    type: 'text',
                                    content: `{{${field.label}}}`,
                                    fieldBinding: field.id,
                                    fontSize: 14,
                                    fontWeight: 'medium'
                                });
                            }
                        }}
                        className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-3 ${field.id === 'f5' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                {field.id === 'f5' ? <Award size={16} /> : <Database size={16} />}
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{field.label}</p>
                                <p className="text-[10px] text-slate-500">Auto-binding: {field.category}</p>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus size={14} className="text-blue-600" />
                        </div>
                    </button>
                ))}
            </div>

            <button className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs font-bold hover:bg-slate-50 transition-all">
                + Create Custom Field
            </button>
        </div>
    );
};

const UploadsPanel = () => {
    const { addElement } = useDesignerStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const src = event.target?.result as string;
            if (src) {
                addElement({
                    type: 'image',
                    src,
                    name: file.name,
                    width: 300,
                    height: 200, // Initial, will be corrected by ImageElement effect
                    x: 100,
                    y: 100
                });
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
            >
                <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <ImageIcon size={32} className="text-blue-500" />
                </div>
                <p className="text-sm font-bold text-slate-600">Upload Image</p>
                <p className="text-[10px] mt-2 px-4 leading-relaxed">
                    Will be added as an element by default.<br />
                    Supported: PNG, JPG, WEBP
                </p>
            </div>

            <div className="relative">
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
                <span className="relative z-10 block w-fit mx-auto bg-white px-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Integration
                </span>
            </div>

            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full relative overflow-hidden group p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent"
                style={{ background: 'linear-gradient(135deg, #7D2AE8 0%, #00C4CC 100%)' }}
            >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative flex items-center justify-center text-white">
                    <div className="mr-3 p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.9-2.74 5.06z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-sm">Import from Canva</p>
                        <p className="text-[10px] opacity-90 font-medium">Upload exported design</p>
                    </div>
                </div>
            </button>

            <div className="grid grid-cols-1 gap-3 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Badge Design Engine</p>
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
                                    const src = f.target?.result as string;
                                    addElement({
                                        type: 'image',
                                        src,
                                        name: 'Achievement Badge',
                                        width: 150,
                                        height: 150,
                                        x: 400,
                                        y: 400,
                                        fieldBinding: 'f5' // Standard Badge field
                                    });
                                };
                                reader.readAsDataURL(file);
                            }
                        };
                        input.click();
                    }}
                    className="w-full flex items-center p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                >
                    <div className="p-2 bg-emerald-100 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                        <Award size={20} className="text-emerald-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-800">Upload Achievement Badge</p>
                        <p className="text-[10px] text-slate-500 italic">Auto-binds to dynamic badge field</p>
                    </div>
                </button>

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
                                    useDesignerStore.getState().setCanvasConfig({ backgroundImage: f.target?.result as string });
                                };
                                reader.readAsDataURL(file);
                            }
                        };
                        input.click();
                    }}
                    className="w-full flex items-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                    <div className="p-2 bg-blue-100 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                        <LayoutTemplate size={20} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-800">Set as Background</p>
                        <p className="text-[10px] text-slate-500">Fixed full-page background</p>
                    </div>
                </button>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start space-x-3">
                <Shield className="w-4 h-4 text-emerald-600 mt-0.5" />
                <p className="text-[11px] text-emerald-700 leading-tight">
                    Images are processed locally. Your data stays in your browser.
                </p>
            </div>
        </div>
    );
};

const BrandPanel = () => {
    const { brandKit, updateElement, selectedIds, elements } = useDesignerStore();
    const mockBrandKit = brandKit || {
        id: 'bk1',
        name: 'Antigravity Default',
        colors: ['#3b82f6', '#1e293b', '#64748b', '#f8fafc', '#ffffff', '#000000'],
        fonts: { heading: 'Inter', body: 'Inter', accent: 'Inter' },
        logos: []
    };

    const applyColor = (color: string) => selectedIds.forEach(id => updateElement(id, { fill: color }));
    const applyFont = (fontFamily: string) => selectedIds.forEach(id => {
        const el = elements.find(e => e.id === id);
        if (el?.type === 'text' || el?.type === 'serial') updateElement(id, { fontFamily });
    });

    return (
        <div className="space-y-8">
            <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Brand Colors</h3>
                <div className="grid grid-cols-6 gap-2">
                    {mockBrandKit.colors.map((color, i) => (
                        <button key={i} onClick={() => applyColor(color)} className="w-full aspect-square rounded-lg shadow-sm border border-slate-200 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                    ))}
                </div>
            </section>
            <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Brand Fonts</h3>
                <div className="space-y-2">
                    {Object.entries(mockBrandKit.fonts).map(([key, font]) => (
                        <button key={key} onClick={() => applyFont(font as string)} className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">{key}</p>
                                <p className="text-sm font-black text-slate-800" style={{ fontFamily: font as string }}>{font}</p>
                            </div>
                            <Plus size={14} className="text-slate-300 group-hover:text-blue-600" />
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

const LayersPanel = () => {
    const { elements, selectedIds, selectElement, updateElement } = useDesignerStore();
    const reversedElements = [...elements].reverse();

    return (
        <div className="space-y-1">
            {reversedElements.length === 0 ? (
                <div className="py-10 text-center text-slate-400 italic text-xs">No layers yet</div>
            ) : (
                reversedElements.map((el) => (
                    <div
                        key={el.id}
                        onClick={() => selectElement(el.id)}
                        className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${selectedIds.includes(el.id) ? 'bg-blue-50 border-blue-100 ring-1 ring-blue-100' : 'hover:bg-slate-50 border-transparent'
                            } border`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`p-1.5 rounded-lg ${selectedIds.includes(el.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white transition-colors'}`}>
                                {el.type === 'text' && <Type size={14} />}
                                {el.type === 'rect' && <Shapes size={14} />}
                                {el.type === 'circle' && <Shapes size={14} />}
                                {el.type === 'image' && <ImageIcon size={14} />}
                                {el.type === 'qr' && <Plus size={14} />}
                                {el.type === 'signature' && <Award size={14} />}
                                {el.type === 'serial' && <Shield size={14} />}
                            </div>
                            <div>
                                <p className={`text-[11px] font-black uppercase tracking-tight ${selectedIds.includes(el.id) ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {el.name || el.type}
                                </p>
                                <p className="text-[9px] text-slate-400 font-medium">Layer ID: {el.id.slice(0, 4)}...</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }); }}
                                className={`p-1.5 rounded-md hover:bg-white transition-colors ${el.locked ? 'text-amber-500' : 'text-slate-400'}`}
                            >
                                <Shield size={14} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); updateElement(el.id, { opacity: el.opacity > 0 ? 0 : 1 }); }}
                                className={`p-1.5 rounded-md hover:bg-white transition-colors ${el.opacity === 0 ? 'text-slate-300' : 'text-slate-400'}`}
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export const ToolPanel = () => {
    const { activePanel } = useDesignerStore();

    const renderContent = () => {
        switch (activePanel) {
            case 'templates': return <><Header title="Templates" icon={LayoutTemplate} /><TemplatesPanel /></>;
            case 'elements': return <><Header title="Elements" icon={Shapes} /><ElementsPanel /></>;
            case 'text': return <><Header title="Typography" icon={Type} /><TextPanel /></>;
            case 'fields': return <><Header title="Fields" icon={Database} /><FieldsPanel /></>;
            case 'uploads': return <><Header title="Uploads" icon={ImageIcon} /><UploadsPanel /></>;
            case 'brand': return <><Header title="Brand Kit" icon={Briefcase} /><BrandPanel /></>;
            case 'security': return (
                <>
                    <Header title="Security" icon={Shield} />
                    <div className="space-y-4">
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-tighter mb-1">Integrity Check</p>
                            <p className="text-xs text-emerald-600 font-medium">Hashed credentials enabled</p>
                        </div>
                    </div>
                </>
            );
            case 'governance': return (
                <>
                    <Header title="Governance" icon={Award} />
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-xs font-bold text-blue-800 uppercase tracking-tighter mb-1">Status: Draft</p>
                            <p className="text-xs text-blue-600 font-medium">Author: Admin</p>
                        </div>
                    </div>
                </>
            );
            case 'layers': return <><Header title="Layers" icon={Layers} /><LayersPanel /></>;
            default: return null;
        }
    };

    return <div className="p-5">{renderContent()}</div>;
};
