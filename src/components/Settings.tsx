import { CustomUl, FuncUL } from './Settings.styled';
import DraggableList from 'react-draggable-list';
import { useRef, useState } from 'react';

type Item = {
  id: number;
  title: string;
  color: string;
};

const dataArray = [
  { id: 1, title: 'Item 1', color: 'red' },
  { id: 2, title: 'Item 2', color: 'blue' },
  { id: 3, title: 'Item 3', color: 'green' },
];

// https://codesandbox.io/s/nervous-mccarthy-t3i88?file=/src/App.js:2008-2046

const Item = ({
  item,
  itemSelected,
  dragHandleProps,
}: {
  item: Item;
  itemSelected: (item: Item) => void;
  dragHandleProps: any;
}) => {
  const { onMouseDown, onTouchStart } = dragHandleProps;

  return (
    <div
      style={{
        border: '1px solid black',
        margin: '4px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-around',
        background: `${item.color}`,
        color: '#000',
        userSelect: 'none',
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        console.log('touchStart');
        // e.target.style.backgroundColor = 'blue';
        document.body.style.overflow = 'hidden';
        onTouchStart(e);
      }}
      onMouseDown={(e) => {
        console.log('mouseDown');
        document.body.style.overflow = 'hidden';
        onMouseDown(e);
      }}
      onTouchEnd={(e) => {
        // e.target.style.backgroundColor = 'black';
        document.body.style.overflow = 'visible';
      }}
      onMouseUp={() => {
        document.body.style.overflow = 'visible';
      }}
    >
      {item.id}
      <div>{item.title}</div>
    </div>
  );
};

export default function Settings() {
  const [list, setList] = useState<any>(dataArray);

  const containerRef = useRef<HTMLDivElement>(null);

  const _onListChange = (newList: any) => {
    setList(newList);
  };

  return (
    <>
      <h2>Settings</h2>
      <div
        style={{
          outline: '1px solid red',
          width: '90%',
          height: '80%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            outline: '1px solid blue',
            width: '30%',
          }}
        >
          <h3>Keys</h3>
          <CustomUl>
            <li>Price</li>
            <li>Discount</li>
            <li>discountPercentage</li>
          </CustomUl>
        </div>
        <div
          ref={containerRef}
          style={{
            outline: '1px solid pink',
            width: '45%',
          }}
        >
          <DraggableList
            itemKey={'title'}
            template={Item}
            list={list}
            onMoveEnd={(newList) => _onListChange(newList)}
            container={() => containerRef.current}
            // )}

            // row={(record, index) => (
            //   <div key={index} style={{ color: record.color }}>
            //     <div className="simple-drag-row-title">{record.title}</div>
            //     <span>{record.text}</span>
            //   </div>
            // )}
            // handles={false}
            // className="simple-drag"
            // rowClassName="simple-drag-row"
          />
        </div>
        <div
          style={{
            outline: '1px solid blue',
            width: '25%',
          }}
        >
          <h3>Funcs</h3>
          <FuncUL>
            <li>+</li>
            <li>-</li>
            <li>*</li>
            <li>/</li>
          </FuncUL>
        </div>
      </div>
    </>
  );
}
