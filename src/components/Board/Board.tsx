import { use, useEffect, useMemo, useRef, useState } from 'react';
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

function getIntersectionPercentage(rect: Position, checkableRect: Position) {
  // return the percentage of rect that is inside checkableRect
  const x1 = Math.max(rect.x1, checkableRect.x1);
  const y1 = Math.max(rect.y1, checkableRect.y1);
  const x2 = Math.min(rect.x2, checkableRect.x2);
  const y2 = Math.min(rect.y2, checkableRect.y2);
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

  const getBoardPositions = useMemo(() => {
    return () => {
      const boardPositions = new Map();
      Array.from(boardContent.keys()).forEach((key) => {
        const boardList = document.getElementById(key);
        if (boardList) {
          const rect = getRect(boardList, container.current as HTMLDivElement);
          boardPositions.set(key, rect);
        }
      });
      console.log('boardPositions', boardPositions);
      setBoardPositions(boardPositions);
      return boardPositions;
    };
  }, [boardContent]);

  useEffect(() => {
    getBoardPositions();
  }, [getBoardPositions]);

  // useEffect(() => {
  //   const boardPositions = new Map();
  //   Array.from(boardContent.keys()).forEach((key) => {
  //     const boardList = document.getElementById(key);
  //     if (boardList) {
  //       const rect = getRect(boardList, container.current as HTMLDivElement);
  //       boardPositions.set(key, rect);
  //     }
  //   });
  //   setBoardPositions(boardPositions);
  // }, [boardContent, draggedItem, placeholder]);

  // const getAndSetItemPositions = useMemo (a function that sets item positions and returns new ItemPositions)
  const updateItemPositions = useMemo(() => {
    return (draggedItem?: string) => {
      setItemPositions((prev) => {
        const itemPositions = new Map();
        Array.from(boardContent.keys()).forEach((key) => {
          const boardListContent = boardContent.get(key) as BoardListContent;
          boardListContent.forEach((item) => {
            const itemElement = document.getElementById(item.id.toString());
            if (itemElement) {
              const rect =
                draggedItem === item.id.toString()
                  ? prev.get(item.id.toString())
                  : getRect(itemElement, container.current as HTMLDivElement);
              itemPositions.set(item.id.toString(), rect);
            }
          });
        });
        console.log('itemPositions', itemPositions);
        return itemPositions;
      });
    };
  }, [boardContent]);

  useEffect(() => {
    updateItemPositions();
  }, [updateItemPositions]);

  useEffect(() => {
    console.log('placeholder', placeholder);
  }, [placeholder]);

  // function findTheMostIntersectingBoardList(currentPosition: Position) {
  //   let mostIntersectingBoardList: string | null = null;
  //   let mostIntersectingPercentage = 0;
  //   boardPositions.forEach((rect, key) => {
  //     const intersectionPercentage = getIntersectionPercentage(
  //       currentPosition,
  //       rect
  //     );
  //     if (intersectionPercentage > mostIntersectingPercentage) {
  //       mostIntersectingBoardList = key;
  //       mostIntersectingPercentage = intersectionPercentage;
  //     }
  //   });
  //   // only intersects if inside more than 15% of tha dragged item
  //   return mostIntersectingBoardList && mostIntersectingPercentage > 0.15
  //     ? mostIntersectingBoardList
  //     : null;
  // }

  const findTheMostIntersectingBoardList = useMemo(() => {
    return (currentPosition: Position) => {
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
    };
  }, [boardPositions]);

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

  // useEffect(() => {
  //   if (placeholder) {
  //     // check that placeholder is in the active boardList
  //     const activeBoardList = boardContent.get(boardListInAction as string);
  //     if (!activeBoardList) {
  //       setPlaceholder(null);
  //       return;
  //     }
  //     const placeholderIndex = activeBoardList.findIndex(
  //       (item) => String(item.id) === placeholder.id
  //     );
  //     if (placeholderIndex === -1) setPlaceholder(null);
  //   }
  // }, [boardContent, boardListInAction, placeholder]);

  function findPlaceholder(y1: number, y2: number) {
    const centerY = (y1 + y2) / 2;
    // the input is the center y position of the dragged item
    // take itemPositions of the active boardList without draggable item and only use y1 and y2
    const activeBoardList = boardContent.get(boardListInAction as string);
    if (!activeBoardList || !draggedItem) return null;
    const activeBoardListWithoutDraggedItem = activeBoardList.filter(
      (item) => String(item.id) !== draggedItem
    );
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
    if (draggedAboveFirstItem) console.log('above first item');
    if (draggedBelowLastItem) console.log('below last item');
  }

  function handleDrag(e: DraggableEvent, data: DraggableData) {
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

    if (!mostIntersectingBoardList) setPlaceholder(null);

    setBoardListInAction(mostIntersectingBoardList);

    findPlaceholder(currentPosition.y1, currentPosition.y2);
  }

  function generateInitialPlaceholder(
    id: string,
    height: string,
    fast?: boolean
  ): string | undefined {
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
      if (itemIndex === 0) {
        const nextItem = boardListContent[itemIndex + 1];
        // transition 0 for next item
        if (fast) moveInstantly(nextItem.id.toString());

        setPlaceholder({
          id: nextItem.id.toString(),
          height: height,
          above: true,
          // instant: true,
          cords: {
            y1: itemPositions.get(id)?.y1 as number,
            y2: itemPositions.get(id)?.y2 as number,
          },
        });
        return nextItem.id.toString();
      } else {
        const previousItem = boardListContent[itemIndex - 1];
        // transition 0 for previous item
        if (fast) moveInstantly(previousItem.id.toString());

        setPlaceholder({
          id: previousItem.id.toString(),
          height: height,
          above: false,
          // instant: true,
          cords: {
            y1: itemPositions.get(id)?.y1 as number,
            y2: itemPositions.get(id)?.y2 as number,
          },
        });
        return previousItem.id.toString();
      }
    }
  }

  function moveInstantly(id: string) {
    const itemElement = document.getElementById(id);
    if (itemElement) {
      itemElement.style.transition = '0s';
      setTimeout(() => {
        itemElement.style.transition = '0.2s';
      }, 0);
    }
  }

  function onDragStart(e: DraggableEvent, data: DraggableData) {
    const id = data.node.id;
    setDraggedItem(id);
    generateInitialPlaceholder(id, data.node.style.height, true);

    // const nextItem = Number(id) + 1;
    // setPlaceholder({
    //   id: nextItem.toString(),
    //   height: data.node.style.height,
    //   above: true,
    //   instant: true,
    // });
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
        moveInstantly(placeID);
        const newPlaceholder = document.getElementById(placeID);
        if (newPlaceholder) newPlaceholder.style.margin = '0';
        setPlaceholder(null);
        // setDraggedItem(null);
      }, 200);
    } else {
      dragElement.style.position = 'initial';
      dragElement.style.top = 'initial';
      dragElement.style.left = 'initial';
      moveInstantly(placeholder.id);
      setPlaceholder(null);
    }
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
            placeholder={placeholder}
            dragItem={draggedItem}
            width="20em"
            itemHeight="3em"
            gap="1em"
            handleDrag={handleDrag}
            onDragStart={onDragStart}
            onDragStop={onDragStop}
          />
        ))}
      </div>
    </>
  );
}
