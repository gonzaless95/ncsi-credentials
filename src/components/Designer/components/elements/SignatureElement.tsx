import { Group, Rect, Text, Image } from 'react-konva';
import { SignatureElement as SignatureElementType } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';
import useImage from 'use-image';

interface SignatureElementProps {
    element: SignatureElementType;
}

export const SignatureElement = ({ element }: SignatureElementProps) => {
    const { selectedIds, selectElement, updateElement, calculateSnapping, clearGuides } = useDesignerStore();
    const isSelected = selectedIds.includes(element.id);
    const [img] = useImage(element.imageSrc || '');

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
                fill={isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent'}
                stroke={isSelected ? '#3b82f6' : 'transparent'}
                strokeWidth={1}
                dash={[4, 4]}
            />

            {element.imageSrc && img ? (
                <Image
                    image={img}
                    width={element.width}
                    height={element.height}
                    opacity={element.opacity}
                />
            ) : (
                <Group>
                    <Rect
                        width={element.width}
                        height={element.height}
                        fill="#f8fafc"
                        stroke="#e2e8f0"
                        strokeWidth={1}
                    />
                    <Text
                        text="[Authorized Signature]"
                        fontSize={12}
                        fill="#94a3b8"
                        fontStyle="italic"
                        align="center"
                        verticalAlign="middle"
                        width={element.width}
                        height={element.height - 20}
                    />
                    <Rect
                        x={20}
                        y={element.height - 20}
                        width={element.width - 40}
                        height={1}
                        fill="#cbd5e1"
                    />
                </Group>
            )}
        </Group>
    );
};
