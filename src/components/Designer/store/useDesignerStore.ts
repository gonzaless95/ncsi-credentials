import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
    DesignerState, DesignerElement, CanvasConfig,
    HistoryState, TemplateGovernance, BrandKit, CanvasSection
} from '../types';

import { loadGoogleFont } from '../utils/fontLoader';

// Default Config
const DEFAULT_CANVAS: CanvasConfig = {
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff',
    zoom: 0.8,
    gridOn: false,
    gridSize: 20,
    showGuides: true,
    safeMargin: 40,
    bleedArea: 5,
    snapToGrid: true,
    unit: 'px',
    dpi: 300,
    designType: 'certificate',
    skills: [],
    earningCriteria: [],
    expiresOn: 'Lifetime'
};

const DEFAULT_BADGE_CANVAS: CanvasConfig = {
    width: 500,
    height: 500,
    backgroundColor: '#ffffff',
    zoom: 1.0,
    gridOn: false,
    gridSize: 20,
    showGuides: true,
    safeMargin: 20,
    bleedArea: 2,
    snapToGrid: true,
    unit: 'px',
    dpi: 300,
    designType: 'badge',
};

const DEFAULT_GOVERNANCE: TemplateGovernance = {
    status: 'draft',
    version: 1,
    isImmutable: false,
    allowDesignerEdits: true
};

const MAX_HISTORY = 50;

interface DesignerActions {
    // Element Actions
    addElement: (element: Partial<DesignerElement>) => void;
    updateElement: (id: string, updates: Partial<DesignerElement>) => void;
    removeElement: (id: string | string[]) => void;
    duplicateElement: () => void;
    moveElement: (id: string, x: number, y: number) => void;

    // Selection
    selectElement: (id: string, multi?: boolean) => void;
    deselectAll: () => void;

    // Canvas & UI
    setZoom: (zoom: number) => void;
    setCanvasConfig: (config: Partial<CanvasConfig>) => void;
    setDesignType: (type: 'certificate' | 'badge') => void;
    setPreviewMode: (mode: 'design' | 'placeholder') => void;
    setActivePanel: (panel: DesignerState['activePanel']) => void;

    // History
    undo: () => void;
    redo: () => void;
    saveToHistory: () => void;

    // Grouping
    groupSelected: () => void;
    ungroupSelected: () => void;

    // Clipboard
    copySelected: () => void;
    pasteSelected: () => void;

    // Layer Management
    bringForward: (id: string) => void;
    sendBackward: (id: string) => void;
    bringToFront: (id: string) => void;
    sendToBack: (id: string) => void;

    // Governance
    setGovernance: (gov: Partial<TemplateGovernance>) => void;
    publishTemplate: () => void;
    createNewVersion: () => void;

    // Utils
    setDragging: (isDragging: boolean) => void;
    loadTemplate: (template: any) => void;
    calculateSnapping: (id: string, x: number, y: number, width: number, height: number) => { x: number, y: number };
    setGuides: (guides: DesignerState['activeGuides']) => void;
    clearGuides: () => void;
    setFieldBinding: (elementId: string, fieldId: string | undefined) => void;

    // Branding & Typography
    setBrandKit: (kit: BrandKit | null) => void;
    setAvailableFonts: (fonts: string[]) => void;
    loadFont: (fontFamily: string) => void;

    // Layout & Sections
    setLayout: (layoutType: 'none' | 'sidebar-left' | 'sidebar-right' | 'logo-tray') => void;
    updateSection: (id: string, updates: Partial<CanvasSection>) => void;

    // Export & Visibility
    toggleBleed: () => void;
    toggleGrid: () => void;
    exportToPDF: (stageRef: any) => Promise<void>;
    setStageRef: (ref: any) => void;
    serializeState: () => any;
}

type Store = DesignerState & DesignerActions;

