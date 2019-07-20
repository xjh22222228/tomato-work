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
