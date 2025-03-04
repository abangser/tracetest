import {useCallback} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import TestHeader from 'components/TestHeader';
import {useGetTestByIdQuery} from 'redux/apis/TraceTest.api';
import {TTestRun} from 'types/TestRun.types';
import * as S from './Test.styled';
import TestDetails from './TestDetails';

const TestContent = () => {
  const navigate = useNavigate();
  const {testId = ''} = useParams();
  const {data: test} = useGetTestByIdQuery({testId});

  const handleSelectTestResult = useCallback(
    (result: TTestRun) => {
      navigate(`/test/${testId}/run/${result.id}`);
    },
    [navigate, testId]
  );

  // TODO: Add proper loading states
  return test ? (
    <>
      <TestHeader onBack={() => navigate('/')} test={test} />
      <S.Wrapper>
        <TestDetails testId={test.id} onSelectResult={handleSelectTestResult} />
      </S.Wrapper>
    </>
  ) : null;
};

export default TestContent;
