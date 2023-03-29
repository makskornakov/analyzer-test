import { BoardListContent, Position } from './Board';
import Draggable from 'react-draggable';
import type { CSSProperties } from 'styled-components';
import { LiContainer } from './Board.styled';

interface BoardListProps {
  id: string;
  boardList: BoardListContent;
  itemPositions: Map<string, Position>;
  // placeholder: Placeholder | null;
  // dragItem: string | null;
  width: string;
  itemHeight: string;
  gap: string;
  listPadding: string;
  transitionDuration: number;
  itemStyle?: React.CSSProperties;
  listStyle?: React.CSSProperties;
  itemActiveStyle?: React.CSSProperties;
  handleDrag: (e: any, data: any) => void;
  onDragStart: (e: any, data: any) => void;
  onDragStop: (e: any, data: any) => void;
}

export default function BoardList({
  id,
  boardList,
  itemPositions,
  // placeholder,
  // dragItem,
  width,
  itemHeight,
  gap,
  itemStyle,
  listStyle,
  itemActiveStyle,
  listPadding,
  transitionDuration,
  handleDrag,
  onDragStart,
  onDragStop,
}: BoardListProps) {
  return (
    <div>
      <h3>Board List</h3>
      <LiContainer
        id={id}
        style={{
          width: width,
          gap,
          padding: listPadding,

          transition: `${transitionDuration / 1000}s`,

          ...listStyle,
        }}
      >
        {boardList.map((item) => (
          <Draggable
            key={item.id}
            defaultPosition={{ x: 0, y: 0 }}
            position={{ x: 0, y: 0 }}
            nodeRef={undefined}
            // grid={[25, 25]}
            // scale={1}
            onStart={(e, data) => {
              const id = data.node.id;
              const initialPosition = itemPositions.get(id);
              if (!initialPosition) return;
              const dragElement = document.getElementById(id);
              if (dragElement) {
                // active styles
                // go through all active styles and apply them to the dragElement

                if (itemActiveStyle)
                  Object.keys(itemActiveStyle).forEach((key) => {
                    const value = itemActiveStyle[key as keyof CSSProperties];
                    dragElement.style.setProperty(key, value as string);
                  });

                dragElement.style.position = 'absolute';
                dragElement.style.top = initialPosition.y1 + 'px';
                dragElement.style.left = initialPosition.x1 + 'px';
                dragElement.style.zIndex = '2';
                dragElement.style.cursor = 'grabbing';
                dragElement.style.transition = 'none';
              }
              onDragStart(e, data);
              // handleDrag(e, data);
            }}
            onDrag={(e, data) => {
              e.preventDefault(); //? This is a fix for the cursor in Safari. To check, uncomment it and try dragging an item — the cursor will look like it's selecting text.
              handleDrag(e, data);
            }}
            onStop={(e, data) => {
              onDragStop(e, data);
              const id = data.node.id;
              const dragElement = document.getElementById(id);

              if (dragElement) dragElement.style.cursor = 'grab';

              // remove active styles
              if (itemActiveStyle && dragElement)
                Object.keys(itemActiveStyle).forEach((key) => {
                  const value = itemStyle
                    ? itemStyle[key as keyof CSSProperties]
                    : '';
                  dragElement.style.setProperty(
                    key,
                    value ? (value as string) : ''
                  );
                });

              const { x, y } = data;
            }}
          >
            <li
              id={item.id.toString()}
              style={{
                width: width,
                height: itemHeight,

                transition: `${transitionDuration / 1000}s`,

                ...itemStyle,
              }}
            >
              <h4>{item.title}</h4>
            </li>
          </Draggable>
        ))}
      </LiContainer>
    </div>
  );
}
