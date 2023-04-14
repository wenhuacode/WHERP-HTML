//报损单
import {request} from "@@/plugin-request/request";
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getOrderNo() {
  return request(HOST.HOST + `/api/goods_loss/order_no/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createOrder(values) {
  return request(HOST.HOST + `/api/goods_loss/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function getOrderList(params?) {
  return request(HOST.HOST + `/api/goods_loss/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function CheckOrderHandler(order_id) {
  return request(HOST.HOST + `/api/goods_loss/check_order/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function cancelOrder(order_id) {
  return request(HOST.HOST + `/api/goods_loss/cancel/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function getOrderDetail(order_id) {
  return request(HOST.HOST + `/api/goods_loss/detail/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function updateOrderDetailData(order_id, values) {
  return request(HOST.HOST + `/api/goods_loss/update/${order_id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function RevocationOrder(order_no) {
  return request(HOST.HOST + `/api/goods_loss/revocation/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}
