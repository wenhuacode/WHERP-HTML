import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
// @ts-ignore
import { Question, SelectLang } from '@/components/RightContent';
// @ts-ignore
import { AvatarDropdown, AvatarName } from '@/components/RightContent/AvatarDropdown';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import type {MenuDataItem} from "@ant-design/pro-components";
import { HeartOutlined, SmileOutlined, ShoppingOutlined, AppstoreOutlined,
  MoneyCollectOutlined, FileDoneOutlined, ProfileOutlined, ProjectOutlined,
  SettingOutlined, SolutionOutlined, LayoutOutlined, LinkOutlined } from '@ant-design/icons';
import { getUserMenus } from "@/services/ant-design-pro/user";
import {ConfigProvider} from "antd"
import themeConfig from "./utils/tableThemeConfig"

import token from "@/utils/token";
import {
  fetchAddress, fetchAsBank,
  fetchCustomerClassify, fetchEmployeeClassify,
  fetchEmployeeData,
  fetchOrderType,
  fetchProductClassify,
  fetchStorehouse
} from "@/services/public-api/api";

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const IconMap: any = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
  shopping: <ShoppingOutlined />,
  appstore: <AppstoreOutlined />,
  moneyCollect: <MoneyCollectOutlined />,
  fileDone: <FileDoneOutlined />,
  setting: <SettingOutlined />,
  solution: <SolutionOutlined />,
  layout: <LayoutOutlined />,
  businessCenter: <ProfileOutlined />,
  dataCenter: <ProjectOutlined />,
};




/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  permissions?: { menus: MenuDataItem[], permissions_id: []};
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchMenus?: () => Promise<MenuDataItem>;
  fetchAddress?: () => Promise<any>;
  fetchEmployeeData?: () => Promise<any>;
  fetchOrderType?: () => Promise<any>;
  fetchProductClassify?: () => Promise<any>;
  fetchStorehouse?: () => Promise<any>;
  fetchCustomerClassify?: () => Promise<any>;
  fetchAsBank?: () => Promise<any>;
  fetchEmployeeClassify?: () => Promise<any>;
  Address?: any;
  EmployeeData?: any;
  OrderType?: any;
  ProductClassify?: any;
  Storehouse?: any;
  CustomerClassify?: any;
  AsBank?: any;
  EmployeeClassify?: any;
}> {

  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();

      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const fetchMenus = async () => {
    const resp = await getUserMenus();
    //加上用户的角色判断
    //从用户的角色中获取对应的菜单
    const menu2MenuDataItem: (menus: API.Menu) => MenuDataItem =(menus: API.Menu) => {
      const item: MenuDataItem = {
        name: menus.name,
        path: menus.path,
        hideInMenu: menus.hide,
        icon: menus.icon && IconMap[menus.icon as string],
        key: menus.key,
        identifier: menus.identifier,
        children: menus.children?.map(menu2MenuDataItem)
      };
      return item;
    }
    if(resp?.success) {
      return [resp.data.map(menu2MenuDataItem), resp.permissions_id]
    }
    return [];
  }


  //判断token是否存在
  if (token.get() !== null) {
    // 如果不是登录页面，执行
    if (location.pathname !== loginPath) {
      const currentUser = await fetchUserInfo();
      const menus = await fetchMenus();
      const permissions = {
        menus:menus[0],
        permissions_id:menus[1],
      }
      const Address = await fetchAddress();
      const EmployeeData = await fetchEmployeeData();
      const OrderType = await fetchOrderType();
      const ProductClassify = await fetchProductClassify();
      const Storehouse = await fetchStorehouse();
      const CustomerClassify = await fetchCustomerClassify();
      const AsBank = await fetchAsBank();
      const EmployeeClassify = await fetchEmployeeClassify();
      return {
        fetchUserInfo,
        fetchMenus,
        fetchAddress,
        fetchEmployeeData,
        fetchOrderType,
        fetchProductClassify,
        fetchStorehouse,
        fetchCustomerClassify,
        fetchAsBank,
        fetchEmployeeClassify,
        Address,
        EmployeeData,
        OrderType,
        ProductClassify,
        Storehouse,
        CustomerClassify,
        AsBank,
        EmployeeClassify,
        permissions,
        currentUser,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    }
  }
  return {
    fetchUserInfo,
    fetchMenus,
    fetchAddress,
    fetchEmployeeData,
    fetchOrderType,
    fetchProductClassify,
    fetchStorehouse,
    fetchCustomerClassify,
    fetchAsBank,
    fetchEmployeeClassify,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return (
          <ConfigProvider theme={themeConfig}>
          <AvatarDropdown>
            {avatarChildren}
          </AvatarDropdown>
          </ConfigProvider>
        )
      },
    },
    menu: {
      locale: false,
    },
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => (
      <ConfigProvider theme={themeConfig}>
        <Footer />
      </ConfigProvider>
    ),
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
        if (!initialState?.currentUser && location.pathname !== loginPath && token.get() === null) {
          history.push(loginPath);
        }
    },
    menuDataRender:(menuData: MenuDataItem[]) => {
      if(initialState?.permissions) {
        return initialState.permissions.menus;
      }
      return menuData;
    },
    menuContentRender: (_, node)=>(
      <ConfigProvider theme={themeConfig}>
        {node}
      </ConfigProvider>
    ),


    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: any) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          <ConfigProvider theme={themeConfig}>
            {children}
          </ConfigProvider>

          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  settings,
                })).then().catch();
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
