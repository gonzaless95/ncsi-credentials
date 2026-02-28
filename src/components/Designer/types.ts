// Enterprise Designer Types

export type ElementType = 'text' | 'image' | 'rect' | 'circle' | 'line' | 'group' | 'qr' | 'serial' | 'signature' | 'hexagon';

export interface GradientColor {
    type: 'linear' | 'radial';
    stops: { offset: number; color: string }[];
    rotation?: number;
}

export interface ShadowConfig {
    color: string;
    blur: number;
    offset: { x: number; y: number };
    opacity: number;
}

export interface DynamicField {
    id: string;
    label: string;
    defaultValue: string;
    category?: 'recipient' | 'issue' | 'security' | 'custom';
}

export interface BaseElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    width: number;
    height: number;
    opacity: number;
    draggable: boolean;
    locked: boolean;
    visible: boolean;
    parentId?: string; // For groups
    name?: string; // For layer panel
    fill?: string | GradientColor; // Moved from TextElement/ShapeElement
    stroke?: string; // Moved from TextElement/ShapeElement
    strokeWidth?: number; // Moved from TextElement/ShapeElement

    // Data Binding
    fieldBinding?: string; // ID of the DynamicField

    // Integrity & Governance
    isLockedZone?: boolean; // Protected by issuer
    version?: number;
    createdAt: number;
    updatedAt: number;

    // Advanced Effects
    shadow?: ShadowConfig;
    blendMode?: string;
}

export interface TextElement extends BaseElement {
    type: 'text';
    content: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string | number;
    fontStyle: string; // normal, italic
    textDecoration: string; // none, underline, line-through
    fill: string | GradientColor;
    align: 'left' | 'center' | 'right' | 'justify';
    letterSpacing: number;
    lineHeight: number;
    textTransform?: 'none' | 'uppercase' | 'lowercase';
    stroke?: string;
    strokeWidth?: number;

    // Dynamic Binding
    dynamicBinding?: {
        field: string;
        fallback: string;
        required: boolean;
    };
}

export interface ImageElement extends BaseElement {
    type: 'image';
    src: string;
    originalWidth?: number;
    originalHeight?: number;
    borderRadius?: number;
    stroke?: string;
    strokeWidth?: number;
    crossOrigin?: 'anonymous' | 'use-credentials';
    isWatermark?: boolean;
}

export interface ShapeElement extends BaseElement {
    type: 'rect' | 'circle' | 'hexagon';
    fill: string | GradientColor;
    stroke: string;
    strokeWidth: number;
    cornerRadius?: number; // For rect
}

export interface LineElement extends BaseElement {
    type: 'line';
    points: number[];
    stroke: string;
    strokeWidth: number;
    dash?: number[];
    lineCap?: 'butt' | 'round' | 'square';
}

export interface QrElement extends BaseElement {
    type: 'qr';
    content: string; // Dynamic binding usually: {{verification_url}}
    color: string;
    backgroundColor: string;
    size: number;
    isValidated?: boolean;
}

export interface SerialElement extends BaseElement {
    type: 'serial';
    content: string; // The rendered preview string
    format: string; // e.g. "ORG-{{YEAR}}-{{CODE}}"
    fontWeight: string | number;
    fontSize: number;
    fill: string;
    fontFamily: string;
}

export interface SignatureElement extends BaseElement {
    type: 'signature';
    signerName: string;
    signerRole: string;
    imageSrc?: string;
}

export interface GroupElement extends BaseElement {
    type: 'group';
    children: string[]; // IDs of children
}

export type DesignerElement =
    | TextElement
    | ImageElement
    | ShapeElement
    | LineElement
    | QrElement
    | SerialElement
    | SignatureElement
    | GroupElement;

export interface CanvasConfig {
    width: number;
    height: number;
    backgroundColor: string;
    backgroundImage?: string;
    zoom: number;
    gridOn: boolean;
    gridSize: number;
    showGuides: boolean;
    safeMargin: number;
    bleedArea: number;
    showBleed?: boolean;
    snapToGrid: boolean;

    // Professional Settings
    unit: 'px' | 'mm' | 'in';
    dpi: number;
    designType: 'certificate' | 'badge';
    sections?: CanvasSection[];

    // Technical Metadata (Professional Grade)
    description?: string;
    skills?: string[];
    earningCriteria?: { id: string; type: string; label: string; description: string }[];
    issuedOn?: string;
    expiresOn?: string;
}

export interface CanvasSection {
    id: string;
    name: string;
    x: number; // 0-100 percentage
    y: number; // 0-100 percentage
    width: number; // 0-100 percentage
    height: number; // 0-100 percentage
    backgroundColor?: string;
    backgroundImage?: string;
    opacity: number;
}

export interface TemplateGovernance {
    status: 'draft' | 'published' | 'archived';
    version: number;
    isImmutable: boolean;
    lockedBy?: string;
    allowDesignerEdits: boolean;
}

export interface HistoryState {
    elements: DesignerElement[];
    canvas: Omit<CanvasConfig, 'zoom' | 'gridOn' | 'showGuides' | 'snapToGrid'>;
    selectedIds: string[];
}

export interface Guide {
    type: 'vertical' | 'horizontal';
    position: number;
    orientation: 'v' | 'h';
}

export interface BrandKit {
    id: string;
    name: string;
    colors: string[];
    fonts: {
        heading?: string;
        body?: string;
        accent?: string;
    };
    logos: string[];
}

export interface DesignerState {
    elements: DesignerElement[];
    canvas: CanvasConfig;
    selectedIds: string[];
    governance: TemplateGovernance;
    history: {
        past: HistoryState[];
        future: HistoryState[];
    };

    // UI State
    activeGuides: Guide[];
    isDragging: boolean;
    clipboard: DesignerElement[] | null;

    // Dynamic Data
    fields: DynamicField[];
    placeholderData: Record<string, string>;

    // Branding & Typography
    brandKit: BrandKit | null;
    availableFonts: string[];

    previewMode: 'design' | 'placeholder';
    activePanel: 'templates' | 'elements' | 'text' | 'uploads' | 'brand' | 'layers' | 'security' | 'governance' | 'fields';
    stageRef: any;
}
