import { LayoutGroup } from 'framer-motion';
import { createRef, RefObject, useEffect, useMemo, useState } from 'react';

import { BoardListContent, getRect, Position } from '../Board/Board';
import { NewBoardItem, PositionLiteral } from './NewBoardItem';
import { NewBoardListContainer } from './NewBoardList.styled';

export function NewBoardList({
  items,
  listRef,
  id,
  containerRef,
  translateCoords,
  setTranslateCoords,
  active,
  findTheMostIntersectingBoardList,
}: {
  items: BoardListContent;
  listRef: RefObject<HTMLDivElement>;
  id: string;
  containerRef: RefObject<HTMLDivElement>;
  translateCoords: PositionLiteral;
  setTranslateCoords: React.Dispatch<React.SetStateAction<PositionLiteral>>;
  active: boolean;
  findTheMostIntersectingBoardList: (currentPosition: Position) => void;
}) {
  const arrayOfElementsForItemRefs = useMemo(
    () => Array.from({ length: items.length }).map((_, idx) => idx + 1),
    [items.length],
  );
  const itemRefs = useMemo(
    () => arrayOfElementsForItemRefs.map(() => createRef<HTMLDivElement>()),
    [arrayOfElementsForItemRefs],
  );

  const [itemPositions, setItemPositions] = useState<Map<string, Position>>(new Map());

  useEffect(() => {
    // console.log('itemRefs', itemRefs);
    const rectsAsMap = new Map();
    const rects = itemRefs.map((listRef) => {
      if (!listRef.current || !containerRef.current) return;
      const rect = getRect(listRef.current, containerRef.current);
      // console.log(rect);
      rectsAsMap.set(listRef.current.id, rect);
      return rect;
    });
    if (rects.some((rect) => rect === undefined)) return;
    // console.log('rectsAsMap', rectsAsMap);

    setItemPositions(rectsAsMap);
  }, [containerRef, itemRefs]);

  return (
    <NewBoardListContainer ref={listRef} id={id} active={active}>
      <LayoutGroup>
        {items.map((item, itemIndex) => {
          return (
            <NewBoardItem
              key={item.id}
              id={item.id}
              content={item.content}
              itemRef={itemRefs[itemIndex]}
              translateCoords={translateCoords}
              setTranslateCoords={setTranslateCoords}
              itemPosition={itemPositions.get(`${item.id}`)}
              findTheMostIntersectingBoardList={findTheMostIntersectingBoardList}
              // findTheMostIntersectingBoardList={() => {
              //   const itemPosition = itemPositions.get(`${item.id}`);
              //   if (!itemPosition) {
              //     console.log('no item pos :(');
              //     return;
              //   }
              //   findTheMostIntersectingBoardList(itemPosition);
              // }}
            />
          );
        })}
      </LayoutGroup>
    </NewBoardListContainer>
  );
}
