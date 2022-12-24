/**
 * 我的备忘
 */
import React, { useState, useEffect } from 'react'
import './style.scss'
import dayjs from 'dayjs'
import NoData from '@/components/no-data/index'
import { Card, Col, Row, Button, Popconfirm, Spin } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
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
      serviceDeleteMemorandum(item.id)
      .then(() => {
        getData()
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
    .then(res => {
      const data = res.map((item: any) => {
        item.createdAt = dayjs(item.createdAt).format('YYYY/M/D HH:mm')
        item.title = item.title || defaultTitle
        return item
      })
      setList(data)
    })
    .finally(() => setLoading(false))
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Spin spinning={loading} wrapperClassName="memorandum-spin">
      <div className="memorandum">
        {(list.length > 0) ? (
          <Row gutter={16} align="bottom">
            {list.map((item: any) => (
              <Col span={8} key={item.id}>
                <Link to={`/home/memorandum/detail/${item.id}`}>
                  <Card title={item.title} hoverable>
                    {item.createdAt}
                    <div
                      className="content"
                      dangerouslySetInnerHTML={{ __html: item.html }}
                    >
                    </div>
                    <div className="button-group">
                      <Popconfirm
                        title="您确定要删除吗？"
                        onConfirm={e => {
                          e?.stopPropagation()
                          handleButton(0, item)
                        }}
                        placement="bottomLeft"
                        okType="danger"
                      >
                        <Button size="small">删除</Button>
                      </Popconfirm>
                      <Button size="small" onClick={handleButton.bind(null, 1, item)}>编辑</Button>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
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
