import { useEffect } from 'react';
import { Image as KonvaImage, Rect, Text, Group } from 'react-konva';
import useImage from 'use-image';
import { ImageElement as ImageElementType } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';

interface Props {
    element: ImageElementType;
}

export const ImageElement = ({ element }: Props) => {
    const { updateElement, calculateSnapping, clearGuides, selectElement, previewMode, placeholderData } = useDesignerStore();

    const displaySrc = (previewMode === 'placeholder' && element.fieldBinding)
        ? (placeholderData[element.fieldBinding] || element.src)
        : element.src;

    const [image, status] = useImage(displaySrc, 'anonymous');

    // Effect to update original dimensions when image loads
    useEffect(() => {
        if (status === 'loaded' && image) {
            if (!element.originalWidth || !element.originalHeight) {
                updateElement(element.id, {
                    originalWidth: image.width,
                    originalHeight: image.height,
                    // Optionally set initial width/height if 0
                    width: element.width || 200,
                    height: element.height || (200 * (image.height / image.width))
                });
            }
        }
    }, [status, image, element.id, element.originalWidth, element.originalHeight, element.width, element.height, updateElement]);

    const commonProps = {
        id: element.id,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        scaleX: element.scaleX,
        scaleY: element.scaleY,
        draggable: !element.locked,
        onClick: (e: any) => {
            e.cancelBubble = true;
            selectElement(element.id, e.evt.shiftKey);
        },
        onTap: (e: any) => {
            e.cancelBubble = true;
            selectElement(element.id, e.evt.shiftKey);
        },
        onDragMove: (e: any) => {
            const snapped = calculateSnapping(
                element.id,
                e.target.x(),
                e.target.y(),
                e.target.width() * e.target.scaleX(),
                e.target.height() * e.target.scaleY()
            );
            e.target.x(snapped.x);
            e.target.y(snapped.y);
        },
        onDragEnd: (e: any) => {
            updateElement(element.id, {
                x: e.target.x(),
                y: e.target.y()
            });
            clearGuides();
        },
        onMouseEnter: () => document.body.style.cursor = 'move',
        onMouseLeave: () => document.body.style.cursor = 'default',
    };

    if (status === 'loading') {
        return (
            <Group {...commonProps}>
                <Rect
                    width={element.width}
                    height={element.height}
                    fill="#f0f0f0"
                    stroke="#ddd"
                    strokeWidth={1}
                />
                <Text
                    text="Loading..."
                    width={element.width}
                    height={element.height}
                    align="center"
                    verticalAlign="middle"
                    fill="#999"
                />
            </Group>
        );
    }

    if (status === 'failed') {
        return (
            <Group {...commonProps}>
                <Rect
                    width={element.width}
                    height={element.height}
                    fill="#ffebee"
                    stroke="#ffcdd2"
                    strokeWidth={1}
                />
                <Text
                    text="Image Error"
                    width={element.width}
                    height={element.height}
                    align="center"
                    verticalAlign="middle"
                    fill="#ef5350"
                />
            </Group>
        );
    }

    return (
        <Group {...commonProps}>
            {(element as any).fill && (
                <Rect
                    width={element.width}
                    height={element.height}
                    fill={(element as any).fill}
                    cornerRadius={element.borderRadius}
                />
            )}
            <KonvaImage
                image={image}
                width={element.width}
                height={element.height}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                cornerRadius={element.borderRadius}
            />
        </Group>
    );
};
