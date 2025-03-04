import {useCallback, useEffect} from 'react';
import {Node, NodeChange} from 'react-flow-renderer';

import SkeletonDiagram from 'components/SkeletonDiagram';
import DAG from 'components/Visualization/components/DAG';
import Timeline from 'components/Visualization/components/Timeline';
import {TestState} from 'constants/TestRun.constants';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {changeNodes, initNodes, selectSpan} from 'redux/slices/Trace.slice';
import TraceSelectors from 'selectors/Trace.selectors';
import TraceAnalyticsService from 'services/Analytics/TraceAnalytics.service';
import TraceDiagramAnalyticsService from 'services/Analytics/TraceDiagramAnalytics.service';
import {TSpan} from 'types/Span.types';
import {TTestRunState} from 'types/TestRun.types';
import {VisualizationType} from './RunDetailTrace';

interface IProps {
  runState: TTestRunState;
  spans: TSpan[];
  type: VisualizationType;
}

const Visualization = ({runState, spans, type}: IProps) => {
  const dispatch = useAppDispatch();
  const edges = useAppSelector(TraceSelectors.selectEdges);
  const matchedSpans = useAppSelector(TraceSelectors.selectMatchedSpans);
  const nodes = useAppSelector(TraceSelectors.selectNodes);
  const selectedSpan = useAppSelector(TraceSelectors.selectSelectedSpan);
  const isMatchedMode = Boolean(matchedSpans.length);

  useEffect(() => {
    dispatch(initNodes({spans}));
  }, [dispatch, spans]);

  useEffect(() => {
    if (selectedSpan) return;
    const firstSpan = spans.find(span => !span.parentId);
    dispatch(selectSpan({spanId: firstSpan?.id ?? ''}));
  }, [dispatch, selectedSpan, spans]);

  const onNodesChange = useCallback((changes: NodeChange[]) => dispatch(changeNodes({changes})), [dispatch]);

  const onNodeClick = useCallback(
    (event, {id}: Node) => {
      TraceDiagramAnalyticsService.onClickSpan(id);
      dispatch(selectSpan({spanId: id}));
    },
    [dispatch]
  );

  const onNodeClickTimeline = useCallback(
    (spanId: string) => {
      TraceAnalyticsService.onTimelineSpanClick(spanId);
      dispatch(selectSpan({spanId}));
    },
    [dispatch]
  );

  const onNavigateToSpan = useCallback(
    (spanId: string) => {
      dispatch(selectSpan({spanId}));
    },
    [dispatch]
  );

  if (runState !== TestState.FINISHED) {
    return <SkeletonDiagram />;
  }

  return type === VisualizationType.Dag ? (
    <DAG
      edges={edges}
      isMatchedMode={isMatchedMode}
      matchedSpans={matchedSpans}
      nodes={nodes}
      onNavigateToSpan={onNavigateToSpan}
      onNodesChange={onNodesChange}
      onNodeClick={onNodeClick}
      selectedSpan={selectedSpan}
    />
  ) : (
    <Timeline
      isMatchedMode={isMatchedMode}
      matchedSpans={matchedSpans}
      onNavigateToSpan={onNavigateToSpan}
      onNodeClick={onNodeClickTimeline}
      selectedSpan={selectedSpan}
      spans={spans}
    />
  );
};

export default Visualization;
