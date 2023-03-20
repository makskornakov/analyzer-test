import { BoardListContent, Position } from './Board';
import type { Placeholder } from './Board';
import Draggable from 'react-draggable';
import { useEffect } from 'react';

export default function BoardList({
  id,
  boardList,
  itemPositions,
  placeholder,
  width,
  itemHeight,
  gap,
  handleDrag,
  onDragStart,
  onDragStop,
}: {
  id: string;
  boardList: BoardListContent;
  itemPositions: Map<string, Position>;
  placeholder: Placeholder | null;
  width: string;
  itemHeight: string;
  gap: string;
  handleDrag: (e: any, data: any) => void;
  onDragStart: (e: any, data: any) => void;
  onDragStop: (e: any, data: any) => void;
}) {
  // add margin to the placeholder element
  useEffect(() => {
    // set initial styles to all items
    boardList.forEach((item) => {
      const itemElement = document.getElementById(item.id.toString());
      if (itemElement) {
        itemElement.style.marginBottom = gap;
        itemElement.style.marginTop = '0px';
      }
    });

    if (placeholder) {
      const placeholderElement = document.getElementById(placeholder.id);
      const space = `calc(${gap} + ${placeholder.height})`;
      if (placeholderElement) {
        if (placeholder.instant) {
          placeholderElement.style.transition = '0s';
        }
        if (placeholder.above) {
          placeholderElement.style.marginTop = space;
        } else {
          placeholderElement.style.marginBottom = space;
        }
        setTimeout(() => {
          placeholderElement.style.transition = '0.2s';
        }, 0);
      }
    }
  }, [placeholder, gap, boardList]);

  return (
    <div>
      <h3>Board List</h3>
      <div
        id={id}
        style={{
          width: width,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'white',
          boxSizing: 'content-box',
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
                dragElement.style.position = 'absolute';
                dragElement.style.background = 'cyan';
                dragElement.style.top = initialPosition.y1 + 'px';
                dragElement.style.left = initialPosition.x1 + 'px';
                dragElement.style.zIndex = '100';
                dragElement.style.marginBottom = '0px';
                dragElement.style.transition = '0s';
              }
              onDragStart(e, data);
              handleDrag(e, data);
            }}
            onDrag={(e, data) => {
              handleDrag(e, data);
            }}
            onStop={(e, data) => {
              const { x, y } = data;
              const id = data.node.id;
              const initialPosition = itemPositions.get(id);
              if (!initialPosition) return;
              const dragElement = document.getElementById(id);
              if (dragElement) {
                dragElement.style.position = 'initial';
                dragElement.style.background = 'darkgray';
                dragElement.style.top = 'initial';
                dragElement.style.left = 'initial';
                dragElement.style.zIndex = 'initial';
                dragElement.style.marginBottom = gap;
                dragElement.style.transition = '0.2s';
              }

              onDragStop(e, data);
            }}
          >
            <div
              id={item.id.toString()}
              style={{
                width: width,
                height: itemHeight,
                outline: '1px solid blue',
                // if not first element, add gap to marginTop
                marginBottom: gap,

                display: 'flex',
                background: 'darkgray',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: '0.2s',
              }}
            >
              <h4>{item.title}</h4>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
