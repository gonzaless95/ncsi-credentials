import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface CanvasContainerProps {
    onCanvasReady: (canvas: fabric.Canvas) => void;
    width?: number;
    height?: number;
    showBleed?: boolean;
    bleedArea?: number;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
    onCanvasReady,
    width = 800,
    height = 600,
    showBleed = false,
    bleedArea = 0
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width,
            height,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true,
            selection: true,
        });

        // Add background rectangle for shadow effect
        const backgroundRect = new fabric.Rect({
            width: canvas.width,
            height: canvas.height,
            fill: '#ffffff',
            selectable: false,
            evented: false,
            hoverCursor: 'default'
        });
        canvas.add(backgroundRect);
        canvas.sendToBack(backgroundRect);

        // Add bleed area visualization
        if (showBleed && bleedArea > 0) {
            const bleedRect = new fabric.Rect({
                left: bleedArea,
                top: bleedArea,
                width: (canvas.width || width) - bleedArea * 2,
                height: (canvas.height || height) - bleedArea * 2,
                stroke: '#ef4444',
                strokeWidth: 1,
                strokeDashArray: [5, 5],
                opacity: 0.5,
                fill: 'transparent',
                selectable: false,
                evented: false,
                hoverCursor: 'default'
            });
            canvas.add(bleedRect);
        }

        onCanvasReady(canvas);

        return () => {
            canvas.dispose();
        };
    }, [width, height, showBleed, bleedArea]);

    return (
        <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-8">
            <div className="relative shadow-2xl">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};
