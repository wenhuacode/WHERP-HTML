// @ts-ignore
import { useState } from 'react';
import {
  Form,
  Input,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  Space,
  Tabs, message,
} from 'antd';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import { register } from '@/services/ant-design-pro/api';
import { history } from '@@/core/history';

const { Option } = Select;

const residences = [
  {
    value: '总经办',
    label: '总经办',
  },
  {
    value: '销售一部',
    label: '销售一部',
    children: [
      {
        value: '一组',
        label: '一组',
        children: [
          {
            value: '杭一地区(市)',
            label: '杭一地区(市)',
          },
          {
            value: '杭一动销(市)',
            label: '杭一动销(市)',
          },
          {
            value: '杭二地区(市)',
            label: '杭二地区(市)',
          },
          {
            value: '杭二动销(市)',
            label: '杭二动销(市)',
          },
          {
            value: '杭三地区(市)',
            label: '杭三地区(市)',
          },
          {
            value: '杭三动销(市)',
            label: '杭三动销(市)',
          },
          {
            value: '绍兴地区',
            label: '绍兴地区',
          },
          {
            value: '绍兴动销',
            label: '绍兴动销',
          },
          {
            value: '湖州地区',
            label: '湖州动销',
          },
        ],
      },
      {
        value: '二组',
        label: '二组',
        children: [
          {
            value: '嘉兴地区',
            label: '嘉兴地区',
          },
          {
            value: '嘉兴动销',
            label: '嘉兴动销',
          },
        ],
      },
      {
        value: '三组',
        label: '三组',
      },
    ],
  },
  {
    value: '销售二部',
    label: '销售二部',
    children: [
      {
        value: '省外/VIP',
        label: '省外/VIP',
      },
      {
        value: 'TOB平台运营',
        label: 'TOB平台运营',
      },
      {
        value: 'TOC平台运营',
        label: 'TOC平台运营',
      },
      {
        value: '二部客服组',
        label: '二部客服组',
      },
      {
        value: '江苏地区',
        label: '江苏地区',
      },
    ],
  },
  {
    value: '技术部',
    label: '技术部',
  },
  {
    value: '储运部',
    label: '储运部',
  },
  {
    value: '市场部',
    label: '市场部',
  },
  {
    value: '财务部',
    label: '财务部',
  },
  {
    value: '综管部',
    label: '综管部',
  },
  {
    value: '直播运营部',
    label: '直播运营部',
  },
];

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 12,
      offset: 12,
    },
    sm: {
      span: 8,
      offset: 8,
    },
  },
};

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const loginPath = '/user/login';

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  const onFinish = async (values: any) => {
    try {
      const msg = await register({ ...values });
      if (msg.status === '0') {
        const defaultLoginSuccessMessage = '注册成功！现在为您跳转到登录界面。'

        message.success(defaultLoginSuccessMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        await waitTime(2000);
        history.push(loginPath);
      }
    } catch (error) {
      const defaultLoginFailureMessage =  '注册失败，请重试！'
      message.error(defaultLoginFailureMessage);
    }
    };


  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        {/*<Option value="87">+87</Option>*/}
      </Select>
    </Form.Item>
  );

  const [ phone, setPhoneNumber ] = useState("");
  const [loadings, setLoadings] = useState([]);


  const enterLoading = (index: number) => {
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      // @ts-ignore
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        // @ts-ignore
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };


  const getCompanyName = () => {
    setPhoneNumber(form.getFieldValue("phone"));
  };

  const onGetCaptcha = async () => {
    const result: any = await getFakeCaptcha({
      phone,
    });
    if (result === false) {
      return;
    }
    message.success(`手机号 ${phone} 验证码发送成功`);
    enterLoading(0)
  };




  return (
    <Tabs defaultActiveKey="1" centered>
      <Tabs.TabPane tab="注册页面" key="1">
        <Form
          {...formItemLayout}
          form={form}
          onValuesChange={getCompanyName}
          layout="horizontal"
          name="register"
          onFinish={onFinish}
          initialValues={{
            // residence: ['销售一部'],
            prefix: '86',
          }}
          scrollToFirstError
        >

          <Form.Item
            name="phone"
            label="手机号码"
            rules={[
              {
                required: true,
                message: '请输入您的手机号码!'
              },
              {
                min: 11,
                max: 11,
                message: '请检查手机号格式',
              },
              {
                pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                message: '请输入正确的手机号',
              },
            ]}
          >
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入您的密码!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请确认您的密码!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('您输入的两个密码不匹配!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            tooltip="请输入你的真实姓名!"
            rules={[{ required: true, message: '请输入你的姓名!', whitespace: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="department"
            label="部门"
            rules={[
              { type: 'array', required: true, message: '请选择你的部门!' },
            ]}
          >
            <Cascader options={residences} multiple style={{ width: '100%' }}
                      maxTagCount="responsive"/>
          </Form.Item>


          <Form.Item label="验证码" extra="请输入您获取到的验证码.">
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="captcha"
                  noStyle
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button onClick={onGetCaptcha} loading={loadings[0]}>获取验证码</Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请勾选我已阅读了用户协议')),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              我已经阅读了<a href="">用户协议</a>
            </Checkbox>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Space style={{ width: '100%' }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              点击注册
            </Button>
              </Space>
          </Form.Item>
        </Form>
      </Tabs.TabPane>
    </Tabs>

  );
};

export default () => <RegistrationForm />;
