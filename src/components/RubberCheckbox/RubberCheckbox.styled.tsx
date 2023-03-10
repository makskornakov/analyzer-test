import styled, { css } from 'styled-components';

export interface RubberCheckboxStylesProps {
  size: number;
  borderRadius: number;
  borderWidth: number;
  animation: string;
  draggableLever: boolean;
}
export const rubberCheckboxStyles = css<RubberCheckboxStylesProps & { isDragging: boolean }>`
  margin: 0; // reset browser defaults

  display: inline-block; // This is the default in most browsers
  width: ${({ size }) => size * 2}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ borderRadius }) => borderRadius}px;

  /* Copied from input styles */

  border: ${({ borderWidth }) => borderWidth}px solid;
  border-color: ${(props) => props.theme.colors.gray.b};

  position: relative;

  cursor: pointer;

  ::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;

    border: ${({ borderWidth }) => borderWidth * 1.6}px solid;
    border-color: ${(props) => props.theme.colors.background};
    border-radius: ${({ borderRadius }) => borderRadius}px;
    box-sizing: border-box;

    height: 100%;
    width: 50%;
    transition-duration: 0.3s;
    transition-property: background-color, margin-left, border-color;

    background-color: ${(props) => props.theme.colors.candleRed};
  }
  :checked {
    border-color: ${(props) => props.theme.colors.gray.b};

    ::after {
      background-color: ${(props) => props.theme.colors.candleGreen};
      margin-left: ${({ size, borderWidth }) => size - borderWidth}px;
    }
  }

  animation: ${({ animation }) => animation} uncheck;
  :checked {
    animation: ${({ animation }) => animation} check;
  }
  ::after {
    animation: ${({ animation }) => animation} afterUncheck;
  }
  :checked::after {
    animation: ${({ animation }) => animation} afterCheck;
  }
  @keyframes afterUncheck {
    8% {
      transform: none;
    }
    60% {
      transform: scaleX(0.84) translateX(-10%);
    }
  }
  @keyframes afterCheck {
    8% {
      transform: none;
    }
    60% {
      transform: scaleX(0.84) translateX(10%);
    }
  }
  @keyframes uncheck {
    8% {
      transform: none;
    }
    60% {
      transform: scaleX(1.2) scaleY(0.9) translateX(-8%);
      border-color: ${(props) => props.theme.colors.candleRed};
    }
  }
  @keyframes check {
    8% {
      transform: none;
    }
    60% {
      transform: scaleX(1.2) scaleY(0.9) translateX(8%);
      border-color: ${(props) => props.theme.colors.candleGreen};
    }
  }

  ${({ draggableLever, isDragging }) =>
    draggableLever &&
    isDragging &&
    css`
      cursor: grabbing;
    `}
`;

export const RubberCheckBoxInput = styled.input.attrs({ type: 'checkbox' })`
  ${rubberCheckboxStyles}
  appearance: none;
`;
