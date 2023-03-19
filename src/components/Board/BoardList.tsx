import { BoardListContent, Position } from './Board';
import Draggable from 'react-draggable';

export default function BoardList({
  id,
  boardList,
  itemPositions,
  width,
  itemHeight,
  gap,
  handleDrag,
  onDragStart,
  onDragStop,
}: {
  id: string;
  boardList: BoardListContent;
  itemPositions: Map<string, Position>;
  width: string;
  itemHeight: string;
  gap: string;
  handleDrag: (e: any, data: any) => void;
  onDragStart: (e: any, data: any) => void;
  onDragStop: (e: any, data: any) => void;
}) {
  return (
    <div>
      <h3>Board List</h3>
      <div
        id={id}
        style={{
          width: width,
          outlineWidth: '1px',
          outlineStyle: 'solid',
          outlineColor: 'white',
        }}
      >
        {boardList.map((item) => (
          <Draggable
            key={item.id}
            defaultPosition={{ x: 0, y: 0 }}
            position={{ x: 0, y: 0 }}
            nodeRef={undefined}
            // grid={[25, 25]}
            // scale={1}
            onStart={(e, data) => {
              const id = data.node.id;
              const initialPosition = itemPositions.get(id);
              if (!initialPosition) return;
              const dragElement = document.getElementById(id);
              if (dragElement) {
                dragElement.style.position = 'absolute';
                dragElement.style.top = initialPosition.y1 + 'px';
                dragElement.style.left = initialPosition.x1 + 'px';
                dragElement.style.zIndex = '100';
                dragElement.style.marginTop = '0';
              }
              onDragStart(e, data);
            }}
            onDrag={(e, data) => {
              handleDrag(e, data);
            }}
            onStop={(e, data) => {
              const { x, y } = data;
              const id = data.node.id;
              const initialPosition = itemPositions.get(id);
              if (!initialPosition) return;
              const dragElement = document.getElementById(id);
              if (dragElement) {
                dragElement.style.position = 'initial';
                dragElement.style.top = 'initial';
                dragElement.style.left = 'initial';
                dragElement.style.zIndex = 'initial';
                dragElement.style.marginTop = gap;
              }

              onDragStop(e, data);
            }}
          >
            <div
              id={item.id.toString()}
              style={{
                width: width,
                height: itemHeight,
                outline: '1px solid blue',
                marginTop: gap,

                display: 'flex',
                background: 'darkgray',
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
