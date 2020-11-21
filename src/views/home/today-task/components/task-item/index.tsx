import React from 'react'
import './style.scss'
import moment from 'moment'
import { modalConfirmDelete } from '@/utils'
import { serviceDeleteTask, serviceUpdateTask } from '@/services'
import {
  Card,
  Button,
  Rate
} from 'antd'

interface Props {
  data: { [key: string]: any },
  reloadData(): void
}

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

const TaskItem: React.FC<Props> = ({ data, reloadData }) => {

  // 0=删除, 1=开始/完成, 2=回退
  function handleAction(buttonType: number) {
    if (buttonType === 0) {
      modalConfirmDelete()
      .then(() => {
        serviceDeleteTask(data.id)
        .then(res => {
          if (res.data.success) {
            reloadData()
          }
        })
      })
    } else {
      serviceUpdateTask(data.id, {
        rollback: buttonType === 2 && true
      })
      .then(res => {
        if (res.data.success) {
          reloadData()
        }
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
          创建时间: {moment(data.createdAt).format(DATE_FORMAT)}
        </p>
      </div>

      <div className="button-wrapper">
        <Button
          type="primary"
          danger
          size="small"
          onClick={handleAction.bind(null, 0)}
        >
          删除
        </Button>
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
