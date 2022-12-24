import React, { useMemo } from 'react'
import { Drawer, Collapse } from 'antd'
import { LOG_LIST } from './constants'

const { Panel } = Collapse

interface Props {
  visible: boolean
  onClose: () => void
  detail: Record<string, any>
}

const defaultActiveKey = ['1', '2', '3', '5']

const DetailDrawer: React.FC<Props> = function({
  visible,
  onClose,
  detail
}) {
  const record: Record<string, any> = useMemo(() => {
    const data = LOG_LIST.find(item => Number(item.key) === Number(detail.logType))
    if (!data) {
      return {}
    }

    return {
      ...data,
      title: `${data.name} - ${detail.companyName}`
    }
  }, [detail])

  return (
    <Drawer
      open={visible}
      title={record.title}
      width={500}
      onClose={onClose}
      destroyOnClose
    >
      <p className="pl20 mb20">日期：{detail.__createdAt__}</p>
      <Collapse
        defaultActiveKey={defaultActiveKey}
        expandIconPosition="right"
      >
        <Panel header={record.doneTitle} key="1">
          <pre>{detail.doneContent || '无'}</pre>
        </Panel>
        <Panel header={record.undoneTitle} key="2">
          <pre>{detail.undoneContent || '无'}</pre>
        </Panel>
        <Panel header={record.planTitle} key="3">
          <pre>{detail.planContent || '无'}</pre>
        </Panel>
        <Panel header={record.summaryTitle} key="5">
          <pre>{detail.summaryContent || '无'}</pre>
        </Panel>
      </Collapse>
    </Drawer>
  )
}

export default DetailDrawer
