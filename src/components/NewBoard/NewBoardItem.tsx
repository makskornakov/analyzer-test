import { RefObject, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';

import { NewBoardItemContainer } from './NewBoardItem.styled';
import { Position } from '../Board/Board';

export type PositionLiteral = [number, number];

export function NewBoardItem({
  content,
  id,
  itemRef,
  translateCoords,
  setTranslateCoords,
  itemPosition,
  findTheMostIntersectingBoardList,
}: {
  content: string;
  id: number;
  itemRef: RefObject<HTMLDivElement>;
  translateCoords: PositionLiteral;
  setTranslateCoords: React.Dispatch<React.SetStateAction<PositionLiteral>>;
  itemPosition: Position | undefined;
  findTheMostIntersectingBoardList: (currentPosition: Position) => void;
}) {
  // console.log('hey');

  const [initialMousePosition, setInitialMousePosition] = useState([0, 0]);
  // const [translateCoords, setTranslateCoords] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);

  const sharedStyle: React.CSSProperties = {
    ...(isDragging
      ? {
          transform: `translate(${translateCoords[0]}px, ${translateCoords[1]}px)`,
          // zIndex: 10,
        }
      : {
          transform: 'translate(0, 0)', // fix for Safari. `none` does not work. `undefined` also doesn't work.

          transitionDuration: '0.3s',
          transitionProperty: 'transform',
        }),
  };

  return (
    <motion.div
      id={`${id}`}
      layout
      transition={{ type: 'spring', bounce: 0.5 }}
      style={
        isDragging
          ? {
              zIndex: 10,
            }
          : undefined
      }
      ref={itemRef}
    >
      <NewBoardItemContainer
        // id={`${id}`}
        // draggable
        onMouseDown={(event) => {
          // console.log(event);
          setInitialMousePosition([event.nativeEvent.x, event.nativeEvent.y]);
          setIsDragging(true);
          if (!itemPosition) {
            console.log('no item pos on m down :(');
            return;
          }
          findTheMostIntersectingBoardList(itemPosition);
        }}
        onMouseMove={(event) => {
          if (!isDragging) return;
          // console.log(event.nativeEvent.x, event.nativeEvent.offsetX);
          const newTranslateCords: PositionLiteral = [
            -(initialMousePosition[0] - event.nativeEvent.x),
            -(initialMousePosition[1] - event.nativeEvent.y),
          ];
          setTranslateCoords(newTranslateCords);
          if (!itemPosition) {
            console.log('no item pos on m move :(');
            return;
          }
          const updatedItemPosition: Position = {
            x1: itemPosition.x1 + newTranslateCords[0],
            y1: itemPosition.y1 + newTranslateCords[1],
            x2: itemPosition.x2 + newTranslateCords[0],
            y2: itemPosition.y2 + newTranslateCords[1],
          };
          findTheMostIntersectingBoardList(updatedItemPosition);
          // setMousePosition([])
        }}
        onMouseUp={(event) => {
          // console.log(event);
          setTranslateCoords([0, 0]);
          setIsDragging(false);
        }}
        style={isDragging ? { ...sharedStyle, background: 'green' } : sharedStyle}
      >
        {content}
      </NewBoardItemContainer>
    </motion.div>
  );
}
