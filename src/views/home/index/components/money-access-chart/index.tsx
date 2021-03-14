import React, { useEffect, useState } from 'react'
import './style.scss'
import moment from 'moment'
import { Empty, DatePicker } from 'antd'
import {
  Chart,
  Point,
  Line,
  Tooltip,
  Legend,
} from 'bizcharts'
import { serviceGetCapitalFlowPrice } from '@/services'

type DataProp = {
  date: string
  name: string
  price: string
  type: number
}

const { RangePicker } = DatePicker
const FORMAT = 'YYYY-MM-DD'
const DEFAULT_DATE: any = [
  moment().subtract(7, 'day'),
  moment()
]

const scale = {
  temperature: { min: 0 },
  city: {
    formatter: (v: string): any => {
      const payload = {
        1: '收入',
        2: '支出'
      } as any
      return payload[v]
    }
  }
}

const MoneyAccessChart = () => {
  const [data, setData] = useState<DataProp[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  function getData(params?: object) {
    serviceGetCapitalFlowPrice({
      ...params
    })
    .then(res => {
      if (res.data.success) {
        let price = 0
        const data = res.data.data.map((item: any) => {
          const amount = Number(item.price)
          price += amount

          item.date = item.date.slice(5)
          item.price = amount
          item.priceLabel = '￥' + amount.toFixed(2)
          return item
        })

        setData(data)
        setTotalPrice(price)
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

      {(totalPrice > 0) ? (
        <Chart
          scale={scale}
          padding={[30, 20, 60, 40]}
          autoFit
          height={399}
          data={data}
          interactions={['element-active']}
        >
          <Point position="date*price" color="name" shape="circle" />
          <Line
            shape="smooth"
            position="date*price"
            color="name"
            label={['price',
              percent => {
                return {
                  content: () => '￥' + Number(percent).toFixed(2),
                }
              }
            ]}
          />
          <Tooltip shared showCrosshairs />
          <Legend background={{
            padding:[5,100,5,36],
            style: {
              fill: '#eaeaea',
              stroke: '#fff'
            }
          }} />
        </Chart>
      ) : (
        <div className="no-data">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
    </div>
  )
}

export default React.memo(MoneyAccessChart)
