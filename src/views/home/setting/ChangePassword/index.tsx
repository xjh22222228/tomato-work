import React from 'react';
import './style.scss';
import {
  Form, Input, Button, message
} from 'antd';
import { connect } from 'react-redux';
import { StoreState } from '@/store';
import { UserInfoProps } from '@/store/reducers/user';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useFormInput } from '@/hooks';
import { serviceUpdateUser } from '@/services';
import md5 from 'blueimp-md5';

type Props = {
  userInfo: UserInfoProps;
}

const ChangePassword: React.FC<Props & RouteComponentProps> = function ({ userInfo }): JSX.Element {
  const password = useFormInput('');
  const passwordValue = password.value.trim();

  function handleUpdateUser() {
    if (passwordValue.length < 6) {
      message.warn('密码至少6位');
      return;
    }
    serviceUpdateUser({ password: md5(passwordValue) });
  }

  return (
    <div className="setting-base">
      <h1 style={{ margin: '10px 0 20px 0 '}}>修改密码</h1>
      <Form layout="vertical" style={{ width: '300px' }}>
        <Form.Item label="登录名">
          <Input defaultValue={userInfo.loginName} readOnly disabled />
        </Form.Item>
        <Form.Item label="密码">
          <Input type="password" maxLength={32} {...password} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleUpdateUser}>提交</Button>
        </Form.Item>
      </Form>
    </div>
  )
};

const mapStateToProps = ({ user }: StoreState): { userInfo: UserInfoProps } => {
  return { userInfo: user.userInfo };
};

export default connect(mapStateToProps)(withRouter(ChangePassword));
