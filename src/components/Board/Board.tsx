import { useEffect, useState } from 'react';

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
  const [ItemsPositions, setItemsPositions] = useState<PositionMap>();

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

  // useEffect(() => {
  //   // console.log(ItemsPositions);
  // }, [ItemsPositions]);

  function getFoundItems(theId: string, coordinates: Position) {
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
      // set the background of the item that is intersecting the most to red
      const itemElement = document.getElementById(maxOverlap.id);
      if (itemElement) {
        itemElement.style.backgroundColor = '#b4b4b4';
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
