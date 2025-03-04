import {Tabs} from 'antd';
import {TriggerTypes} from '../../constants/Test.constants';
import {TTriggerResult} from '../../types/Test.types';
import ResponseBody from './ResponseBody';
import ResponseHeaders from './ResponseHeaders';
import * as S from './RunDetailTriggerResponse.styled';

interface IProps {
  triggerResult?: TTriggerResult;
  executionTime?: number;
}

const RunDetailTriggerResponse = ({
  executionTime = 0,
  triggerResult: {headers, body = '', statusCode = 200} = {
    body: '',
    type: TriggerTypes.http,
    statusCode: 200,
  },
}: IProps) => {
  return (
    <S.Container>
      <S.TitleContainer>
        <S.Title>Response Data</S.Title>
        <div>
          <S.StatusText>
            Status: <S.StatusSpan $isError={statusCode >= 400}>{statusCode}</S.StatusSpan>
          </S.StatusText>
          <S.StatusText>
            Time: <S.StatusSpan $isError={executionTime > 1000}>{executionTime}ms</S.StatusSpan>
          </S.StatusText>
        </div>
      </S.TitleContainer>
      <S.TabsContainer>
        <Tabs defaultActiveKey="1" data-cy="run-detail-trigger-response" size="small">
          <Tabs.TabPane key="1" tab="Body">
            <ResponseBody body={body} />
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="Headers">
            <ResponseHeaders headers={headers} />
          </Tabs.TabPane>
        </Tabs>
      </S.TabsContainer>
    </S.Container>
  );
};

export default RunDetailTriggerResponse;
