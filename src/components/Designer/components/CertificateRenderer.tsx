import { useRef, useEffect, useState, forwardRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import {
    TextElement, ShapeElement, ImageElement,
    SerialElement, SignatureElement, QrElement
} from './elements';
import useImage from 'use-image';
import { Image as KonvaImage } from 'react-konva';
import { CanvasConfig, DesignerElement, CanvasSection } from '../types';

interface CertificateRendererProps {
    canvas: CanvasConfig;
    elements: DesignerElement[];
    placeholderData?: Record<string, string>;
    maxWidth?: number;
    borderless?: boolean;
}

const SectionBackground = ({ section, canvasWidth, canvasHeight }: { section: CanvasSection, canvasWidth: number, canvasHeight: number }) => {
    const width = Math.max(0, (section.width / 100) * canvasWidth) || 0;
    const height = Math.max(0, (section.height / 100) * canvasHeight) || 0;
    const x = ((section.x || 0) / 100) * canvasWidth;
    const y = ((section.y || 0) / 100) * canvasHeight;
    const [image] = useImage(section.backgroundImage || '', 'anonymous');

    return (
        <>
            <Rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={section.backgroundColor}
                opacity={section.opacity}
                listening={false}
            />
            {section.backgroundImage && image && (
                <KonvaImage
                    image={image}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    opacity={section.opacity}
                    listening={false}
                />
            )}
        </>
    );
};

const BackgroundImage = ({ src, width, height }: { src: string, width: number, height: number }) => {
    const [image] = useImage(src, 'anonymous');
    if (!image) return null;
    return (
        <KonvaImage
            image={image}
            width={width}
            height={height}
            listening={false}
        />
    );
};

export const CertificateRenderer = forwardRef<any, CertificateRendererProps>(({ canvas, elements, placeholderData, maxWidth = 1200, borderless = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const newScale = Math.min(containerWidth / canvas.width, 1);
                setScale(newScale);
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [canvas.width]);

    // Apply placeholder replacements and filter out legacy elements
    const processedElements = elements
        .filter(el => !['badge-base', 'badge-t1', 'badge-t2', 'badge-t3'].includes(el.id))
        .map(el => {
            let updatedEl = { ...el };

            // Handle text content replacement
            if (updatedEl.type === 'text') {
                let content = updatedEl.content || '';
                if (placeholderData) {
                    Object.entries(placeholderData).forEach(([key, value]) => {
                        // Support both {{field_id}} and generic {{recipient_name}} style placeholders
                        content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
                    });
                }
                updatedEl.content = content;
            }

            // Handle field binding (overwrites content/src/etc for specific fields)
            if (updatedEl.fieldBinding && placeholderData?.[updatedEl.fieldBinding]) {
                const boundValue = placeholderData[updatedEl.fieldBinding];

                if (updatedEl.type === 'text' || updatedEl.type === 'qr' || updatedEl.type === 'serial') {
                    (updatedEl as any).content = String(boundValue);
                } else if (updatedEl.type === 'image') {
                    (updatedEl as any).src = String(boundValue);
                } else if (updatedEl.type === 'signature') {
                    (updatedEl as any).imageSrc = String(boundValue);
                }
            }

            return updatedEl;
        });

    return (
        <div ref={containerRef} className={`w-full flex justify-center overflow-hidden ${borderless ? '' : 'bg-slate-50 p-4 rounded-xl'}`} style={{ maxWidth }}>
            <div style={{ width: canvas.width * scale, height: canvas.height * scale }}>
                <Stage
                    ref={ref}
                    width={canvas.width}
                    height={canvas.height}
                    scaleX={scale}
                    scaleY={scale}
                    listening={false}
                >
                    <Layer>
                        {/* Shadow / Base Background */}
                        <Rect
                            x={0}
                            y={0}
                            width={canvas.width}
                            height={canvas.height}
                            fill={canvas.backgroundColor}
                            shadowColor="black"
                            shadowBlur={20}
                            shadowOpacity={0.05}
                            shadowOffset={{ x: 0, y: 10 }}
                        />

                        {canvas.backgroundImage && (
                            <BackgroundImage src={canvas.backgroundImage} width={canvas.width} height={canvas.height} />
                        )}

                        {/* Section Backgrounds */}
                        {Array.isArray(canvas.sections) && canvas.sections.map(section => (
                            <SectionBackground
                                key={section.id}
                                section={section}
                                canvasWidth={canvas.width}
                                canvasHeight={canvas.height}
                            />
                        ))}

                        {/* Rendering Elements */}
                        {processedElements.map(el => {
                            switch (el.type) {
                                case 'text':
                                    return <TextElement key={el.id} element={el as any} />;
                                case 'rect':
                                case 'circle':
                                case 'hexagon':
                                    return <ShapeElement key={el.id} element={el as any} />;
                                case 'image':
                                    return <ImageElement key={el.id} element={el as any} />;
                                case 'serial':
                                    return <SerialElement key={el.id} element={el as any} />;
                                case 'signature':
                                    return <SignatureElement key={el.id} element={el as any} />;
                                case 'qr':
                                    return <QrElement key={el.id} element={el as any} />;
                                default:
                                    return null;
                            }
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
});
