import { useState } from 'react';
import Draggable, {
  ControlPosition,
  DraggableEventHandler,
} from 'react-draggable';
import { ItemStyled, ItemPlaceholderStyled } from './Board.styled';

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
  placeholder?: boolean;
  moved?: boolean;
}

function BoardItem({
  id,
  content,
  placeholder,
  dragFunction,
  onStart,
  onEnd,
}: BoardItemProps & {
  dragFunction: (id: string) => void;
  onStart: (id: string) => void;
  onEnd: (id: string) => void;
}) {
  const [controlPosition, setControlPosition] = useState<ControlPosition>({
    x: 0,
    y: 0,
  });

  const onDragFunction: DraggableEventHandler = (e, data) => {
    const thisId = data.node.id;
    // const theDiv = data.node;

    dragFunction(thisId);

    // setControlPosition({
    //   x: data.x,
    //   y: data.y,
    // });
  };

  return placeholder ? (
    <ItemPlaceholderStyled id={id}>
      <span>{content}</span>
    </ItemPlaceholderStyled>
  ) : (
    <Draggable
      defaultPosition={{ x: 0, y: 0 }}
      position={controlPosition}
      onStart={(e, data) => {
        onStart(id);
        return onStartFunction(e, data);
      }}
      onDrag={onDragFunction}
      onStop={(e, data) => {
        onEnd(id);
        return onStopFunction(e, data);
      }}
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
  onStart,
  onEnd,
  placeholder,
}: {
  id: string;
  content: string;
  dragFunction: (id: string) => void;
  onStart: (id: string) => void;
  onEnd: (id: string) => void;
  placeholder: boolean | undefined;
}) {
  return (
    <BoardItem
      id={id}
      content={content}
      placeholder={placeholder}
      dragFunction={dragFunction}
      onStart={onStart}
      onEnd={onEnd}
    />
  );
}
