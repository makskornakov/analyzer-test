import { useState } from 'react';
import Draggable, { ControlPosition, DraggableEventHandler } from 'react-draggable';
import { ItemStyled } from './Board.styled';

const onStartFunction: DraggableEventHandler = (e, data) => {
  const theDiv = data.node;
  // set the z-index of the div to 1
  theDiv.style.zIndex = '1';
  theDiv.style.backgroundColor = 'cyan';

  console.log('onStart', e, data);
};

const onStopFunction: DraggableEventHandler = (e, data) => {
  const theDiv = data.node;
  // set the z-index of the div to initial
  theDiv.style.zIndex = 'initial';
  theDiv.style.backgroundColor = 'white';

  console.log('onStop', e, data);
};

export interface BoardItemProps {
  id: string;
  content: string;
}

function BoardItem({
  id,
  content,
  dragFunction,
}: BoardItemProps & {
  dragFunction: (id: string) => void;
}) {
  const [controlPosition, setControlPosition] = useState<ControlPosition>({
    x: 0,
    y: 0,
  });

  const onDragFunction: DraggableEventHandler = (e, data) => {
    const thisId = data.node.id;
    // const theDiv = data.node;

    dragFunction(thisId);

    setControlPosition({
      x: data.x,
      y: data.y,
    });
  };
  return (
    <Draggable
      defaultPosition={{ x: 0, y: 0 }}
      position={controlPosition}
      onStart={onStartFunction}
      onDrag={onDragFunction}
      onStop={onStopFunction}
    >
      <ItemStyled id={id}>
        <span>{content}</span>
      </ItemStyled>
    </Draggable>
  );
}
export default function Item({
  id,
  content,
  dragFunction,
}: {
  id: string;
  content: string;
  dragFunction: (id: string) => void;
}) {
  return <BoardItem id={id} content={content} dragFunction={dragFunction} />;
}
