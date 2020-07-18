import React from 'react';
import { Button } from 'antd';
import { modalConfirmDelete } from '@/utils/helper';

interface Props {
  onDelete?: () => void;
  selectedRowKeys: string[];
}

const ActionPanel: React.FC<Props> = function({
  selectedRowKeys,
  onDelete
}) {
  const isShowPanel = onDelete;
  const disabled = selectedRowKeys.length <= 0;

  function handleDelete() {
    modalConfirmDelete({
      title: '确定要删除选中'
    }).then(() => {
      onDelete && onDelete();
    });
  }

  return isShowPanel ? (
    <div className="table-action-panel">
      {onDelete && (
        <Button
          type="primary"
          danger
          onClick={handleDelete}
          disabled={disabled}
        >
            删除
        </Button>
      )}
    </div>
  ) : null
};

export default ActionPanel;
