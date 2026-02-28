import { Text } from 'react-konva';
import { TextElement as TextElementType } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';

export const TextElement = ({ element }: { element: TextElementType }) => {
    const {
        selectElement, updateElement, calculateSnapping,
        clearGuides, previewMode, placeholderData
    } = useDesignerStore();

    const displayContent = (previewMode === 'placeholder' && element.fieldBinding)
        ? (placeholderData[element.fieldBinding] || element.content)
        : element.content;

    const getGradientProps = (fill: any, width: number, height: number) => {
        if (typeof fill !== 'object' || !fill) return { fill };

        if (fill.type === 'linear') {
            const angle = (fill.rotation || 0) * (Math.PI / 180);
            return {
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: {
                    x: width * Math.cos(angle),
                    y: height * Math.sin(angle)
                },
                fillLinearGradientColorStops: fill.stops.flatMap((s: any) => [s.offset, s.color])
            };
        }
        return { fill: '#000000' };
    };

    const gradientProps = getGradientProps(element.fill, element.width, element.height);

    return (
        <Text
            x={element.x}
            y={element.y}
            text={displayContent}
            fontSize={element.fontSize}
            fontFamily={element.fontFamily}
            fontStyle={`${element.fontStyle || ''} ${element.fontWeight || ''}`.trim() || 'normal'}
            align={element.align}
            {...gradientProps}
            draggable={element.draggable && !element.locked}
            onClick={(e) => {
                e.cancelBubble = true;
                selectElement(element.id, e.evt.shiftKey);
            }}
            onDragStart={() => {
                selectElement(element.id, false); // Select on drag
            }}
            onDragMove={(e) => {
                const snapped = calculateSnapping(
                    element.id,
                    e.target.x(),
                    e.target.y(),
                    e.target.width() * e.target.scaleX(),
                    e.target.height() * e.target.scaleY()
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
            onMouseEnter={() => {
                document.body.style.cursor = 'move';
            }}
            onMouseLeave={() => {
                document.body.style.cursor = 'default';
            }}
        />
    );
};
