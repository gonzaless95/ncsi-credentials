import { DesignerElement } from '../types';

const createTemplate = (id: string, name: string, bg: string, elements: Partial<DesignerElement>[]) => {
    const now = Date.now();
    const defaults = {
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        draggable: true,
        locked: false,
        visible: true,
        createdAt: now,
        updatedAt: now,
        version: 1
    };

    return {
        id,
        name,
        canvas: {
            width: 1200,
            height: 900,
            background: bg,
        },
        elements: elements.map(el => ({ ...defaults, ...el }))
    };
};

export const SAMPLE_TEMPLATES = [
    // 1. NCSI COHPA (Improved Professional Design)
    createTemplate('ncsi-cohpa', 'NCSI COHPA (Professional)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#1a0508', locked: true },
        { id: 'sb-pattern', type: 'image', x: 0, y: 0, width: 340, height: 900, src: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&h=900&fit=crop', opacity: 0.15, locked: true },
        { id: 'logo-mark', type: 'text', x: 20, y: 80, content: '🛡️', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'logo-text', type: 'text', x: 20, y: 750, content: 'NCSI™', fontSize: 90, fontFamily: 'serif', fill: '#ffffff', width: 300, align: 'center', fontWeight: 'bold' },

        { id: 'ack', type: 'text', x: 400, y: 60, content: 'This is to acknowledge', fontSize: 36, fontFamily: 'Inter', fill: '#555555', width: 760, align: 'center' },
        { id: 'div', type: 'rect', x: 450, y: 160, width: 660, height: 4, fill: '#bbbbbb' },

        { id: 'cand-text', type: 'text', x: 400, y: 200, content: "If candidate's, was titled as an", fontSize: 28, fontFamily: 'Inter', fill: '#444444', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'title-acron', type: 'text', x: 400, y: 260, content: 'COHPA', fontSize: 120, fontFamily: 'DM Sans', fill: '#c0392b', width: 760, align: 'center', fontWeight: 900, letterSpacing: -2 },
        { id: 'title-full', type: 'text', x: 400, y: 400, content: 'Certified Offensive Hacking Professional – Applied', fontSize: 32, fontFamily: 'DM Sans', fill: '#333333', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'success', type: 'text', x: 400, y: 480, content: 'and successfully completed all requirements and criteria\nfor said certification through examination administered by NCSI', fontSize: 22, fontFamily: 'DM Sans', fill: '#666666', width: 760, align: 'center', lineHeight: 1.6 },
        { id: 'awarded-on', type: 'text', x: 400, y: 620, content: 'This certification was awarded on', fontSize: 24, fontFamily: 'DM Sans', fill: '#555555', width: 760, align: 'center' },
        { id: 'date-field', type: 'text', x: 400, y: 680, content: '{{issue_date}}', fontSize: 32, fontFamily: 'DM Sans', fill: '#111111', width: 760, align: 'center', fontWeight: 'bold', fieldBinding: 'f2' },
        { id: 'qr', type: 'qr', x: 400, y: 760, width: 120, height: 120, content: 'https://ncsi.institute/verify/{{certificate_id}}' },
    ]),

    // 2. NCSI CRTA (Red/Dark Red Design)
    createTemplate('ncsi-crta', 'NCSI CRTA (Red Arch)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#1a0508', locked: true },
        { id: 'sb-pattern', type: 'image', x: 0, y: 0, width: 340, height: 900, src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=900&fit=crop', opacity: 0.2, locked: true },
        { id: 'logo-mark', type: 'text', x: 20, y: 80, content: '🐻', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'logo-text', type: 'text', x: 20, y: 750, content: 'NCSI™', fontSize: 90, fontFamily: 'serif', fill: '#ffffff', width: 300, align: 'center', fontWeight: 'bold' },

        { id: 'ack', type: 'text', x: 400, y: 60, content: 'This is to acknowledge', fontSize: 36, fontFamily: 'Inter', fill: '#555555', width: 760, align: 'center' },
        { id: 'name', type: 'text', x: 400, y: 120, content: '{{recipient_name}}', fontSize: 48, fill: '#111111', width: 760, align: 'center', fontWeight: 'bold', fieldBinding: 'f1' },

        { id: 'cand-text', type: 'text', x: 400, y: 200, content: "If candidate's, was titled as an", fontSize: 28, fontFamily: 'Inter', fill: '#444444', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'title-acron', type: 'text', x: 400, y: 260, content: 'CRTA', fontSize: 120, fontFamily: 'DM Sans', fill: '#800000', width: 760, align: 'center', fontWeight: 900, letterSpacing: -2 },
        { id: 'title-full', type: 'text', x: 400, y: 400, content: 'Certified Red Team Archtitech', fontSize: 32, fontFamily: 'DM Sans', fill: '#333333', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'awarded-on', type: 'text', x: 400, y: 620, content: 'This certification was awarded on', fontSize: 24, fontFamily: 'DM Sans', fill: '#555555', width: 760, align: 'center' },
        { id: 'date-field', type: 'text', x: 400, y: 680, content: '{{issue_date}}', fontSize: 32, fontFamily: 'DM Sans', fill: '#111111', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'qr', type: 'qr', x: 400, y: 760, width: 120, height: 120, content: 'https://ncsi.institute/verify/{{certificate_id}}' },
    ]),

    // 3. NCSI CSCR (Blue Design)
    createTemplate('ncsi-cscr', 'NCSI CSCR (Blue Source)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#0a192f', locked: true },
        { id: 'sb-pattern', type: 'image', x: 0, y: 0, width: 340, height: 900, src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=900&fit=crop', opacity: 0.25, locked: true },
        { id: 'logo-mark', type: 'text', x: 20, y: 80, content: '🦅', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'logo-text', type: 'text', x: 20, y: 750, content: 'NCSI™', fontSize: 90, fontFamily: 'serif', fill: '#ffffff', width: 300, align: 'center', fontWeight: 'bold' },

        { id: 'ack', type: 'text', x: 400, y: 60, content: 'This is to acknowledge', fontSize: 36, fontFamily: 'Inter', fill: '#555555', width: 760, align: 'center' },
        { id: 'name', type: 'text', x: 400, y: 120, content: 'Caner T', fontSize: 48, fill: '#111111', width: 760, align: 'center', fontWeight: 'bold' },

        { id: 'cand-text', type: 'text', x: 400, y: 200, content: "If candidate's, was titled as an", fontSize: 28, fontFamily: 'Inter', fill: '#444444', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'title-acron', type: 'text', x: 400, y: 260, content: 'CSCR', fontSize: 120, fontFamily: 'DM Sans', fill: '#00b4d8', width: 760, align: 'center', fontWeight: 900, letterSpacing: -2 },
        { id: 'title-full', type: 'text', x: 400, y: 400, content: 'Certified Source Code Review', fontSize: 32, fontFamily: 'DM Sans', fill: '#333333', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'awarded-on', type: 'text', x: 400, y: 620, content: 'This certification was awarded on', fontSize: 24, fontFamily: 'DM Sans', fill: '#555555', width: 760, align: 'center' },
        { id: 'date-field', type: 'text', x: 400, y: 680, content: '{{issue_date}}', fontSize: 32, fontFamily: 'DM Sans', fill: '#111111', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'qr', type: 'qr', x: 400, y: 760, width: 120, height: 120, content: 'https://ncsi.institute/verify/{{certificate_id}}' },
    ]),

    // 2. Corporate Blue (Navy/Gold)
    createTemplate('corp-blue', 'Corporate Blue', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 360, height: 900, fill: '#0f172a', locked: true }, // Slate 900
        { id: 'sb-acc', type: 'rect', x: 40, y: 40, width: 280, height: 820, stroke: '#fbbf24', strokeWidth: 2, fill: 'transparent', locked: true }, // Amber 400
        { id: 'logo', type: 'text', x: 80, y: 100, content: 'LOGO', fontSize: 24, fill: '#ffffff', width: 200, align: 'center' },
        { id: 'org', type: 'text', x: 40, y: 700, content: 'SECURITY', fontSize: 60, fontFamily: 'sans-serif', fill: '#fbbf24', width: 300, align: 'center', fontWeight: 'bold' },
        { id: 'ack', type: 'text', x: 400, y: 100, content: 'CERTIFICATE OF ACHIEVEMENT', fontSize: 48, fontFamily: 'serif', fill: '#0f172a', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'div', type: 'rect', x: 580, y: 180, width: 400, height: 2, fill: '#fbbf24' },
        { id: 'pres', type: 'text', x: 400, y: 220, content: 'PRESENTED TO', fontSize: 24, fontFamily: 'sans-serif', fill: '#64748b', width: 760, align: 'center', letterSpacing: 4 },
        { id: 'name', type: 'text', x: 400, y: 280, content: '{{recipient.name}}', fontSize: 72, fontFamily: 'serif', fill: '#0f172a', width: 760, align: 'center', fontStyle: 'italic' },
        { id: 'desc', type: 'text', x: 450, y: 420, content: 'For demonstrating excellence in Advanced Network Defense\nand securing enterprise infrastructure.', fontSize: 24, fontFamily: 'sans-serif', fill: '#475569', width: 660, align: 'center', lineHeight: 1.6 },
        { id: 'sig1', type: 'rect', x: 450, y: 700, width: 250, height: 1, fill: '#0f172a' },
        { id: 'sig1t', type: 'text', x: 450, y: 710, content: 'Director', fontSize: 16, fill: '#64748b', width: 250, align: 'center' },
        { id: 'badge', type: 'circle', x: 1000, y: 700, width: 120, height: 120, fill: '#fbbf24', opacity: 0.2 },
        { id: 'badge2', type: 'circle', x: 1000, y: 700, width: 100, height: 100, stroke: '#fbbf24', strokeWidth: 4 }
    ]),

    // 3. Executive Green (Emerald/Slate)
    createTemplate('exec-green', 'Executive Green', '#f0fdf4', [
        { id: 'top-bar', type: 'rect', x: 0, y: 0, width: 1200, height: 150, fill: '#065f46', locked: true }, // Emerald 800
        { id: 'btm-bar', type: 'rect', x: 0, y: 850, width: 1200, height: 50, fill: '#065f46', locked: true },
        { id: 'title', type: 'text', x: 100, y: 50, content: 'CERTIFICATE OF EXCELLENCE', fontSize: 48, fill: '#ffffff', width: 1000, align: 'center', fontWeight: 'bold' },
        { id: 'border', type: 'rect', x: 50, y: 180, width: 1100, height: 640, stroke: '#065f46', strokeWidth: 2, fill: 'transparent' },
        { id: 'name', type: 'text', x: 100, y: 350, content: '{{recipient.name}}', fontSize: 80, fontFamily: 'serif', fill: '#064e3b', width: 1000, align: 'center', fontStyle: 'italic' },
        { id: 'body', type: 'text', x: 200, y: 500, content: 'Has successfully completed the Executive Cybersecurity Leadership Program', fontSize: 28, fill: '#374151', width: 800, align: 'center' },
        { id: 'badge', type: 'circle', x: 600, y: 650, width: 100, height: 100, fill: '#059669', opacity: 0.8 },
        { id: 'star', type: 'text', x: 575, y: 635, content: '★', fontSize: 60, fill: '#ffffff' }
    ]),

    // 4. Royal Purple (Amethyst/Gold)
    createTemplate('royal-purple', 'Royal Purple', '#faf5ff', [
        { id: 'l-bar', type: 'rect', x: 0, y: 0, width: 100, height: 900, fill: '#581c87', locked: true },
        { id: 'r-bar', type: 'rect', x: 1100, y: 0, width: 100, height: 900, fill: '#581c87', locked: true },
        { id: 'title', type: 'text', x: 100, y: 150, content: 'DIPLOMA', fontSize: 120, fontFamily: 'serif', fill: '#581c87', width: 1000, align: 'center', fontWeight: 'bold', letterSpacing: 10 },
        { id: 'sub', type: 'text', x: 100, y: 280, content: 'OF CERTIFICATION', fontSize: 24, fill: '#a855f7', width: 1000, align: 'center', letterSpacing: 5 },
        { id: 'name', type: 'text', x: 100, y: 400, content: '{{recipient.name}}', fontSize: 64, fill: '#1e1b4b', width: 1000, align: 'center' },
        { id: 'line', type: 'rect', x: 400, y: 500, width: 400, height: 2, fill: '#eab308' }, // Yellow 500
        { id: 'badge', type: 'circle', x: 600, y: 700, width: 80, height: 80, fill: 'transparent', stroke: '#eab308', strokeWidth: 4 },
        { id: 'badge2', type: 'circle', x: 600, y: 700, width: 60, height: 60, fill: '#581c87' }
    ]),

    // 5. Crimson Guard (Red/Black)
    createTemplate('crimson-guard', 'Crimson Guard', '#000000', [
        { id: 'glow', type: 'circle', x: 600, y: 450, width: 400, height: 400, fill: '#7f1d1d', opacity: 0.3 },
        { id: 'border', type: 'rect', x: 50, y: 50, width: 1100, height: 800, stroke: '#ef4444', strokeWidth: 4 },
        { id: 'title', type: 'text', x: 0, y: 150, content: 'CODE RED', fontSize: 100, fontFamily: 'Impact', fill: '#ef4444', width: 1200, align: 'center' },
        { id: 'sub', type: 'text', x: 0, y: 260, content: 'SECURITY CLEARANCE GRANTED', fontSize: 32, fontFamily: 'monospace', fill: '#ffffff', width: 1200, align: 'center', letterSpacing: 2 },
        { id: 'name', type: 'text', x: 0, y: 450, content: '{{recipient.name}}', fontSize: 72, fontFamily: 'monospace', fill: '#ffffff', width: 1200, align: 'center', fontWeight: 'bold' },
        { id: 'box', type: 'rect', x: 400, y: 700, width: 400, height: 100, stroke: '#ef4444', strokeWidth: 2 },
        { id: 'verify', type: 'text', x: 400, y: 735, content: 'VERIFIED', fontSize: 32, fontFamily: 'monospace', fill: '#ef4444', width: 400, align: 'center' }
    ]),

    // 6. Slate Monochrome (Modern/Clean)
    createTemplate('slate-mono', 'Slate Monochrome', '#e2e8f0', [
        { id: 'bg', type: 'rect', x: 0, y: 0, width: 600, height: 900, fill: '#f1f5f9' },
        { id: 'line', type: 'rect', x: 600, y: 100, width: 2, height: 700, fill: '#94a3b8' },
        { id: 'title', type: 'text', x: 50, y: 300, content: 'CERTIFIED', fontSize: 80, fontFamily: 'sans-serif', fill: '#0f172a', width: 500, align: 'right', fontWeight: 'bold' },
        { id: 'sub', type: 'text', x: 50, y: 400, content: 'PROFESSIONAL', fontSize: 80, fontFamily: 'sans-serif', fill: '#94a3b8', width: 500, align: 'right', fontWeight: 'bold' },
        { id: 'name', type: 'text', x: 650, y: 350, content: '{{recipient.name}}', fontSize: 48, fill: '#0f172a', width: 500, align: 'left' },
        { id: 'desc', type: 'text', x: 650, y: 450, content: 'Full Stack Development\nMastery Course', fontSize: 24, fill: '#475569', width: 500, align: 'left' }
    ]),

    // 7. Golden Luxe (Black/Gold)
    createTemplate('golden-luxe', 'Golden Luxe', '#18181b', [
        { id: 'frame', type: 'rect', x: 50, y: 50, width: 1100, height: 800, stroke: '#ca8a04', strokeWidth: 8 }, // Yellow 600
        { id: 'inner-frame', type: 'rect', x: 70, y: 70, width: 1060, height: 760, stroke: '#ca8a04', strokeWidth: 2 },
        { id: 'title', type: 'text', x: 0, y: 200, content: 'Certificate of Membership', fontSize: 64, fontFamily: 'serif', fill: '#facc15', width: 1200, align: 'center' },
        { id: 'name', type: 'text', x: 0, y: 400, content: '{{recipient.name}}', fontSize: 80, fontFamily: 'serif', fill: '#ffffff', width: 1200, align: 'center', fontStyle: 'italic' },
        { id: 'badge', type: 'circle', x: 600, y: 650, width: 80, height: 80, fill: '#ca8a04' },
        { id: 'ribbon', type: 'rect', x: 580, y: 720, width: 40, height: 80, fill: '#ca8a04' },
        { id: 'ribbon2', type: 'rect', x: 580, y: 720, width: 40, height: 80, fill: '#a16207', rotation: 20 },
    ]),

    // 8. Ocean Breeze (Teal Gradient)
    createTemplate('ocean-breeze', 'Ocean Breeze', '#f0fdfa', [
        // Simulated Gradient
        { id: 'bg1', type: 'rect', x: 0, y: 0, width: 1200, height: 300, fill: '#ccfbf1' },
        { id: 'bg2', type: 'rect', x: 0, y: 300, width: 1200, height: 300, fill: '#99f6e4' },
        { id: 'bg3', type: 'rect', x: 0, y: 600, width: 1200, height: 300, fill: '#5eead4' },
        { id: 'wave', type: 'circle', x: 600, y: 900, width: 1000, height: 600, fill: '#ffffff', opacity: 0.5 },
        { id: 'title', type: 'text', x: 0, y: 200, content: 'CERTIFICATION', fontSize: 72, fill: '#0f766e', width: 1200, align: 'center', letterSpacing: 10, fontWeight: 'bold' },
        { id: 'name', type: 'text', x: 0, y: 400, content: '{{recipient.name}}', fontSize: 60, fill: '#134e4a', width: 1200, align: 'center' }
    ]),

    // 9. Tech Grid (Matrix Style)
    createTemplate('tech-grid', 'Tech Grid', '#000000', [
        // Grid lines
        { id: 'g1', type: 'rect', x: 100, y: 0, width: 1, height: 900, fill: '#22c55e', opacity: 0.2 },
        { id: 'g2', type: 'rect', x: 1100, y: 0, width: 1, height: 900, fill: '#22c55e', opacity: 0.2 },
        { id: 'g3', type: 'rect', x: 0, y: 100, width: 1200, height: 1, fill: '#22c55e', opacity: 0.2 },
        { id: 'g4', type: 'rect', x: 0, y: 800, width: 1200, height: 1, fill: '#22c55e', opacity: 0.2 },
        { id: 'title', type: 'text', x: 120, y: 120, content: 'SYSTEM ACCESS GRANTED', fontSize: 48, fontFamily: 'monospace', fill: '#22c55e', width: 1000, align: 'left' },
        { id: 'user', type: 'text', x: 120, y: 300, content: 'USER: {{recipient.name}}', fontSize: 64, fontFamily: 'monospace', fill: '#ffffff', width: 1000, align: 'left' },
        { id: 'status', type: 'text', x: 120, y: 400, content: 'STATUS: AUTHORIZED', fontSize: 32, fontFamily: 'monospace', fill: '#4ade80', width: 1000, align: 'left' },
        { id: 'code', type: 'rect', x: 800, y: 600, width: 200, height: 200, stroke: '#22c55e', strokeWidth: 2 },
    ]),

    // 10. Classic Serif (Traditional)
    createTemplate('classic-serif', 'Classic Serif', '#ffffff', [
        { id: 'border-out', type: 'rect', x: 20, y: 20, width: 1160, height: 860, stroke: '#000000', strokeWidth: 1 },
        { id: 'border-in', type: 'rect', x: 30, y: 30, width: 1140, height: 840, stroke: '#000000', strokeWidth: 4 },
        { id: 'curve', type: 'text', x: 0, y: 150, content: 'Certificate of Completion', fontSize: 72, fontFamily: 'Garamond', fill: '#000000', width: 1200, align: 'center', fontStyle: 'italic' },
        { id: 'presented', type: 'text', x: 0, y: 300, content: 'is hereby presented to', fontSize: 24, fontFamily: 'Times New Roman', fill: '#333333', width: 1200, align: 'center' },
        { id: 'name', type: 'text', x: 0, y: 380, content: '{{recipient.name}}', fontSize: 64, fontFamily: 'Garamond', fill: '#000000', width: 1200, align: 'center', fontWeight: 'bold' },
        { id: 'line', type: 'rect', x: 300, y: 460, width: 600, height: 1, fill: '#000000' },
        { id: 'seal', type: 'circle', x: 900, y: 700, width: 120, height: 120, stroke: '#000000', strokeWidth: 2, fill: '#dddddd' },
        { id: 'seal-txt', type: 'text', x: 860, y: 680, content: 'OFFICIAL\nSEAL', fontSize: 20, align: 'center', width: 80, fill: '#000000' }
    ]),

    // 11. OffSec OSMR (macOS Researcher) - Indigo
    createTemplate('offsec-osmr', 'OffSec OSMR (Indigo)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#14142b', locked: true },
        { id: 'sb-icon', type: 'text', x: 20, y: 80, content: '🐙', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'sb-logo', type: 'text', x: 20, y: 720, content: 'OffSec', fontSize: 48, fill: '#ffffff', width: 300, align: 'center', fontWeight: 'bold' },
        { id: 'sb-line', type: 'rect', x: 100, y: 780, width: 140, height: 2, fill: '#4f39f6' },

        { id: 'ack', type: 'text', x: 400, y: 80, content: 'This is to acknowledge that', fontSize: 28, fontFamily: 'Inter', fill: '#555555', width: 760, align: 'center' },
        { id: 'name', type: 'text', x: 400, y: 160, content: '{{recipient.name}}', fontSize: 72, fontFamily: 'Playfair Display', fill: '#111111', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'name-line', type: 'rect', x: 480, y: 250, width: 600, height: 1.5, fill: '#888888' },
        { id: 'cert-as', type: 'text', x: 400, y: 300, content: 'is certified as an', fontSize: 24, fill: '#666666', width: 760, align: 'center' },
        { id: 'osmr', type: 'text', x: 400, y: 360, content: 'OSMR', fontSize: 130, fill: '#4f39f6', width: 760, align: 'center', fontWeight: 900, letterSpacing: -2 },
        { id: 'osmr-sub', type: 'text', x: 400, y: 500, content: '(OffSec macOS Researcher)', fontSize: 24, fill: '#4f39f6', width: 760, align: 'center', fontWeight: 'bold' },

        { id: 'body', type: 'text', x: 400, y: 580, content: 'and successfully completed all requirements and criteria for\nsaid certification through examination administered by OffSec.', fontSize: 18, fill: '#444444', width: 760, align: 'center', lineHeight: 1.6 },

        { id: 'earned-on', type: 'text', x: 400, y: 700, content: 'This certification was earned on', fontSize: 20, fill: '#666666', width: 760, align: 'center' },
        { id: 'date', type: 'text', x: 400, y: 740, content: '{{award.date}}', fontSize: 28, fill: '#111111', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'date-line', type: 'rect', x: 550, y: 790, width: 460, height: 1.5, fill: '#888888' },

        { id: 'qr', type: 'qr', x: 450, y: 800, width: 80, height: 80, content: 'https://offsec.com/verify/osmr' },
        { id: 'badge', type: 'circle', x: 1020, y: 800, width: 130, height: 130, fill: '#4f39f6' },
        { id: 'badge-t1', type: 'text', x: 1020, y: 790, content: 'OffSec', fontSize: 14, fill: '#ffffff', width: 130, align: 'center' },
        { id: 'badge-t2', type: 'text', x: 1020, y: 810, content: 'OSMR', fontSize: 28, fill: '#ffffff', width: 130, align: 'center', fontWeight: 'bold' }
    ]),

    // 12. OffSec OSDA (Defense Analyst) - Teal
    createTemplate('offsec-osda', 'OffSec OSDA (Teal)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#0a191e', locked: true },
        { id: 'sb-icon', type: 'text', x: 20, y: 80, content: '🛡️', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'sb-logo', type: 'text', x: 20, y: 720, content: 'OffSec', fontSize: 48, fill: '#ffffff', width: 300, align: 'center', fontWeight: 'bold' },
        { id: 'sb-line', type: 'rect', x: 100, y: 780, width: 140, height: 2, fill: '#0891b2' },

        { id: 'ack', type: 'text', x: 400, y: 80, content: 'This is to acknowledge that', fontSize: 28, fill: '#555555', width: 760, align: 'center' },
        { id: 'name', type: 'text', x: 400, y: 160, content: '{{recipient.name}}', fontSize: 72, fill: '#111111', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'name-line', type: 'rect', x: 480, y: 250, width: 600, height: 1.5, fill: '#888888' },
        { id: 'cert-as', type: 'text', x: 400, y: 300, content: 'is certified as an', fontSize: 24, fill: '#666666', width: 760, align: 'center' },
        { id: 'osda', type: 'text', x: 400, y: 360, content: 'OSDA', fontSize: 130, fill: '#0891b2', width: 760, align: 'center', fontWeight: 900 },
        { id: 'osda-sub', type: 'text', x: 400, y: 500, content: '(OffSec Defense Analyst)', fontSize: 24, fill: '#0891b2', width: 760, align: 'center', fontWeight: 'bold' },

        { id: 'body', type: 'text', x: 400, y: 580, content: 'and successfully completed all requirements and criteria for\nsaid certification through examination administered by OffSec.', fontSize: 18, fill: '#444444', width: 760, align: 'center' },

        { id: 'earned-on', type: 'text', x: 400, y: 700, content: 'This certification was earned on', fontSize: 20, fill: '#666666', width: 760, align: 'center' },
        { id: 'date', type: 'text', x: 400, y: 740, content: '{{award.date}}', fontSize: 28, fill: '#111111', width: 760, align: 'center', fontWeight: 'bold' },

        { id: 'qr', type: 'qr', x: 450, y: 800, width: 80, height: 80, content: 'https://offsec.com/verify/osda' },
        { id: 'badge', type: 'circle', x: 1020, y: 800, width: 130, height: 130, fill: '#0891b2' },
        { id: 'badge-t2', type: 'text', x: 1020, y: 810, content: 'OSDA', fontSize: 28, fill: '#ffffff', width: 130, align: 'center', fontWeight: 'bold' }
    ]),

    // 13. OffSec OSWE (Web Expert) - Emerald
    createTemplate('offsec-oswe', 'OffSec OSWE (Emerald)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#052e16', locked: true },
        { id: 'sb-icon', type: 'text', x: 20, y: 80, content: '🕸️', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'sb-logo', type: 'text', x: 20, y: 720, content: 'OffSec', fontSize: 48, fill: '#ffffff', width: 300, align: 'center', fontWeight: 'bold' },
        { id: 'sb-line', type: 'rect', x: 100, y: 780, width: 140, height: 2, fill: '#10b981' },

        { id: 'ack', type: 'text', x: 400, y: 80, content: 'This is to acknowledge that', fontSize: 28, fill: '#555555', width: 760, align: 'center' },
        { id: 'name', type: 'text', x: 400, y: 160, content: '{{recipient.name}}', fontSize: 72, fill: '#111111', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'cert-as', type: 'text', x: 400, y: 300, content: 'is certified as an', fontSize: 24, fill: '#666666', width: 760, align: 'center' },
        { id: 'oswe', type: 'text', x: 400, y: 360, content: 'OSWE', fontSize: 130, fill: '#10b981', width: 760, align: 'center', fontWeight: 900 },
        { id: 'oswe-sub', type: 'text', x: 400, y: 500, content: '(OffSec Web Expert)', fontSize: 24, fill: '#10b981', width: 760, align: 'center', fontWeight: 'bold' },

        { id: 'qr', type: 'qr', x: 450, y: 800, width: 80, height: 80, content: 'https://offsec.com/verify/oswe' },
        { id: 'badge', type: 'circle', x: 1020, y: 800, width: 130, height: 130, fill: '#10b981' },
        { id: 'badge-t2', type: 'text', x: 1020, y: 810, content: 'OSWE', fontSize: 28, fill: '#ffffff', width: 130, align: 'center', fontWeight: 'bold' }
    ]),

    // 14. Institutional Cybersecurity Authority (Strict/Government Grade)
    createTemplate('inst-cyber-auth', 'Institutional Cyber Authority', '#ffffff', [
        // LEFT PANEL (28% width)
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 336, height: 900, fill: '#0f172a', locked: true }, // Slate 900
        { id: 'sb-pattern', type: 'image', x: 0, y: 0, width: 336, height: 900, src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=900&fit=crop', opacity: 0.1, locked: true },
        { id: 'sb-emblem', type: 'text', x: 20, y: 60, content: '🛡️', fontSize: 120, width: 296, align: 'center', opacity: 0.8 },
        { id: 'sb-org-name', type: 'text', x: 20, y: 820, content: 'GLOBAL CYBERSECURITY\nAUTHORITY', fontSize: 20, fontFamily: 'Inter', fill: '#94a3b8', width: 296, align: 'left', fontWeight: 'bold', letterSpacing: 1 },

        // RIGHT PANEL Content
        { id: 'ack', type: 'text', x: 400, y: 80, content: 'THIS DOCUMENT CERTIFIES THAT', fontSize: 22, fontFamily: 'Inter', fill: '#64748b', width: 760, align: 'center', letterSpacing: 2, fontWeight: 'bold' },

        { id: 'name', type: 'text', x: 400, y: 160, content: '{{recipient_name}}', fontSize: 64, fontFamily: 'Inter', fill: '#0f172a', width: 760, align: 'center', fontWeight: 500 },

        { id: 'body', type: 'text', x: 400, y: 300, content: 'has demonstrated the required institutional discipline and technical\nmastery to be recognized as a senior professional within the', fontSize: 24, fontFamily: 'Inter', fill: '#475569', width: 760, align: 'center', lineHeight: 1.6 },

        { id: 'acronym', type: 'text', x: 400, y: 400, content: 'GCSA', fontSize: 220, fontFamily: 'Inter', fill: '#0f172a', width: 760, align: 'center', fontWeight: 900, letterSpacing: -8 },
        { id: 'full-title', type: 'text', x: 400, y: 620, content: 'GLOBAL CYBERSECURITY STRATEGIC ARCHITECT', fontSize: 32, fontFamily: 'Inter', fill: '#334155', width: 760, align: 'center', fontWeight: 'bold', letterSpacing: 1 },

        { id: 'meta', type: 'text', x: 400, y: 720, content: 'ISSUED UNDER NATIONAL AUTHORITY GUIDELINES — VERSION 4.2', fontSize: 14, fontFamily: 'Inter', fill: '#94a3b8', width: 760, align: 'center', fontWeight: 'bold', letterSpacing: 1 },

        // SECURITY ELEMENTS
        { id: 'qr', type: 'qr', x: 400, y: 780, width: 100, height: 100, content: 'https://verify.cyberauthority.int/GCSA-993-2026' },
    ]),

    // 15. NCSI CTIA (Green/Intelligence)
    createTemplate('ncsi-ctia', 'NCSI CTIA (Intelligence)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#064e3b', locked: true },
        { id: 'sb-pattern', type: 'image', x: 0, y: 0, width: 340, height: 900, src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=600&h=900&fit=crop', opacity: 0.1, locked: true },
        { id: 'logo-mark', type: 'text', x: 20, y: 80, content: '👁️', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'logo-text', type: 'text', x: 20, y: 750, content: 'NCSI™', fontSize: 90, fontFamily: 'serif', fill: '#ffffff', width: 300, align: 'center', fontWeight: 'bold' },
        { id: 'ack', type: 'text', x: 400, y: 60, content: 'This is to acknowledge', fontSize: 36, fontFamily: 'Inter', fill: '#555555', width: 760, align: 'center' },
        { id: 'cand-text', type: 'text', x: 400, y: 200, content: "If candidate's, was titled as an", fontSize: 28, fontFamily: 'Inter', fill: '#444444', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'title-acron', type: 'text', x: 400, y: 260, content: 'CTIA', fontSize: 120, fontFamily: 'DM Sans', fill: '#059669', width: 760, align: 'center', fontWeight: 900, letterSpacing: -2 },
        { id: 'title-full', type: 'text', x: 400, y: 400, content: 'Certified Tactical Intelligence Analyst', fontSize: 32, fontFamily: 'DM Sans', fill: '#333333', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'date-field', type: 'text', x: 400, y: 680, content: '{{issue_date}}', fontSize: 32, fontFamily: 'DM Sans', fill: '#111111', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'qr', type: 'qr', x: 400, y: 760, width: 120, height: 120, content: 'https://ncsi.institute/verify/{{certificate_id}}' },
    ]),

    // 16. NCSI CMA (Purple/Malware)
    createTemplate('ncsi-cma', 'NCSI CMA (Malware)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#2e1065', locked: true },
        { id: 'sb-pattern', type: 'image', x: 0, y: 0, width: 340, height: 900, src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=900&fit=crop', opacity: 0.15, locked: true },
        { id: 'logo-mark', type: 'text', x: 20, y: 80, content: '🦠', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'logo-text', type: 'text', x: 20, y: 750, content: 'NCSI™', fontSize: 90, fontFamily: 'serif', fill: '#ffffff', width: 300, align: 'center', fontWeight: 'bold' },
        { id: 'ack', type: 'text', x: 400, y: 60, content: 'This is to acknowledge', fontSize: 36, fontFamily: 'Inter', fill: '#555555', width: 760, align: 'center' },
        { id: 'title-acron', type: 'text', x: 400, y: 260, content: 'CMA', fontSize: 120, fontFamily: 'DM Sans', fill: '#7c3aed', width: 760, align: 'center', fontWeight: 900, letterSpacing: -2 },
        { id: 'title-full', type: 'text', x: 400, y: 400, content: 'Certified Malware Analyst', fontSize: 32, fontFamily: 'DM Sans', fill: '#333333', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'qr', type: 'qr', x: 400, y: 760, width: 120, height: 120, content: 'https://ncsi.institute/verify/{{certificate_id}}' },
    ]),

    // 17. NCSI CSCRS (Gold/Strategic)
    createTemplate('ncsi-cscrs', 'NCSI CSCRS (Strategic)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#451a03', locked: true },
        { id: 'logo-mark', type: 'text', x: 20, y: 80, content: '🌟', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'title-acron', type: 'text', x: 400, y: 260, content: 'CSCRS', fontSize: 120, fontFamily: 'DM Sans', fill: '#a16207', width: 760, align: 'center', fontWeight: 900, letterSpacing: -2 },
        { id: 'title-full', type: 'text', x: 400, y: 400, content: 'Certified Strategic Code Review Specialist', fontSize: 32, fontFamily: 'DM Sans', fill: '#333333', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'qr', type: 'qr', x: 400, y: 760, width: 120, height: 120, content: 'https://ncsi.institute/verify/{{certificate_id}}' },
    ]),

    // 18. NCSI CCTIA (Certified Cyber Threat Intelligence Analyst)
    createTemplate('ncsi-cctia', 'NCSI CCTIA (Intelligence)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#083344', locked: true },
        { id: 'sb-pattern', type: 'image', x: 0, y: 0, width: 340, height: 900, src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=900&fit=crop', opacity: 0.1, locked: true },
        { id: 'logo-mark', type: 'text', x: 20, y: 80, content: '🌐', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'logo-text', type: 'text', x: 20, y: 750, content: 'NCSI™', fontSize: 90, fontFamily: 'serif', fill: '#ffffff', width: 300, align: 'center', fontWeight: 'bold' },
        { id: 'ack', type: 'text', x: 400, y: 60, content: 'This is to acknowledge', fontSize: 36, fontFamily: 'Inter', fill: '#555555', width: 760, align: 'center' },
        { id: 'title-acron', type: 'text', x: 400, y: 260, content: 'CCTIA', fontSize: 120, fontFamily: 'DM Sans', fill: '#0ea5e9', width: 760, align: 'center', fontWeight: 900, letterSpacing: -2 },
        { id: 'title-full', type: 'text', x: 400, y: 400, content: 'Certified Cyber Threat Intelligence Analyst', fontSize: 32, fontFamily: 'DM Sans', fill: '#333333', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'date-field', type: 'text', x: 400, y: 680, content: '{{issue_date}}', fontSize: 32, fontFamily: 'DM Sans', fill: '#111111', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'qr', type: 'qr', x: 400, y: 760, width: 120, height: 120, content: 'https://ncsi.institute/verify/{{certificate_id}}' },
    ]),

    // 19. NCSI CISS (Certified Information Security Strategist)
    createTemplate('ncsi-ciss', 'NCSI CISS (Strategy)', '#ffffff', [
        { id: 'sb-bg', type: 'rect', x: 0, y: 0, width: 340, height: 900, fill: '#1e1b4b', locked: true },
        { id: 'logo-mark', type: 'text', x: 20, y: 80, content: '🏛️', fontSize: 160, width: 300, align: 'center', opacity: 0.9 },
        { id: 'logo-text', type: 'text', x: 20, y: 750, content: 'NCSI™', fontSize: 90, fontFamily: 'serif', fill: '#ffffff', width: 300, align: 'center', fontWeight: 'bold' },
        { id: 'ack', type: 'text', x: 400, y: 60, content: 'This is to acknowledge', fontSize: 36, fontFamily: 'Inter', fill: '#555555', width: 760, align: 'center' },
        { id: 'title-acron', type: 'text', x: 400, y: 260, content: 'CISS', fontSize: 120, fontFamily: 'DM Sans', fill: '#eab308', width: 760, align: 'center', fontWeight: 900, letterSpacing: -2 },
        { id: 'title-full', type: 'text', x: 400, y: 400, content: 'Certified Information Security Strategist', fontSize: 32, fontFamily: 'DM Sans', fill: '#333333', width: 760, align: 'center', fontWeight: 'bold' },
        { id: 'qr', type: 'qr', x: 400, y: 760, width: 120, height: 120, content: 'https://ncsi.institute/verify/{{certificate_id}}' },
    ]),
];
