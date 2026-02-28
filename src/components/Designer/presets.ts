import { fabric } from 'fabric';

export const applyModernProfessionalPreset = (canvasObj: fabric.Canvas, organizationName: string) => {
    const canvasWidth = canvasObj.getWidth();
    const canvasHeight = canvasObj.getHeight();

    canvasObj.clear();
    canvasObj.setBackgroundColor('#ffffff', canvasObj.renderAll.bind(canvasObj));

    // Sidebar color gradient placeholder (using a dark rect)
    const sidebar = new fabric.Rect({
        left: 0,
        top: 0,
        width: 200,
        height: canvasHeight,
        fill: '#1a1a2e',
        selectable: false,
        evented: false,
        data: { type: 'ui' }
    });
    canvasObj.add(sidebar);

    // Fox Logo Placeholder
    const logoIcon = new fabric.IText('🦊', {
        left: 100,
        top: 50,
        originX: 'center',
        fontSize: 60,
        selectable: true,
    });
    canvasObj.add(logoIcon);

    const orgName = new fabric.IText(organizationName?.toUpperCase() || 'NCSI INSTITUTE', {
        left: 100,
        top: 130,
        originX: 'center',
        fontSize: 12,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#ffffff',
        charSpacing: 100
    });
    canvasObj.add(orgName);

    // Main Title
    const title = new fabric.IText('CEHP', {
        left: (canvasWidth + 200) / 2,
        top: 100,
        originX: 'center',
        fontSize: 80,
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 'bold',
        fill: '#111827',
        charSpacing: 200
    });
    canvasObj.add(title);

    const subTitle = new fabric.IText('Certified Ethical Hacking Professional', {
        left: (canvasWidth + 200) / 2,
        top: 180,
        originX: 'center',
        fontSize: 24,
        fontFamily: 'Inter, sans-serif',
        fill: '#374151'
    });
    canvasObj.add(subTitle);

    const recipientLabel = new fabric.IText('Recipient Name', {
        left: (canvasWidth + 200) / 2,
        top: 230,
        originX: 'center',
        fontSize: 14,
        fill: '#9ca3af'
    });
    canvasObj.add(recipientLabel);

    const nameField = new fabric.IText('[[recipient_name]]', {
        left: (canvasWidth + 200) / 2,
        top: 280,
        originX: 'center',
        fontSize: 36,
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 'bold',
        fill: '#111827'
    });
    canvasObj.add(nameField);

    // Lines
    const line1 = new fabric.Rect({
        left: 250,
        top: 350,
        width: canvasWidth - 300,
        height: 1,
        fill: '#e5e7eb',
        selectable: false
    });
    canvasObj.add(line1);

    const line2 = new fabric.Rect({
        left: 250,
        top: 420,
        width: canvasWidth - 300,
        height: 1,
        fill: '#e5e7eb',
        selectable: false
    });
    canvasObj.add(line2);

    // Bottom Logo/Badge
    const ncsiBadge = new fabric.IText('NCSI™', {
        left: 100,
        top: canvasHeight - 100,
        originX: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        fill: '#ffffff'
    });
    canvasObj.add(ncsiBadge);

    canvasObj.renderAll();
};

export const applyHexBadgePreset = (canvasObj: fabric.Canvas) => {
    canvasObj.clear();
    canvasObj.setBackgroundColor('#f9fafb', canvasObj.renderAll.bind(canvasObj));

    // Hexagon shape placeholder
    const hex = new fabric.Polygon([
        { x: 300, y: 50 },
        { x: 550, y: 175 },
        { x: 550, y: 425 },
        { x: 300, y: 550 },
        { x: 50, y: 425 },
        { x: 50, y: 175 }
    ], {
        left: 50,
        top: 50,
        fill: '#1a1a2e',
        stroke: '#ff6b35',
        strokeWidth: 8,
        selectable: true
    });
    canvasObj.add(hex);

    const title = new fabric.IText('CEHP', {
        left: 300,
        top: 300,
        originX: 'center',
        originY: 'center',
        fontSize: 80,
        fontFamily: 'Space Grotesk',
        fontWeight: 'bold',
        fill: '#ffffff'
    });
    canvasObj.add(title);

    const badgeLabel = new fabric.IText('PROFESSIONAL', {
        left: 300,
        top: 380,
        originX: 'center',
        fontSize: 14,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#ff6b35',
        charSpacing: 200
    });
    canvasObj.add(badgeLabel);

    canvasObj.renderAll();
};

