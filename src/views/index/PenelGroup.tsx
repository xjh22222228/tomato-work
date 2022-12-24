import React, { useState, useEffect, useRef } from 'react'
import './style.scss'
import { Row, Col, Statistic } from 'antd'
import { Link } from 'react-router-dom'
import { serviceGetPanelData } from '@/services'
import {
  PropertySafetyFilled,
  ScheduleFilled,
  FileTextFilled,
  AlertFilled
} from '@ant-design/icons'

const PanelGroup = () => {
  const isInit = useRef<boolean>(false)
  const [state, setState] = useState([
    {
      title: '今日支出',
      total: '0',
      Icon: <PropertySafetyFilled className="icon" />,
      prefix: '￥',
      path: '/home/capitalFlow'
    },
    {
      title: '今日待办',
      total: '0',
      Icon: <ScheduleFilled className="icon" />,
      path: '/home/todayTask'
    },
    {
      title: '活动清单',
      total: '0',
      Icon: <FileTextFilled className="icon" />,
      path: '/home/todoList'
    },
    {
      title: '提醒事项',
      total: '0',
      Icon: <AlertFilled className="icon" />,
      path: '/home/reminder'
    },
  ])

  useEffect(() => {
    if (isInit.current) return

    isInit.current = true

    serviceGetPanelData()
    .then(res => {
      const data = state.slice()
      data[0].total = Number(res.consumption).toFixed(2)
      data[1].total = res.todayTaskCount
      data[2].total = res.unfinishedTodoListCount
      data[3].total = res.reminderCount
      setState(data)
    })
  }, [state])

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24}} className="panel-group">
      {state.map(item => (
        <Col xl={6} lg={12} md={12} sm={24} xs={24} key={item.title}>
          <Link to={item.path} className="block-item">
            {item.Icon}
            <div className="data">
              <Statistic title={item.title} value={item.total} prefix={item.prefix} />
            </div>
          </Link>
        </Col>
      ))}
    </Row>
  )
}

export default React.memo(PanelGroup)
