import { DndProvider } from 'react-dnd';
import { Container } from './Container';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function SettingsWrapper() {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>
    </div>
  );
}
