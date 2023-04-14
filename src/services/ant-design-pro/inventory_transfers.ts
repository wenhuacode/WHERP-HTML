// 调拨单
import {request} from "@@/plugin-request/request";
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getOrderNo() {
  return request(HOST.HOST + `/api/inventory_transfers/order_no/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createOrder(values) {
  return request(HOST.HOST + `/api/inventory_transfers/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function getOrderList(params?) {
  return request(HOST.HOST + `/api/inventory_transfers/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function CheckOrderHandler(order_id) {
  return request(HOST.HOST + `/api/inventory_transfers/check_order/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function cancelOrder(order_id) {
  return request(HOST.HOST + `/api/inventory_transfers/cancel/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function getOrderDetail(order_id) {
  return request(HOST.HOST + `/api/inventory_transfers/detail/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function updateOrderDetailData(order_id, values) {
  return request(HOST.HOST + `/api/inventory_transfers/update/${order_id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function RevocationOrder(order_no) {
  return request(HOST.HOST + `/api/inventory_transfers/revocation/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}
