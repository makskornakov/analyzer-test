import { BoardListContent, Position } from './Board';
import type { Placeholder } from './Board';
import Draggable from 'react-draggable';
import { useEffect } from 'react';

export default function BoardList({
  id,
  boardList,
  itemPositions,
  placeholder,
  dragItem,
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
  dragItem: string | null;
  width: string;
  itemHeight: string;
  gap: string;
  handleDrag: (e: any, data: any) => void;
  onDragStart: (e: any, data: any) => void;
  onDragStop: (e: any, data: any) => void;
}) {
  // add margin to the placeholder element
  useEffect(() => {
    // set initial styles to all items but skip the placeholder item and the item that is being dragged
    boardList.forEach((item) => {
      if (item.id.toString() === placeholder?.id) return;
      if (item.id.toString() === dragItem) return;
      const itemElement = document.getElementById(item.id.toString());
      if (itemElement) {
        itemElement.style.transition = '0s';
        itemElement.style.marginBottom = gap;
        itemElement.style.marginTop = '0px';
        setTimeout(() => {
          itemElement.style.transition = '0.2s';
        }, 0);
      }
    });

    if (placeholder) {
      const placeholderElement = document.getElementById(placeholder.id);
      // if the placeholder is going to be the first item or the last item in the list dont multiply the gap by 2
      // find the index of the placeholder in the boardList

      const newArrToFindIndex = boardList.filter(
        (item) => String(item.id) !== dragItem
      );
      console.log('newArrToFindIndex', newArrToFindIndex);
      const placeholderIndexInNewArr = newArrToFindIndex.findIndex(
        (item) => String(item.id) === placeholder.id
      );
      if (placeholderIndexInNewArr === -1) return;

      console.log('placeholderIndexInNewArr', placeholderIndexInNewArr);
      console.log('id', placeholder.id);
      const firstOrLastItem =
        placeholderIndexInNewArr === 0 && placeholder.above;

      const space = `calc(${gap}${firstOrLastItem ? '' : '* 2'} + ${
        placeholder.height
      })`;
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
        }, 200);
      }
    }
  }, [placeholder, gap, boardList, dragItem]);

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
          // padding: '10px',
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
                dragElement.style.transition = 'none';
              }
              onDragStart(e, data);
              handleDrag(e, data);
            }}
            onDrag={(e, data) => {
              handleDrag(e, data);
            }}
            onStop={(e, data) => {
              onDragStop(e, data);

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
                dragElement.style.transitionDuration = '0.2s';
                dragElement.style.transitionProperty = 'transform, background';
                dragElement.style.marginBottom = gap;
                setTimeout(() => {
                  dragElement.style.transitionProperty =
                    'transform, background, margin';
                }, 200);
              }
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
                transitionDuration: '0.2s',
                transitionProperty: 'margin, transform, background',
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