export const applyOffSecPreset = (canvasObj: fabric.Canvas) => {
    const canvasWidth = canvasObj.getWidth();
    const canvasHeight = canvasObj.getHeight();

    canvasObj.clear();
    canvasObj.setBackgroundColor('#ffffff', canvasObj.renderAll.bind(canvasObj));

    // Border
    const border = new fabric.Rect({
        left: 20,
        top: 20,
        width: canvasWidth - 40,
        height: canvasHeight - 40,
        fill: 'transparent',
        stroke: '#da1e28',
        strokeWidth: 2,
        selectable: false,
        evented: false
    });
    canvasObj.add(border);

    // Header Section
    const headerRect = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvasWidth,
        height: 120,
        fill: '#f4f4f4',
        selectable: false
    });
    canvasObj.add(headerRect);

    const logoText = new fabric.IText('OFFSEC', {
        left: 60,
        top: 45,
        fontSize: 40,
        fontFamily: 'Inter',
        fontWeight: '900',
        fill: '#da1e28',
        charSpacing: -20
    });
    canvasObj.add(logoText);

    const certTitle = new fabric.IText('PENETRATION TESTING WITH KALI LINUX', {
        left: canvasWidth / 2,
        top: 180,
        originX: 'center',
        fontSize: 28,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#161616',
        charSpacing: 50
    });
    canvasObj.add(certTitle);

    const certType = new fabric.IText('OSCP', {
        left: canvasWidth / 2,
        top: 240,
        originX: 'center',
        fontSize: 72,
        fontFamily: 'Inter',
        fontWeight: '900',
        fill: '#da1e28'
    });
    canvasObj.add(certType);

    const recipientLabel = new fabric.IText('THIS CERTIFIES THAT', {
        left: canvasWidth / 2,
        top: 330,
        originX: 'center',
        fontSize: 12,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#525252',
        charSpacing: 200
    });
    canvasObj.add(recipientLabel);

    const nameField = new fabric.IText('[[recipient_name]]', {
        left: canvasWidth / 2,
        top: 380,
        originX: 'center',
        fontSize: 48,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#161616'
    });
    canvasObj.add(nameField);

    const successText = new fabric.IText('HAS SUCCESSFULLY COMPLETED THE REQUIREMENTS TO BE RECOGNIZED AS AN', {
        left: canvasWidth / 2,
        top: 450,
        originX: 'center',
        fontSize: 10,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#525252',
        charSpacing: 100
    });
    canvasObj.add(successText);

    const osTitle = new fabric.IText('OFFSEC CERTIFIED PROFESSIONAL', {
        left: canvasWidth / 2,
        top: 480,
        originX: 'center',
        fontSize: 20,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#161616',
        charSpacing: 100
    });
    canvasObj.add(osTitle);

    // Signature Line
    const sigLine = new fabric.Rect({
        left: canvasWidth / 2 - 100,
        top: canvasHeight - 120,
        width: 200,
        height: 1,
        fill: '#161616'
    });
    canvasObj.add(sigLine);

    const sigLabel = new fabric.IText('OFFSEC CERTIFICATION COMMITTEE', {
        left: canvasWidth / 2,
        top: canvasHeight - 100,
        originX: 'center',
        fontSize: 9,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#525252'
    });
    canvasObj.add(sigLabel);

    // Security Seal
    const seal = new fabric.Circle({
        left: canvasWidth - 180,
        top: canvasHeight - 200,
        radius: 40,
        fill: 'transparent',
        stroke: '#da1e28',
        strokeWidth: 2,
        opacity: 0.3
    });
    canvasObj.add(seal);

    const sealText = new fabric.IText('OFFSEC\nCERTIFIED', {
        left: canvasWidth - 140,
        top: canvasHeight - 160,
        originX: 'center',
        originY: 'center',
        fontSize: 10,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#da1e28',
        textAlign: 'center',
        opacity: 0.3
    });
    canvasObj.add(sealText);

    // Footer details
    const dateLabel = new fabric.IText('DATE: [[issued_date]]', {
        left: 60,
        top: canvasHeight - 80,
        fontSize: 12,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#161616'
    });
    canvasObj.add(dateLabel);

    const idLabel = new fabric.IText('ID: [[certificate_id]]', {
        left: canvasWidth - 250,
        top: canvasHeight - 80,
        fontSize: 12,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#161616'
    });
    canvasObj.add(idLabel);

    canvasObj.renderAll();
};

