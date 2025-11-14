import React, { useMemo } from 'react'
import { Drawer, Collapse } from 'antd'
import type { CollapseProps } from 'antd/es/collapse'
import { LOG_LIST } from './constants'

interface Props {
  visible: boolean
  onClose: () => void
  detail: Record<string, any>
}

const defaultActiveKey = ['1', '2', '3', '5']

const DetailDrawer: React.FC<Props> = function ({ visible, onClose, detail }) {
  const record: Record<string, any> = useMemo(() => {
    const data = LOG_LIST.find(
      (item) => Number(item.key) === Number(detail.logType),
    )
    if (!data) {
      return {}
    }

    return {
      ...data,
      title: `${data.name} - ${detail.companyName}`,
    }
  }, [detail])

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: record.doneTitle,
      children: <pre>{detail.doneContent || '无'}</pre>,
    },
    {
      key: '2',
      label: record.undoneTitle,
      children: <pre>{detail.undoneContent || '无'}</pre>,
    },
    {
      key: '3',
      label: record.planTitle,
      children: <pre>{detail.planContent || '无'}</pre>,
    },
    {
      key: '5',
      label: record.summaryTitle,
      children: <pre>{detail.summaryContent || '无'}</pre>,
    },
  ]

  return (
    <Drawer
      open={visible}
      title={record.title}
      width={500}
      onClose={onClose}
      destroyOnHidden
    >
      <p className="pl-5 mb-5">日期：{detail.__createdAt__}</p>
      <Collapse
        items={items}
        defaultActiveKey={defaultActiveKey}
        expandIconPosition="start"
      ></Collapse>
    </Drawer>
  )
}

export default DetailDrawer
