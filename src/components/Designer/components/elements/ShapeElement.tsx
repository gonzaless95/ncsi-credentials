import { Rect, Circle, RegularPolygon } from 'react-konva';
import { ShapeElement as ShapeElementType } from '../../types';
import { useDesignerStore } from '../../store/useDesignerStore';

interface Props {
    element: ShapeElementType;
}

export const ShapeElement = ({ element }: Props) => {
    // Common props
    const { selectElement, updateElement, calculateSnapping, clearGuides } = useDesignerStore();

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
        return { fill: '#3b82f6' };
    };

    const gradientProps = getGradientProps(element.fill, element.width, element.height);

    const commonProps = {
        id: element.id,
        x: element.x,
        y: element.y,
        draggable: !element.locked,
        rotation: element.rotation,
        scaleX: element.scaleX,
        scaleY: element.scaleY,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        ...gradientProps,
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

    if (element.type === 'rect') {
        return (
            <Rect
                {...commonProps}
                width={element.width}
                height={element.height}
                cornerRadius={element.cornerRadius}
            />
        );
    }

    if (element.type === 'circle') {
        return (
            <Circle
                {...commonProps}
                radius={element.width / 2}
            />
        );
    }

    if (element.type === 'hexagon') {
        return (
            <RegularPolygon
                {...commonProps}
                sides={6}
                radius={element.width / 2}
            />
        );
    }

    return null;
};
