import { useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

import { RubberCheckBoxInput } from './RubberCheckbox.styled';

import type { RubberCheckboxStylesProps } from './RubberCheckbox.styled';

const magicBorderModifier = 16;

export function RubberCheckbox({
  size = 25,
  borderRadius = (3 / magicBorderModifier) * size,
  borderWidth = size / magicBorderModifier,
  animation = '0.6s ease-out 0.08s',
  draggableLever = true,
  ...props
}: typeof RubberCheckBoxInput['defaultProps'] & Partial<RubberCheckboxStylesProps>) {
  const [isDragging, setIsDragging] = useState(false);
  const [wasLastChangeInitiatedByDrag, setWasLastChangeInitiatedByDrag] = useState(false);

  const checkboxInputRef = useRef<HTMLInputElement>(null);

  useEventListener('mouseup', (e) => {
    if (!draggableLever) return;

    const isMouseUpOnCheckbox = e.target === checkboxInputRef.current;

    setIsDragging(false);
    if (!isMouseUpOnCheckbox) {
      setWasLastChangeInitiatedByDrag(false);
    }
  });

  return (
    <RubberCheckBoxInput
      {...props}
      ref={checkboxInputRef}
      size={size}
      borderRadius={borderRadius}
      borderWidth={borderWidth}
      animation={animation}
      draggableLever={draggableLever}
      isDragging={isDragging}
      onChange={(e) => {
        if (draggableLever && wasLastChangeInitiatedByDrag) {
          setWasLastChangeInitiatedByDrag(false);
          return;
        }
        props.onChange?.(e);
      }}
      onMouseDown={() => {
        if (!draggableLever) return;
        setIsDragging(true);
      }}
      onMouseMove={(e) => {
        if (!draggableLever) return;
        if (!isDragging) return;

        // @ts-expect-error
        const layerX = e.nativeEvent.layerX;
        const offsetWidth = e.currentTarget.offsetWidth;

        const mouseHorizontalPositionPercentage = layerX / offsetWidth;
        const isMouseOnLeftSide = mouseHorizontalPositionPercentage < 0.5;

        const newChecked = !isMouseOnLeftSide;
        if (e.currentTarget.checked === newChecked) return;

        e.currentTarget.checked = newChecked;
        // @ts-expect-error
        props.onChange(e);
        setWasLastChangeInitiatedByDrag(true);
      }}
    />
  );
}
