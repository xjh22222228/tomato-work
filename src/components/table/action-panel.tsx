import React from 'react'
import { Button, Popconfirm } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

interface Props {
  onDelete?: () => void
  onAdd?: () => void
  selectedRowKeys: string[]
}

const ActionPanel: React.FC<Props> = function({
  selectedRowKeys,
  onDelete,
  onAdd
}) {
  const isShowPanel = onDelete || onAdd
  const disabled = selectedRowKeys.length <= 0

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
        <Popconfirm
          title="您确定要删除吗？"
          onConfirm={onDelete}
          placement="bottomLeft"
          okType="danger"
        >
          <Button
            type="primary"
            danger
            disabled={disabled}
            icon={<DeleteOutlined />}
          >
            批量删除
          </Button>
        </Popconfirm>
      )}
    </div>
  ) : null
}

export default ActionPanel
