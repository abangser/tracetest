import {Dropdown, Menu} from 'antd';
import {useCallback} from 'react';
import * as S from './TestCard.styled';

interface IProps {
  testId: string;
  onDelete(): void;
}

const TestCardActions: React.FC<IProps> = ({testId, onDelete}) => {
  const onClick = useCallback(
    ({domEvent}) => {
      domEvent?.stopPropagation();
      onDelete();
    },
    [onDelete]
  );

  return (
    <Dropdown
      overlay={<Menu items={[{key: 'delete', label: <span data-cy="test-card-delete">Delete</span>, onClick}]} />}
      placement="bottomLeft"
      trigger={['click']}
    >
      <span data-cy={`test-actions-button-${testId}`} className="ant-dropdown-link" onClick={e => e.stopPropagation()}>
        <S.ActionButton />
      </span>
    </Dropdown>
  );
};

export default TestCardActions;
