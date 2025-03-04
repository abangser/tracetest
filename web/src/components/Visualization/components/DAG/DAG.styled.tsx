import {Button} from 'antd';
import styled, {css} from 'styled-components';

export const ActionButton = styled(Button)<{$isActive?: boolean}>`
  color: ${({theme, $isActive}) => ($isActive ? theme.color.interactive : theme.color.textLight)};
  width: 24px;

  &:focus {
    background-color: unset;
    color: ${({theme, $isActive}) => ($isActive ? theme.color.interactive : theme.color.textLight)};
  }

  &:hover {
    background-color: unset;
    color: ${({theme}) => theme.color.text};
  }
`;

export const ActionsContainer = styled.div`
  background-color: ${({theme}) => theme.color.background};
  border-radius: 8px;
  padding: 0 8px;
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 9;
`;

export const Container = styled.div<{$showMatched: boolean}>`
  position: relative;
  height: 100%;
  width: 100%;

  .react-flow__attribution {
    visibility: hidden;
  }

  .react-flow__minimap {
    bottom: 0;
    background-color: ${({theme}) => theme.color.background};
    right: 0;
  }

  ${({$showMatched}) =>
    $showMatched &&
    css`
      .react-flow__node-span > div:not(.matched) {
        opacity: 0.5;
      }
    `}
`;
