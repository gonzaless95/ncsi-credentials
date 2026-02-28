import React, { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';
import { useDesignerStore } from '../store/useDesignerStore';

export const TransformerLayer = () => {
    const { selectedIds, updateElement } = useDesignerStore();
    const trRef = useRef<any>(null);

    useEffect(() => {
        if (!trRef.current) return;
        const stage = trRef.current.getStage();
        if (!stage) return;

        const selectedNodes = selectedIds.map(id => stage.findOne('#' + id)).filter(Boolean);
        trRef.current.nodes(selectedNodes);
        trRef.current.getLayer().batchDraw();
    }, [selectedIds]);

    const handleTransformEnd = () => {
        const nodes = trRef.current.nodes();
        nodes.forEach((node: any) => {
            const id = node.id();
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // Reset scale to 1 and adjust width/height for shapes where possible?
            // Or keep scale. consistently using scale is often easier for groups.
            // For simple shapes, let's keep scale. 
            // Ideally we normalize for text to avoid font distortion, but Konva handles scale well.

            updateElement(id, {
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                scaleX: scaleX,
                scaleY: scaleY,
                width: node.width(), // Note: width doesn't change on scale unless we reset it. 
                height: node.height()
            });
        });
    };

    if (selectedIds.length === 0) return null;

    return (
        <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
                // Constraint: minimum size 5px
                if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                }
                return newBox;
            }}
            onTransformEnd={handleTransformEnd}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            anchorSize={8}
            anchorCornerRadius={4}
            borderStroke="#0099ff"
            anchorStroke="#0099ff"
            anchorFill="#ffffff"
        />
    );
};
