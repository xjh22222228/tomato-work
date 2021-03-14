import React, { useState, useEffect, useRef } from 'react'
import './style.scss'
import { Row, Col, Statistic } from 'antd'
import { Link } from 'react-router-dom'
import { serviceGetPanelData } from '@/services'
import { HOME } from '@/router/constants'
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
      suffix: '￥',
      path: HOME.CAPITAL_FLOW.path
    },
    {
      title: '今日待办',
      total: '0',
      Icon: <ScheduleFilled className="icon" />,
      path: HOME.TODAY_TASK.path
    },
    {
      title: '活动清单',
      total: '0',
      Icon: <FileTextFilled className="icon" />,
      path: HOME.TODO_LIST.path
    },
    {
      title: '提醒事项',
      total: '0',
      Icon: <AlertFilled className="icon" />,
      path: HOME.REMINDER.path
    },
  ])

  useEffect(() => {
    if (isInit.current) return

    isInit.current = true

    serviceGetPanelData()
    .then(res => {
      if (res.data.success) {
        const data = state.slice()
        data[0].total = Number(res.data.data.consumption).toFixed(2)
        data[1].total = res.data.data.todayTaskCount
        data[2].total = res.data.data.unfinishedTodoListCount
        data[3].total = res.data.data.reminderCount
        setState(data)
      }
    })
  }, [state])

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24}} className="panel-group">
      {state.map(item => (
        <Col xl={6} lg={12} md={12} sm={24} xs={24} key={item.title}>
          <Link to={item.path} className="block-item">
            {item.Icon}
            <div className="data">
              <Statistic title={item.title} value={item.total} suffix={item.suffix} />
            </div>
          </Link>
        </Col>
      ))}
    </Row>
  )
}

export default React.memo(PanelGroup)
