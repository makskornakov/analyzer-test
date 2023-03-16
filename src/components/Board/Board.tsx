import { useEffect, useMemo, useState } from 'react';

import { BoardContainer } from './Board.styled';
import { BoardList } from './BoardList';
import { BoardItemProps } from './Item';

export interface BoardData {
  itemArrays: BoardItemProps[][]; // array of arrays of items
}

interface Position {
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  placeholder?: boolean;
  moved?: boolean;
}

type PositionMap = Map<string, Position>;

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

export default function Board({ boardData }: { boardData: BoardData }): JSX.Element {
  const [dynamicBoardData, setDynamicBoardData] = useState(boardData);
  const [ItemsPositions, setItemsPositions] = useState<PositionMap>();

  useEffect(() => {
    const returnArray = new Map<string, Position>();

    dynamicBoardData.itemArrays.forEach((itemArray) => {
      itemArray.forEach((item) => {
        const itemElement = document.getElementById(item.id);
        if (!itemElement) return;
        // transfer placeholder and moved to the position object
        const itemPosition = getRect(itemElement, 'board-container');
        itemPosition.placeholder = item.placeholder;
        itemPosition.moved = item.moved;
        returnArray.set(item.id, itemPosition);
      });
    });
    console.log(returnArray);
    setItemsPositions(returnArray);
  }, [dynamicBoardData]);

  // useEffect(() => {
  //   // console.log(ItemsPositions);
  // }, [ItemsPositions]);

  function getFoundItems(theId: string, coordinates: Position) {
    const foundItems = new Map<string, Position>();
    if (!ItemsPositions) return;
    ItemsPositions.forEach((item, id) => {
      // if (item.placeholder) return;

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
    return foundItems;
  }

  const checkIntersection = (theId: string) => {
    const theDiv = document.getElementById(theId);
    if (!theDiv) return;
    const coordinates = getRect(theDiv, 'board-container');

    // go through all items and check if the dragged item is intersecting with any of them
    const foundItems = getFoundItems(theId, coordinates);
    if (!foundItems) return;

    const maxOverlap = {
      id: '',
      overlap: 0,
    };
    foundItems.forEach((item, id) => {
      // check which is intersecting the most
      const xOverlap =
        Math.max(0, Math.min(coordinates.x2, item.x2) - Math.max(coordinates.x1, item.x1)) /
        (coordinates.x2 - coordinates.x1);
      const yOverlap =
        Math.max(0, Math.min(coordinates.y2, item.y2) - Math.max(coordinates.y1, item.y1)) /
        (coordinates.y2 - coordinates.y1);
      const overlap = xOverlap * yOverlap;
      if (overlap > maxOverlap.overlap && overlap > 0.02) {
        maxOverlap.id = id;
        maxOverlap.overlap = overlap;
      }
    });

    if (maxOverlap.id) {
      // check that the item is not a placeholder
      if (maxOverlap.id.includes('placeholder')) return;
      // set the background of the item that is intersecting the most to red
      const itemElement = document.getElementById(maxOverlap.id);
      if (itemElement) {
        itemElement.style.backgroundColor = '#b4b4b4';
      }

      // understand weather the grabbed item is above or below the intersecting item
      const grabbedItem = document.getElementById(theId);
      if (!grabbedItem) return;
      const grabbedItemPosition = getRect(grabbedItem, 'board-container');
      const intersectingItem = document.getElementById(maxOverlap.id);
      if (!intersectingItem) return;
      const intersectingItemPosition = getRect(intersectingItem, 'board-container');

      const above = grabbedItemPosition.y1 <= intersectingItemPosition.y1;
      if (above) {
        addPlaceholderAboveOrBelow(maxOverlap.id, true, setDynamicBoardData);
      } else {
        addPlaceholderAboveOrBelow(maxOverlap.id, false, setDynamicBoardData);
      }
    }
    const returnArray = new Map<string, Position>();

    dynamicBoardData.itemArrays.forEach((itemArray) => {
      itemArray.forEach((item) => {
        const itemElement = document.getElementById(item.id);
        if (!itemElement) return;
        // transfer placeholder and moved to the position object
        const itemPosition = getRect(itemElement, 'board-container');
        itemPosition.placeholder = item.placeholder;
        itemPosition.moved = item.moved;
        returnArray.set(item.id, itemPosition);
      });
    });
    console.log(returnArray);
    setItemsPositions(returnArray);

    //! don't delete this
    // find the new position of the dragged item and set it
    // const itemElement = document.getElementById(theId);
    // if (!itemElement) return;

    // const itemPosition = getRect(itemElement, 'board-container');
    // setItemsPositions((prev) => {
    //   const newMap = new Map(prev);
    //   newMap.set(theId, itemPosition);
    //   return newMap;
    // });
  };

  return (
    <>
      <h2>Draggable lists</h2>
      <BoardContainer id="board-container">
        {dynamicBoardData.itemArrays.map((itemArray, index) => (
          <div key={index}>
            <BoardList
              items={itemArray}
              dragFunction={checkIntersection}
              onStart={(id) => {
                const element = document.getElementById(id);
                if (!element) return;
                // set position to absolute

                element.style.position = 'absolute';
                // set top and left to the current position
                const itemPosition = ItemsPositions?.get(id);
                if (!itemPosition) return;
                element.style.top = `${itemPosition.y1}px`;
                element.style.left = `${itemPosition.x1}px`;

                // rerender the ItemsPositions
                const returnArray = new Map<string, Position>();

                dynamicBoardData.itemArrays.forEach((itemArray) => {
                  itemArray.forEach((item) => {
                    const itemElement = document.getElementById(item.id);
                    if (!itemElement) return;

                    const itemPosition = getRect(itemElement, 'board-container');
                    returnArray.set(item.id, itemPosition);
                  });
                });
                console.log(returnArray);
                setItemsPositions(returnArray);
              }}
              onEnd={(id) => {
                const element = document.getElementById(id);
                if (!element) return;
                // set position to initial
                element.style.position = 'initial';
                // set top and left to the current position
                element.style.top = 'initial';
                element.style.left = 'initial';
                const returnArray = new Map<string, Position>();

                dynamicBoardData.itemArrays.forEach((itemArray) => {
                  itemArray.forEach((item) => {
                    const itemElement = document.getElementById(item.id);
                    if (!itemElement) return;
                    // transfer placeholder and moved to the position object
                    const itemPosition = getRect(itemElement, 'board-container');
                    itemPosition.placeholder = item.placeholder;
                    itemPosition.moved = item.moved;
                    returnArray.set(item.id, itemPosition);
                  });
                });
                console.log(returnArray);
                setItemsPositions(returnArray);
              }}
            />
          </div>
        ))}
      </BoardContainer>
    </>
  );
}

function addPlaceholderAboveOrBelow(
  id: string,
  above: boolean,
  setDynamicBoardData: React.Dispatch<React.SetStateAction<BoardData>>,
) {
  // Add a placeholder above or below the item in the BoardList
  setDynamicBoardData((prev) => {
    // find id in prev.itemArrays
    const itemArrayIndex = prev.itemArrays.findIndex((itemArray) =>
      itemArray.find((item) => item.id === id),
    );
    if (itemArrayIndex === -1) return prev;
    const itemIndex = prev.itemArrays[itemArrayIndex].findIndex((item) => item.id === id);
    if (itemIndex === -1) return prev;

    const newItemArray = [...prev.itemArrays[itemArrayIndex]];
    // check if the item that is being moved has the moved property
    if (newItemArray[itemIndex].moved) return prev;
    if (newItemArray[itemIndex].placeholder) return prev;
    // add moved: true to the item that is being moved
    newItemArray[itemIndex] = { ...newItemArray[itemIndex], moved: true };
    newItemArray.splice(itemIndex + (above ? 0 : 1), 0, {
      id: `${id}placeholder`,
      placeholder: true,
      content: 'placeholder',
    });
    const newItemArrays = [...prev.itemArrays];
    newItemArrays[itemArrayIndex] = newItemArray;
    return { ...prev, itemArrays: newItemArrays };
  });

  // const placeholderExists = document.getElementById(`${id}placeholder`);
  // if (placeholderExists) {
  //   placeholderExists.parentElement?.removeChild(placeholderExists);
  // }
  // const theDiv = document.getElementById(id);
  // if (!theDiv) return;
  // const theDivParent = theDiv.parentElement;
  // if (!theDivParent) return;
  // const copyDiv = theDiv.cloneNode() as HTMLElement;
  // copyDiv.id = copyDiv.id + 'placeholder';
  // copyDiv.style.opacity = '0.4';
  // copyDiv.style.color = 'transparent';
  // theDivParent.insertBefore(copyDiv, theDiv);
  // use PlaceholderItemStyled
  // type insertProps = <T>(node: T, child: Node | null) => T;
  // theDivParent?.insertBefore()
}
