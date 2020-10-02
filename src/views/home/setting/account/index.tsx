/**
 * 账号设置
 */
import React, { useEffect } from 'react';
import md5 from 'blueimp-md5';
import { connect } from 'react-redux';
import { StoreState } from '@/store';
import { UserInfoProps } from '@/store/reducers/user';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { serviceUpdateUser, serviceGetUserConfig, serviceUpdateUserConfig } from '@/services';
import { Form, Input, Button, Divider } from 'antd';

type Props = {
  userInfo: UserInfoProps;
}

const Account: React.FC<Props & RouteComponentProps> = function ({ userInfo }) {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  async function handleUpdateUser() {
    try {
      const values = await form.validateFields();
      serviceUpdateUser({ password: md5(values.password) });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSckey() {
    try {
      const values = await form2.validateFields();
      serviceUpdateUserConfig({ sckey: values.sckey });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    serviceGetUserConfig()
    .then(res => {
      if (res.data.success) {
        form.setFieldsValue({
          sckey: res.data.data?.serverChanSckey || ''
        });
      }
    });
  }, []);

  return (
    <div className="account-setting">
      <Divider orientation="left" plain>修改密码</Divider>
      <Form layout="vertical" form={form} style={{ width: '300px' }}>
        <Form.Item
          label="登录名"
          name="name"
          initialValue={userInfo.loginName}
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="password"
          rules={[
            {
              required: true,
              message: "请输入新密码"
            },
            {
              pattern: /.{6,}/,
              message: "新密码至少6位"
            }
          ]}
        >
          <Input type="password" maxLength={32} />
        </Form.Item>
        <br />
        <Form.Item>
          <Button type="primary" onClick={handleUpdateUser}>提交</Button>
        </Form.Item>
      </Form>

      <Divider orientation="left" plain>Server酱配置</Divider>

      <Form layout="vertical" form={form2} style={{ width: '300px' }}>
        <Form.Item
          label="SCKEY"
          name="sckey"
          rules={[
            {
              required: true,
              message: '请正确填写SCKEY'
            }
          ]}
        >
          <Input maxLength={100} />
        </Form.Item>
        <div style={{ textAlign: 'right', marginTop: '5px' }}>
          <a href="http://sc.ftqq.com" target="_blank" rel="noopener noreferrer">如何获取？</a>
        </div>
        <Form.Item>
          <Button type="primary" onClick={handleSckey}>提交</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = ({ user }: StoreState): { userInfo: UserInfoProps } => {
  return { userInfo: user.userInfo };
};

export default connect(mapStateToProps)(withRouter(Account));
