// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getCapitalAdjustList(params?) {
  return request(HOST.HOST + `/api/finance/capital_adjust/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function getCapitalAdjustNo() {
  return request(HOST.HOST + `/api/finance/capital_adjust_no/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createCapitalAdjust(value) {
  return request(HOST.HOST + `/api/finance/capital_adjust/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function updateCapitalAdjust(id, value) {
  return request(HOST.HOST + `/api/finance/capital_adjust/update/${id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function cancelCapitalAdjust(id) {
  return request(HOST.HOST + `/api/finance/capital_adjust/cancel/${id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function checkCapitalAdjust(id) {
  return request(HOST.HOST + `/api/finance/capital_adjust/check/${id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UndoCapitalAdjust(ca_no) {
  return request(HOST.HOST + `/api/finance/capital_adjust/undo/${ca_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}
