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

export default function Board({
  boardData,
}: {
  boardData: BoardData;
}): JSX.Element {
  const [boardListsOrder, setBoardListsOrder] = useState<BoardListOrder>({
    items: boardData.itemArrays.map((itemArray) =>
      itemArray.map((item) => item.id)
    ),
  });

  const [dynamicBoardData, setDynamicBoardData] = useState(boardData);
  const [ItemsPositions, setItemsPositions] = useState<PositionMap>();

  const [placeHolderState, setPlaceHolderState] =
    useState<PlaceHolderState | null>(null);
  // const [draggedId, setDraggedId] = useState<string | null>(null);

  // update the boardData when the boardListsOrder changes
  useEffect(() => {
    // control placeholder
    setDynamicBoardData((prev) => {
      const newBoardData = { ...prev };
      newBoardData.itemArrays = boardListsOrder.items.map((itemArray) =>
        itemArray.map((itemId) => {
          const item = boardData.itemArrays
            .flat()
            .find((item) => item.id === itemId);
          if (!item) throw new Error('Item not found');
          return item;
        })
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
      newBoardData.itemArrays.forEach((itemArray) => {
        const index = itemArray.findIndex((item) => item.placeholder);
        if (index !== -1) {
          itemArray.splice(index, 1);
        }
      });
      // insert placeholder if needed
      if (placeHolderState) {
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
      }
      return newBoardData;
    });
  }, [placeHolderState]);

  // function controlPlaceHolder(newBoardData: BoardData): BoardData {
  //   // insert placeholder if needed
  //   if (placeHolderState) {
  //     const { movedId, above } = placeHolderState;
  //     newBoardData.itemArrays.forEach((itemArray) => {
  //       const index = itemArray.findIndex((item) => item.id === movedId);
  //       if (index === -1) return;
  //       const placeholder = {
  //         id: `${movedId}placeholder`,
  //         content: 'placeholder',
  //         placeholder: true,
  //       };
  //       if (above) {
  //         itemArray.splice(index, 0, placeholder);
  //       } else {
  //         itemArray.splice(index + 1, 0, placeholder);
  //       }
  //     });
  //   } else if (placeHolderState === null) {
  //     // remove placeholder from boardData
  //     newBoardData.itemArrays.forEach((itemArray) => {
  //       const index = itemArray.findIndex((item) => item.placeholder);
  //       if (index !== -1) {
  //         itemArray.splice(index, 1);
  //       }
  //     });
  //   }
  //   return newBoardData;
  // }
  // use memo to render boardData in the boardListOrder order
  const boardDataToRender = useMemo((): BoardData => {
    const newBoardData = { ...boardData };

    newBoardData.itemArrays = boardListsOrder.items.map((itemArray) =>
      itemArray.map((itemId) => {
        const item = boardData.itemArrays
          .flat()
          .find((item) => item.id === itemId);
        if (!item) throw new Error('Item not found');
        return item;
      })
    );
    return newBoardData;
  }, [boardData, boardListsOrder.items]);

  useEffect(() => {
    const newMap = new Map<string, Position>();
    dynamicBoardData.itemArrays.forEach((itemArray) => {
      itemArray.forEach((item) => {
        const itemElement = document.getElementById(item.id);
        if (!itemElement) return;
        // const isDragged = item.id === draggedId;

        // const itemPosition = isDragged
        //   ? prev?.get(item.id) || getRect(itemElement, 'board')
        //   : getRect(itemElement, 'board');
        const itemPosition = getRect(itemElement, 'board-container');

        newMap.set(item.id, itemPosition);
      });
    });
    console.log(newMap);
    setItemsPositions(newMap);
  }, [dynamicBoardData]);

  // function clearPlaceHolder() {
  // delete from dynamicBoardData
  //   const newBoardData = { ...dynamicBoardData };
  //   newBoardData.itemArrays.forEach((itemArray) => {
  // const index = itemArray.findIndex((item) => item.id === placeHolderId);
  //     if (index !== -1) {
  //       itemArray.splice(index, 1);
  //     }
  //   });
  //   setDynamicBoardData(newBoardData);
  // setPlaceHolderId(null);
  // }
  // useEffect(() => {
  // console.log(ItemsPositions);
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
      if (item.placeholder) return;
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
      console.log(overlap);
      if (overlap > maxOverlap.overlap && overlap > 0.02) {
        maxOverlap.id = id;
        maxOverlap.overlap = overlap;
      }
    });

    if (maxOverlap.id) {
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
      const intersectingItemPosition = getRect(
        intersectingItem,
        'board-container'
      );

      // if (placeHolderId) return;

      // const above = grabbedItemPosition.y1 <= intersectingItemPosition.y1;
      // const placeHolder = above
      if (placeHolderState) return;
      if (grabbedItemPosition.y1 <= intersectingItemPosition.y1)
        setPlaceHolderState({
          movedId: `${maxOverlap.id}`,
          above: true,
        });
      else
        setPlaceHolderState({
          movedId: `${maxOverlap.id}`,
          above: false,
        });

      // // setPlaceHolderId(placeHolder);
      // if (above) {
      //   addPlaceholderAboveOrBelow(maxOverlap.id, true, setDynamicBoardData);
      // } else {
      //   addPlaceholderAboveOrBelow(maxOverlap.id, false, setDynamicBoardData);
      // }
    }

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
                // setDraggedId(id);

                // rerender the ItemsPositions
                // const returnArray = new Map<string, Position>();

                // dynamicBoardData.itemArrays.forEach((itemArray) => {
                //   itemArray.forEach((item) => {
                //     const itemElement = document.getElementById(item.id);
                //     if (!itemElement) return;

                //     const itemPosition = getRect(
                //       itemElement,
                //       'board-container'
                //     );
                //     returnArray.set(item.id, itemPosition);
                //   });
                // });
                // console.log(returnArray);

                // setItemsPositions(returnArray);

                const element = document.getElementById(id);
                if (!element) return;
                // set position to absolute

                element.style.position = 'absolute';
                // set top and left to the current position
                const itemPosition = ItemsPositions?.get(id);
                if (!itemPosition) return;
                element.style.top = `${itemPosition.y1}px`;
                element.style.left = `${itemPosition.x1}px`;
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
                    const itemPosition = getRect(
                      itemElement,
                      'board-container'
                    );
                    itemPosition.placeholder = item.placeholder;
                    returnArray.set(item.id, itemPosition);
                  });
                });
                console.log(returnArray);

                setPlaceHolderState(null);
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

