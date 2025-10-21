import React, { useState, useEffect, useRef } from 'react'
import './style.scss'
import NumberFlow from '@number-flow/react'
import { Link } from 'react-router'
import { serviceGetPanelData } from '@/services'
import {
  PropertySafetyFilled,
  ScheduleFilled,
  FileTextFilled,
  AlertFilled,
} from '@ant-design/icons'

const PanelGroup = () => {
  const isInit = useRef<boolean>(false)
  const [state, setState] = useState([
    {
      title: '今日支出',
      total: 0,
      Icon: <PropertySafetyFilled className="icon" />,
      prefix: '￥',
      path: '/home/bill',
    },
    {
      title: '今日待办',
      total: 0,
      Icon: <ScheduleFilled className="icon" />,
      path: '/home/todayTask',
    },
    {
      title: '活动清单',
      total: 0,
      Icon: <FileTextFilled className="icon" />,
      path: '/home/todoList',
    },
    {
      title: '提醒事项',
      total: 0,
      Icon: <AlertFilled className="icon" />,
      path: '/home/reminder',
    },
  ])

  useEffect(() => {
    if (isInit.current) return

    isInit.current = true

    serviceGetPanelData().then((res) => {
      const data = state.slice()
      data[0].total = Number(res.consumption)
      data[1].total = res.todayTaskCount
      data[2].total = res.unfinishedTodoListCount
      data[3].total = res.reminderCount
      setState(data)
    })
  }, [state])

  return (
    <div className="panel-group grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {state.map((item) => (
        <div className="item" key={item.title}>
          <Link to={item.path} className="block-item">
            {item.Icon}
            <div className="data">
              <div className="title">{item.title}</div>
              <NumberFlow value={item.total} prefix={item.prefix} />
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default React.memo(PanelGroup)
