import Draggable from 'react-draggable';
import { CSSObject } from 'styled-components';

import type { BoardItem, Position, TheBoard } from './Board';
import { LiContainer, ListItem } from './Board.styled';

interface BoardListProps {
  id: string;
  boardList: TheBoard;
  itemPositions: Map<string, Position>;
  // placeholder: Placeholder | null;
  // dragItem: string | null;
  width: string;
  itemHeight: string;
  gap: string;
  listPadding: string;
  transitionDuration: number;
  itemStyle: CSSObject | undefined;
  listStyle: CSSObject | undefined;
  listActiveStyle: CSSObject | undefined;
  itemActiveStyle: CSSObject | undefined;
  handleDrag: (e: any, data: any) => void;
  onDragStart: (e: any, data: any) => void;
  onDragStop: (e: any, data: any) => void;
  ItemComponent: React.FC<{ item: BoardItem }>;
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
  listActiveStyle,
  itemActiveStyle,
  listPadding,
  transitionDuration,
  handleDrag,
  onDragStart,
  onDragStop,
  ItemComponent,
}: BoardListProps) {
  const listId = id.charAt(0).toUpperCase() + id.slice(1);
  const boardListWidth = boardList.width ?? width;
  return (
    <div>
      <h3>{listId}</h3>
      <LiContainer
        listStyle={listStyle}
        listActiveStyle={listActiveStyle}
        id={id}
        style={{
          width: boardListWidth,
          gap,
          padding: listPadding,

          transition: `${transitionDuration}ms`,
        }}
      >
        {boardList.items.map((item) => (
          <Draggable
            key={item.id}
            defaultPosition={{ x: 0, y: 0 }}
            position={{ x: 0, y: 0 }}
            nodeRef={undefined}
            onStart={
              (e, data) => {
                const id = data.node.id;
                const initialPosition = itemPositions.get(id);
                if (!initialPosition) return;
                const dragElement = document.getElementById(id);
                if (!dragElement) return;
                onDragStart(e, data);

                dragElement.style.position = 'absolute';
                dragElement.style.top = initialPosition.y1 + 'px';
                dragElement.style.left = initialPosition.x1 + 'px';
                dragElement.style.zIndex = '2';
                dragElement.style.transition = 'none';
              }
              // handleDrag(e, data);
            }
            onDrag={(e, data) => {
              e.preventDefault(); //? This is a fix for the cursor in Safari. To check, uncomment it and try dragging an item — the cursor will look like it's selecting text.
              handleDrag(e, data);
            }}
            onStop={(e, data) => {
              onDragStop(e, data);
              const dragElement = document.getElementById(data.node.id);
              if (!dragElement) return;

              const { x, y } = data;

              //#region force cursor update on drag stop in safari
              if (navigator.userAgent.includes('Safari')) {
                /** approximate dead-band value (px) for mousemove not to update cursor */
                const deadBand = 5;
                // no enforcement if position hasn't changed
                if (Math.abs(x) + Math.abs(y) > deadBand) {
                  dragElement.style.cursor = 'initial';
                  setTimeout(() => {
                    dragElement.style.cursor = 'grab';
                  }, transitionDuration);
                }
              }
              //#endregion
            }}
          >
            <ListItem
              itemStyle={itemStyle}
              itemActiveStyle={itemActiveStyle}
              id={item.id.toString()}
              style={{
                width: boardListWidth,
                height: itemHeight,

                transition: `${transitionDuration}ms`,
              }}
            >
              <ItemComponent item={item} />
            </ListItem>
          </Draggable>
        ))}
      </LiContainer>
    </div>
  );
}
