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

    const theDiv = e.target as HTMLDivElement;
    const theDivRect = theDiv.getBoundingClientRect();
    const coordinates = {
      x1: theDivRect.x - boardContainerRect.x,
      y1: theDivRect.y - boardContainerRect.y,
      x2: theDivRect.x + theDivRect.width - boardContainerRect.x,
      y2: theDivRect.y + theDivRect.height - boardContainerRect.y,
    };

    // go through all items and check if the dragged item is intersecting with any of them
    const foundItems = [] as {
      id: string;
      position: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
      };
    }[];

    ItemsPositions.forEach((item) => {
      if (item.id === id) return;
      if (
        coordinates.x1 < item.position.x2 &&
        coordinates.x2 > item.position.x1 &&
        coordinates.y1 < item.position.y2 &&
        coordinates.y2 > item.position.y1
      ) {
        foundItems.push(item);
      }
      // reset the background color
      const itemElement = document.getElementById(item.id);
      if (!itemElement) return;
      itemElement.style.backgroundColor = 'white';
    });

    const maxOverlap = {
      id: '',
      overlap: 0,
    };
    foundItems.forEach((item) => {
      // check which is intersecting the most
      const xOverlap =
        Math.max(
          0,
          Math.min(coordinates.x2, item.position.x2) -
            Math.max(coordinates.x1, item.position.x1)
        ) /
        (coordinates.x2 - coordinates.x1);
      const yOverlap =
        Math.max(
          0,
          Math.min(coordinates.y2, item.position.y2) -
            Math.max(coordinates.y1, item.position.y1)
        ) /
        (coordinates.y2 - coordinates.y1);
      const overlap = xOverlap * yOverlap;
      if (overlap > maxOverlap.overlap) {
        maxOverlap.id = item.id;
        maxOverlap.overlap = overlap;
      }
    });

    if (maxOverlap.id) {
      // set the background of the item that is intersecting the most to red
      const itemElement = document.getElementById(maxOverlap.id);
      if (itemElement) {
        itemElement.style.backgroundColor = 'red';
      }
    }

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
