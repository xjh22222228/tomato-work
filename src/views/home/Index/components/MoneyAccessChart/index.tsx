import React, { useEffect, useState } from 'react';
import './style.scss';
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

  useEffect(() => {
    serviceGetCapitalFlowPrice()
    .then(res => {
      if (res.data.success) {
        const data = res.data.data.map((item: any) => {
          item.date = item.date.slice(5);
          return item;
        })
        setData(data);
      }
    });
  }, [setData]);

  return (
    <div className="money-access">
      <h2 className="title">7天资金流动</h2>
      <Chart height={400} data={data} scale={cols} forceFit>
        <Legend />
        <Axis
          name="price"
          label={{ formatter: val => `${parseInt(val)}￥` }}
        />
        <Tooltip crosshairs={{ type: 'y' }} />
        <Geom
          type="line"
          position="date*price"
          size={2}
          color={'name'}
          shape={'smooth'}
        />
        <Geom
          type="point"
          position="date*price"
          size={4}
          shape={'circle'}
          color={'name'}
          style={{ stroke: '#fff', lineWidth: 1 }}
        />
      </Chart>
    </div>
  )
};

export default React.memo(MoneyAccessChart);
