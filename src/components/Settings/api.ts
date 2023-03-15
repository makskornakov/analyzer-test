import { v4 } from 'uuid';

// export const v4 = (): string => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     var r = (Math.random() * 16) | 0,
//       v = c == 'x' ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// };

export type TaskType = {
  id: string;
  content: string;
};

export type ColumnType = {
  id: string;
  title: string;
  tasks: TaskType[];
};

export type TaskBoardType = {
  columns: ColumnType[];
};

export const api: TaskBoardType = {
  columns: [
    {
      id: v4(),
      title: 'col1',
      tasks: [
        { content: 'item1', id: v4() },
        { content: 'item2', id: v4() },
        { content: 'item3', id: v4() },
      ],
    },
    {
      id: v4(),
      title: 'col2',
      tasks: [
        { content: 'item1', id: v4() },
        { content: 'item2', id: v4() },
        { content: 'item3', id: v4() },
      ],
    },

    {
      id: v4(),
      title: 'col3',
      tasks: [
        { content: 'item1', id: v4() },
        { content: 'item2', id: v4() },
        { content: 'item3', id: v4() },
      ],
    },
    {
      id: v4(),
      title: 'col4',
      tasks: [
        { content: 'item1', id: v4() },
        { content: 'item2', id: v4() },
        { content: 'item3', id: v4() },
      ],
    },
  ],
};
