import React, { useEffect, useState } from 'react';
import './style.scss';
import { Empty } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';
import { serviceGetCapitalFlowPrice } from '@/services';

const cols = {
  date: {
    range: [0, 1]
  }
};

const MoneyAccessChart = () => {
  const [data, setData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    serviceGetCapitalFlowPrice()
    .then(res => {
      if (res.data.success) {
        let price = 0;
        const data = res.data.data.map((item: any) => {
          item.date = item.date.slice(5);
          item.price = Number(item.price);
          price += item.price;
          return item;
        });

        setData(data);
        setTotalPrice(price);
      }
    });
  }, []);

  return (
    <div className="money-access">
      <h2 className="title">过去7天资金流动</h2>
      {(totalPrice > 0) ? (
        <Chart height={400} data={data} scale={cols} forceFit>
          <Legend />
          <Axis
            name="price"
            label={{ formatter: (val: string) => `${parseInt(val)}￥` }}
          />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom
            type="line"
            position="date*price"
            size={2}
            color="name"
            shape="smooth"
          />
          <Geom
            type="point"
            position="date*price"
            size={4}
            shape="circle"
            color="name"
            style={{ stroke: '#fff', lineWidth: 1 }}
          />
        </Chart>
      ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </div>
  )
};

export default React.memo(MoneyAccessChart);
