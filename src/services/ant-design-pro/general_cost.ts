// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')


export async function getGeneralCostList(params?) {
  return request(HOST.HOST + `/api/finance/general_cost/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function getGeneralCostNo(params?) {
  return request(HOST.HOST + `/api/finance/general_cost_no/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  })
}

export async function createGeneralCost(value) {
  return request(HOST.HOST + `/api/finance/general_cost/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function updateGeneralCost(id, value) {
  return request(HOST.HOST + `/api/finance/general_cost/update/${id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function cancelGeneralCost(general_cost_id) {
  return request(HOST.HOST + `/api/finance/general_cost/cancel/${general_cost_id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function checkGeneralCost(general_cost_id) {
  return request(HOST.HOST + `/api/finance/general_cost/check/${general_cost_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UndoGeneralCost(gc_no) {
  return request(HOST.HOST + `/api/finance/general_cost/undo/${gc_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function getGeneralCostASNO(params?) {
  return request(HOST.HOST + `/api/base/finance/gc_as/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  })
}
