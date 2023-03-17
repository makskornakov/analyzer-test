import { useEffect, useMemo, useState } from 'react';

import { BoardContainer } from './Board.styled';
import { BoardList } from './BoardList';
import { BoardItemProps } from './Item';

export interface BoardData {
  itemArrays: BoardItemProps[][]; // array of arrays of items
}
interface BoardListOrder {
  items: string[][]; // array of arrays of items
}

interface Position {
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  placeholder?: boolean;
  // moved?: boolean;
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

interface PlaceHolderState {
  movedId: string;
  above: boolean;
}

export default function Board({ boardData }: { boardData: BoardData }): JSX.Element {
  const [boardListsOrder, setBoardListsOrder] = useState<BoardListOrder>({
    items: boardData.itemArrays.map((itemArray) => itemArray.map((item) => item.id)),
  });

  const [dynamicBoardData, setDynamicBoardData] = useState(boardData);
  const [ItemsPositions, setItemsPositions] = useState<PositionMap>();

  const [placeHolderState, setPlaceHolderState] = useState<PlaceHolderState | null>(null);

  const [lastDraggedId, setLastDraggedId] = useState<string | null>(null);
  const [draggedItemPosition, setDraggedItemPosition] = useState<Position | null>(null);

  // update the boardData when the boardListsOrder changes
  useEffect(() => {
    // control placeholder
    setDynamicBoardData((prev) => {
      const newBoardData = { ...prev };
      newBoardData.itemArrays = boardListsOrder.items.map((itemArray) =>
        itemArray.map((itemId) => {
          const item = boardData.itemArrays.flat().find((item) => item.id === itemId);
          if (!item) throw new Error('Item not found');
          return item;
        }),
      );
      return newBoardData;
    });
  }, [boardData.itemArrays, boardListsOrder]);

  // update the boardData when the placeHolderState changes
  useEffect(() => {
    // control placeholder
    setDynamicBoardData((prev) => {
      const newBoardData = { ...prev };
      // remove all placeholders from boardData

      // insert placeholder if needed
      if (placeHolderState) {
        // if there are placeholders in the boardData return
        const placeholderExists = newBoardData.itemArrays.flat().find((item) => item.placeholder);
        if (placeholderExists) return newBoardData;

        const { movedId, above } = placeHolderState;
        newBoardData.itemArrays.forEach((itemArray) => {
          const index = itemArray.findIndex((item) => item.id === movedId);
          if (index === -1) return;
          const placeholder = {
            id: `${movedId}placeholder`,
            content: `placeholder ${above ? 'above' : 'below'} ${movedId}`,
            placeholder: true,
          };
          if (above) {
            itemArray.splice(index, 0, placeholder);
          } else {
            itemArray.splice(index + 1, 0, placeholder);
          }
        });
      } else {
        newBoardData.itemArrays.forEach((itemArray) => {
          const index = itemArray.findIndex((item) => item.placeholder);
          if (index !== -1) {
            itemArray.splice(index, 1);
          }
        });
      }
      // remove all placeholders from boardData
      return newBoardData;
    });
  }, [placeHolderState]);

  useEffect(() => {
    setItemsPositions((prev) => {
      const newMap = new Map<string, Position>();
      dynamicBoardData.itemArrays.forEach((itemArray) => {
        itemArray.forEach((item) => {
          const itemElement = document.getElementById(item.id);
          if (!itemElement) return;
          const isDragged = item.id === lastDraggedId;

          const itemPosition = isDragged
            ? prev?.get(item.id) || getRect(itemElement, 'board-container')
            : getRect(itemElement, 'board-container');

          newMap.set(item.id, itemPosition);
        });
      });
      return newMap;
    });
  }, [dynamicBoardData, lastDraggedId, draggedItemPosition]); // draggedItemPosition is not used, it is used to trigger a re-render

  function getFoundItems(theId: string, coordinates: Position) {
    const foundItems = new Map<string, Position>();
    if (!ItemsPositions) return;
    ItemsPositions.forEach((item, id) => {
      // if (item.placeholder) return;
      // if there is placeholder in id
      // if (id.includes('placeholder')) return;

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
  function getOverlap(coordinates: Position, item: Position) {
    const xOverlap =
      Math.max(0, Math.min(coordinates.x2, item.x2) - Math.max(coordinates.x1, item.x1)) /
      (coordinates.x2 - coordinates.x1);
    const yOverlap =
      Math.max(0, Math.min(coordinates.y2, item.y2) - Math.max(coordinates.y1, item.y1)) /
      (coordinates.y2 - coordinates.y1);
    const overlap = xOverlap * yOverlap;
    return {
      overlap,
      xOverlap,
      yOverlap,
    };
  }

  const checkIntersection = (theId: string) => {
    const theDiv = document.getElementById(theId);
    if (!theDiv) return;
    const coordinates = getRect(theDiv, 'board-container');

    // check if the dragged item is intersecting with an existing placeholder
    if (placeHolderState) {
      const { movedId, above } = placeHolderState;
      const placeholderId = `${movedId}placeholder`;
      const placeHolderParentId = movedId;
      const placeholder = ItemsPositions?.get(placeholderId);
      const placeHolderParent = ItemsPositions?.get(placeHolderParentId);
      if (placeholder && placeHolderParent) {
        const overlap = getOverlap(coordinates, placeholder);
        const parentOverlap = getOverlap(coordinates, placeHolderParent);
        console.log(overlap, parentOverlap);
        // if no overlap, remove the placeholder
        const wrongSide = above
          ? coordinates.y1 > placeHolderParent.y1
          : coordinates.y1 < placeHolderParent.y1;
        if (
          (overlap.overlap === 0 && parentOverlap.overlap === 0) ||
          wrongSide
          // (overlap.yOverlap < 0.5 && !wrongSide && parentOverlap.overlap === 0)
        ) {
          setPlaceHolderState(null);
        }
        return;
        // return;
      }
    }

    // go through all items and check if the dragged item is intersecting with any of them
    const foundItems = getFoundItems(theId, coordinates);
    console.log(foundItems);
    if (!foundItems) {
      // check if the dragged item is intersecting with any of the lists
      // setPlaceHolderState(null);

      return;
    }

    const maxOverlap = {
      id: '',
      overlap: 0,
      above: false,
    };
    foundItems.forEach((item, id) => {
      if (item.placeholder) return;
      if (id.includes('placeholder')) return;
      // check which is intersecting the most

      const overlap = getOverlap(coordinates, item);
      // console.log(overlap);

      // const placeholder = item.placeholder;

      if (overlap.overlap > maxOverlap.overlap && overlap.overlap > 0.02) {
        maxOverlap.id = id;
        maxOverlap.overlap = overlap.overlap;
      }
    });

    if (maxOverlap.id) {
      // if (maxOverlap.id === placeHolderState?.movedId) return;
      // check that the item is not a placeholder

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

      // if (placeHolderState) return;
      const above = grabbedItemPosition.y1 <= intersectingItemPosition.y1;

      const newPlaceholder = {
        movedId: `${maxOverlap.id}`,
        above,
      };
      setPlaceHolderState((prev) => (prev !== newPlaceholder ? newPlaceholder : prev));
    }
    // check if the placeholder is still intersecting with the dragged item

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
                setDraggedItemPosition(ItemsPositions?.get(id) || null);
                console.log('drag started', ItemsPositions?.get(id));
                const element = document.getElementById(id);
                if (!element) return;

                // set position to absolute

                element.style.position = 'absolute';
                // set top and left to the current position
                const itemPosition = ItemsPositions?.get(id);
                if (!itemPosition) return;
                element.style.top = `${itemPosition.y1}px`;
                element.style.left = `${itemPosition.x1}px`;
                setLastDraggedId(id);

                // find the element in the dynamicBoardData, check if its not the last one and add a placeholder to the next one above, if it is the last one, add a placeholder to itself below
                const itemIndex = dynamicBoardData.itemArrays[index].findIndex(
                  (item) => item.id === id,
                );
                if (itemIndex === -1) return;
                const notLast = itemIndex !== dynamicBoardData.itemArrays[index].length - 1;
                const targetItemIndex = notLast ? itemIndex + 1 : itemIndex - 1;
                const targetItemId = dynamicBoardData.itemArrays[index][targetItemIndex].id;

                const newPlaceholder = {
                  movedId: `${targetItemId}`,
                  above: notLast,
                };
                setPlaceHolderState((prev) => (prev !== newPlaceholder ? newPlaceholder : prev));

                console.log('huy');
              }}
              onEnd={(id) => {
                const element = document.getElementById(id);
                if (!element) return;

                setPlaceHolderState(null);
                setDraggedItemPosition(null);
                // set position to initial
                element.style.position = 'initial';
                // set top and left to the current position
                element.style.top = 'initial';
                element.style.left = 'initial';

                // ! swap test
                // const newBoardListsOrder = { ...boardListsOrder };
                // newBoardListsOrder.items[0].push(
                //   newBoardListsOrder.items[0].shift()!
                // );
                // setBoardListsOrder(newBoardListsOrder);

                //

                // setItemsPositions(returnArray);
                // clearPlaceHolder();
                // setDraggedId(null);
              }}
            />
          </div>
        ))}
      </BoardContainer>
    </>
  );
}
