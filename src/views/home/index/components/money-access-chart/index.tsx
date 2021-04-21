import React, { useEffect, useState } from 'react'
import './style.scss'
import moment from 'moment'
import { Empty, DatePicker } from 'antd'
import { serviceGetCapitalFlowPrice } from '@/services'
import {
  LineChart, Line, XAxis,
  YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

type DataProp = {
  date: string
  [key: string]: any
}

const { RangePicker } = DatePicker
const FORMAT = 'YYYY-MM-DD'
const DEFAULT_DATE: any = [
  moment().subtract(7, 'day'),
  moment()
]

const MoneyAccessChart = () => {
  const [data, setData] = useState<DataProp[]>([])
  const [totalAmount, setTotalAmount] = useState(0)

  function getData(params?: object) {
    serviceGetCapitalFlowPrice({
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

  return (
    <div className="money-access">
      <h2 className="title">
        资金流动
        <RangePicker
          format={FORMAT}
          value={DEFAULT_DATE}
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
    </div>
  )
}

export default React.memo(MoneyAccessChart)
