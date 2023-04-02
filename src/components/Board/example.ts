import type { BoardContent } from './Board';

// export const exampleBoardContent: BoardContent = new Map([
//   [
//     'list 1',
//     [
//       { id: 1, title: 'title1', content: 'content1' },
//       { id: 2, title: 'title2', content: 'content2' },
//     ],
//   ],
//   [
//     'list 2',
//     [
//       { id: 3, title: 'title3', content: 'content3' },
//       { id: 4, title: 'title4', content: 'content4' },
//       { id: 5, title: 'title5', content: 'content5' },
//     ],
//   ],
//   ['list 3', [{ id: 6, title: 'title6', content: 'content6' }]],
// ]);

export const exampleCalculator: BoardContent = new Map([
  [
    'Take keys',
    {
      items: [
        { id: 1, title: 'X', content: '200.35' },
        { id: 2, title: 'Y', content: '29' },
        { id: 3, title: 'A1', content: '1500.2' },

        // * Uncomment to test with more variables, to see scroll
        // { id: 8, title: 'A2', content: '0.17' },
        // { id: 9, title: 'B1', content: '8' },
        // { id: 10, title: 'B2', content: '0.5' },
        // { id: 11, title: 'C1', content: '39100' },
        // { id: 12, title: 'Other', content: '120' },
      ],
    },
  ],
  ['Calculate', { width: '20em', items: [] }],
  [
    'Take operators',
    {
      items: [
        { id: 4, title: '+', content: '' },
        { id: 5, title: '-', content: '' },
        { id: 6, title: '*', content: '' },
        { id: 7, title: '/', content: '' },
      ],
    },
  ],
]);
