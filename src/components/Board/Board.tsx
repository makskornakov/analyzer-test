import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    const boardPositions = new Map();
    const itemPositions = new Map();
    Array.from(boardContent.keys()).forEach((key) => {
      const boardList = document.getElementById(key);
      if (boardList) {
        const rect = getRect(boardList, container.current as HTMLDivElement);
        boardPositions.set(key, rect);
      }
      // set item positions
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
    setBoardPositions(boardPositions);
    setItemPositions(itemPositions);
  }, [boardContent]);

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
    // check intersection with all board lists and if there is an intersection set background color of the board list to rgba(255, 0, 0, 0.5)
    boardPositions.forEach((rect, key) => {
      const intersectionPercentage = getIntersectionPercentage(
        currentPosition,
        rect
      );
      const boardList = document.getElementById(key);
      if (boardList) {
        boardList.style.backgroundColor =
          intersectionPercentage > 0.1
            ? 'rgba(255, 0, 255, 0.2)'
            : 'rgba(0, 0, 0, 0)';
        boardList.style.outlineWidth =
          intersectionPercentage > 0.1 ? '4px' : '1px';
      }
      // if (intersectionPercentage !== 0) console.log(intersectionPercentage);
    });
  }
  function onDragStart(e: DraggableEvent, data: DraggableData) {}

  function onDragStop(e: DraggableEvent, data: DraggableData) {}

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
