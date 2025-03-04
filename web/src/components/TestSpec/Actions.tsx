import {DeleteOutlined, EditOutlined, UndoOutlined} from '@ant-design/icons';
import {Button, Tooltip} from 'antd';

import * as S from './TestSpec.styled';

interface IProps {
  isDeleted: boolean;
  isDraft: boolean;
  onDelete(): void;
  onEdit(): void;
  onRevert(): void;
}

const Actions = ({isDeleted, isDraft, onDelete, onEdit, onRevert}: IProps) => (
  <S.ActionsContainer>
    {isDraft && <S.ActionTag>pending</S.ActionTag>}
    {isDeleted && <S.ActionTag>deleted</S.ActionTag>}
    {isDraft && (
      <Tooltip title="Revert spec">
        <Button
          icon={<UndoOutlined />}
          onClick={event => {
            event.stopPropagation();
            onRevert();
          }}
          size="small"
          type="link"
        />
      </Tooltip>
    )}
    <Tooltip title="Edit spec">
      <Button
        data-cy="edit-assertion-button"
        icon={<EditOutlined />}
        onClick={event => {
          event.stopPropagation();
          onEdit();
        }}
        size="small"
        type="link"
      />
    </Tooltip>
    <Tooltip title="Delete spec">
      <Button
        icon={<DeleteOutlined />}
        onClick={event => {
          event.stopPropagation();
          onDelete();
        }}
        size="small"
        type="link"
      />
    </Tooltip>
  </S.ActionsContainer>
);

export default Actions;
