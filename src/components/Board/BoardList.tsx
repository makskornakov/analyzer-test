import Item, { BoardItemProps } from './Item';

export function BoardList({
  items,
  dragFunction,
}: {
  items: BoardItemProps[];
  dragFunction: (id: string) => void;
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
        <Item key={item.id} id={item.id} content={item.content} dragFunction={dragFunction} />
      ))}
    </div>
  );
}
