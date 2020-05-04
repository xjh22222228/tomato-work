import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './style.scss';
import Avatar from '@/components/avatar';
import moment from 'moment';
import config from '@/config';
import { Layout, Icon, Badge, Popover } from 'antd';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { HomeMainState } from '@/views/home/main-entry/index';
import { connect } from 'react-redux';
import { StoreState } from '@/store';
import { logout } from '@/store/actions/user';
import { SETTING } from '@/router/constants';
import { serviceGetInnerMessage } from '@/services';
import { fullscreen, exitFullscreen } from '@/utils';

const { Header } = Layout;
const popoverList = [
  { name: SETTING.BASE.name, path: SETTING.BASE.path },
  { name: SETTING.NOTIFICATION.name, path: SETTING.NOTIFICATION.path },
  { name: SETTING.ACCOUNT.name, path: SETTING.ACCOUNT.path }
];

type Props = ReturnType<typeof mapStateToProps> & HomeMainState & RouteComponentProps;

const PopoverContent = (
  <div className="popover-content">
  {popoverList.map(el => (
    <Link to={el.path} key={el.name} className="ls">{el.name}</Link>
  ))}
    <div className="ls sign-out" onClick={() => logout()}>
      <Icon type="poweroff" style={{ fontSize: '14px', marginRight: '5px' }} />
      退出
    </div>
  </div>
);

const HomeHeader: React.FC<Props> = function ({
  collapsed,
  setCollapsed,
  userInfo
}) {

  const [messageList, setMessageList] = useState([]);
  const [unReadCount, setUnReadCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    serviceGetInnerMessage({ pageSize: 5 })
    .then(res => {
      if (res.data.success) {
        let count = 0;
        const data = res.data.data.rows.map((item: any) => {
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
          if (!item.hasRead) {
            count++;
          }
          return item;
        });
        setUnReadCount(count);
        setMessageList(data);
      }
    });
  }, []);

  const MessageContent = useMemo(() => (
    <div className="message-popover">
      <div className="msg-header item-block">
        <span className="left">站内消息通知</span>
        <Link className="right" to={SETTING.NOTIFICATION.path}>消息接收管理</Link>
      </div>
      {
        messageList.map((item: any) => (
          <div className="item-block ls" key={item.id}>
            <div className="content">{item.content}</div>
            <div className="date">{item.createdAt}</div>
          </div>
        ))
      }
      <Link className="item-block ls" to={SETTING.INNER_MESSAGE.path}>查看更多</Link>
    </div>
  ), [messageList]);

  const handleFullscreen = useCallback(() => {
    setIsFullscreen(isFullscreen => {
      isFullscreen ? exitFullscreen() : fullscreen();
      return !isFullscreen;
    });
  }, [setIsFullscreen]);

  return (
    <Header>
      <div className="left">
        <Icon 
          type={collapsed ? 'menu-unfold' : 'menu-fold'} 
          style={{ cursor: 'pointer', fontSize: '20px' }} 
          onClick={setCollapsed}
        />
      </div>
      <ul className="right">
        <Popover content={MessageContent}>
          <li>
            <Badge dot={unReadCount > 0}>
              <Icon type="bell" />
            </Badge>
          </li>
        </Popover>
        <li onClick={handleFullscreen}>
          <Icon type={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} />
        </li>
        <li>
          <a href={config.github.bug} target="_blank" rel="noopener noreferrer">
            <Icon type="bug" theme="filled" />
          </a>
        </li>
        <li>
          <a href={config.github.repositoryUrl} target="_blank" rel="noopener noreferrer">
            <Icon type="github" />
          </a>
        </li>
        <Popover 
          placement="bottomRight" 
          content={PopoverContent} 
        >
        <li>
          <Avatar src={userInfo.avatarUrl} />
          <span className="username">{userInfo.username}</span>
        </li>
        </Popover>
      </ul>
    </Header>
  )
};

const mapStateToProps = ({ user }: StoreState) => {
  return { userInfo: user.userInfo }
};

export default connect(mapStateToProps)(withRouter(HomeHeader));
