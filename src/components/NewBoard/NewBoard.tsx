import { createRef, useEffect, useMemo, useRef, useState } from 'react';

import { BoardContent, getRect, Position } from '../Board/Board';
import { exampolBoardContent } from './exampol';
import { NewBoardContainer } from './NewBoard.styled';
import { PositionLiteral } from './NewBoardItem';
import { NewBoardList } from './NewBoardList';

/** return the percentage of rect that is inside checkableRect */
function getIntersectionPercentage(rect: Position, checkableRect: Position) {
  const x1 = Math.max(rect.x1, checkableRect.x1);
  const y1 = Math.max(rect.y1, checkableRect.y1);
  const x2 = Math.min(rect.x2, checkableRect.x2);
  const y2 = Math.min(rect.y2, checkableRect.y2);

  const intersectionArea = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const rectArea = (rect.x2 - rect.x1) * (rect.y2 - rect.y1);
  return intersectionArea / rectArea;
}

export function NewBoard() {
  const [boardContent, setBoardContent] = useState<BoardContent>(exampolBoardContent);

  const [translateCoords, setTranslateCoords] = useState<PositionLiteral>([0, 0]);

  const [activeBoard, setActiveBoard] = useState<string | null>(null);

  const arrayOfElementsForListRefs = useMemo(
    () => Array.from({ length: boardContent.size }).map((_, idx) => idx + 1),
    [boardContent.size],
  );
  const listRefs = useMemo(
    () => arrayOfElementsForListRefs.map(() => createRef<HTMLDivElement>()),
    [arrayOfElementsForListRefs],
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const [listPositions, setListPositions] = useState<Map<string, Position>>(new Map());

  useEffect(() => {
    // console.log('listRefs', listRefs);
    const listRectsAsMap = new Map();
    const listRects = listRefs.map((listRef) => {
      if (!listRef.current || !containerRef.current) return;
      const rect = getRect(listRef.current, containerRef.current);
      // console.log(rect);
      listRectsAsMap.set(listRef.current.id, rect);
      return rect;
    });
    if (listRects.some((rect) => rect === undefined)) return;
    setListPositions(listRectsAsMap);
  }, [listRefs]);

  function findTheMostIntersectingBoardList(currentPosition: Position) {
    let mostIntersectingBoardList: string | null = null;
    let mostIntersectingPercentage = 0;
    listPositions.forEach((rect, rectKey) => {
      const intersectionPercentage = getIntersectionPercentage(currentPosition, rect);
      if (intersectionPercentage > mostIntersectingPercentage) {
        mostIntersectingBoardList = rectKey;
        mostIntersectingPercentage = intersectionPercentage;
      }
    });
    setActiveBoard(mostIntersectingBoardList);
    // return mostIntersectingBoardList;
  }

  return (
    <NewBoardContainer
      ref={containerRef}
      onDoubleClick={() => {
        console.log('dbl');
        // console.log('dbl refs', refs[0]);

        setBoardContent((prev) => {
          const newContent = new Map(prev);
          const board1 = newContent.get('board1');
          const board2 = newContent.get('board2');

          if (!board1 || !board2) return prev;
          // const firstOfFirst = board1[0];
          newContent.set('board1', [board1[1], board1[2], board1[0]]);
          // newContent.set('board2', [...board2, board1[2]]);
          return newContent;
        });
      }}
    >
      {Array.from(boardContent.entries()).map((list, listIndex) => {
        const [name, content] = list;

        return (
          <NewBoardList
            key={name}
            id={name}
            items={content}
            listRef={listRefs[listIndex]}
            containerRef={containerRef}
            translateCoords={translateCoords}
            setTranslateCoords={setTranslateCoords}
            active={activeBoard === name}
            findTheMostIntersectingBoardList={findTheMostIntersectingBoardList}
          />
        );
      })}
    </NewBoardContainer>
  );
}
