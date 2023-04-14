// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getOrderNo() {
  return request(HOST.HOST + `/api/order_return/order_no/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createOrder(values) {
  return request(HOST.HOST + `/api/order/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function getOrderList(params?) {
  return request(HOST.HOST + `/api/order_return/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function CheckPashJstOrderHandler(order_id) {
  return request(HOST.HOST + `/api/order_return/push_jst_order/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function cancelOrder(order_id) {
  return request(HOST.HOST + `/api/order_return/cancel/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function getOrderDetail(order_id) {
  return request(HOST.HOST + `/api/order_return/detail/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function updateOrderDetailData(order_id, values) {
  return request(HOST.HOST + `/api/order_return/update/${order_id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function RevocationOrder(order_no) {
  return request(HOST.HOST + `/api/order_return/revocation/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}
