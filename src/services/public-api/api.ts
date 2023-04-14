import {getOrderNo} from "@/services/ant-design-pro/sale_order";
import {getStorehouseManagement} from "@/services/ant-design-pro/storehouse_management";
import {getEmployeeClassify, getUsers} from "@/services/ant-design-pro/user";
import {getAddressClassify} from "@/services/ant-design-pro/address_classify";
import type {DataNode} from "antd/lib/tree";
import {getProductClassify} from "@/services/ant-design-pro/product_classify";
import {getOrderTypeData} from "@/services/ant-design-pro/base_api";
import {getCustomerClassify} from "@/services/ant-design-pro/customer_classify";
import {getAsNo} from "@/services/ant-design-pro/finance";

//获取订单编号
export async function GetOrderNO(orderType: number){
  const resp = await getOrderNo(orderType);
  return resp.id;
}


//获取银行账户
export async function fetchAsBank(){
  const result = await getAsNo();
  const AsBankDataItem: (u: any) => any = (u) => {
    const item: any= {
      label: u.name,
      value: u.id,
    };
    return item;
  }
  if(result?.success) {
    // window.localStorage.setItem('OrderType', JSON.stringify(data))
    return result.data.map(AsBankDataItem);
  }
}


// 获取客户地区分类信息, 并设置主节点不允许选中
export async function fetchCustomerClassify(){
  const result = await getCustomerClassify();
  const menu2Node: (m: any) => DataNode = (m) => {
    return {
      ...m,
      value: m.id,
      label: m.classify_name,
      title: m.classify_name,
      key: m.id,
      children: m.children?.map(menu2Node),
    };
  };
  return [menu2Node(result.data?.[0])]
}


//获取单据类型
export async function fetchOrderType(){
  const result = await getOrderTypeData();

  const OrderTypeDataItem: (u: any) => any = (u) => {
    const item: any= {
      label: u.name,
      value: u.id,
    };
    return item;
  }
  if(result?.success) {
    // window.localStorage.setItem('OrderType', JSON.stringify(data))
    return result.data.map(OrderTypeDataItem);
  }
}


//获取仓库信息
export async function fetchStorehouse(){
  // const Storehouse = JSON.parse(window.localStorage.getItem('Storehouse'))
  // if (Storehouse){
  //   return Storehouse
  // }
  const result = await getStorehouseManagement();
  const UsersDataItem: (u: API.StorehouseManagement) => API.StorehouseManagement =(u: API.StorehouseManagement) => {
    const item: any= {
      label: u.storehouse_name,
      value: u.id,
    };
    return item;
  }
  if(result?.success) {
    // window.localStorage.setItem('Storehouse', JSON.stringify(data))
    return result.data.map(UsersDataItem);
  }
}

//获取职员信息
export async function fetchEmployeeData(){
  // const EmployeeData = JSON.parse(window.localStorage.getItem('EmployeeData'))
  // if (EmployeeData){
  //   return EmployeeData
  // }
  const result = await getUsers();
  const UsersDataItem: (u: API.User) => API.CustomerManager =(u: API.User) => {
    const item: API.CustomerManager = {
      label: u.name,
      value: u.id,
    };
    return item;
  }
  if(result?.success) {
    // window.localStorage.setItem('EmployeeData', JSON.stringify(employeeManger))
    return await result.data.map(UsersDataItem);
  }
}

//获取地址信息
export async function fetchAddress(){
  // const Address = JSON.parse(window.localStorage.getItem('Address'))
  // if (Address){
  //   return Address
  // }
  const result = await getAddressClassify();
  const menu2Node: (m: any) => DataNode = (m) => {
    return {
      ...m,
      value: m.id,
      label: m.classify_name,
      children: m.children?.map(menu2Node),
    };
  };
  // window.localStorage.setItem('Address', JSON.stringify(data))
  return result?.data?.map(menu2Node);
}

// 获取产品分类信息
export async function fetchProductClassify(){
  // const ProductClassify = [JSON.parse(window.localStorage.getItem('ProductClassify'))]
  // if (ProductClassify){
  //   return ProductClassify
  // }
  const result = await getProductClassify();
  const menu2Node: (m: any) => any = (m) => {
    return {
      ...m,
      value: m.id,
      label: m.classify_name,
      title: m.classify_name,
      key: m.id,
      product_classify_path: m.product_classify_path,
      children: m.children?.map(menu2Node),
    };
  };
  return [menu2Node(result.data[0])]
  // window.localStorage.setItem('ProductClassify', JSON.stringify(data))
}

// 获取公司分类信息
export async function fetchEmployeeClassify(){
  const result = await getEmployeeClassify();
  const menu2Node: (m: any) => DataNode = (m) => {
    return {
      ...m,
      key: m.id,
      value: m.id,
      title: m.classify_name,
      label: m.classify_name,
      children: m.children?.map(menu2Node),
    };
  };
  return [menu2Node(result.data?.[0])]
}
