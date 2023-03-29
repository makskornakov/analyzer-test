import type { BoardContent } from './Board';

export const exampleBoardContent: BoardContent = new Map([
  [
    'list 1',
    [
      { id: 1, title: 'title1', content: 'content1' },
      { id: 2, title: 'title2', content: 'content2' },
      // { id: 3, title: 'title3', content: 'content3' },
      // { id: 4, title: 'title4', content: 'content4' },
      // { id: 5, title: 'title5', content: 'content5' },
      // { id: 6, title: 'title6', content: 'content6' },
      // { id: 7, title: 'title7', content: 'content7' },
    ],
  ],
  [
    'list 2',
    [
      { id: 8, title: 'title8', content: 'content8' },
      { id: 9, title: 'title9', content: 'content9' },
      { id: 10, title: 'title10', content: 'content10' },
      { id: 11, title: 'title11', content: 'content11' },
      // { id: 12, title: 'title12', content: 'content12' },
      // { id: 13, title: 'title13', content: 'content13' },
      // { id: 14, title: 'title14', content: 'content14' },
    ],
  ],
  ['list 3', [{ id: 15, title: 'title15', content: 'content15' }]],
]);
