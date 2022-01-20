import React, { FC, useEffect, useState } from 'react'
import './style.scss'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { serviceGetMemorandumById } from '@/services'
import { defaultTitle } from './constants'
import { LeftOutlined, EditOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import config from '@/config'

const DetailPage: FC = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    if (!id) return

    serviceGetMemorandumById(id)
    .then(res => {
      const title = res.title || defaultTitle
      document.title = `${title} - ${config.title}`
      setTitle(title)
      setContent(res.html)
    })
    .finally(() => setLoading(false))
  }, [id])

  function goBack() {
    navigate('/home/memorandum', { replace: true })
  }

  return (
    <Spin spinning={loading}>
      <div className="memorandum-detail">
        <div className="tool-bar">
          <LeftOutlined className="icon-left" onClick={goBack} />
          <Link className="edit" to={`/home/memorandum/update/${id}`}>
            <EditOutlined title="编辑" />
          </Link>
        </div>
        <h1 className="title">{ title }</h1>
        <div
          className="markdown-body tui-editor-contents"
          dangerouslySetInnerHTML={{ __html: content }}
        >
        </div>
      </div>
    </Spin>
  )
}

export default DetailPage
