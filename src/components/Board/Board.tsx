import BoardList from './BoardList';
import { exampleBoardContent } from './example';

export interface BoardItem {
  id: number;
  title: string;
  content: string;
}
export type BoardListContent = BoardItem[];
export type BoardContent = Map<string, BoardListContent>;

export default function Board() {
  return (
    <>
      <h2>Board</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '90%',
          height: '85%',
          outline: '1px solid #f55500',
        }}
      >
        {Array.from(exampleBoardContent.keys()).map((key) => (
          <BoardList
            key={key}
            boardList={exampleBoardContent.get(key) as BoardListContent}
            width="20em"
            itemHeight="3em"
            gap="1em"
          />
        ))}
      </div>
    </>
  );
}
