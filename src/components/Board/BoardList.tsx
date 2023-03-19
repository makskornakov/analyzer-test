import { BoardListContent } from './Board';
import Draggable from 'react-draggable';

export default function BoardList({
  boardList,
  width,
  itemHeight,
  gap,
}: {
  boardList: BoardListContent;
  width: string;
  itemHeight: string;
  gap: string;
}) {
  return (
    <div>
      <h3>Board List</h3>
      <div
        style={{
          width: width,
          outline: '1px solid red',
        }}
      >
        {boardList.map((item) => (
          <Draggable
            key={item.id}
            defaultPosition={{ x: 0, y: 0 }}
            position={{ x: 0, y: 0 }}
            // grid={[25, 25]}
            // scale={1}
            // onStart={this.handleStart}
            // onDrag={this.handleDrag}
            // onStop={this.handleStop}
          >
            <div
              style={{
                width: '100%',
                height: itemHeight,
                outline: '1px solid blue',
                marginTop: gap,

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h4>{item.title}</h4>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
