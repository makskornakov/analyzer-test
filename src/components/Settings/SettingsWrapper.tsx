import DragDropProvider from './DragDropProvider';
import { api } from './api';
import Board from './Board';

// export default function SettingsWrapper() {
//   return (
//     <div>
//       <DragDropProvider data={api.columns}>
//         <Board />
//       </DragDropProvider>
//     </div>
//   );
// }
const SettingsWrapper: React.FC = () => (
  <div className="App">
    <DragDropProvider data={api.columns}>
      <Board />
    </DragDropProvider>
  </div>
);
export default SettingsWrapper;
