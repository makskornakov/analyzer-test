import { BoardContainer, Item } from './Board.styled';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { useEffect, useRef, useState } from 'react';

export interface BoardItemProps {
  id: string;
  content: string;
}
export interface BoardData {
  itemArrays: BoardItemProps[][]; // array of arrays of items
}

const onStartFunction: DraggableEventHandler = (e, data) => {
  console.log('onStart', e, data);
};

const onDragFunction: DraggableEventHandler = (e, data) => {
  console.log('onDrag', e, data);
};

const onStopFunction: DraggableEventHandler = (e, data) => {
  console.log('onStop', e, data);
};

function BoardItem({ id, content }: BoardItemProps) {
  return (
    <Draggable
      defaultPosition={{ x: 0, y: 0 }}
      onStart={onStartFunction}
      onDrag={onDragFunction}
      onStop={onStopFunction}
    >
      <Item id={id}>
        <span>{content}</span>
      </Item>
    </Draggable>
  );
}

function BoardList({ items }: { items: BoardItemProps[] }) {
  // const containerRef = useRef<HTMLDivElement>(null);
  const [itemsState, setItemsState] = useState<
    { id: string; position: DOMRect }[]
  >([]);

  useEffect(() => {
    const itemsArray: { id: string; position: DOMRect }[] = [];
    items.forEach((item) => {
      const itemElement = document.getElementById(item.id);
      if (itemElement) {
        const itemPosition = itemElement.getBoundingClientRect();
        itemsArray.push({ id: item.id, position: itemPosition });
      }
    });
    setItemsState(itemsArray);
    console.log(itemsArray);
  }, [items]);

  // useEffect(() => {
  //   if (itemsState.length > 0) {
  //     console.log(itemsState);
  //   }
  // }, [itemsState]);

  return (
    <div
      // ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // gap: '1em',
      }}
    >
      {items.map((item) => (
        <BoardItem key={item.id} id={item.id} content={item.content} />
      ))}
    </div>
  );
}

export default function Board({
  boardData,
}: {
  boardData: BoardData;
}): JSX.Element {
  return (
    <>
      <h2>Draggable lists</h2>
      <BoardContainer>
        {/* <div>
          <BoardList items={boardItems} />
        </div>
        <div>
          <BoardList items={boardItems2} />
        </div> */}
        {boardData.itemArrays.map((itemArray, index) => (
          <div key={index}>
            <BoardList items={itemArray} />
          </div>
        ))}
      </BoardContainer>
    </>
  );
}
