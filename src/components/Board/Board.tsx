import { useCallback, useEffect, useRef, useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';

import { BoardListContainer } from './Board.styled';
import BoardList from './BoardList';

import type { CSSObject } from 'styled-components';

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
interface BoardProps {
  initialBoardContent: BoardContent;
  listWidth: string;
  itemHeight: string;
  itemGap: string;
  listPadding?: string;
  itemStyle?: CSSObject;
  listStyle?: CSSObject;
  itemActiveStyle?: CSSObject;
  listActiveStyle?: CSSObject;
  transitionDuration?: number;
}

export default function Board({
  initialBoardContent,
  listWidth,
  itemHeight,
  itemGap,
  listPadding = '0px',
  itemStyle,
  listStyle,
  itemActiveStyle,
  listActiveStyle,
  transitionDuration = 200,
}: BoardProps) {
  const container = useRef<HTMLDivElement>(null);
  const [boardContent, setBoardContent] = useState<BoardContent>(initialBoardContent);

  const [boardPositions, setBoardPositions] = useState<Map<string, Position>>(new Map());

  const [itemPositions, setItemPositions] = useState<Map<string, Position>>(new Map());

  const [placeholder, setPlaceholder] = useState<Placeholder | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [boardListInAction, setBoardListInAction] = useState<string | null>(null);

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
              const rect = getRect(itemElement, container.current as HTMLDivElement);
              itemPositions.set(item.id.toString(), rect);
            }
          });
        });
        return itemPositions;
      });
    },
    [boardContent],
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

  const findTheMostIntersectingBoardList = useCallback(
    // ? can be redone to be more efficient

    (currentPosition: Position) => {
      console.log('findTheMostIntersectingBoardList function called');
      let mostIntersectingBoardList: string | null = null;
      let mostIntersectingPercentage = 0;
      boardPositions.forEach((rect, key) => {
        const intersectionPercentage = getIntersectionPercentage(currentPosition, rect);
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
    [boardPositions],
  );

  const placeholderInActiveBoardList = useCallback(
    (placeholder: Placeholder | null, boardListInAction: string | null) => {
      if (!placeholder) return false;
      const activeBoardList = boardContent.get(boardListInAction as string);
      if (!activeBoardList) return false;
      return activeBoardList.some((item) => item.id.toString() === placeholder.id);
    },
    [boardContent],
  );

  // ?? REDO LATER
  useEffect(() => {
    Array.from(boardContent.keys()).forEach((key) => {
      const boardList = document.getElementById(key);
      if (boardList) {
        boardList.classList.remove('active');
        boardList.style.padding = listPadding;
      }
    });
    if (boardListInAction) {
      const activeList = boardContent.get(boardListInAction as string);
      const boardList = document.getElementById(boardListInAction);
      console.log('activeList', activeList);
      // activelist filter draggedItem
      if (activeList) {
        const cleanActiveList = activeList?.filter((item) => item.id.toString() !== draggedItem);
        //! if empty board list and no placeholder generate general placeholder
        if (cleanActiveList?.length < 1) {
          const draggedItemElement = document.getElementById(draggedItem as string);
          if (boardList) {
            boardList.style.paddingTop = `calc(${draggedItemElement?.style.height} + ${listPadding})`;
          }
        }
      }
      if (boardList) {
        boardList.classList.add('active');
      }
    }
  }, [boardListInAction, boardContent, draggedItem, listPadding, listActiveStyle, listStyle]);

  const moveInstantly = useCallback(
    (id: string) => {
      console.log('moveInstantly called');
      const itemElement = document.getElementById(id);
      if (itemElement) {
        itemElement.style.transition = '0s';
        setTimeout(() => {
          itemElement.style.transition = `${transitionDuration}ms`;
        }, 0);
      }
    },
    [transitionDuration],
  );

  const applyAndSetPlaceholder = useCallback(
    (placeholder: Placeholder | null, instant?: boolean, newDraggedItem?: string) => {
      const useDraggedItem = newDraggedItem || draggedItem;
      console.log('applyAndSetPlaceholder called');
      console.log('draggedItem', useDraggedItem);
      // set margin of the placeholder
      setPlaceholder((prev) => {
        if (placeholder) {
          const placeholderElement = document.getElementById(placeholder.id);
          if (instant) moveInstantly(placeholder.id);
          if (placeholderElement) {
            if (placeholder.above) {
              placeholderElement.style.marginTop = `calc(${placeholder.height} + ${itemGap})`;
            } else {
              placeholderElement.style.marginBottom = `calc(${placeholder.height} + ${itemGap})`;
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
        }, transitionDuration);
        return placeholder;
      });
    },
    [
      draggedItem,
      transitionDuration,
      moveInstantly,
      itemGap,
      updateItemPositions,
      getBoardPositions,
    ],
  );

  interface YPosWithPlaceholder {
    y0?: number;
    y1: number;
    y2: number;
    y3?: number;
  }

  const updateBoardOrder = useCallback(
    (dragged: string, placeholder: Placeholder, boardList: string) => {
      console.log('updateBoardOrder called');
      // get the boardList of the dragged item
      const draggedItemBoardListName = Array.from(boardContent.keys()).find((key) =>
        boardContent.get(key)?.find((item) => String(item.id) === dragged),
      );
      if (!draggedItemBoardListName) return;

      const sameBoardList = draggedItemBoardListName === boardList;

      if (sameBoardList) {
        const theBoardList = boardContent.get(boardList);
        if (!theBoardList) return;
        const draggedItemIndex = theBoardList.findIndex((item) => String(item.id) === dragged);
        const draggedItem = theBoardList[draggedItemIndex];
        // remove the dragged item from the boardList
        theBoardList.splice(draggedItemIndex, 1);
        const placeholderIndex = theBoardList.findIndex(
          (item) => String(item.id) === placeholder.id,
        );
        if (placeholder.above) {
          theBoardList.splice(placeholderIndex, 0, draggedItem);
        } else {
          theBoardList.splice(placeholderIndex + 1, 0, draggedItem);
        }
        setBoardContent((prev) => {
          const newBoardContent = new Map(prev);
          newBoardContent.set(boardList, theBoardList);
          return newBoardContent;
        });
      } else {
        const draggedItemBoardList = [
          ...(boardContent.get(draggedItemBoardListName) as BoardItem[]),
        ];
        const placeHolderBoardList = [...(boardContent.get(boardList) as BoardItem[])];
        if (!draggedItemBoardList || !placeHolderBoardList) return;

        // get the index of the dragged item
        const draggedItemIndex = draggedItemBoardList.findIndex(
          (item) => String(item.id) === dragged,
        );
        // get the index of the placeholder
        const placeholderIndex = placeHolderBoardList.findIndex(
          (item) => String(item.id) === placeholder?.id,
        );
        if (draggedItemIndex === -1 || placeholderIndex === -1) return;
        // save the dragged item
        const draggedItem = draggedItemBoardList[draggedItemIndex];
        // remove the dragged item from the boardList
        draggedItemBoardList.splice(draggedItemIndex, 1);

        placeHolderBoardList.splice(placeholderIndex + (placeholder.above ? 0 : 1), 0, draggedItem);
        setBoardContent((prev) => {
          const newBoardContent = new Map(prev);
          newBoardContent.set(boardList, placeHolderBoardList);
          newBoardContent.set(draggedItemBoardListName, draggedItemBoardList);
          return newBoardContent;
        });
      }
      // updateItemPositions();
      // getBoardPositions();
      // insert the dragged item above or below the placeholder

      // update the boardContent

      // setDraggedItem(null);
    },
    [boardContent],
  );

  const [itemInTransition, setItemInTransition] = useState<string | null>(null);

  // use effect when itemInTransition is set to something set it to null after 200ms
  useEffect(() => {
    if (itemInTransition) {
      setTimeout(() => {
        setItemInTransition(null);
      }, transitionDuration);
    }
  }, [itemInTransition, transitionDuration]);

  const checkOnDrag = useCallback(
    (
      // draggedItem: string,
      currentPosition: Position,
      boardList: string | null,
      placeholder: Placeholder | null,
      itemPositions: Map<string, Position>,
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

      const topY = Math.min(...Array.from(theYMap.values()).map((v) => v.y0 || v.y1));
      const bottomY = Math.max(...Array.from(theYMap.values()).map((v) => v.y3 || v.y2));

      // console.log('topY', topY);
      // console.log('bottomY', bottomY);

      const useLine = centerY < topY ? y2 : centerY > bottomY ? y1 : centerY;
      const useLineName = useLine === y1 ? 'top' : useLine === y2 ? 'bottom' : 'center';
      console.log('useLine', useLineName);

      // now we go through the map and check if the useLine is between y0 and y1 of the item except the placeholder item
      // get the closest item and top or bottom of the item
      const closestEdge = { id: '', above: false };
      let closestEdgeDistance = Infinity;
      let set = false;
      theYMap.forEach((itemYPos, itemId) => {
        const { y1, y2 } = itemYPos;
        // const itemCenterY = (y1 + y2) / 2;

        const placeholderElement = document.getElementById(itemId);
        if (!placeholderElement) return;
        // if (itemId === placeholder?.id) return;
        // check that useLine is between y1 and y2 of the item

        const nextItemId = Array.from(theYMap.keys())[
          Array.from(theYMap.keys()).indexOf(itemId) + 1
        ];
        const prevItemId = Array.from(theYMap.keys())[
          Array.from(theYMap.keys()).indexOf(itemId) - 1
        ];

        if (itemId === itemInTransition) return;
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
          // setting new placeholder
          // ? not sure of sensitivityPixels
          const setPlaceholderAbove = useLine < y1;

          const placeholderObj: Placeholder = {
            id: itemId,
            above: !setPlaceholderAbove,
            height: placeholderElement.style.height,
            cords: itemYPos,
          };

          setItemInTransition(itemId);
          set = true;
          applyAndSetPlaceholder(placeholderObj);
          // ? so it doesn't check the rest of the items
          return false;
        } else if (
          (itemId === placeholder?.id ||
            (nextItemId === placeholder?.id && placeholder?.above) ||
            (prevItemId === placeholder?.id && !placeholder?.above)) &&
          placeholder
        ) {
          // when the dragged item touches the placeholder its time to move the intersected item to the other side since there is more space
          const timeToChangePlaceholderSide = placeholder?.above
            ? useLine > y1 + sensitivityPixels && useLine < y2 - sensitivityPixels
            : useLine < y2 - sensitivityPixels && useLine > y1 + sensitivityPixels;

          console.log('timeToChangePlaceholderSide', timeToChangePlaceholderSide);
          // console.log('itemInTransition', itemInTransition);
          // change placeholders side
          if (timeToChangePlaceholderSide) {
            const placeholderObj: Placeholder = {
              id: itemId,
              above: !placeholder.above,
              height: placeholderElement.style.height,
              cords: itemYPos,
            };
            setItemInTransition(itemId);
            set = true;
            applyAndSetPlaceholder(null);
            applyAndSetPlaceholder(placeholderObj);
            // ? so it doesn't check the rest of the items
            return false;
          }
        }
      });
      console.log('closestEdge', closestEdge);

      // if no placeholder but closest edge is found set placeholder above or below it
      if (!placeholder && closestEdge.id && !set) {
        const placeholderElement = document.getElementById(closestEdge.id);
        if (!placeholderElement) return;
        const placeholderObj: Placeholder = {
          id: closestEdge.id,
          above: closestEdge.above,
          height: placeholderElement.style.height,
          cords: theYMap.get(closestEdge.id) as YPosWithPlaceholder,
        };
        console.log(
          `applying placeholder ${closestEdge.above ? 'above' : 'below'} ${closestEdge.id}`,
        );
        setItemInTransition(closestEdge.id);
        applyAndSetPlaceholder(placeholderObj);
      }
    },
    [applyAndSetPlaceholder, itemInTransition],
  );

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

      const mostIntersectingBoardList = findTheMostIntersectingBoardList(currentPosition);

      setBoardListInAction(mostIntersectingBoardList);

      // ? state is old but usePlaceholder is new
      // This is to show placeholder instantly when drag starts
      const usePlaceholder = newPlaceholder || placeholder;
      const isAllRight = placeholderInActiveBoardList(usePlaceholder, mostIntersectingBoardList);
      if ((!mostIntersectingBoardList || !isAllRight) && usePlaceholder) {
        applyAndSetPlaceholder(null);
        setTimeout(() => {
          getBoardPositions();
        }, transitionDuration);
        return;
      }

      if (!mostIntersectingBoardList) return;
      const boardListItems = boardContent.get(mostIntersectingBoardList);
      if (!boardListItems) return;

      const activeBoardListItemPositions = new Map(
        Array.from(itemPositions).filter(
          ([theId]) => boardListItems.some((item) => `${item.id}` === theId) && theId !== id,
        ),
      );
      if (activeBoardListItemPositions.size < 1) moveInstantly(mostIntersectingBoardList);

      checkOnDrag(
        // id,
        currentPosition,
        mostIntersectingBoardList,
        usePlaceholder,
        activeBoardListItemPositions,
      );
    },
    [
      itemPositions,
      findTheMostIntersectingBoardList,
      moveInstantly,
      placeholder,
      placeholderInActiveBoardList,
      boardContent,
      checkOnDrag,
      applyAndSetPlaceholder,
      transitionDuration,
      getBoardPositions,
    ],
  );

  function generateInitialPlaceholder(
    id: string,
    height: string,
    fast?: boolean,
  ): Placeholder | undefined {
    const boardListKey = Array.from(boardContent.keys()).find((key) => {
      const boardListContent = boardContent.get(key) as BoardListContent;
      return boardListContent.find((item) => item.id.toString() === id);
    });
    if (boardListKey) {
      // if item is the first one set placeholder above the next item in the list
      // else set placeholder below the previous item in the list
      const boardListContent = boardContent.get(boardListKey) as BoardListContent;
      const itemIndex = boardListContent.findIndex((item) => item.id.toString() === id);

      if (boardListContent.length < 2) return;
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

    const dragElement = document.getElementById(id);
    if (!dragElement) return;

    dragElement.style.zIndex = 'initial';
    dragElement.style.transition = `${transitionDuration}ms`;

    const boardListKey = Array.from(boardContent.keys()).find((key) => {
      const boardListContent = boardContent.get(key) as BoardListContent;
      return boardListContent.find((item) => item.id.toString() === id);
    });

    if (!placeholder && !boardListInAction) {
      const placeID = generateInitialPlaceholder(id, data.node.style.height);

      // const neededList = boardContent.get(boardListKey as string);
      // const filteredList = neededList?.filter(
      //   (item) => item.id.toString() !== id
      // );
      // if (filteredList?.length === 0) //? this can be added back to prevent "last frame" animation of the list being "active" on item release out of list bounds. Idea: option "flash when back".
      setBoardListInAction(boardListKey as string);

      setTimeout(() => {
        dragElement.style.position = 'initial';

        const boardListElement = document.getElementById(boardListKey as string);
        moveInstantly(boardListKey as string);
        if (boardListElement) boardListElement.style.padding = listPadding;
        // ? IF the code below is commented out the placeholder will lag on fast drag out and drag stop

        if (placeID) {
          moveInstantly(placeID.id);
          const newPlaceholder = document.getElementById(placeID.id as string);
          if (newPlaceholder) newPlaceholder.style.margin = '0';
        }
        applyAndSetPlaceholder(null, true);

        getBoardPositions();

        setBoardListInAction((prev) => {
          if (prev === boardListKey) return null;
          return prev;
        });
      }, transitionDuration);
    } else if (!placeholder && boardListInAction !== boardListKey) {
      console.log('time to move to empty list');
      // just delete the dragged item from the old list and add it to the new list
      const boardListItems = boardContent.get(boardListInAction as string);
      if (!boardListItems) return;
      const draggedItemList = boardContent.get(boardListKey as string);
      if (!draggedItemList) return;

      const draggedItem = draggedItemList.find((item) => item.id.toString() === id);
      if (!draggedItem) return;

      // remove the dragged item from the old list
      const newDraggedItemList = draggedItemList.filter((item) => item.id.toString() !== id);
      // add the dragged item to the new list
      const newBoardListItems = [...boardListItems, draggedItem];

      // update the board content
      const boardListElement = document.getElementById(boardListInAction as string);
      moveInstantly(boardListInAction as string);
      if (boardListElement) boardListElement.style.padding = listPadding;

      dragElement.style.position = 'initial';

      setBoardContent((prev) => {
        const newBoardContent = new Map(prev);
        newBoardContent.set(boardListInAction as string, newBoardListItems);
        newBoardContent.set(boardListKey as string, newDraggedItemList);
        return newBoardContent;
      });

      setBoardListInAction(null);
    } else if (placeholder) {
      // ? If placeholder is not null and the board list in action is the same as placeholders list
      dragElement.style.position = 'initial';

      applyAndSetPlaceholder(null, true);
      setBoardListInAction(null);
      const theList = boardContent.get(boardListInAction as string);
      if (!theList) return;
      const placeholderIndex = theList.findIndex((item) => item.id.toString() === placeholder?.id);
      const draggedItemIndex = theList.findIndex((item) => item.id.toString() === id);
      const calcItem = placeholder.above ? placeholderIndex - 1 : placeholderIndex + 1;

      if (calcItem === draggedItemIndex && placeholderIndex !== -1 && draggedItemIndex !== -1) {
        console.log('no need to update');
        return;
      }
      // ? Only instant if there is change in the list
      // Needed when dropped at the top of the list to prevent the item from lagging
      moveInstantly(id);

      updateBoardOrder(id, placeholder as Placeholder, boardListInAction as string);
    } else {
      dragElement.style.position = 'initial';
      // ? has to be instant to prevent the placeholder from lagging on click and stop
      setBoardListInAction((prev) => {
        if (prev) moveInstantly(prev);
        return null;
      });
    }
    setTimeout(() => {
      setDraggedItem(null);
    }, transitionDuration);
  }

  return (
    <>
      <h2>Board</h2>
      <BoardListContainer ref={container} style={{}}>
        {Array.from(boardContent.keys()).map((key) => (
          <BoardList
            key={key}
            id={key}
            boardList={boardContent.get(key) as BoardListContent}
            itemPositions={itemPositions}
            // placeholder={placeholder}
            // dragItem={draggedItem}
            width={listWidth}
            itemHeight={itemHeight}
            gap={itemGap}
            itemStyle={itemStyle}
            listStyle={listStyle}
            listActiveStyle={listActiveStyle}
            itemActiveStyle={itemActiveStyle}
            listPadding={listPadding}
            transitionDuration={transitionDuration}
            handleDrag={handleDrag}
            onDragStart={onDragStart}
            onDragStop={onDragStop}
          />
        ))}
      </BoardListContainer>
    </>
  );
}
