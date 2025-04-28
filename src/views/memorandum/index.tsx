/**
 * 我的备忘
 */
import React, { useState, useEffect } from 'react'
import './style.scss'
import dayjs from 'dayjs'
import NoData from '@/components/no-data/index'
import { Card, Button, Popconfirm, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { serviceGetMemorandum, serviceDeleteMemorandum } from '@/services'
import { defaultTitle } from './constants'

const MemorandumPage: React.FC = () => {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  function handleButton(
    buttonType: 0 | 1 | 2,
    item: any,
    e?: React.MouseEvent
  ) {
    e?.stopPropagation()
    e?.preventDefault()

    if (buttonType === 0) {
      setLoading(true)
      serviceDeleteMemorandum(item.id)
        .then(() => {
          getData()
        })
        .finally(() => {
          setLoading(false)
        })
      return
    }

    if (buttonType === 2) {
      navigate('/home/memorandum/create')
      return
    }

    navigate(`/home/memorandum/update/${item.id}`)
  }

  function getData() {
    serviceGetMemorandum()
      .then((res) => {
        const data = res.rows.map((item: any) => {
          const format = 'YYYY.M.D HH:mm'
          item.createdAt = dayjs(item.createdAt).format(format)
          item.updatedAt = dayjs(item.updatedAt).format(format)
          item.title = item.title || defaultTitle
          return item
        })
        setList(data)
      })
      .finally(() => setLoading(false))
  }

  function goDetail(id: string) {
    navigate(`/home/memorandum/detail/${id}`)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Spin spinning={loading} wrapperClassName="memorandum-spin">
      <div className="memorandum">
        {list.length > 0 ? (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((item: any) => (
              <Card
                onClick={() => goDetail(item.id)}
                title={item.title}
                hoverable
                key={item.id}
              >
                {item.updatedAt}
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: item.html }}
                ></div>
                <div className="button-group">
                  <Popconfirm
                    title="您确定要删除吗？"
                    onConfirm={(e) => {
                      e?.stopPropagation()
                      handleButton(0, item)
                    }}
                    onCancel={(e) => {
                      e?.stopPropagation()
                    }}
                    placement="bottomRight"
                    okType="danger"
                  >
                    <Button size="small" onClick={(e) => e?.stopPropagation()}>
                      删除
                    </Button>
                  </Popconfirm>
                  <Button
                    size="small"
                    onClick={handleButton.bind(null, 1, item)}
                  >
                    编辑
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <NoData
            message="还没有备忘录，是否马上创建？"
            onClick={handleButton.bind(null, 2, null)}
          />
        )}
      </div>
    </Spin>
  )
}

export default MemorandumPage
