import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Icon, Statistic } from 'antd';
import './style.scss';
import { serviceGetPanelData } from '@/services';

const PanelGroup = () => {
  const isInit = useRef<any>(false);
  const [state, setState] = useState([
    { title: '今日支出', total: 0, iconType: 'property-safety', suffix: '$' },
    { title: '今日待办', total: 0, iconType: 'schedule' },
    { title: '活动清单', total: 0, iconType: 'file-text' },
    { title: '提醒事项', total: 0, iconType: 'alert' },
  ]);

  useEffect(() => {
    if (isInit.current) return;

    isInit.current = true;

    serviceGetPanelData()
    .then(res => {
      if (res.data.success) {
        const data = state.slice();
        data[0].total = res.data.data.consumption;
        data[1].total = res.data.data.todayTaskCount;
        data[2].total = res.data.data.unfinishedTodoListCount;
        data[3].total = res.data.data.reminderCount;
        setState(data)
      }
    });
  }, [state]);

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24}} className="panel-group">
    {
      state.map(item => (
        <Col xl={6} lg={12} md={12} sm={24} xs={24} key={item.title}>
          <div className="block-item">
            <Icon type={item.iconType} theme="filled" />
            <div className="data">
              <Statistic title={item.title} value={item.total} suffix={item.suffix} />
            </div>
          </div>
        </Col>
      ))
    }
    </Row>
  )
};

export default React.memo(PanelGroup);
