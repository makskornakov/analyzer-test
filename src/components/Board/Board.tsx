import { BoardContainer, Item } from './Board.styled';
import Draggable, {
  ControlPosition,
  DraggableEventHandler,
} from 'react-draggable';
import { useEffect, useRef, useState } from 'react';

export interface BoardItemProps {
  id: string;
  content: string;
}
export interface BoardData {
  itemArrays: BoardItemProps[][]; // array of arrays of items
}

const onStartFunction: DraggableEventHandler = (e, data) => {
  console.log('onStart', e, data);
};

// const onDragFunction: DraggableEventHandler = (e, data) => {
//   const theDiv = data.node as HTMLDivElement;
//   const theDivRect = theDiv.getBoundingClientRect();
//   const coordinates = {
//     x: theDivRect.x,
//     y: theDivRect.y,
//   };
//   console.log(coordinates);
//   // console.log('onDrag', e, data);
// };

const onStopFunction: DraggableEventHandler = (e, data) => {
  console.log('onStop', e, data);
};

function BoardItem({ id, content }: BoardItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  const onDragFunction: DraggableEventHandler = (e, data) => {
    // mouse coordinates
    const mouseCoordinates = e as MouseEvent;
    const boardContainer = document.getElementById('board-container');
    if (!boardContainer) return;
    const boardContainerRect = boardContainer.getBoundingClientRect();
    const mouseCords = {
      x: mouseCoordinates.clientX - boardContainerRect.x,
      y: mouseCoordinates.clientY - boardContainerRect.y,
    };

    console.log(mouseCords);

    // setControlPosition(coordinates);
  };

  return (
    <Draggable
      defaultPosition={{ x: 0, y: 0 }}
      // position={}
      onStart={onStartFunction}
      onDrag={onDragFunction}
      onStop={onStopFunction}
    >
      <Item id={id} ref={itemRef}>
        <span>{content}</span>
      </Item>
    </Draggable>
  );
}

function BoardList({ items }: { items: BoardItemProps[] }) {
  // const [itemsState, setItemsState] = useState<
  //   { id: string; position: DOMRect }[]
  // >([]);

  // useEffect(() => {
  //   const boardContainer = document.getElementById('board-container');
  //   if (!boardContainer) return;
  //   const boardContainerRect = boardContainer.getBoundingClientRect();
  //   const itemsState = items.map((item) => {
  //     const itemElement = document.getElementById(item.id);
  //     if (!itemElement) return;
  //     const itemRect = itemElement.getBoundingClientRect();
  //     const itemPosition = {
  //       x: itemRect?.x - boardContainerRect?.x,
  //       y: itemRect?.y - boardContainerRect?.y,
  //     };
  //     return {
  //       id: item.id,
  //       position: itemPosition,
  //     };
  //   });
  //   setItemsState(itemsState);
  // }, [items]);

  return (
    <div
      // ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1em',
      }}
    >
      {items.map((item) => (
        <BoardItem key={item.id} id={item.id} content={item.content} />
      ))}
    </div>
  );
}

export default function Board({
  boardData,
}: {
  boardData: BoardData;
}): JSX.Element {
  const [ItemsPosition, setItemsPosition] = useState<
    {
      id: string;
      position: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
      };
    }[]
  >([]);

  useEffect(() => {
    const boardContainer = document.getElementById('board-container');
    if (!boardContainer) return;
    const boardContainerRect = boardContainer.getBoundingClientRect();
    const returnArray = [] as {
      id: string;
      position: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
      };
    }[];
    boardData.itemArrays.forEach((itemArray) => {
      itemArray.forEach((item) => {
        const itemElement = document.getElementById(item.id);
        if (!itemElement) return;
        const itemRect = itemElement.getBoundingClientRect();
        const itemPosition = {
          x1: itemRect.x - boardContainerRect.x,
          y1: itemRect.y - boardContainerRect.y,
          x2: itemRect.x + itemRect.width - boardContainerRect.x,
          y2: itemRect.y + itemRect.height - boardContainerRect.y,
        };
        returnArray.push({
          id: item.id,
          position: itemPosition,
        });
      });
    });
    setItemsPosition(returnArray);
  }, [boardData]);

  useEffect(() => {
    console.log(ItemsPosition);
  }, [ItemsPosition]);

  return (
    <>
      <h2>Draggable lists</h2>
      <BoardContainer id="board-container">
        {boardData.itemArrays.map((itemArray, index) => (
          <div key={index}>
            <BoardList items={itemArray} />
          </div>
        ))}
      </BoardContainer>
    </>
  );
}
