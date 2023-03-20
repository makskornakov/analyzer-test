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
  instant: boolean;
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

  // const getAndSetItemPositions = useMemo
  const getItemPositions = useMemo(() => {
    return () => {
      const itemPositions = new Map();
      Array.from(boardContent.keys()).forEach((key) => {
        const boardListContent = boardContent.get(key) as BoardListContent;
        boardListContent.forEach((item) => {
          const itemElement = document.getElementById(item.id.toString());
          if (itemElement) {
            const rect = getRect(
              itemElement,
              container.current as HTMLDivElement
            );
            itemPositions.set(item.id.toString(), rect);
          }
        });
      });
      console.log('itemPositions', itemPositions);
      setItemPositions(itemPositions);
    };
  }, [boardContent]);

  function findTheMostIntersectingBoardList(currentPosition: Position) {
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
    return mostIntersectingBoardList;
  }

  useEffect(() => {
    const boardPositions = new Map();
    Array.from(boardContent.keys()).forEach((key) => {
      const boardList = document.getElementById(key);
      if (boardList) {
        const rect = getRect(boardList, container.current as HTMLDivElement);
        boardPositions.set(key, rect);
      }
    });
    setBoardPositions(boardPositions);
  }, [boardContent, getItemPositions, draggedItem, placeholder]);

  useEffect(() => {
    // if not instant, wait for the animation to finish
    //! now set to constant 200 as it is used everywhere

    if (placeholder && !placeholder?.instant)
      setTimeout(() => getItemPositions(), 200);
    else getItemPositions();
  }, [getItemPositions, placeholder, draggedItem]);

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

  function findPlaceholder(y: number) {
    // the input is the center y position of the dragged item
    //
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

    setBoardListInAction(mostIntersectingBoardList);
  }

  function onDragStart(e: DraggableEvent, data: DraggableData) {
    const id = data.node.id;
    setDraggedItem(id);
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
        setPlaceholder({
          id: nextItem.id.toString(),
          height: data.node.style.height,
          above: true,
          instant: true,
        });
      } else {
        const previousItem = boardListContent[itemIndex - 1];
        setPlaceholder({
          id: previousItem.id.toString(),
          height: data.node.style.height,
          above: false,
          instant: true,
        });
      }
    }

    // const nextItem = Number(id) + 1;
    // setPlaceholder({
    //   id: nextItem.toString(),
    //   height: data.node.style.height,
    //   above: true,
    //   instant: true,
    // });
  }

  function onDragStop(e: DraggableEvent, data: DraggableData) {
    setPlaceholder(null);
    setTimeout(() => {
      setDraggedItem(null);
    }, 200);
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
          width: '90%',
          height: '85%',
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
