import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DraggableEvent, DraggableData } from 'react-draggable';
import BoardList from './BoardList';
import { exampleBoardContent } from './example';

export interface BoardItem {
  id: number;
  title: string;
  content: string;
}
export type BoardListContent = BoardItem[];
export type BoardContent = Map<string, BoardListContent>;
export interface Position {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Placeholder {
  id: string;
  height: string;
  above: boolean;
  // instant: boolean;
  cords: ItemYCords;
}

const listGap = '1em';
const sensitivityPixels = 10;
// ? Y 0 & 3 are cords of the
interface ItemYCords {
  y1: number;
  y2: number;
}

function getRect(element: HTMLElement, container: HTMLElement): Position {
  const rect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    x1: rect.x - containerRect.x,
    y1: rect.y - containerRect.y,
    x2: rect.x + rect.width - containerRect.x,
    y2: rect.y + rect.height - containerRect.y,
  };
}

function getIntersectionPercentage(rect: Position, refRect: Position) {
  // return the percentage of rect that is inside checkableRect
  // ? refRect is for ex. the boardList
  const x1 = Math.max(rect.x1, refRect.x1);
  const y1 = Math.max(rect.y1, refRect.y1);
  const x2 = Math.min(rect.x2, refRect.x2);
  const y2 = Math.min(rect.y2, refRect.y2);
  const intersectionArea = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const rectArea = (rect.x2 - rect.x1) * (rect.y2 - rect.y1);
  return intersectionArea / rectArea;
}

