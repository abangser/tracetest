import {ClockCircleOutlined, SettingOutlined, ToolOutlined} from '@ant-design/icons';
import {Handle, NodeProps, Position} from 'react-flow-renderer';

import {SemanticGroupNamesToText} from 'constants/SemanticGroupNames.constants';
import {SpanKindToText} from 'constants/Span.constants';
import {useAppSelector} from 'redux/hooks';
import TestDefinitionSelectors from 'selectors/TestDefinition.selectors';
import {INodeDataSpan} from 'types/DAG.types';
import * as S from './SpanNode.styled';

interface IProps extends NodeProps<INodeDataSpan> {}

const SpanNode = ({data, id, selected}: IProps) => {
  const spansResult = useAppSelector(TestDefinitionSelectors.selectSpansResult);
  const passedChecks = spansResult[data.id]?.passed;
  const failedChecks = spansResult[data.id]?.failed;
  const className = data.isMatched ? 'matched' : '';

  return (
    <S.Container
      className={className}
      data-cy={`trace-node-${data.type}`}
      $matched={data.isMatched}
      $selected={selected}
    >
      <Handle id={id} position={Position.Top} style={{top: 0, visibility: 'hidden'}} type="target" />

      <S.TopLine $type={data.type} />

      <S.Header>
        <S.BadgeContainer>
          <S.BadgeType count={SemanticGroupNamesToText[data.type]} $hasMargin $type={data.type} />
        </S.BadgeContainer>
        <S.HeaderText>{data.name}</S.HeaderText>
      </S.Header>

      <S.Body>
        <S.Item>
          <SettingOutlined />
          <S.ItemText>
            {data.service} {SpanKindToText[data.kind]}
          </S.ItemText>
        </S.Item>
        {Boolean(data.system) && (
          <S.Item>
            <ToolOutlined />
            <S.ItemText>{data.system}</S.ItemText>
          </S.Item>
        )}
        <S.Item>
          <ClockCircleOutlined />
          <S.ItemText>{data.duration}</S.ItemText>
        </S.Item>
      </S.Body>

      <S.Footer>
        {Boolean(passedChecks) && <S.BadgeCheck status="success" text={passedChecks} />}
        {Boolean(failedChecks) && <S.BadgeCheck status="error" text={failedChecks} />}
      </S.Footer>

      <Handle id={id} position={Position.Bottom} style={{bottom: 0, visibility: 'hidden'}} type="source" />
    </S.Container>
  );
};

export default SpanNode;
