import { BoardContainer, Item } from './Board.styled';
import Draggable, { DraggableEventHandler } from 'react-draggable';

interface BoardItemProps {
  id: string;
  content: string;
}

const boardItems: BoardItemProps[] = [
  {
    id: '1',
    content: 'Item 1',
  },
  {
    id: '2',
    content: 'Item 2',
  },
  {
    id: '3',
    content: 'Item 3',
  },
];

const boardItems2: BoardItemProps[] = [
  {
    id: '4',
    content: 'Item 4',
  },
  {
    id: '5',
    content: 'Item 5',
  },
  {
    id: '6',
    content: 'Item 6',
  },
];

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
  return (
    <div
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

export default function Board() {
  return (
    // <Draggable
    //   // axis="x"
    //   handle=".handle"
    //   defaultPosition={{ x: 0, y: 0 }}
    //   // position={null}
    //   grid={[25, 25]}
    //   scale={1}
    //   // onStart={this.handleStart}
    //   // onDrag={this.handleDrag}
    //   // onStop={this.handleStop}
    // >
    //   <div
    //     style={{
    //       width: '200px',
    //       height: '200px',
    //       border: '1px solid black',
    //       display: 'flex',
    //       flexDirection: 'column',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       gap: '1em',
    //     }}
    //   >
    //     <div className="handle">Drag from here</div>
    //   </div>
    // </Draggable>
    <>
      <h2>Draggable lists</h2>
      <BoardContainer>
        <div>
          <BoardList items={boardItems} />
        </div>
        <div>
          <BoardList items={boardItems2} />
        </div>
      </BoardContainer>
    </>
  );
}