// function addPlaceholderAboveOrBelow(
//   id: string,
//   above: boolean,
//   setDynamicBoardData: React.Dispatch<React.SetStateAction<BoardData>>
// ): string {
//   // Add a placeholder above or below the item in the BoardList
//   setDynamicBoardData((prev) => {
//     // find id in prev.itemArrays
//     const itemArrayIndex = prev.itemArrays.findIndex((itemArray) =>
//       itemArray.find((item) => item.id === id)
//     );
//     if (itemArrayIndex === -1) return prev;
//     const itemIndex = prev.itemArrays[itemArrayIndex].findIndex(
//       (item) => item.id === id
//     );
//     if (itemIndex === -1) return prev;

//     const newItemArray = [...prev.itemArrays[itemArrayIndex]];
//     // check if the item that is being moved has the moved property
//     // if (newItemArray[itemIndex].moved) return prev;
//     // if (newItemArray[itemIndex].placeholder) return prev;
//     // add moved: true to the item that is being moved
//     // newItemArray[itemIndex] = { ...newItemArray[itemIndex], moved: true };
//     newItemArray.splice(itemIndex + (above ? 0 : 1), 0, {
//       id: `${id}placeholder`,
//       placeholder: true,
//       content: 'placeholder',
//     });
//     const newItemArrays = [...prev.itemArrays];
//     newItemArrays[itemArrayIndex] = newItemArray;
//     return { ...prev, itemArrays: newItemArrays };
//   });
//   return `${id}placeholder`;

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
// }
