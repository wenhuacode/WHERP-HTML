import {
    // AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    // TaobaoCircleOutlined,
    UserOutlined,
    // WeiboCircleOutlined,
    MailTwoTone,
} from '@ant-design/icons';
import { Alert, Form, message, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText, ModalForm, ProFormTreeSelect } from '@ant-design/pro-components';
// @ts-ignore
import { history, SelectLang, useModel, Helmet } from '@umijs/max';
import Footer from '@/components/Footer';
import { login, register } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
// @ts-ignore
import token from '@/utils/token'
import { getEmployeeClassify } from "@/services/ant-design-pro/user";
import type { DataNode } from "antd/lib/tree";
import { ProCard } from "@ant-design/pro-components";
import { useEmotionCss } from '@ant-design/use-emotion-css';
import Settings from '../../../../config/defaultSettings';
import { flushSync } from 'react-dom';


const LoginMessage: React.FC<{
    content: string;
}> = ({ content }) => (
    <Alert
        style={{ marginBottom: 24, }}
        message={content}
        type="error"
        showIcon
    />
);


const Login: React.FC = () => {
    const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
    const [type, setType] = useState<string>('account');
    const { initialState, setInitialState } = useModel('@@initialState');
    const [employeeClassifyData, setEmployeeClassifyData] = useState<any>();
    const [registerState, setRegisterState] = useState(false);

    const [form] = Form.useForm();

    // 获取公司分类信息
    const fetchEmployeeClassify = async () => {
        const result = await getEmployeeClassify();
        const menu2Node: (m: any) => DataNode = (m) => {
            return {
                ...m,
                key: m.classify_no,
                value: m.classify_no,
                title: m.classify_name,
                children: m.children?.map(menu2Node),
            };
        };
        const data = menu2Node(result.data?.[0])

        setEmployeeClassifyData([data]);
    }
    const containerClassName = useEmotionCss(() => {
        return {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
            backgroundImage:
                "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
            backgroundSize: '100% 100%',
        };
    });



    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();
        // @ts-ignore
        const permissions = await initialState?.fetchMenus?.();
        const Address = await initialState?.fetchAddress?.();
        const EmployeeData = await initialState?.fetchEmployeeData?.();
        const OrderType = await initialState?.fetchOrderType?.();
        const ProductClassify = await initialState?.fetchProductClassify?.();
        const Storehouse = await initialState?.fetchStorehouse?.();
        const CustomerClassify = await initialState?.fetchCustomerClassify?.();
        const AsBank = await initialState?.fetchAsBank?.();
        const EmployeeClassify = await initialState?.fetchEmployeeClassify?.();

        if (userInfo && permissions && Address && EmployeeData && OrderType && ProductClassify && Storehouse) {
            flushSync(() => {
                setInitialState((s) => ({
                    ...s,
                    permissions: {
                        menus: permissions[0],
                        permissions_id: permissions[1],
                    },
                    Address: Address,
                    EmployeeData: EmployeeData,
                    OrderType: OrderType,
                    ProductClassify: ProductClassify,
                    Storehouse: Storehouse,
                    CustomerClassify: CustomerClassify,
                    currentUser: userInfo,
                    AsBank: AsBank,
                    EmployeeClassify: EmployeeClassify,
                }));
            });
            return true
        }
    };

    const handleSubmit = async (values: API.LoginParams) => {
        try {
            // 登录
            const msg: any = await login({ ...values, type });
            if (msg.success === true) {
                await token.save(msg.token);
                const rsp = await fetchUserInfo();

                if (rsp) {
                    message.success("登录成功");
                    // await refresh;
                    /** 此方法会跳转到 redirect 参数所在的位置 */
                    const urlParams = new URL(window.location.href).searchParams;
                    history.push(urlParams.get('redirect') || '/');
                }
                return;
            }
            // 如果失败去设置用户错误信息
            setUserLoginState(msg);
        } catch (error) {
            message.error('登录失败，请重试！');
        }
    };
    const { status, type: loginType } = userLoginState;

    useEffect(() => {
        fetchEmployeeClassify().then().catch();
    }, []);


    // 注册
    const saveRegister: (values: any) => Promise<boolean> = async (values) => {
        const hide = message.loading('正在注册....');
        const result = await register({ ...values });
        hide();

        if (result && result.success == true) {
            message.success('注册成功!');
            return true;

        } else {
            message.error('注册失败!');
            return false;
        }
    }


    return (
        <div className={containerClassName}>
            <Helmet>
                <title>
                    {'登录页'} - {Settings.title}
                </title>
            </Helmet>
            <div style={{
                flex: '1',
                padding: '32px 0',
            }}>
                <LoginForm
                    logo={<img alt="logo" src="/logo.svg" />}
                    title="MYERP"
                    subTitle={'wenhua-erp'}
                    initialValues={{
                        autoLogin: true,
                    }}
                    // actions={[
                    //   <FormattedMessage
                    //     key="loginWith"
                    //     id="pages.login.loginWith"
                    //     defaultMessage="其他登录方式"
                    //   />,
                    //   <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
                    //   <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
                    //   <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
                    // ]}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.LoginParams);
                    }}
                >
                    <Tabs activeKey={type} onChange={setType}>
                        <Tabs.TabPane
                            key="account"
                            tab={'账户密码登录'}
                        />
                        <Tabs.TabPane
                            key="mobile"
                            tab={'手机号登录'}
                        />
                    </Tabs>

                    {status === 'error' && loginType === 'account' && (
                        <LoginMessage
                            content={'账户或密码错误'}
                        />
                    )}
                    {type === 'account' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined />,
                                }}
                                placeholder={'用户名: '}
                                rules={[
                                    {
                                        required: true,
                                        message: ("请输入用户名!"),
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined />,
                                }}
                                placeholder={'密码: '}
                                rules={[
                                    {
                                        required: true,
                                        message: ("请输入密码！"),
                                    },
                                ]}
                            />
                        </>
                    )}

                    {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
                    {type === 'mobile' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MobileOutlined />,
                                }}
                                name="phone"
                                placeholder={'手机号'}
                                rules={[
                                    {
                                        required: true,
                                        message: ("请输入手机号！"),
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: ("手机号格式错误！"),
                                    },
                                ]}
                            />
                            <ProFormCaptcha
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined />,
                                }}
                                captchaProps={{
                                    size: 'large',
                                }}
                                phoneName="phone"
                                placeholder={'请输入验证码'}
                                captchaTextRender={(timing, count) => {
                                    if (timing) {
                                        return `${count} '获取验证码'`;
                                    }
                                    return '获取验证码';
                                }}
                                name="captcha"
                                rules={[
                                    {
                                        required: true,
                                        message: ("请输入验证码！"),
                                    },
                                ]}
                                onGetCaptcha={async (phone) => {
                                    const result: any = await getFakeCaptcha({
                                        phone,
                                    });
                                    if (result === false) {
                                        return;
                                    }
                                    message.success(`手机号 ${phone} 验证码发送成功`);
                                }}
                            />
                        </>
                    )}
                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            {"自动登录"}
                        </ProFormCheckbox>
                        <a style={{ float: 'right', }} onClick={() => { setRegisterState(true) }}>
                            注册帐号
                        </a>
                    </div>
                </LoginForm>

                <ModalForm
                    title="注册帐号"
                    width={420}
                    form={form}
                    size={'middle'}
                    visible={registerState}
                    modalProps={{
                        destroyOnClose: true,
                        onCancel: () => { setRegisterState(false) },
                    }}
                    onFinish={async (values) => {
                        return await saveRegister(values);
                    }}
                >
                    <ProCard
                        loading={employeeClassifyData == null}
                        ghost={true}
                    >
                        <Form.Item>
                            <ProFormText
                                name={'name'}
                                label={'姓名'}
                                fieldProps={{
                                    prefix: <UserOutlined />,
                                }}
                                rules={[
                                    { required: true, message: '请输入您的姓名!' }
                                ]}
                            />
                            <ProFormText
                                name={'phone'}
                                label={'手机号码'}
                                fieldProps={{
                                    prefix: <MobileOutlined />,
                                }}
                                rules={[
                                    { required: true, message: '请输入您的手机号码!' },
                                    { min: 11, max: 11, message: '请检查手机号格式', },
                                    { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号', },
                                ]}
                            />
                            <ProFormText.Password
                                name={'password'}
                                label={'密码'}
                                fieldProps={{
                                    prefix: <LockOutlined />,
                                }}
                                rules={[
                                    { required: true, message: '请输入您的密码!' },
                                    { min: 8, max: 30, message: '密码不小于8位', },
                                ]}
                            />
                            <ProFormText.Password
                                name={'confirm'}
                                label={'确认密码'}
                                fieldProps={{
                                    prefix: <LockOutlined />,
                                }}
                                rules={[
                                    { required: true, message: '请输入您的密码!' },
                                    { min: 8, max: 30, message: '密码不小于8位', },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('您输入的两个密码不匹配!'));
                                        },
                                    }),
                                ]}
                            />
                            <ProFormTreeSelect
                                name={'department'}
                                label={'部门'}
                                rules={[
                                    { required: true, message: '请选择你的部门!' }
                                ]}
                                fieldProps={{
                                    treeDefaultExpandAll: true,
                                    onSelect: (_, node,) => {
                                        form.setFieldValue('employee_classify_id', node.value);
                                        form.setFieldValue('employee_classify', node.classify_name);
                                        form.setFieldValue('employee_classify_path', node.parent_path);
                                    }
                                }}
                                request={async () => {
                                    return employeeClassifyData;
                                }}
                            />
                            <ProFormText
                                name={'employee_classify_id'}
                                label={'部门id'}
                                rules={[
                                    { required: true, message: '请选择你的部门!' }
                                ]}
                                hidden={true}
                            />
                            <ProFormText
                                name={'employee_classify_path'}
                                label={'路径'}
                                hidden={true}
                                rules={[{ required: true, message: '路径' }]}
                            />
                            <ProFormText
                                name={'employee_classify'}
                                label={'部门名称'}
                                hidden={true}
                                rules={[
                                    { required: true, message: '请选择你的部门!' }
                                ]}
                            />
                            <ProFormCaptcha
                                fieldProps={{
                                    size: 'middle',
                                    prefix: <MailTwoTone />,
                                }}
                                captchaProps={{
                                    size: 'middle',
                                }}
                                // 手机号的 name，onGetCaptcha 会注入这个值
                                phoneName="phone"
                                name="captcha"
                                countDown={60}
                                rules={[
                                    { required: true, message: '请输入验证码', },
                                    { min: 4, max: 4, message: '请检查验证码格式', },
                                ]}
                                placeholder="请输入验证码"
                                // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
                                // throw new Error("获取验证码错误")
                                onGetCaptcha={async (phone) => {
                                    const result: any = await getFakeCaptcha({
                                        phone,
                                    });
                                    if (result === false) {
                                        return;
                                    }
                                    message.success(`手机号 ${phone} 验证码发送成功!`);
                                }}
                            />
                        </Form.Item>
                    </ProCard>
                </ModalForm>
            </div>
            <Footer />
        </div>

    );
};

export default Login;
