import { BoardListContent, Position } from './Board';
import Draggable from 'react-draggable';
import type { CSSProperties } from 'styled-components';

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
  // add margin to the placeholder element
  // useEffect(() => {
  //   // set initial styles to all items but skip the placeholder item and the item that is being dragged
  //   boardList.forEach((item) => {
  //     if (item.id.toString() === placeholder?.id) return;
  //     if (item.id.toString() === dragItem) return;
  //     const itemElement = document.getElementById(item.id.toString());
  //     if (itemElement) {
  //       // itemElement.style.transition = '0s';
  //       itemElement.style.marginTop = '0px';
  //       itemElement.style.marginBottom = '0px';
  //       // setTimeout(() => {
  //       //   itemElement.style.transition = '0.2s';
  //       // }, 0);
  //     }
  //   });

  //   if (placeholder) {
  //     const placeholderElement = document.getElementById(placeholder.id);
  //     // if the placeholder is going to be the first item or the last item in the list dont multiply the gap by 2
  //     // find the index of the placeholder in the boardList

  //     const newArrToFindIndex = boardList.filter(
  //       (item) => String(item.id) !== dragItem
  //     );
  //     console.log('newArrToFindIndex', newArrToFindIndex);
  //     const placeholderIndexInNewArr = newArrToFindIndex.findIndex(
  //       (item) => String(item.id) === placeholder.id
  //     );
  //     if (placeholderIndexInNewArr === -1) return;

  //     console.log('placeholderIndexInNewArr', placeholderIndexInNewArr);
  //     console.log('id', placeholder.id);

  //     const space = `calc(${gap} + ${placeholder.height})`;
  //     if (placeholderElement) {
  //       // if (placeholder.instant) {
  //       //   placeholderElement.style.transition = '0s';
  //       // }
  //       if (placeholder.above) {
  //         placeholderElement.style.marginTop = space;
  //       } else {
  //         placeholderElement.style.marginBottom = space;
  //       }
  //       // setTimeout(() => {
  //       //   placeholderElement.style.transition = '0.2s';
  //       // }, 200);
  //     }
  //   }
  // }, [placeholder, gap, boardList, dragItem]);

  return (
    <div>
      <h3>Board List</h3>
      <div
        id={id}
        style={{
          width: width,
          // borderWidth: '2px',
          // borderStyle: 'solid',
          // borderColor: 'lightgray',
          boxSizing: 'content-box',
          // borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          // userSelect: 'none',
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
              // const parent = document.getElementById(id);
              // if (!parent) return;
              // parent.style.cursor = 'grabbing';
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
            <div
              id={item.id.toString()}
              style={{
                width: width,
                height: itemHeight,

                userSelect: 'none',
                cursor: 'grab',

                transition: `${transitionDuration / 1000}s`,

                ...itemStyle,
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
