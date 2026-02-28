import { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { useDesignerStore } from '../store/useDesignerStore';
import { KonvaEventObject } from 'konva/lib/Node';
import {
    TextElement, ShapeElement, ImageElement,
    SerialElement, SignatureElement, QrElement
} from './elements/index';
import { TransformerLayer } from './TransformerLayer';
import useImage from 'use-image';
import { Image as KonvaImage } from 'react-konva';
import { CanvasSection } from '../types';

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

const Grid = ({ width, height, size, visible }: { width: number, height: number, size: number, visible: boolean }) => {
    // ... existing Grid implementation
    if (!visible || !size || size <= 0) return null;

    const lines = [];
    // Vertical lines
    for (let i = 0; i <= width / size; i++) {
        lines.push(
            <Line
                key={`v-${i}`}
                points={[i * size, 0, i * size, height]}
                stroke="#ddd"
                strokeWidth={1}
                listening={false}
            />
        );
    }
    // Horizontal lines
    for (let i = 0; i <= height / size; i++) {
        lines.push(
            <Line
                key={`h-${i}`}
                points={[0, i * size, width, i * size]}
                stroke="#ddd"
                strokeWidth={1}
                listening={false}
            />
        );
    }
    return <>{lines}</>;
};

export const CanvasArea = () => {
    const { canvas, elements, deselectAll, setZoom, activeGuides } = useDesignerStore();
    const stageRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync ref to store on mount
    useEffect(() => {
        if (stageRef.current) {
            useDesignerStore.getState().setStageRef(stageRef.current);
        }
    }, []);

    // Force redraw when fonts are loaded
    useEffect(() => {
        const handleFontsLoaded = () => {
            if (stageRef.current) {
                stageRef.current.batchDraw();
            }
        };

        if (document.fonts) {
            document.fonts.addEventListener('loadingdone', handleFontsLoaded);
            document.fonts.ready.then(handleFontsLoaded);
        }

        return () => {
            if (document.fonts) {
                document.fonts.removeEventListener('loadingdone', handleFontsLoaded);
            }
        };
    }, [elements]);

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        const scaleBy = 1.1;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        // Limits
        if (newScale < 0.1) newScale = 0.1;
        if (newScale > 5) newScale = 5;

        setZoom(newScale); // Sync store

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        stage.position(newPos);
        stage.batchDraw();
    };

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            deselectAll();
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex-1 bg-gray-100 overflow-hidden relative flex items-center justify-center"
        >
            <Stage
                width={window.innerWidth - 400}
                height={window.innerHeight - 100}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                ref={stageRef}
                draggable
                scaleX={canvas.zoom}
                scaleY={canvas.zoom}
                style={{ background: '#f3f4f6' }}
            >
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        width={canvas.width}
                        height={canvas.height}
                        fill={canvas.backgroundColor}
                        shadowColor="black"
                        shadowBlur={20}
                        shadowOpacity={0.1}
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

                    {/* Bleed Area Visualization */}
                    {canvas.showBleed && (
                        <Rect
                            x={canvas.bleedArea}
                            y={canvas.bleedArea}
                            width={canvas.width - canvas.bleedArea * 2}
                            height={canvas.height - canvas.bleedArea * 2}
                            stroke="#ef4444"
                            strokeWidth={1}
                            dash={[5, 5]}
                            opacity={0.5}
                            listening={false}
                        />
                    )}

                    <Grid
                        width={canvas.width}
                        height={canvas.height}
                        size={canvas.gridSize}
                        visible={canvas.gridOn}
                    />

                    {/* Rendering Elements */}
                    {elements.map(el => {
                        switch (el.type) {
                            case 'text':
                                return <TextElement key={el.id} element={el} />;
                            case 'rect':
                            case 'circle':
                                return <ShapeElement key={el.id} element={el} />;
                            case 'image':
                                return <ImageElement key={el.id} element={el} />;
                            case 'serial':
                                return <SerialElement key={el.id} element={el} />;
                            case 'signature':
                                return <SignatureElement key={el.id} element={el} />;
                            case 'qr':
                                return <QrElement key={el.id} element={el} />;
                            default:
                                return null;
                        }
                    })}

                    {/* Guidelines */}
                    {activeGuides.map((guide, i) => (
                        <Line
                            key={i}
                            points={
                                guide.orientation === 'v'
                                    ? [guide.position, 0, guide.position, canvas.height]
                                    : [0, guide.position, canvas.width, guide.position]
                            }
                            stroke="#3b82f6"
                            strokeWidth={1}
                            dash={[4, 4]}
                            listening={false}
                        />
                    ))}

                    {/* Transformer for Selection - Should be last */}
                    <TransformerLayer />
                </Layer>
            </Stage>

            {/* Zoom Controls Overlay */}
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow flex space-x-2">
                <button onClick={() => setZoom(canvas.zoom - 0.1)}>-</button>
                <span>{Math.round(canvas.zoom * 100)}%</span>
                <button onClick={() => setZoom(canvas.zoom + 0.1)}>+</button>
            </div>
        </div>
    );
};
