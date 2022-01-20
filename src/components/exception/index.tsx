import React from 'react'
import './style.scss'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ExceptionStatusType } from 'antd/lib/result'

interface Props {
  status?: ExceptionStatusType
}

const statusMap = {
  403: {
    title: '403',
    subTitle: 'Sorry, you are not authorized to access this page.',
  },
  404: {
    title: '404',
    subTitle: 'Sorry, the page you visited does not exist.',
  },
  500: {
    title: '500',
    subTitle: 'Sorry, the server is wrong.',
  }
}

const NoMatch: React.FC<Props> = function ({
  status = '404'
}) {
  const navigate = useNavigate()

  function goBack() {
    navigate(-1)
  }

  return (
    <Result
      status={status}
      extra={<Button type="primary" onClick={goBack}>Back</Button>}
      {...statusMap[status]}
    />
  )
}

export default NoMatch
