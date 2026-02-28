import { Group, Rect, Text } from 'react-konva';
import { SerialElement as SerialElementType } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';

interface SerialElementProps {
    element: SerialElementType;
}

export const SerialElement = ({ element }: SerialElementProps) => {
    const { selectedIds, selectElement, updateElement, calculateSnapping, clearGuides } = useDesignerStore();
    const isSelected = selectedIds.includes(element.id);

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
                    (element.width || 120) * e.target.scaleX(),
                    (element.height || 30) * e.target.scaleY()
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
                width={element.width || 120}
                height={element.height || 30}
                fill={isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent'}
                stroke={isSelected ? '#3b82f6' : 'transparent'}
                strokeWidth={1}
                dash={[4, 4]}
            />
            <Text
                text={element.content}
                fontSize={element.fontSize}
                fontFamily={element.fontFamily}
                fontStyle={typeof element.fontWeight === 'string' ? element.fontWeight : 'normal'}
                fill={element.fill}
                align="center"
                verticalAlign="middle"
                width={element.width || 120}
                height={element.height || 30}
                opacity={element.opacity}
            />
        </Group>
    );
};
