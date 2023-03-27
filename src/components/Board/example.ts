import type { BoardContent } from './Board';

export const exampleBoardContent: BoardContent = new Map([
  [
    'board1',
    [
      { id: 1, title: 'title1', content: 'content1' },
      // { id: 2, title: 'title2', content: 'content2' },
      // { id: 3, title: 'title3', content: 'content3' },
    ],
  ],
  [
    'board2',
    [
      { id: 4, title: 'title4', content: 'content4' },
      { id: 5, title: 'title5', content: 'content5' },
      { id: 6, title: 'title6', content: 'content6' },
      { id: 7, title: 'title7', content: 'content7' },
    ],
  ],
]);