export const applyCloudPreset = (canvasObj: fabric.Canvas) => {
    const canvasWidth = canvasObj.getWidth();
    const canvasHeight = canvasObj.getHeight();

    canvasObj.clear();
    canvasObj.setBackgroundColor('#ffffff', canvasObj.renderAll.bind(canvasObj));

    // Background decorative elements
    const circle1 = new fabric.Circle({
        left: -100,
        top: -100,
        radius: 200,
        fill: '#2563eb',
        opacity: 0.05,
        selectable: false
    });
    canvasObj.add(circle1);

    const circle2 = new fabric.Circle({
        left: canvasWidth - 100,
        top: canvasHeight - 100,
        radius: 200,
        fill: '#2563eb',
        opacity: 0.05,
        selectable: false
    });
    canvasObj.add(circle2);

    // Top bar
    const topBar = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvasWidth,
        height: 20,
        fill: '#1d4ed8',
        selectable: false
    });
    canvasObj.add(topBar);

    const logoIcon = new fabric.IText('☁️', {
        left: canvasWidth / 2,
        top: 80,
        originX: 'center',
        fontSize: 60,
    });
    canvasObj.add(logoIcon);

    const certLabel = new fabric.IText('CERTIFICATE OF ACCOMPLISHMENT', {
        left: canvasWidth / 2,
        top: 160,
        originX: 'center',
        fontSize: 12,
        fontFamily: 'Inter',
        fontWeight: '900',
        fill: '#2563eb',
        charSpacing: 300
    });
    canvasObj.add(certLabel);

    const titleText = new fabric.IText('Cloud Security Solutions Architect', {
        left: canvasWidth / 2,
        top: 220,
        originX: 'center',
        fontSize: 40,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#1e293b'
    });
    canvasObj.add(titleText);

    const presentedTo = new fabric.IText('THIS IS PRESENTED TO', {
        left: canvasWidth / 2,
        top: 300,
        originX: 'center',
        fontSize: 10,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#64748b',
        charSpacing: 100
    });
    canvasObj.add(presentedTo);

    const nameField = new fabric.IText('[[recipient_name]]', {
        left: canvasWidth / 2,
        top: 350,
        originX: 'center',
        fontSize: 56,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#1e293b'
    });
    canvasObj.add(nameField);

    const bottomBar = new fabric.Rect({
        left: 50,
        top: canvasHeight - 60,
        width: canvasWidth - 100,
        height: 4,
        fill: '#e2e8f0',
        selectable: false
    });
    canvasObj.add(bottomBar);

    const dateLabel = new fabric.IText('ISSUED ON [[issued_date]]', {
        left: 50,
        top: canvasHeight - 40,
        fontSize: 10,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#94a3b8'
    });
    canvasObj.add(dateLabel);

    canvasObj.renderAll();
};
