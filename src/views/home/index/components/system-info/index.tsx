import React, { useCallback, useEffect, useMemo } from 'react';
import './style.scss';
import bytes from 'bytes';
import moment from 'moment';
import CONFIG from '@/config';
import useKeepState from 'use-keep-state';
import { Row, Col, Card, Progress } from 'antd';
import { totalPercentage } from '@/utils';
import { serviceGetInnerMessage } from '@/services';

interface Props {
  systemInfo: {
    [propName: string]: any;
  }
}

interface State {
  curSystemTime: string;
  messageList: any[];
  loading: boolean;
}

const initialState: State = {
  curSystemTime: '',
  messageList: [],
  loading: true
};

const statusColor = (percentage: number) => {
  if (percentage < 40) return '#52c41a';
  if (percentage < 80) return '#ffa500';
  return '#f50';
};
let timer: any;

const System: React.FC<Props> = ({ systemInfo }) => {
  const [state, setState] = useKeepState(initialState);
  const memPercentage = useMemo(() => {
    return totalPercentage(systemInfo.totalmem, systemInfo.freemem);
  }, [systemInfo.totalmem, systemInfo.freemem]);

  // 倒计时
  const countdown = useCallback(() => {
    clearTimeout(timer);
    const timeDiff = systemInfo.currentSystemTime + (Date.now() - systemInfo.currentSystemTime);
    setState({ curSystemTime: moment(timeDiff).format('YYYY-MM-DD HH:mm:ss') });
    timer = setTimeout(() => {
      countdown();
    }, 1000);
  }, [systemInfo.currentSystemTime, setState]);

  useEffect(() => {
    countdown();

    return () => {
      clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    serviceGetInnerMessage({ pageSize: 5 })
    .then(res => {
      if (res.data.success) {
        setState({ loading: false, messageList: res.data.data.rows });
      }
    });
  }, [setState]);

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24}} className="system-data">
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card
          title="系统参数"
          hoverable
          loading={!systemInfo.nodeVersion}
        >
          <p className="item-text">
            <em>系统类型：</em>
            {systemInfo.platform}{systemInfo.arch}
          </p>
          <p className="item-text">
            <em>Node版本：</em>
            {systemInfo.nodeVersion}
          </p>
          <p className="item-text">
            <em>MySQL版本：</em>
            {systemInfo.mysqlVersion}
          </p>
          <p className="item-text">
            <em>当前环境：</em>
            {CONFIG.isProduction ? '生产环境' : '开发环境'}
          </p>
          <p className="item-text">
            <em>系统时间：</em>
            {state.curSystemTime}
          </p>
        </Card>
      </Col>
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card
          title="我的消息" 
          hoverable 
          loading={state.loading}
        >
        {state.messageList.map((msg: any) => (
          <p className="item-text" key={msg.id}>
            <em>{msg.content}</em>
          </p>
        ))}
        </Card>
      </Col>
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card
          title={`内存使用率(${bytes(systemInfo.totalmem)})`} 
          hoverable 
          className="mem"
        >
          <Progress 
            type="circle" 
            percent={memPercentage} 
            strokeColor={statusColor(memPercentage)} 
            format={percent => percent + '%'}
          />
          <div className="surplus">剩余{bytes(systemInfo.freemem)}</div>
        </Card>
      </Col>
    </Row>
  )
};

export default React.memo(System);
