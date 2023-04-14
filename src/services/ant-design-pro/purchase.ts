// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function GetSupplierList(params?) {
  return request(HOST.HOST + `/api/supplier/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function createSupplier(values) {
  return request(HOST.HOST + `/api/supplier/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function UpdateSupplier(supplier_id, values) {
  return request(HOST.HOST + `/api/supplier/update/${supplier_id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function DeleteSupplier(supplier_id) {
  return request(HOST.HOST + `/api/supplier/delete/${supplier_id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function GETSupplier() {
  return request(HOST.HOST + `/api/supplier/get_supplier/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}


//采购订单
export async function getOrderNo() {
  return request(HOST.HOST + `/api/purchase_order/order_no/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createOrder(values) {
  return request(HOST.HOST + `/api/purchase_order/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function getOrderList(params?) {
  return request(HOST.HOST + `/api/purchase_order/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function CheckPashJstOrderHandler(order_id) {
  return request(HOST.HOST + `/api/purchase_order/push_jst_order/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function cancelOrder(order_id) {
  return request(HOST.HOST + `/api/purchase_order/cancel/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function getOrderDetail(order_id) {
  return request(HOST.HOST + `/api/purchase_order/detail/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function updateOrderDetailData(order_id, values) {
  return request(HOST.HOST + `/api/purchase_order/update/${order_id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function RevocationOrder(order_no) {
  return request(HOST.HOST + `/api/purchase_order/revocation/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function GetAccountCurrentList(params) {
  return request(HOST.HOST + '/api/supplier/account_current_list/',{
    method: "GET",
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  })
}

export async function GetAccountPayableDetailList(params) {
  return request(HOST.HOST + `/api/supplier/account_payable/detail_list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}


