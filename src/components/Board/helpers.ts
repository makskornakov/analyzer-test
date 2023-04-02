import { BoardItem, Position } from './Board';

export function getRect(element: HTMLElement, container: HTMLElement): Position {
  const rect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    x1: rect.x - containerRect.x,
    y1: rect.y - containerRect.y,
    x2: rect.x + rect.width - containerRect.x,
    y2: rect.y + rect.height - containerRect.y,
  };
}

export function getIntersectionPercentage(rect: Position, refRect: Position) {
  // ? refRect is for ex. the boardList container
  const x1 = Math.max(rect.x1, refRect.x1);
  const y1 = Math.max(rect.y1, refRect.y1);
  const x2 = Math.min(rect.x2, refRect.x2);
  const y2 = Math.min(rect.y2, refRect.y2);
  const intersectionArea = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const rectArea = (rect.x2 - rect.x1) * (rect.y2 - rect.y1);
  // return the percentage of rect that is inside checkableRect
  return intersectionArea / rectArea;
}
