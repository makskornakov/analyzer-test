import Item, { BoardItemProps } from './Item';

export function BoardList({
  items,
  dragFunction,
  onStart,
  onEnd,
}: {
  items: BoardItemProps[];
  dragFunction: (id: string) => void;
  onStart: (id: string) => void;
  onEnd: (id: string) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1em',
      }}
    >
      {items.map((item) => (
        <Item
          key={item.id}
          id={item.id}
          content={item.content}
          dragFunction={dragFunction}
          onStart={onStart}
          onEnd={onEnd}
          placeholder={item.placeholder}
        />
      ))}
    </div>
  );
}
