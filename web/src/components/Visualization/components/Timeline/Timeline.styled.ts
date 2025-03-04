import {Group} from '@visx/group';
import styled, {css} from 'styled-components';

import {
  SemanticGroupNames,
  SemanticGroupNamesToColor,
  SemanticGroupNamesToLightColor,
} from 'constants/SemanticGroupNames.constants';

export const Container = styled.div<{$showMatched: boolean}>`
  height: 100%;
  padding: 24px;
  position: relative;

  ${({$showMatched}) =>
    $showMatched &&
    css`
      .node-span-list > g:not(.matched) {
        opacity: 0.5;
      }
    `}
`;

export const CircleArrow = styled.circle`
  fill: transparent;
`;

export const CircleCheck = styled.circle<{$passed: boolean}>`
  fill: ${({$passed, theme}) => ($passed ? theme.color.success : theme.color.error)};
`;

export const CircleNumber = styled.circle`
  fill: ${({theme}) => theme.color.borderLight};
`;

export const GroupCollapse = styled(Group)`
  cursor: pointer;
`;

export const Image = styled.image`
  height: 8px;
  width: 8px;
`;

export const LineConnector = styled.line`
  stroke: ${({theme}) => theme.color.textLight};
`;

export const PathArrow = styled.path`
  fill: ${({theme}) => theme.color.textLight};
  transform: scale(0.6);
`;

export const RectBadge = styled.rect<{$type: SemanticGroupNames}>`
  fill: ${({$type}) => SemanticGroupNamesToLightColor[$type]};
  height: 12px;
  width: 50px;
  pointer-events: none;
`;

export const RectDuration = styled.rect<{$type: SemanticGroupNames}>`
  fill: ${({$type}) => SemanticGroupNamesToColor[$type]};
  height: 6px;
  pointer-events: none;
`;

export const RectDurationGuideline = styled.rect`
  fill: ${({theme}) => theme.color.borderLight};
  height: 1px;
  pointer-events: none;
  width: 100%;
`;

export const RectOverlay = styled.rect<{$isMatched: boolean; $isSelected: boolean}>`
  cursor: pointer;
  fill: ${({$isSelected, theme}) => ($isSelected ? theme.color.backgroundInteractive : 'transparent')};
  stroke: ${({$isMatched, theme}) => $isMatched && theme.color.text};
  stroke: ${({$isSelected, theme}) => $isSelected && theme.color.interactive};
  width: 100%;

  :hover {
    fill: ${({theme}) => theme.color.backgroundInteractive};
  }
`;

export const TextBadge = styled.text`
  fill: ${({theme}) => theme.color.text};
  font-size: 8px;
  pointer-events: none;
  text-transform: uppercase;
`;

export const TextDescription = styled.text`
  fill: ${({theme}) => theme.color.text};
  font-size: ${({theme}) => theme.size.xs};
  pointer-events: none;
`;

export const TextName = styled.text`
  fill: ${({theme}) => theme.color.text};
  font-size: ${({theme}) => theme.size.sm};
  font-weight: 600;
  pointer-events: none;
`;

export const TextNumber = styled.text`
  fill: ${({theme}) => theme.color.textLight};
  font-size: ${({theme}) => theme.size.sm};
  pointer-events: none;
`;
