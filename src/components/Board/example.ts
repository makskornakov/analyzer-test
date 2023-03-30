import type { BoardContent } from './Board';

export const exampleBoardContent: BoardContent = new Map([
  [
    'list 1',
    [
      { id: 1, title: 'title1', content: 'content1' },
      { id: 2, title: 'title2', content: 'content2' },
    ],
  ],
  [
    'list 2',
    [
      { id: 3, title: 'title3', content: 'content3' },
      { id: 4, title: 'title4', content: 'content4' },
      { id: 5, title: 'title5', content: 'content5' },
    ],
  ],
  ['list 3', [{ id: 6, title: 'title6', content: 'content6' }]],
]);

export const exampleCalculator: BoardContent = new Map([
  [
    'Take keys',
    [
      { id: 1, title: 'X', content: '200' },
      { id: 2, title: 'Variable1', content: '29' },
      { id: 3, title: 'Yb', content: '1500' },
    ],
  ],
  ['Calculate', []],
  [
    'Take operators',
    [
      { id: 4, title: '+', content: '' },
      { id: 5, title: '-', content: '' },
      { id: 6, title: '*', content: '' },
      { id: 7, title: '/', content: '' },
    ],
  ],
]);
