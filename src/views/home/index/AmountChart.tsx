import React, { useEffect, useState } from 'react'
import './style.scss'
import { Empty, DatePicker } from 'antd'
import { serviceGetCapitalFlowAmount, serviceGetCapitalFlowAmountGroup } from '@/services'
import {
  LineChart, Line, XAxis,
  YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, BarChart,
  Bar
} from 'recharts'
import { formatDate, FORMAT_DATE, DATE_WEEK } from '@/utils'
import config from '@/config'

type DataProp = {
  date: string
  [key: string]: any
}

interface GroupProp {
  amount: string
  name: string
  type: number
  [key: string]: any
}

const { RangePicker } = DatePicker

const AmountChart = () => {
  const [data, setData] = useState<DataProp[]>([])
  const [group, setGroup] = useState<GroupProp[]>([])
  const [totalAmount, setTotalAmount] = useState(0)

  function getData(params?: object) {
    serviceGetCapitalFlowAmount({
      ...params
    })
    .then(res => {
      if (res.data.success) {
        let price = 0
        const data: DataProp[] = []
        res.data.data.forEach((item: DataProp, idx: number) => {
          const date = item.date.slice(5)
          const amount = Number(item.price)
          price += amount

          if (idx % 2 === 0) {
            data.push({
              date,
              '收入': amount
            })
          } else {
            data[data.length - 1]['支出'] = amount
          }
        })

        setData(data)
        setTotalAmount(price)
      }
    })

    serviceGetCapitalFlowAmountGroup({
      startDate: formatDate(DATE_WEEK[0]),
      endDate: formatDate(DATE_WEEK[1]),
      ...params
    }).then(res => {
      if (res.data.success) {
        setGroup(
          res.data.data.map((item: GroupProp) => {
            item.name = item.type === 1 ? `+ ${item.name}` : `- ${item.name}`
            return item
          })
        )
      }
    })
  }

  function handleChangeDate(_: unknown, formatString: [string, string]) {
    getData({
      startDate: formatString[0],
      endDate: formatString[1]
    })
  }

  useEffect(() => {
    getData()
  }, [])

  if (config.isProduction) {
    return null
  }

  return (
    <div className="amount-chart">
      <h2 className="title">
        资金流动
        <RangePicker
          format={FORMAT_DATE}
          value={DATE_WEEK}
          onChange={handleChangeDate}
          className="date-picker"
        />
      </h2>

      {(totalAmount > 0) ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="收入" stroke="#82ca9d" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="支出" stroke="#ff5000" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="no-data">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}

      {group.length > 0 && (
        <ResponsiveContainer width="100%" height={350} className="mt10">
          <BarChart
            width={500}
            height={300}
            data={group}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={20}
          >
            <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="amount" fill="#8884d8" background={{ fill: '#f1f1f1' }} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default React.memo(AmountChart)
