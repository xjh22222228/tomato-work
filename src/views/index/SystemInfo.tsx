import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './style.scss'
import bytes from 'bytes'
import CONFIG from '@/config'
import { Card, Progress, Empty } from 'antd'
import { totalPercentage, formatDateTime } from '@/utils'
import { serviceGetInnerMessage } from '@/services'

interface Props {
  systemInfo: Record<string, any>
}

const statusColor = (percentage: number) => {
  if (percentage < 40) return '#52c41a'
  if (percentage < 80) return '#ffa500'
  return '#f50'
}
let timer: any

const System: React.FC<Props> = ({ systemInfo }) => {
  const [curSystemTime, setCurSystemTime] = useState('')
  const [messageList, setMessageList] = useState([])
  const [loading, setLoading] = useState(true)

  const memPercentage = useMemo(() => {
    return totalPercentage(systemInfo.totalmem, systemInfo.freemem)
  }, [systemInfo.totalmem, systemInfo.freemem])

  // 倒计时
  const countdown = useCallback(() => {
    clearTimeout(timer)
    const timeDiff =
      systemInfo.currentSystemTime + (Date.now() - systemInfo.currentSystemTime)
    setCurSystemTime(formatDateTime(timeDiff))

    timer = setTimeout(() => {
      countdown()
    }, 1000)
  }, [systemInfo.currentSystemTime])

  useEffect(() => {
    countdown()

    return () => {
      clearTimeout(timer)
    }
  }, [countdown])

  useEffect(() => {
    serviceGetInnerMessage({ pageSize: 5 }).then((res) => {
      setLoading(false)
      setMessageList(res.rows)
    })
  }, [])

  return (
    <div className="system-data grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
      <Card title="系统参数" hoverable loading={!systemInfo.nodeVersion}>
        <p className="item-text">
          <em>系统类型：</em>
          {systemInfo.platform}
          {systemInfo.arch}
        </p>
        <p className="item-text">
          <em>Node版本：</em>
          {systemInfo.nodeVersion}
        </p>
        <p className="item-text">
          <em>MySQL版本：</em>
          {systemInfo.mysqlVersion}
        </p>
        <p className="item-text">
          <em>当前环境：</em>
          {CONFIG.isProduction ? '生产环境' : '开发环境'}
        </p>
        <p className="item-text">
          <em>系统时间：</em>
          {curSystemTime}
        </p>
      </Card>
      <Card title="我的消息" hoverable loading={loading}>
        {messageList.length > 0 ? (
          messageList.map((msg: any) => (
            <p className="item-text" key={msg.id}>
              <em>{msg.content}</em>
            </p>
          ))
        ) : (
          <Empty />
        )}
      </Card>
      <Card
        title={`内存使用率(${bytes(systemInfo.totalmem)})`}
        hoverable
        className="mem"
      >
        <Progress
          type="circle"
          percent={memPercentage}
          strokeColor={statusColor(memPercentage)}
          format={(percent) => percent + '%'}
        />
        <div className="surplus">剩余{bytes(systemInfo.freemem)}</div>
      </Card>
    </div>
  )
}

export default React.memo(System)
