import {request} from "@@/plugin-request/request";
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getPaymentList(params?) {
  return request(HOST.HOST + `/api/finance/payment/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function getPaymentNo() {
  return request(HOST.HOST + `/api/finance/payment_no/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createPayment(value) {
  return request(HOST.HOST + `/api/finance/payment/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function updatePayment(id, value) {
  return request(HOST.HOST + `/api/finance/payment/update/${id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function cancelPaymentOrder(order_id) {
  return request(HOST.HOST + `/api/finance/payment/cancel/${order_id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function checkPaymentOrder(order_id) {
  return request(HOST.HOST + `/api/finance/payment/check/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UndoPaymentOrder(pay_no) {
  return request(HOST.HOST + `/api/finance/payment/undo/${pay_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}
