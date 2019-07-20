import React from 'react';
import { Button, Result } from 'antd';
import NoDataSvg from '@/assets/img/common/no-data.svg';

interface Props {
  onClick(e: React.MouseEvent): void;
  message?: string;
}

const NoData: React.FC<Props> = ({ onClick, message = '暂无数据' }) => {
  return (
    <Result
      className="no-data"
      icon={<img src={NoDataSvg} className="user-drag_none" alt="no-data" />}
      title={message}
      extra={<Button type="primary" onClick={onClick}>现在创建</Button>}
      status={'info'}
      style={{ marginTop: '50px' }}
    />
  )
};

export default React.memo(NoData);
