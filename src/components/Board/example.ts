import { BoardData, BoardItemProps } from './Board';

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

export const boardData: BoardData = {
  itemArrays: [boardItems, boardItems2],
};
