import React, { useState } from 'react';
import { Row, Col, Icon, Statistic } from 'antd';
import './style.scss';

const PanelGroup = () => {
  const [state] = useState([
    { title: '资金流动', total: 102400, iconType: 'property-safety' },
    { title: '今日待办', total: 102400, iconType: 'schedule' },
    { title: '活动清单', total: 102400, iconType: 'file-text' },
    { title: '提醒事项', total: 102400, iconType: 'alert' },
  ]);

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24}} className="panel-group">
    {
      state.map(item => (
        <Col xl={6} lg={12} md={12} sm={24} xs={24} key={item.title}>
          <div className="block-item">
            <Icon type={item.iconType} theme="filled" />
            <div className="data">
              <Statistic title={item.title} value={item.total} />
            </div>
          </div>
        </Col>
      ))
    }
    </Row>
  )
};

export default React.memo(PanelGroup);