// Helper to snapshot current state for history (includes governance)
const getSnapshot = (state: DesignerState): HistoryState => ({
    elements: JSON.parse(JSON.stringify(state.elements)), // Deep clone for immutability in stack
    canvas: {
        width: state.canvas.width,
        height: state.canvas.height,
        backgroundColor: state.canvas.backgroundColor,
        backgroundImage: state.canvas.backgroundImage,
        safeMargin: state.canvas.safeMargin,
        bleedArea: state.canvas.bleedArea,
        gridSize: state.canvas.gridSize,
        unit: state.canvas.unit,
        dpi: state.canvas.dpi,
        designType: state.canvas.designType,
        sections: state.canvas.sections ? JSON.parse(JSON.stringify(state.canvas.sections)) : undefined,
        description: state.canvas.description,
        skills: state.canvas.skills ? [...state.canvas.skills] : undefined,
        earningCriteria: state.canvas.earningCriteria ? JSON.parse(JSON.stringify(state.canvas.earningCriteria)) : undefined,
        expiresOn: state.canvas.expiresOn
    },
    selectedIds: [...state.selectedIds]
});

const DEFAULT_FIELDS: any[] = [
    { id: 'f1', label: 'Recipient Name', defaultValue: 'John Doe', category: 'recipient' },
    { id: 'f2', label: 'Issue Date', defaultValue: '2026-01-01', category: 'issue' },
    { id: 'f3', label: 'Credential ID', defaultValue: 'CERT-000-000', category: 'security' },
    { id: 'f4', label: 'Course Name', defaultValue: 'Mastering Antigravity', category: 'recipient' },
    { id: 'f5', label: 'Achievement Badge', defaultValue: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=200&fit=crop', category: 'issue' },
];

const DEFAULT_PLACEHOLDERS: Record<string, string> = {
    f1: 'John Q. Graduate',
    f2: 'September 15, 2026',
    f3: 'CERT-12345-ABCD',
    f4: 'Enterprise Architecture 101',
    f5: 'https://images.unsplash.com/photo-1599056377759-3a3621453f60?w=200&h=200&fit=crop'
};

export const useDesignerStore = create<Store>()(
    persist(
        (set, get) => ({
            // Initial State
            elements: [],
            canvas: DEFAULT_CANVAS,
            selectedIds: [],
            governance: DEFAULT_GOVERNANCE,
            history: {
                past: [],
                future: []
            },
            fields: DEFAULT_FIELDS,
            placeholderData: DEFAULT_PLACEHOLDERS,
            activeGuides: [],
            isDragging: false,
            clipboard: null,
            previewMode: 'design',
            activePanel: 'templates',
            stageRef: null,
            brandKit: null,
            availableFonts: [
                'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald',
                'Source Sans Pro', 'Raleway', 'PT Sans', 'Merriweather', 'Nunito',
                'Playfair Display', 'Mulish', 'Alegreya', 'Ubuntu', 'Roboto Mono',
                'Lora', 'PT Serif', 'Arvo', 'Josefin Sans', 'Quicksand', 'Titillium Web',
                'Kanit', 'Fira Sans', 'Oxygen', 'Hind', 'Bitter', 'Inconsolata',
                'Dosis', 'Anton', 'Josefin Slab', 'Cabin', 'Libre Baskerville',
                'Lobster', 'Pacifico', 'Comfortaa', 'Questrial', 'Exo', 'Archivo',
                'Asap', 'Signika', 'Rubik', 'Catamaran', 'Work Sans', 'Nanum Gothic',
                'Crimson Text', 'Karla', 'Barlow', 'Heebo', 'Overpass',
                'Cormorant Garamond', 'EB Garamond', 'Dancing Script', 'Caveat',
                'Shadows Into Light', 'Indie Flower', 'Amatic SC', 'Permanent Marker',
                'Satisfy', 'Courgette', 'Great Vibes', 'Kaushan Script',
                'DM Sans', 'DM Serif Display', 'Outfit', 'Sora', 'Public Sans',
                'Syne', 'Space Grotesk', 'Lexend', 'Manrope', 'Plus Jakarta Sans',
                'Urbanist', 'Be Vietnam Pro', 'Poppins', 'Bebas Neue', 'Teko',
                'Righteous', 'Pathway Gothic One', 'Abel', 'Archivo Black',
                'Cinzel', 'Spectral', 'Quattrocento', 'Gilda Display',
                'Cardo', 'Crimson Pro', 'Frank Ruhl Libre', 'Old Standard TT',
                'Volkhov', 'Vollkorn', 'Alice', 'Bodoni Moda', 'Playfair Display SC',
                'Prata', 'Rozha One', 'Yeseva One', 'Abril Fatface', 'Bungee',
                'Monoton', 'Ultra', 'Sigmar One', 'Patua One', 'Fredoka One',
                'Luckiest Guy', 'Special Elite', 'Special Elite', 'Creepster',
                'Nosifer', 'Piedra', 'Metal Mania', 'Bangers', 'Chodaba',
                'Press Start 2P', 'VT323', 'Silkscreen', 'DotGothic16',
                'Orbitron', 'Michroma', 'Audiowide', 'Rajdhani', 'Exo 2'
            ],

            // Actions
            setBrandKit: (kit) => set({ brandKit: kit }),
            setAvailableFonts: (fonts) => set({ availableFonts: fonts }),
            setStageRef: (ref) => set({ stageRef: ref }),
            setDesignType: (type) => {
                const preset = type === 'badge' ? DEFAULT_BADGE_CANVAS : DEFAULT_CANVAS;
                set((state) => ({
                    canvas: {
                        ...state.canvas,
                        ...preset,
                        zoom: state.canvas.zoom // Preserve existing zoom? No, reset for better view
                    }
                }));
                get().saveToHistory();
            },

            loadFont: (fontFamily: string) => {
                loadGoogleFont(fontFamily);
                const state = get();
                if (!state.availableFonts.includes(fontFamily)) {
                    set({ availableFonts: [...state.availableFonts, fontFamily] });
                }
            },

            setLayout: (layoutType) => {
                let sections: CanvasSection[] = [];
                if (layoutType === 'sidebar-left') {
                    sections = [
                        { id: 'sidebar', name: 'Left Sidebar', x: 0, y: 0, width: 25, height: 100, backgroundColor: '#f8fafc', opacity: 1 },
                        { id: 'main', name: 'Main Area', x: 25, y: 0, width: 75, height: 100, backgroundColor: '#ffffff', opacity: 1 }
                    ];
                } else if (layoutType === 'sidebar-right') {
                    sections = [
                        { id: 'main', name: 'Main Area', x: 0, y: 0, width: 75, height: 100, backgroundColor: '#ffffff', opacity: 1 },
                        { id: 'sidebar', name: 'Right Sidebar', x: 75, y: 0, width: 25, height: 100, backgroundColor: '#f8fafc', opacity: 1 }
                    ];
                } else if (layoutType === 'logo-tray') {
                    sections = [
                        { id: 'tray', name: 'Logo Tray', x: 0, y: 0, width: 100, height: 20, backgroundColor: '#f1f5f9', opacity: 1 },
                        { id: 'main', name: 'Content Area', x: 0, y: 20, width: 100, height: 80, backgroundColor: '#ffffff', opacity: 1 }
                    ];
                }

                set((state) => ({
                    canvas: { ...state.canvas, sections }
                }));
                get().saveToHistory();
            },

            updateSection: (id, updates) => {
                const state = get();
                if (!state.canvas.sections) return;

                set((state) => ({
                    canvas: {
                        ...state.canvas,
                        sections: state.canvas.sections?.map(s => s.id === id ? { ...s, ...updates } : s)
                    }
                }));
                get().saveToHistory();
            },

            toggleBleed: () => set((state) => ({
                canvas: { ...state.canvas, showBleed: !state.canvas.showBleed }
            })),

            toggleGrid: () => set((state) => ({
                canvas: { ...state.canvas, gridOn: !state.canvas.gridOn }
            })),

            exportToPDF: async (stageRef) => {
                if (!stageRef) return;

                const { jsPDF } = await import('jspdf');
                const state = get();
                const { width, height, unit } = state.canvas;

                // Create high-res data URL (3x scale)
                const dataUrl = stageRef.toDataURL({ pixelRatio: 3 });

                // Initialize PDF (matching canvas size and unit)
                const pdf = new jsPDF({
                    orientation: width > height ? 'landscape' : 'portrait',
                    unit: unit === 'px' ? 'pt' : unit, // PDF units are pt by default for digital
                    format: [width, height]
                });

                pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
                pdf.save(`certificate-${state.brandKit?.name || 'design'}.pdf`);
            },

            setFieldBinding: (elementId, fieldId) => {
                const state = get();
                if (state.governance.isImmutable) return;

                set((state) => ({
                    elements: state.elements.map(el =>
                        el.id === elementId ? { ...el, fieldBinding: fieldId } : el
                    )
                }));
                get().saveToHistory();
            },
            setGuides: (guides) => set({ activeGuides: guides }),
            clearGuides: () => set({ activeGuides: [] }),

            addElement: (partial) => {
                const state = get();
                if (state.governance.isImmutable) return;

                const id = partial.id || uuidv4();
                const now = Date.now();

                const defaults = {
                    x: 100,
                    y: 100,
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1,
                    width: 200,
                    height: 100,
                    opacity: 1,
                    draggable: true,
                    locked: false,
                    visible: true,
                    type: 'text',
                    createdAt: now,
                    updatedAt: now,
                    version: 1
                };

                const newElement = { ...defaults, ...partial, id } as DesignerElement;

                set((state) => {
                    const newHistory = [...state.history.past, getSnapshot(state)].slice(-MAX_HISTORY);
                    return {
                        elements: [...state.elements, newElement],
                        selectedIds: [id],
                        history: {
                            past: newHistory,
                            future: []
                        }
                    };
                });
            },

            updateElement: (id, updates) => {
                const state = get();
                if (state.governance.isImmutable) return;

                set((state) => ({
                    elements: state.elements.map((el) => {
                        if (el.id === id) {
                            return { ...el, ...updates, updatedAt: Date.now() } as DesignerElement;
                        }
                        return el;
                    })
                }));
            },

            removeElement: (target) => {
                const state = get();
                if (state.governance.isImmutable) return;

                const idsToRemove = Array.isArray(target) ? target : [target];

                set((state) => {
                    const newHistory = [...state.history.past, getSnapshot(state)].slice(-MAX_HISTORY);
                    return {
                        elements: state.elements.filter(e => !idsToRemove.includes(e.id)),
                        selectedIds: state.selectedIds.filter(sid => !idsToRemove.includes(sid)),
                        history: { past: newHistory, future: [] }
                    };
                });
            },

            duplicateElement: () => {
                const state = get();
                if (state.governance.isImmutable) return;

                set((state) => {
                    const selected = state.elements.filter(e => state.selectedIds.includes(e.id));
                    if (selected.length === 0) return state;

                    const newHistory = [...state.history.past, getSnapshot(state)].slice(-MAX_HISTORY);
                    const newElements: DesignerElement[] = [];
                    const newIds: string[] = [];
                    const now = Date.now();

                    selected.forEach(el => {
                        const id = uuidv4();
                        newElements.push({
                            ...JSON.parse(JSON.stringify(el)),
                            id,
                            x: el.x + 20,
                            y: el.y + 20,
                            createdAt: now,
                            updatedAt: now
                        });
                        newIds.push(id);
                    });

                    return {
                        elements: [...state.elements, ...newElements],
                        selectedIds: newIds,
                        history: { past: newHistory, future: [] }
                    };
                });
            },

            moveElement: (id, x, y) => {
                set((state) => ({
                    elements: state.elements.map(el => el.id === id ? { ...el, x, y, updatedAt: Date.now() } : el)
                }));
            },

            selectElement: (id, multi = false) => {
                set((state) => {
                    if (multi) {
                        const alreadySelected = state.selectedIds.includes(id);
                        return {
                            selectedIds: alreadySelected
                                ? state.selectedIds.filter(sid => sid !== id)
                                : [...state.selectedIds, id]
                        };
                    }
                    return { selectedIds: [id] };
                });
            },

            deselectAll: () => set({ selectedIds: [] }),

            setZoom: (zoom) => set((state) => ({ canvas: { ...state.canvas, zoom } })),

            setCanvasConfig: (config) => {
                const state = get();
                if (state.governance.isImmutable) return;
                set((state) => ({ canvas: { ...state.canvas, ...config } }));
            },

            setPreviewMode: (previewMode) => set({ previewMode }),
            setActivePanel: (activePanel) => set({ activePanel }),

            saveToHistory: () => {
                try {
                    const state = get();
                    const snapshot = getSnapshot(state);
                    set((state) => ({
                        history: {
                            past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
                            future: []
                        }
                    }));
                } catch (err) {
                    console.error("Failed to save to history:", err);
                }
            },

            undo: () => {
                set((state) => {
                    if (state.history.past.length === 0) return state;
                    const newPast = [...state.history.past];
                    const previousState = newPast.pop()!;
                    const currentSnapshot = getSnapshot(state);

                    return {
                        elements: previousState.elements,
                        canvas: { ...state.canvas, ...previousState.canvas },
                        selectedIds: previousState.selectedIds,
                        history: {
                            past: newPast,
                            future: [currentSnapshot, ...state.history.future].slice(0, MAX_HISTORY)
                        }
                    };
                });
            },

            redo: () => {
                set((state) => {
                    if (state.history.future.length === 0) return state;
                    const newFuture = [...state.history.future];
                    const nextState = newFuture.shift()!;
                    const currentSnapshot = getSnapshot(state);

                    return {
                        elements: nextState.elements,
                        canvas: { ...state.canvas, ...nextState.canvas },
                        selectedIds: nextState.selectedIds,
                        history: {
                            past: [...state.history.past, currentSnapshot].slice(-MAX_HISTORY),
                            future: newFuture
                        }
                    };
                });
            },

            groupSelected: () => {
                const state = get();
                if (state.governance.isImmutable || state.selectedIds.length < 2) return;

                const groupId = uuidv4();

                // For simplified grouping, we'll just tag them with parentId for now
                // Real grouping would calculate a bounding box for the group element
                set((state) => {
                    const newHistory = [...state.history.past, getSnapshot(state)].slice(-MAX_HISTORY);
                    return {
                        elements: state.elements.map(el =>
                            state.selectedIds.includes(el.id) ? { ...el, parentId: groupId } : el
                        ),
                        history: { past: newHistory, future: [] }
                    };
                });
            },

            ungroupSelected: () => {
                const state = get();
                if (state.governance.isImmutable) return;

                set((state) => {
                    const newHistory = [...state.history.past, getSnapshot(state)].slice(-MAX_HISTORY);
                    return {
                        elements: state.elements.map(el => {
                            // Find elements whose parent is selected? 
                            // Simplified: if selected element has children, ungroup
                            if (state.selectedIds.includes(el.parentId || '')) {
                                return { ...el, parentId: undefined };
                            }
                            return el;
                        }),
                        history: { past: newHistory, future: [] }
                    };
                });
            },

            copySelected: () => {
                const state = get();
                const selected = state.elements.filter(e => state.selectedIds.includes(e.id));
                if (selected.length > 0) {
                    set({ clipboard: JSON.parse(JSON.stringify(selected)) });
                }
            },

            pasteSelected: () => {
                const state = get();
                if (state.governance.isImmutable || !state.clipboard) return;

                const now = Date.now();
                const newElements = state.clipboard.map(el => ({
                    ...el,
                    id: uuidv4(),
                    x: el.x + 40,
                    y: el.y + 40,
                    createdAt: now,
                    updatedAt: now
                }));

                set((state) => {
                    const newHistory = [...state.history.past, getSnapshot(state)].slice(-MAX_HISTORY);
                    return {
                        elements: [...state.elements, ...newElements],
                        selectedIds: newElements.map(e => e.id),
                        history: { past: newHistory, future: [] }
                    };
                });
            },

            bringForward: (id) => {
                set((state) => {
                    const index = state.elements.findIndex(el => el.id === id);
                    if (index === -1 || index === state.elements.length - 1) return state;
                    const newElements = [...state.elements];
                    [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
                    return { elements: newElements };
                });
            },

            sendBackward: (id) => {
                set((state) => {
                    const index = state.elements.findIndex(el => el.id === id);
                    if (index <= 0) return state;
                    const newElements = [...state.elements];
                    [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
                    return { elements: newElements };
                });
            },

            bringToFront: (id) => {
                set((state) => {
                    const element = state.elements.find(el => el.id === id);
                    if (!element) return state;
                    return {
                        elements: [...state.elements.filter(el => el.id !== id), element]
                    };
                });
            },

            sendToBack: (id) => {
                set((state) => {
                    const element = state.elements.find(el => el.id === id);
                    if (!element) return state;
                    return {
                        elements: [element, ...state.elements.filter(el => el.id !== id)]
                    };
                });
            },

            setGovernance: (gov) => set((state) => ({
                governance: { ...state.governance, ...gov }
            })),

            publishTemplate: () => {
                set((state) => ({
                    governance: { ...state.governance, status: 'published', isImmutable: true }
                }));
            },

            createNewVersion: () => {
                set((state) => ({
                    governance: {
                        ...state.governance,
                        status: 'draft',
                        isImmutable: false,
                        version: state.governance.version + 1
                    }
                }));
            },

            setDragging: (isDragging) => set({ isDragging }),

            loadTemplate: (template) => {
                if (!template) return;

                // Hydrate fonts used in the template
                if (template.elements) {
                    const fontsToLoad = new Set<string>();
                    template.elements.forEach((el: any) => {
                        if (el.fontFamily) fontsToLoad.add(el.fontFamily);
                    });
                    fontsToLoad.forEach(font => loadGoogleFont(font));
                }

                set({
                    elements: template.elements || [],
                    canvas: { ...DEFAULT_CANVAS, ...template.canvas },
                    governance: { ...DEFAULT_GOVERNANCE, ...template.governance },
                    selectedIds: [],
                    history: { past: [], future: [] },
                    previewMode: 'design'
                });
            },

            calculateSnapping: (id: string, x: number, y: number, width: number, height: number) => {
                const { elements, canvas } = get();
                const threshold = 5;
                const guides: any[] = [];
                let snappedX = x;
                let snappedY = y;

                const others = elements.filter(el => el.id !== id);

                // Vertical Snapping Points (Horizontal Alignment)
                const vPoints = [
                    { pos: 0, origin: 'canvas' },
                    { pos: canvas.width / 2, origin: 'canvas' },
                    { pos: canvas.width, origin: 'canvas' }
                ];

                others.forEach(el => {
                    vPoints.push({ pos: el.x, origin: 'element' });
                    vPoints.push({ pos: el.x + el.width / 2, origin: 'element' });
                    vPoints.push({ pos: el.x + el.width, origin: 'element' });
                });

                // Horizontal Snapping Points (Vertical Alignment)
                const hPoints = [
                    { pos: 0, origin: 'canvas' },
                    { pos: canvas.height / 2, origin: 'canvas' },
                    { pos: canvas.height, origin: 'canvas' }
                ];

                others.forEach(el => {
                    hPoints.push({ pos: el.y, origin: 'element' });
                    hPoints.push({ pos: el.y + el.height / 2, origin: 'element' });
                    hPoints.push({ pos: el.y + el.height, origin: 'element' });
                });

                // Check X
                const myXPoints = [x, x + width / 2, x + width];
                let foundX = false;
                for (const p of vPoints) {
                    for (const myP of myXPoints) {
                        if (Math.abs(p.pos - myP) < threshold) {
                            if (myP === x) snappedX = p.pos;
                            else if (myP === x + width / 2) snappedX = p.pos - width / 2;
                            else snappedX = p.pos - width;

                            guides.push({ type: 'vertical', position: p.pos, orientation: 'v' });
                            foundX = true;
                            break;
                        }
                    }
                    if (foundX) break;
                }

                // Check Y
                const myYPoints = [y, y + height / 2, y + height];
                let foundY = false;
                for (const p of hPoints) {
                    for (const myP of myYPoints) {
                        if (Math.abs(p.pos - myP) < threshold) {
                            if (myP === y) snappedY = p.pos;
                            else if (myP === y + height / 2) snappedY = p.pos - height / 2;
                            else snappedY = p.pos - height;

                            guides.push({ type: 'horizontal', position: p.pos, orientation: 'h' });
                            foundY = true;
                            break;
                        }
                    }
                    if (foundY) break;
                }

                set({ activeGuides: guides });
                return { x: snappedX, y: snappedY };
            },

            serializeState: () => {
                const state = get();
                return {
                    elements: state.elements,
                    canvas: state.canvas,
                    governance: state.governance,
                    fields: state.fields,
                    brandKit: state.brandKit,
                };
            },
        }),
        {
            name: 'designer-enterprise-storage-v1',
            partialize: (state) => ({
                elements: state.elements,
                canvas: state.canvas,
                governance: state.governance,
                // history: state.history, // Don't persist history to save space
                fields: state.fields,
                placeholderData: state.placeholderData,
                brandKit: state.brandKit,
                // availableFonts: state.availableFonts, // Removed from persistence to ensure update
            }),
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    return str ? JSON.parse(str) : null;
                },
                setItem: (name, value) => {
                    try {
                        localStorage.setItem(name, JSON.stringify(value));
                    } catch (e) {
                        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
                            console.error('Storage quota exceeded. Clearing history or older data might help.');
                            // Optional: Clear storage or handle degradation
                        }
                    }
                },
                removeItem: (name) => localStorage.removeItem(name),
            }
        }
    )
);
