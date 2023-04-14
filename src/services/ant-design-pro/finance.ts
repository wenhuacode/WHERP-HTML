// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getAccountingSubject(params?) {
  return request(HOST.HOST + `/api/finance/accounting_subject/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function createAccountingSubject(value) {
  return request(HOST.HOST + `/api/finance/accounting_subject/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function updateAccountingSubject(value) {
  return request(HOST.HOST + `/api/finance/accounting_subject/update/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}


export async function getAsNo(params?) {
  return request(HOST.HOST + `/api/base/finance/bank_no/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  })
}


export async function cancelReceiptOrder(order_id) {
  return request(HOST.HOST + `/api/finance/receipt/cancel/${order_id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createFinanceOrder(value) {
  return request(HOST.HOST + `/api/order/finance_order/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}
