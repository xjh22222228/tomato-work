import React from 'react'
import { Button, Popconfirm } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

interface Props {
  onDelete?: () => void
  onAdd?: () => void,
  toolbar?: React.ReactChild
  selectedRowKeys: string[]
}

const Toolbar: React.FC<Props> = function({
  selectedRowKeys,
  toolbar,
  onDelete,
  onAdd
}) {
  const showToolbar = onDelete || onAdd
  const selectedLen = selectedRowKeys.length
  const disabled = selectedLen <= 0

  return showToolbar ? (
    <div className="table-action-panel">
      <div>
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
            title={`确定要删除选中 ${selectedLen} 条记录吗？`}
            onConfirm={onDelete}
            placement="bottomLeft"
            okType="danger"
            disabled={disabled}
          >
            <Button
              type="primary"
              danger
              disabled={disabled}
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        )}
      </div>

      {toolbar}
    </div>
  ) : null
}

export default Toolbar
