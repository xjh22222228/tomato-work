import React from 'react';
import { Button } from 'antd';
import { modalConfirmDelete } from '@/utils/helper';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
  onDelete?: () => void;
  onAdd?: () => void;
  selectedRowKeys: string[];
}

const ActionPanel: React.FC<Props> = function({
  selectedRowKeys,
  onDelete,
  onAdd
}) {
  const isShowPanel = onDelete || onAdd;
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
      {onAdd && (
        <Button
          type="primary"
          onClick={onAdd}
          icon={<PlusOutlined />}
        >
          新增
        </Button>
      )}

      {onDelete && (
        <Button
          type="primary"
          danger
          onClick={handleDelete}
          disabled={disabled}
          icon={<DeleteOutlined />}
        >
          批量删除
        </Button>
      )}
    </div>
  ) : null;
};

export default ActionPanel;
