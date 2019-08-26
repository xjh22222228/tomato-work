import React, { useCallback, useEffect, useState } from 'react';
import {
  Form, Input, Button, message, Divider
} from 'antd';
import { connect } from 'react-redux';
import { StoreState } from '@/store';
import { UserInfoProps } from '@/store/reducers/user';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useFormInput } from '@/hooks';
import { serviceUpdateUser, serviceGetUserConfig, serviceUpdateUserConfig } from '@/services';
import md5 from 'blueimp-md5';

type Props = {
  userInfo: UserInfoProps;
}

const Account: React.FC<Props & RouteComponentProps> = function ({ userInfo }) {
  const password = useFormInput('');
  const [sckey, setSckey] = useState('');
  const passwordValue = password.value.trim();

  const handleUpdateUser = useCallback(() => {
    if (passwordValue.length < 6) {
      message.warn('密码至少6位');
      return;
    }
    serviceUpdateUser({ password: md5(passwordValue) });
  }, [passwordValue]);

  const handleSckey = useCallback(() => {
    if (!sckey) {
      message.warn('请正确填写SCKEY');
      return;
    }

    serviceUpdateUserConfig({ sckey });
  }, [sckey]);

  useEffect(() => {
    serviceGetUserConfig()
    .then(res => {
      if (res.data.success) {
        setSckey(res.data.data.serverChanSckey);
      }
    });
  }, []);

  return (
    <div className="account-setting">
      <Divider orientation="left">修改密码</Divider>
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
      <Divider orientation="left">Server酱配置</Divider>
      <Form layout="vertical" style={{ width: '300px' }}>
        <Form.Item label="SCKEY">
          <Input 
            maxLength={100} 
            value={sckey} 
            onChange={e => setSckey(e.target.value)} 
          />
          <div style={{ textAlign: 'right', marginTop: '5px' }}>
            <a href="http://sc.ftqq.com" target="_blank">如何获取？</a>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSckey}>提交</Button>
        </Form.Item>
      </Form>
    </div>
  )
};

const mapStateToProps = ({ user }: StoreState): { userInfo: UserInfoProps } => {
  return { userInfo: user.userInfo };
};

export default connect(mapStateToProps)(withRouter(Account));
