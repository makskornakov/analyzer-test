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

function BoardItem({
  id,
  content,
  dragFunction,
}: BoardItemProps & {
  dragFunction: (e: MouseEvent | TouchEvent, id: string) => void;
}) {
  const [controlPosition, setControlPosition] = useState<ControlPosition>({
    x: 0,
    y: 0,
  });

  const onDragFunction: DraggableEventHandler = (e, data) => {
    const thisId = data.node.id;
    dragFunction(e as MouseEvent, thisId);

    const cords = {
      x: data.x,
      y: data.y,
    };
    setControlPosition(cords);
  };
  return (
    <Draggable
      defaultPosition={{ x: 0, y: 0 }}
      position={controlPosition}
      onStart={onStartFunction}
      onDrag={onDragFunction}
      onStop={onStopFunction}
    >
      <Item id={id}>
        <span>{content}</span>
      </Item>
    </Draggable>
  );
}

function BoardList({
  items,
  dragFunction,
}: {
  items: BoardItemProps[];
  dragFunction: (e: MouseEvent | TouchEvent, id: string) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1em',
      }}
    >
      {items.map((item) => (
        <BoardItem
          key={item.id}
          id={item.id}
          content={item.content}
          dragFunction={dragFunction}
        />
      ))}
    </div>
  );
}

export default function Board({
  boardData,
}: {
  boardData: BoardData;
}): JSX.Element {
  const [ItemsPositions, setItemsPositions] = useState<
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
    setItemsPositions(returnArray);
  }, [boardData]);

  useEffect(() => {
    console.log(ItemsPositions);
  }, [ItemsPositions]);
  const checkIntersection = (e: MouseEvent | TouchEvent, id: string) => {
    // mouse coordinates
    const mouseCoordinates = e as MouseEvent;
    const boardContainer = document.getElementById('board-container');
    if (!boardContainer) return;
    const boardContainerRect = boardContainer.getBoundingClientRect();
    const mouseCords = {
      x: mouseCoordinates.clientX - boardContainerRect.x,
      y: mouseCoordinates.clientY - boardContainerRect.y,
    };

    // go through all items and check if mouse is inside
    ItemsPositions.forEach((item) => {
      if (
        mouseCords.x > item.position.x1 &&
        mouseCords.x < item.position.x2 &&
        mouseCords.y > item.position.y1 &&
        mouseCords.y < item.position.y2
      ) {
        // set the background color of the item to red
        const itemElement = document.getElementById(item.id);
        if (!itemElement || item.id === id) return;
        itemElement.style.backgroundColor = 'red';
      } else {
        // set the background color of the item to white
        const itemElement = document.getElementById(item.id);
        if (!itemElement) return;
        itemElement.style.backgroundColor = 'white';
      }
    });

    console.log(mouseCords);

    // setControlPosition(coordinates);
  };

  return (
    <>
      <h2>Draggable lists</h2>
      <BoardContainer id="board-container">
        {boardData.itemArrays.map((itemArray, index) => (
          <div key={index}>
            <BoardList items={itemArray} dragFunction={checkIntersection} />
          </div>
        ))}
      </BoardContainer>
    </>
  );
}
