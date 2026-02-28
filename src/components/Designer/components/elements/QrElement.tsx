import { Group, Rect, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { QrElement as QrElementType } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';

interface QrElementProps {
    element: QrElementType;
}

export const QrElement = ({ element }: QrElementProps) => {
    const { selectedIds, selectElement, updateElement, calculateSnapping, clearGuides } = useDesignerStore();
    const isSelected = selectedIds.includes(element.id);

    // Use a real QR code API
    // The content is already processed by the renderer (replacing {{VerifyLink}})
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(element.content || 'https://example.com')}`;
    const [image, status] = useImage(qrUrl, 'anonymous');

    return (
        <Group
            x={element.x}
            y={element.y}
            rotation={element.rotation}
            scaleX={element.scaleX}
            scaleY={element.scaleY}
            draggable={element.draggable && !element.locked}
            onClick={(e) => {
                e.cancelBubble = true;
                selectElement(element.id, e.evt.shiftKey);
            }}
            onDragMove={(e) => {
                const snapped = calculateSnapping(
                    element.id,
                    e.target.x(),
                    e.target.y(),
                    element.width * e.target.scaleX(),
                    element.height * e.target.scaleY()
                );
                e.target.x(snapped.x);
                e.target.y(snapped.y);
            }}
            onDragEnd={(e) => {
                updateElement(element.id, {
                    x: e.target.x(),
                    y: e.target.y()
                });
                clearGuides();
            }}
        >
            <Rect
                width={element.width}
                height={element.height}
                fill={element.backgroundColor || 'white'}
                stroke={isSelected ? '#3b82f6' : '#e2e8f0'}
                strokeWidth={isSelected ? 1 : 0.5}
            />

            {status === 'loaded' ? (
                <KonvaImage
                    image={image}
                    width={element.width}
                    height={element.height}
                    opacity={1}
                />
            ) : (
                <Rect
                    width={element.width}
                    height={element.height}
                    fill="#f1f5f9"
                />
            )}
        </Group>
    );
};
