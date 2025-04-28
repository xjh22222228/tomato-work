import React from 'react'
import './style.scss'
import { serviceDeleteTask, serviceUpdateTask } from '@/services'
import { Card, Button, Rate, Popconfirm } from 'antd'
import { formatDateTime } from '@/utils'

interface Props {
  data: Record<string, any>
  onOk(): void
}

const TaskItem: React.FC<Props> = ({ data, onOk }) => {
  function handleDelete() {
    serviceDeleteTask(data.id).then(() => {
      onOk()
    })
  }

  function handleNextAction() {
    serviceUpdateTask(data.id, {
      type: data.type + 1,
    }).then(() => {
      onOk()
    })
  }

  function handleBackAction() {
    serviceUpdateTask(data.id, {
      type: data.type - 1,
    }).then(() => {
      onOk()
    })
  }

  return (
    <Card title="我的待办" hoverable className="task-component">
      <p className="content">{data.content}</p>
      <div className="level">
        <span>优先级别：</span>
        <Rate value={data.count} disabled></Rate>
        <p className="mt10">创建时间: {formatDateTime(data.date)}</p>
      </div>

      <div className="button-wrapper">
        <Popconfirm
          title="您确定要删除吗？"
          onConfirm={handleDelete}
          placement="bottomRight"
          okType="danger"
        >
          <Button type="primary" danger size="small">
            删除
          </Button>
        </Popconfirm>

        {data.type === 1 && (
          <Button type="primary" size="small" onClick={handleNextAction}>
            开始
          </Button>
        )}
        {[2, 3].includes(data.type) && (
          <Button type="primary" size="small" onClick={handleBackAction}>
            回退
          </Button>
        )}
        {data.type === 2 && (
          <Button type="primary" size="small" onClick={handleNextAction}>
            完成
          </Button>
        )}
      </div>
    </Card>
  )
}

export default React.memo(TaskItem)
