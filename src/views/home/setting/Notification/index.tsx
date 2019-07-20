import React, {
  useState,
  useEffect
} from 'react';
import './style.scss';
import { Switch } from 'antd';
import { serviceGetUserConfig, serviceUpdateUserConfig } from '@/services';

const Notification: React.FC = function (): JSX.Element {
  const [userConfig, setUserConfig] = useState({
    isMatterNotify: true,
    isTaskNotify: true
  });

  useEffect(() => {
    serviceGetUserConfig().then(res => {
      if (res.data.success) {
        setUserConfig(res.data.data);
      }
    });
  }, []);

  function handleUpdateUserConfig(type: number, checked: boolean) {
    const fields: any = {
      0: 'isTaskNotify',
      1: 'isMatterNotify'
    };
    serviceUpdateUserConfig({
      [fields[type]]: checked
    }).then(res => {
      if (res.data.success) {
        setUserConfig({
          ...userConfig,
          [fields[type]]: checked
        });
      }
    });
  }

  return (
    <div className="notification">
      <h1 style={{ margin: '10px 0 20px 0 '}}>消息通知</h1>
      <div className="list">
        <div className="left">
          <h4 className="title">待办任务</h4>
          <p className="description">开通后将以站内信的形式通知并且通知到邮箱， 否则只会站内信通知</p>
        </div>
        <Switch 
          checked={userConfig.isTaskNotify} 
          onChange={handleUpdateUserConfig.bind(null, 0)}
        />
      </div>
      <div className="list">
        <div className="left">
          <h4 className="title">提醒事项</h4>
          <p className="description">开通后将以站内信的形式通知并且通知到邮箱， 否则只会站内信通知</p>
        </div>
        <Switch 
          checked={userConfig.isMatterNotify} 
          onChange={handleUpdateUserConfig.bind(null, 1)} 
        />
      </div>
    </div>
  )
};

export default Notification;
