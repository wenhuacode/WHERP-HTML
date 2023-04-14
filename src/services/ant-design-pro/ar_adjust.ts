// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getArAdjustList(params?) {
  return request(HOST.HOST + `/api/finance/ar_adjust/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function getArAdjustNo() {
  return request(HOST.HOST + `/api/finance/ar_adjust_no/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createArAdjust(value) {
  return request(HOST.HOST + `/api/finance/ar_adjust/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function updateArAdjust(id, value) {
  return request(HOST.HOST + `/api/finance/ar_adjust/update/${id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function cancelArAdjust(general_cost_id) {
  return request(HOST.HOST + `/api/finance/ar_adjust/cancel/${general_cost_id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function checkArAdjust(general_cost_id) {
  return request(HOST.HOST + `/api/finance/ar_adjust/check/${general_cost_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UndoArAdjust(ar_no) {
  return request(HOST.HOST + `/api/finance/ar_adjust/undo/${ar_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function GetIncomeAS(params?) {
  return request(HOST.HOST + `/api/base/finance/ic_as/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  })
}
