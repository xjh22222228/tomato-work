import React from 'react'
import './style.scss'
import { serviceDeleteTask, serviceUpdateTask } from '@/services'
import {
  Card,
  Button,
  Rate,
  Popconfirm
} from 'antd'
import { formatDateTime } from '@/utils'

interface Props {
  data: Record<string, any>,
  reloadData(): void
}

const TaskItem: React.FC<Props> = ({ data, reloadData }) => {

  // 0=删除, 1=开始/完成, 2=回退
  function handleAction(buttonType: number) {
    if (buttonType === 0) {
      serviceDeleteTask(data.id)
      .then(() => {
        reloadData()
      })
    } else {
      serviceUpdateTask(data.id, {
        rollback: buttonType === 2 && true
      })
      .then(() => {
        reloadData()
      })
    }
  }

  return (
    <Card
      title="我的待办"
      hoverable
      className="task-component"
    >
      <p className="content">{data.content}</p>
      <div className="level">
        <span>优先级别：</span>
        <Rate value={data.count} disabled></Rate>
        <p className="mt10">
          创建时间: {formatDateTime(data.createdAt)}
        </p>
      </div>

      <div className="button-wrapper">
        <Popconfirm
          title="您确定要删除吗？"
          onConfirm={handleAction.bind(null, 0)}
          placement="bottomLeft"
          okType="danger"
        >
          <Button
            type="primary"
            danger
            size="small"
          >
            删除
          </Button>
        </Popconfirm>

        {(data.type === 1) && (
          <Button
            type="primary"
            size="small"
            onClick={handleAction.bind(null, 1)}
          >
            开始
          </Button>
        )}
        {([2, 3].includes(data.type)) && (
          <Button
            type="primary"
            size="small"
            onClick={handleAction.bind(null, 2)}
          >
            回退
          </Button>
        )}
        {(data.type === 2) && (
          <Button
            type="primary"
            size="small"
            onClick={handleAction.bind(null, 1)}
          >
            完成
          </Button>
        )}
      </div>
    </Card>
  )
}

export default React.memo(TaskItem)