export default function Board() {
  const container = useRef<HTMLDivElement>(null);
  const [boardContent, setBoardContent] =
    useState<BoardContent>(exampleBoardContent);

  const [boardPositions, setBoardPositions] = useState<Map<string, Position>>(
    new Map()
  );

  const [itemPositions, setItemPositions] = useState<Map<string, Position>>(
    new Map()
  );

  const [placeholder, setPlaceholder] = useState<Placeholder | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [boardListInAction, setBoardListInAction] = useState<string | null>(
    null
  );

  const getBoardPositions = useCallback(() => {
    const boardPositions = new Map();
    Array.from(boardContent.keys()).forEach((key) => {
      const boardList = document.getElementById(key);
      if (boardList) {
        const rect = getRect(boardList, container.current as HTMLDivElement);
        boardPositions.set(key, rect);
      }
    });
    setBoardPositions(boardPositions);
    return boardPositions;
  }, [boardContent]);

  useEffect(() => {
    getBoardPositions();
  }, [getBoardPositions]);

  const updateItemPositions = useCallback(
    (excludeItem?: string) => {
      console.log('updateItemPositions function called');
      setItemPositions((prev) => {
        const itemPositions = new Map(prev);
        Array.from(boardContent.keys()).forEach((key) => {
          const boardListContent = boardContent.get(key) as BoardListContent;
          boardListContent.forEach((item) => {
            const itemElement = document.getElementById(item.id.toString());
            if (itemElement && excludeItem !== item.id.toString()) {
              const rect = getRect(
                itemElement,
                container.current as HTMLDivElement
              );
              itemPositions.set(item.id.toString(), rect);
            }
          });
        });
        return itemPositions;
      });
    },
    [boardContent]
  );

  useEffect(() => {
    updateItemPositions();
  }, [updateItemPositions]);

  useEffect(() => {
    console.log('placeholder', placeholder);
  }, [placeholder]);

  useEffect(() => {
    console.log('itemPositions', itemPositions);
  }, [itemPositions]);

  useEffect(() => {
    console.log('boardPositions', boardPositions);
  }, [boardPositions]);

  // !
  // useEffect(() => {
  //   updateItemPositions();
  // }, [, updateItemPositions, placeholder]);

  // !

  const findTheMostIntersectingBoardList = useCallback(
    // ? can be redone to be more efficient
    (currentPosition: Position) => {
      console.log('findTheMostIntersectingBoardList function called');
      let mostIntersectingBoardList: string | null = null;
      let mostIntersectingPercentage = 0;
      boardPositions.forEach((rect, key) => {
        const intersectionPercentage = getIntersectionPercentage(
          currentPosition,
          rect
        );
        if (intersectionPercentage > mostIntersectingPercentage) {
          mostIntersectingBoardList = key;
          mostIntersectingPercentage = intersectionPercentage;
        }
      });
      // only intersects if inside more than 15% of tha dragged item
      return mostIntersectingBoardList && mostIntersectingPercentage > 0.15
        ? mostIntersectingBoardList
        : null;
    },
    [boardPositions]
  );

  const placeholderInActiveBoardList = useCallback(
    (placeholder: Placeholder | null, boardListInAction: string | null) => {
      if (!placeholder) return false;
      const activeBoardList = boardContent.get(boardListInAction as string);
      if (!activeBoardList) return false;
      return activeBoardList.some(
        (item) => item.id.toString() === placeholder.id
      );
    },
    [boardContent]
  );

  // ?? REDO LATER
  useEffect(() => {
    Array.from(boardContent.keys()).forEach((key) => {
      const boardList = document.getElementById(key);
      if (boardList) {
        boardList.style.backgroundColor = 'rgba(0, 0, 0, 0)';
      }
    });
    if (boardListInAction) {
      const boardList = document.getElementById(boardListInAction);
      if (boardList) {
        boardList.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      }
    }
  }, [boardListInAction, boardContent]);

  const moveInstantly = useCallback((id: string) => {
    console.log('moveInstantly called');
    const itemElement = document.getElementById(id);
    if (itemElement) {
      itemElement.style.transition = '0s';
      setTimeout(() => {
        itemElement.style.transition = '0.2s';
      }, 0);
    }
  }, []);

  function findPlaceholder(
    y1: number,
    y2: number,
    boardList: string | null,
    placeholder: Placeholder | null
  ) {
    const centerY = (y1 + y2) / 2;
    // the input is the center y position of the dragged item
    // take itemPositions of the active boardList without draggable item and only use y1 and y2
    console.log('activeBoardList', boardList);
    if (!boardList) return null;
    const activeBoardList = boardContent.get(boardList);
    if (!activeBoardList || !draggedItem) return null;
    const activeBoardListWithoutDraggedItem = activeBoardList.filter(
      (item) => String(item.id) !== draggedItem
    );

    // ? Items near the placeholder may be carried differently
    const responsibleIds = [];
    if (placeholder) {
      responsibleIds.push(placeholder.id);
      // find the index of the placeholder
      const placeholderIndex = activeBoardListWithoutDraggedItem.findIndex(
        (item) => String(item.id) === placeholder.id
      );
      // add the id of the item before the placeholder or after if exists
      if (placeholder.above && placeholderIndex > 0) {
        responsibleIds.push(
          activeBoardListWithoutDraggedItem[placeholderIndex - 1].id
        );
      } else if (
        !placeholder.above &&
        placeholderIndex < activeBoardListWithoutDraggedItem.length - 1
      ) {
        responsibleIds.push(
          activeBoardListWithoutDraggedItem[placeholderIndex + 1].id
        );
        // now we have 1-2 ids that are near the placeholder so they are carried specially
      }
    }

    // find the index of the first item in itemPositions
    const firstItemId = activeBoardListWithoutDraggedItem[0].id;
    const lastItemId =
      activeBoardListWithoutDraggedItem[
        activeBoardListWithoutDraggedItem.length - 1
      ].id;

    const firstItemPosition = itemPositions.get(firstItemId.toString());
    const lastItemPosition = itemPositions.get(lastItemId.toString());

    if (!firstItemPosition || !lastItemPosition) return null;

    const maxTopItemOrPlaceholderY =
      placeholder?.id === String(firstItemId) && placeholder.above
        ? placeholder.cords.y1
        : firstItemPosition.y1;

    const minBottomItemOrPlaceholderY =
      placeholder?.id === String(lastItemId) && !placeholder.above
        ? placeholder.cords.y2
        : lastItemPosition.y2;

    console.log(placeholder?.cords);

    const draggedAboveFirstItem = centerY < maxTopItemOrPlaceholderY;
    const draggedBelowLastItem = centerY > minBottomItemOrPlaceholderY;

    // checkLine is y1 if dragged above first item and y2 if dragged below last item and centerY otherwise
    const checkYLine =
      !draggedAboveFirstItem && !draggedBelowLastItem
        ? centerY
        : draggedAboveFirstItem
        ? y2
        : y1;

    // ! tests
    const checkLineName =
      checkYLine === centerY
        ? 'center'
        : draggedAboveFirstItem
        ? 'bottom'
        : 'top';

    console.log('checkYLine', checkLineName);
    // innerText of draggable item set to checkLineName
    const draggableItem = document.getElementById(draggedItem);
    if (draggableItem) draggableItem.innerText = checkLineName;

    if (draggedAboveFirstItem) console.log('above first item');
    if (draggedBelowLastItem) console.log('below last item');
  }

  const applyAndSetPlaceholder = useCallback(
    (
      placeholder: Placeholder | null,
      instant?: boolean,
      newDraggedItem?: string
    ) => {
      const useDraggedItem = newDraggedItem || draggedItem;
      console.log('applyAndSetPlaceholder called');
      console.log('draggedItem', useDraggedItem);
      // set margin of the placeholder
      setPlaceholder((prev) => {
        setItemInTransition(placeholder?.id || null);
        if (placeholder) {
          const placeholderElement = document.getElementById(placeholder.id);
          if (instant) moveInstantly(placeholder.id);
          if (placeholderElement) {
            if (placeholder.above) {
              placeholderElement.style.marginTop = `calc(${placeholder.height} + ${listGap})`;
            } else {
              placeholderElement.style.marginBottom = `calc(${placeholder.height} + ${listGap})`;
            }
          }
        }
        if (prev) {
          const prevPlaceholderElement = document.getElementById(prev.id);
          if (instant) moveInstantly(prev.id);
          if (prevPlaceholderElement) prevPlaceholderElement.style.margin = '0';
        }
        setTimeout(() => {
          updateItemPositions(useDraggedItem ? useDraggedItem : undefined);
          getBoardPositions();
        }, 200);
        return placeholder;
      });
    },
    [draggedItem, moveInstantly, updateItemPositions, getBoardPositions]
  );

  interface YPosWithPlaceholder {
    y0?: number;
    y1: number;
    y2: number;
    y3?: number;
  }

  const [itemInTransition, setItemInTransition] = useState<string | null>(null);

  // use effect when itemInTransition is set to something set it to null after 200ms
  useEffect(() => {
    if (itemInTransition) {
      setTimeout(() => {
        setItemInTransition(null);
      }, 200);
    }
  }, [itemInTransition]);

  const checkOnDrag = useCallback(
    (
      draggedItem: string,
      currentPosition: Position,
      boardList: string | null,
      placeholder: Placeholder | null,
      itemPositions: Map<string, Position>
    ) => {
      console.log('checkOnDrag called');
      // console.log('currentPosition', currentPosition);
      // console.log('placeholder', placeholder);
      // console.log('itemPositions', itemPositions);
      // console.log('boardList', boardList);
      // console.log('------------------');

      // ? TO DO
      // * Create Y map of items in active boardList in format {y0, y1, y2, y3} where y0 and y3 are the top and bottom possible margins of the item if it has placeholder above or below

      // * take current Y center and check if its between y0 min and y1 max of the item map
      // * if its higher than useLine = bottom of the item
      // * if its lower than useLine = top of the item
      // * if its between useLine = center of the item

      if (!boardList) return;
      const theYMap: Map<string, YPosWithPlaceholder> = new Map();

      // console.log('activeBoardListItemPositions', itemPositions);

      itemPositions.forEach((itemPosition, itemId) => {
        const { y1, y2 } = itemPosition;
        const resObj: YPosWithPlaceholder = { y1, y2 };
        // if placeholder id is the same as the item id then we need to check if the placeholder is above or below the item
        if (placeholder?.id === itemId) {
          if (placeholder.above) {
            resObj.y0 = placeholder.cords.y1;
          } else {
            resObj.y3 = placeholder.cords.y2;
          }
        }
        theYMap.set(itemId, resObj);
      });
      // console.log('theYMap', theYMap);

      // * check if the current Y center is between y0 min and y1 max of the item map
      const { y1, y2 } = currentPosition;
      const centerY = (y1 + y2) / 2;

      const topY = Math.min(
        ...Array.from(theYMap.values()).map((v) => v.y0 || v.y1)
      );
      const bottomY = Math.max(
        ...Array.from(theYMap.values()).map((v) => v.y3 || v.y2)
      );

      // console.log('topY', topY);
      // console.log('bottomY', bottomY);

      const useLine = centerY < topY ? y2 : centerY > bottomY ? y1 : centerY;
      const useLineName =
        useLine === y1 ? 'top' : useLine === y2 ? 'bottom' : 'center';
      console.log('useLine', useLineName);

      // now we go through the map and check if the useLine is between y0 and y1 of the item except the placeholder item
      // get the closest item and top or bottom of the item
      const closestEdge = { id: '', above: false };
      let closestEdgeDistance = Infinity;

      theYMap.forEach((itemYPos, itemId) => {
        const { y0, y1, y2, y3 } = itemYPos;
        const itemCenterY = (y1 + y2) / 2;

        const placeholderElement = document.getElementById(itemId);
        if (!placeholderElement) return;
        // if (itemId === placeholder?.id) return;
        // check that useLine is between y1 and y2 of the item
        if (itemId === itemInTransition) return;

        const nextItemId = Array.from(theYMap.keys())[
          Array.from(theYMap.keys()).indexOf(itemId) + 1
        ];
        const prevItemId = Array.from(theYMap.keys())[
          Array.from(theYMap.keys()).indexOf(itemId) - 1
        ];

        // closest edge
        const distanceToTop = Math.abs(useLine - y1);
        const distanceToBottom = Math.abs(useLine - y2);

        if (distanceToTop < closestEdgeDistance) {
          closestEdgeDistance = distanceToTop;
          closestEdge.id = itemId;
          closestEdge.above = true;
        }
        if (distanceToBottom < closestEdgeDistance) {
          closestEdgeDistance = distanceToBottom;
          closestEdge.id = itemId;
          closestEdge.above = false;
        }

        if (
          useLine > y1 + sensitivityPixels &&
          useLine < y2 - sensitivityPixels &&
          itemId !== placeholder?.id
        ) {
          const setPlaceholderAbove = useLine < itemCenterY;

          const placeholderObj: Placeholder = {
            id: itemId,
            above: setPlaceholderAbove,
            height: placeholderElement.style.height,
            cords: itemYPos,
          };
          // if (
          //   placeholder?.above === setPlaceholderAbove &&
          //   placeholder.id === itemId
          // )
          //   return;
          // applyAndSetPlaceholder(null);
          applyAndSetPlaceholder(placeholderObj);
          return false;

          // if next item is placeholder
        } else if (
          itemId === placeholder?.id ||
          (nextItemId === placeholder?.id && placeholder?.above) ||
          (prevItemId === placeholder?.id && !placeholder?.above)
        ) {
          const timeToChangePlaceholderSide = placeholder?.above
            ? useLine > y1 + sensitivityPixels && useLine < itemCenterY
            : useLine < y2 - sensitivityPixels && useLine > itemCenterY;

          console.log(
            'timeToChangePlaceholderSide',
            timeToChangePlaceholderSide
          );
          console.log('itemInTransition', itemInTransition);
          if (timeToChangePlaceholderSide) {
            const placeholderObj: Placeholder = {
              id: itemId,
              above: !placeholder.above,
              height: placeholderElement.style.height,
              cords: itemYPos,
            };

            applyAndSetPlaceholder(null);
            applyAndSetPlaceholder(placeholderObj);
            return false;
          }
          // updateItemPositions(draggedItem);

          //
        }
        // if useLine is above the highest Y set placeholder above the first item
        // else if (useLine < topY && !placeholder) {
        //   const firstItemId = Array.from(theYMap.keys())[0];
        //   const placeholderObj: Placeholder = {
        //     id: firstItemId,
        //     above: true,
        //     height: placeholderElement.style.height,
        //     cords: theYMap.get(firstItemId) as YPosWithPlaceholder,
        //   };
        //   console.log(`applying placeholder above ${firstItemId}`);
        //   applyAndSetPlaceholder(null);
        //   applyAndSetPlaceholder(placeholderObj);
        // } else if (useLine > bottomY && !placeholder) {
        //   const lastItemId = Array.from(theYMap.keys())[
        //     Array.from(theYMap.keys()).length - 1
        //   ];
        //   const placeholderObj: Placeholder = {
        //     id: lastItemId,
        //     above: false,
        //     height: placeholderElement.style.height,
        //     cords: theYMap.get(lastItemId) as YPosWithPlaceholder,
        //   };
        //   console.log(`applying placeholder below ${lastItemId}`);
        //   applyAndSetPlaceholder(null);
        //   applyAndSetPlaceholder(placeholderObj);
        // }
        // else if no placeholder find the closest item and set placeholder above or below it

        // else
      });
      console.log('closestEdge', closestEdge);

      // if no placeholder but closest edge is found set placeholder above or below it
      if (!placeholder && closestEdge.id) {
        const placeholderElement = document.getElementById(closestEdge.id);
        if (!placeholderElement) return;
        const placeholderObj: Placeholder = {
          id: closestEdge.id,
          above: closestEdge.above,
          height: placeholderElement.style.height,
          cords: theYMap.get(closestEdge.id) as YPosWithPlaceholder,
        };
        console.log(
          `applying placeholder ${closestEdge.above ? 'above' : 'below'} ${
            closestEdge.id
          }`
        );
        // applyAndSetPlaceholder(null);
        applyAndSetPlaceholder(placeholderObj);
      }

      // ? test for rerendering
      // setBoardContent((prev) => {
      //   // swap the first and last items in tge first list
      //   const newBoardContent = new Map(prev);
      //   const activeBoardList = newBoardContent.get(boardList);
      //   if (!activeBoardList) return prev;
      //   // swap the first and last items in tge first list
      //   const newActiveBoardList = [...activeBoardList];
      //   const firstItem = newActiveBoardList[0];
      //   const lastItem = newActiveBoardList[newActiveBoardList.length - 1];
      //   newActiveBoardList[0] = lastItem;
      //   newActiveBoardList[newActiveBoardList.length - 1] = firstItem;

      //   newBoardContent.set(boardList, newActiveBoardList);

      //   return newBoardContent;
      // });
    },
    [applyAndSetPlaceholder, itemInTransition]
  );

  // const checkOnDrag = function (
  //   draggedItem: string,
  //   currentPosition: Position,
  //   boardList: string | null,
  //   placeholder: Placeholder | null,
  //   itemPositions: Map<string, Position>
  // ) {

  // };

  const handleDrag = useCallback(
    (e: DraggableEvent, data: DraggableData, newPlaceholder?: Placeholder) => {
      const { x, y } = data;
      const id = data.node.id;
      const initialPosition = itemPositions.get(id);
      if (!initialPosition) return;
      const currentPosition = {
        x1: initialPosition.x1 + x,
        y1: initialPosition.y1 + y,
        x2: initialPosition.x2 + x,
        y2: initialPosition.y2 + y,
      };

      const mostIntersectingBoardList =
        findTheMostIntersectingBoardList(currentPosition);

      setBoardListInAction(mostIntersectingBoardList);

      const usePlaceholder = newPlaceholder || placeholder;
      const isAllRight = placeholderInActiveBoardList(
        usePlaceholder,
        mostIntersectingBoardList
      );
      if ((!mostIntersectingBoardList || !isAllRight) && usePlaceholder) {
        applyAndSetPlaceholder(null);
        setTimeout(() => {
          getBoardPositions();
        }, 200);
        return;
      }

      // ? state is old but usePlaceholder is new
      // console.log('placeholder STATE', placeholder);
      if (!mostIntersectingBoardList) return;
      const boardListItems = boardContent.get(mostIntersectingBoardList);
      if (!boardListItems) return;

      const activeBoardListItemPositions = new Map(
        Array.from(itemPositions).filter(
          ([theId]) =>
            boardListItems.some((item) => `${item.id}` === theId) &&
            theId !== id
        )
      );
      checkOnDrag(
        id,
        currentPosition,
        mostIntersectingBoardList,
        usePlaceholder,
        activeBoardListItemPositions
      );

      // findPlaceholder(
      //   currentPosition.y1,
      //   currentPosition.y2,
      //   mostIntersectingBoardList,
      //   placeholder
      // );
    },
    [
      itemPositions,
      findTheMostIntersectingBoardList,
      placeholder,
      placeholderInActiveBoardList,
      boardContent,
      checkOnDrag,
      applyAndSetPlaceholder,
      getBoardPositions,
    ]
  );

  function generateInitialPlaceholder(
    id: string,
    height: string,
    fast?: boolean
  ): Placeholder | undefined {
    const boardListKey = Array.from(boardContent.keys()).find((key) => {
      const boardListContent = boardContent.get(key) as BoardListContent;
      return boardListContent.find((item) => item.id.toString() === id);
    });
    if (boardListKey) {
      // if item is the first one set placeholder above the next item in the list
      // else set placeholder below the previous item in the list
      const boardListContent = boardContent.get(
        boardListKey
      ) as BoardListContent;
      const itemIndex = boardListContent.findIndex(
        (item) => item.id.toString() === id
      );

      const isFirstChild = itemIndex === 0;
      const targetItem = boardListContent[itemIndex + (isFirstChild ? 1 : -1)];
      const targetItemPosition = itemPositions.get(targetItem.id.toString());
      const draggedItemPosition = itemPositions.get(id);
      if (!targetItemPosition || !draggedItemPosition) return;

      const placeholderObject = {
        id: targetItem.id.toString(),
        height: height,
        above: isFirstChild,
        cords: {
          y1: draggedItemPosition.y1,
          y2: draggedItemPosition.y2,
        },
      };
      applyAndSetPlaceholder(placeholderObject, fast, id);
      return placeholderObject;
    }
  }

  function onDragStart(e: DraggableEvent, data: DraggableData) {
    const id = data.node.id;
    setDraggedItem(id);
    const place = generateInitialPlaceholder(id, data.node.style.height, true);
    handleDrag(e, data, place);
  }

  function onDragStop(e: DraggableEvent, data: DraggableData) {
    const id = data.node.id;
    // const initialPosition = itemPositions.get(id);
    // if (!initialPosition) return;

    const dragElement = document.getElementById(id);
    if (!dragElement) return;
    dragElement.style.background = 'rgba(255, 255, 255, 0.5)';

    dragElement.style.zIndex = 'initial';
    dragElement.style.transition = '0.2s';
    if (!placeholder) {
      // generateInitialPlaceholder(id, data.node.style.height);
      const placeID = generateInitialPlaceholder(id, data.node.style.height);
      if (!placeID) return;
      setTimeout(() => {
        dragElement.style.position = 'initial';
        dragElement.style.top = 'initial';
        dragElement.style.left = 'initial';

        // ? IF the code below is commented out the placeholder will lag on fast drag out and drag stop
        moveInstantly(placeID.id);
        const newPlaceholder = document.getElementById(placeID.id);
        if (newPlaceholder) newPlaceholder.style.margin = '0';

        applyAndSetPlaceholder(null, true);
        // setPlaceholder(null);
        getBoardPositions();
        setDraggedItem(null);
      }, 200);
    } else {
      dragElement.style.position = 'initial';
      dragElement.style.top = 'initial';
      dragElement.style.left = 'initial';

      applyAndSetPlaceholder(null, true);
    }
    setBoardListInAction(null);
  }

  return (
    <>
      <h2>Board</h2>
      <div
        ref={container}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '70%',
          height: '70%',
          outline: '1px solid #f55500',
        }}
      >
        {Array.from(boardContent.keys()).map((key) => (
          <BoardList
            key={key}
            id={key}
            boardList={boardContent.get(key) as BoardListContent}
            itemPositions={itemPositions}
            // placeholder={placeholder}
            dragItem={draggedItem}
            width="20em"
            itemHeight="3em"
            gap={listGap}
            handleDrag={handleDrag}
            onDragStart={onDragStart}
            onDragStop={onDragStop}
          />
        ))}
      </div>
    </>
  );
}
