import { BoardContainer, Item } from './Board.styled';
import Draggable, {
  ControlPosition,
  DraggableEventHandler,
} from 'react-draggable';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface BoardItemProps {
  id: string;
  content: string;
}

export interface BoardData {
  itemArrays: BoardItemProps[][]; // array of arrays of items
}

interface Position {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

type PositionMap = Map<string, Position>;

const onStartFunction: DraggableEventHandler = (e, data) => {
  const theDiv = data.node;
  // set the z-index of the div to 1
  theDiv.style.zIndex = '1';
  theDiv.style.backgroundColor = 'cyan';

  console.log('onStart', e, data);
};

function getRect(item: Element, containerId: string): Position {
  const container = document.getElementById(containerId);
  if (!container) return { x1: 0, y1: 0, x2: 0, y2: 0 };
  const containerRect = container.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const itemPosition = {
    x1: itemRect.x - containerRect.x,
    y1: itemRect.y - containerRect.y,
    x2: itemRect.x + itemRect.width - containerRect.x,
    y2: itemRect.y + itemRect.height - containerRect.y,
  };
  return itemPosition;
}

function BoardItem({
  id,
  content,
  dragFunction,
  stopFunction,
}: BoardItemProps & {
  dragFunction: (id: string) => void;
  stopFunction: DraggableEventHandler;
}) {
  const [controlPosition, setControlPosition] = useState<ControlPosition>({
    x: 0,
    y: 0,
  });

  const onDragFunction: DraggableEventHandler = (e, data) => {
    const thisId = data.node.id;
    const theDiv = data.node;

    dragFunction(thisId);

    // setControlPosition({
    //   x: data.x,
    //   y: data.y,
    // });
  };
  return (
    <Draggable
      defaultPosition={{ x: 0, y: 0 }}
      position={controlPosition}
      onStart={onStartFunction}
      onDrag={onDragFunction}
      onStop={stopFunction}
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
  stopFunction,
}: {
  items: BoardItemProps[];
  dragFunction: (id: string) => void;
  stopFunction: DraggableEventHandler;
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
          stopFunction={stopFunction}
        />
      ))}
    </div>
  );
}

export default function Board({
  boardData,
  setBoardData,
}: {
  boardData: BoardData;
  setBoardData: (newBoardData: BoardData) => void;
}): JSX.Element {
  // states for each item's position

  const [ItemsPositions, setItemsPositions] = useState<PositionMap>();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [overItem, setOverItem] = useState<string | null>(null);

  function changePosition(id: string, targetId: string) {
    // get the item's position
    const itemPosition = ItemsPositions?.get(id);
    if (!itemPosition) return;

    // get the target item's position
    const targetPosition = ItemsPositions?.get(targetId);
    if (!targetPosition) return;

    // save the item
    const item = boardData.itemArrays[0].find((item) => item.id === id);
    if (!item) return;

    // remove the item from the array
    const newArray = boardData.itemArrays[0].filter((item) => item.id !== id);
    if (!newArray) return;

    // insert the item in the new position in the array
    const index = newArray.findIndex((item) => item.id === targetId);
    newArray.splice(index, 0, item);

    // update the state
    const newBoardData = {
      ...boardData,
      itemArrays: [newArray],
    };
    setBoardData(newBoardData);
  }

  const onStopFunction: DraggableEventHandler = (e, data) => {
    const theDiv = data.node;
    // set the z-index of the div to initial
    theDiv.style.zIndex = 'initial';
    theDiv.style.backgroundColor = 'white';

    console.log('onStop', e, data);

    if (overItem) {
      changePosition(data.node.id, overItem);
      setOverItem(null);

      // rerennder the items
    }
  };

  useEffect(() => {
    const returnArray = new Map<string, Position>();

    boardData.itemArrays.forEach((itemArray) => {
      itemArray.forEach((item) => {
        const itemElement = document.getElementById(item.id);
        if (!itemElement) return;

        const itemPosition = getRect(itemElement, 'board-container');
        returnArray.set(item.id, itemPosition);
      });
    });
    setItemsPositions(returnArray);
  }, [boardData]);

  useEffect(() => {
    // console.log(ItemsPositions);
  }, [ItemsPositions]);

  const checkIntersection = (theId: string) => {
    const theDiv = document.getElementById(theId);
    if (!theDiv) return;
    const coordinates = getRect(theDiv, 'board-container');

    // go through all items and check if the dragged item is intersecting with any of them
    const foundItems = new Map<string, Position>();
    if (!ItemsPositions) return;
    ItemsPositions.forEach((item, id) => {
      if (id === theId) return;
      // reset the background color
      const itemElement = document.getElementById(id);
      if (!itemElement) return;
      itemElement.style.backgroundColor = 'white';

      if (
        coordinates.x1 < item.x2 &&
        coordinates.x2 > item.x1 &&
        coordinates.y1 < item.y2 &&
        coordinates.y2 > item.y1
      ) {
        foundItems.set(id, item);
      }
    });

    const maxOverlap = {
      id: '',
      overlap: 0,
    };
    foundItems.forEach((item, id) => {
      // check which is intersecting the most
      const xOverlap =
        Math.max(
          0,
          Math.min(coordinates.x2, item.x2) - Math.max(coordinates.x1, item.x1)
        ) /
        (coordinates.x2 - coordinates.x1);
      const yOverlap =
        Math.max(
          0,
          Math.min(coordinates.y2, item.y2) - Math.max(coordinates.y1, item.y1)
        ) /
        (coordinates.y2 - coordinates.y1);
      const overlap = xOverlap * yOverlap;
      if (overlap > maxOverlap.overlap && overlap > 0.02) {
        maxOverlap.id = id;
        maxOverlap.overlap = overlap;
      }
    });
    // reset the overItem
    setOverItem(null);

    if (maxOverlap.id) {
      // set the background of the item that is intersecting the most to red
      const itemElement = document.getElementById(maxOverlap.id);
      if (itemElement) {
        itemElement.style.backgroundColor = 'red';
        setOverItem(maxOverlap.id);
      }
    }

    // find the new position of the dragged item and set it
    const itemElement = document.getElementById(theId);
    if (!itemElement) return;

    const itemPosition = getRect(itemElement, 'board-container');
    setItemsPositions((prev) => {
      const newMap = new Map(prev);
      newMap.set(theId, itemPosition);
      return newMap;
    });
  };
  // use memo function to prevent rerendering of the lists
  const renderLists = useMemo(
    () =>
      boardData.itemArrays.map((itemArray, index) => (
        <div key={index}>
          <BoardList
            items={itemArray}
            dragFunction={checkIntersection}
            stopFunction={onStopFunction}
          />
        </div>
      )),
    [boardData.itemArrays, checkIntersection, onStopFunction]
  );

  return (
    <>
      <h2>Draggable lists</h2>
      <BoardContainer id="board-container">{renderLists}</BoardContainer>
    </>
  );
}
