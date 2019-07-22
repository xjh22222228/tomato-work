import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import './style.scss';
import { Button, Input, Icon, message, Popover } from 'antd';
import Footer from '@/components/Footer';
import { useFormInput } from '@/hooks';
import { RouteComponentProps } from 'react-router-dom';
import { DispatchProp, connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { githubAuthz, loginByToken, setUser } from '@/store/actions';
import { serviceLogin } from '@/services';
import { HOME } from '@/router/constants';
import { LOCAL_STORAGE } from '@/constants';
import qs from 'query-string';
import md5 from 'blueimp-md5';
import _ from 'lodash';
import api from '@/api';
import config from '@/config';


type ThunkDispatchProps = ThunkDispatch<{}, {}, AnyAction>;
type LoginProps = {
  dispatch: ThunkDispatchProps;
} & DispatchProp & RouteComponentProps;

const PopoverContent = (
  <div style={{ padding: '10px 20px 10px 20px' }}>
    <div>本站不开放注册账号，首次登陆请使用GitHub</div>
    <div>登陆后系统将自动注册账号, 密码为123456</div>
  </div>
);

const LOGIN_NAME = window.localStorage.getItem(LOCAL_STORAGE.LOGIN_NAME) || '';

const Login: React.FC<LoginProps> = function ({
  dispatch,
  history,
  location
}) {
  const loginName = useFormInput(LOGIN_NAME);
  const password = useFormInput('');
  const code = useFormInput('');
  const [loading, setLoading] = useState(false);
  const [redirectUrl] = useState(() => {
    const url = qs.parse(location.search).redirectUrl as string;
    return url || HOME.HOME_INDEX.path;
  });

  useEffect(() => {
    const query = qs.parse(location.search);
    const { token, state } = query;

    if (Number(state) === 0) {
      message.error('登录失败，请重新登录');
      return;
    }

    if (token) {
      dispatch(loginByToken(token as string))
      .then((res) => {
        if (!_.isEmpty(res.userInfo)) {
          history.replace(redirectUrl);
        }
      });
    }
  }, [history, location.search, dispatch, redirectUrl]);

  const handleSubmit = () => {
    const _loginName = loginName.value.trim();
    const _password = password.value.trim();
    const _code = code.value.trim();

    try {
      if (!_loginName) {
        throw new Error('用户名不能为空');
      }
      if (!_password) {
        throw new Error('密码不能为空');
      }
      if (!_code) {
        throw new Error('验证码不能为空');
      }

      setLoading(true);
      serviceLogin({ loginName: _loginName, password: md5(_password), code: _code })
      .then(res => {
        setLoading(false);
        if (res.data.success) {
          dispatch(setUser(res.data.data.userInfo));
          history.replace(redirectUrl);
        }
      })
      .catch(_ => {
        setLoading(false);
      });
    } catch (err) {
      message.warn(err.message);
      return;
    }
  };

  const refreshCaptcha = useCallback(e => {
    e.target.src = api.getCaptcha + '?_=' +  Date.now();
  }, []);
  
  const githubHandler = () => {
    setLoading(true);
    githubAuthz();
  };

  return (
    <section className="login-page">
      <a href={config.github.repositoryUrl} target="_blank">
        <svg width="56" height="56" viewBox="0 0 250 250" className="svg-wrapper" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" className="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor"></path></svg>
      </a>
      
      <div className="wrap">
        <div>
          <div className="logo-wrap">
            <img src={require('@/assets/img/common/logo.png')} className="logo" />
            <em>{ config.title }</em>
          </div>
          <Input.Group>
            <Input
              {...loginName} 
              placeholder="Username"
              prefix={<Icon type="user" />} 
              maxLength={32} 
              autoComplete="off" 
              onPressEnter={handleSubmit} 
            />
            <Input
              {...password}
              placeholder="Password"
              prefix={<Icon type="lock" />} 
              maxLength={32} 
              type="password" 
              autoComplete="off"
              onPressEnter={handleSubmit}
            />
            <Input
              {...code}
              placeholder="请输入验证码"
              prefix={<Icon type="picture" />} 
              maxLength={4} 
              autoComplete="off" 
              onPressEnter={handleSubmit} 
              suffix={<img src={api.getCaptcha} className="captcha" onClick={refreshCaptcha} />}
            />
          </Input.Group>
          <Button 
            type="primary" 
            style={{ marginTop: '20px' }} 
            size="large" 
            loading={loading} 
            block 
            onClick={handleSubmit}
          >
            { loading ? '登 录 中...' : '登 录' }
          </Button>
          <div className="other-login">
            <span className="txt">其他登录方式</span>
            <Icon 
              type="github" 
              onClick={githubHandler} 
            />
            <div className="to-register">
              <Popover content={PopoverContent} trigger="hover" placement="bottomRight">
                <em className="cursor_pointer">注册账号</em>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  )
};

export default connect()(Login);
