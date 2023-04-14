// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getApAdjustList(params?) {
  return request(HOST.HOST + `/api/finance/ap_adjust/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function getApAdjustNo() {
  return request(HOST.HOST + `/api/finance/ap_adjust_no/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createApAdjust(value) {
  return request(HOST.HOST + `/api/finance/ap_adjust/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function updateApAdjust(id, value) {
  return request(HOST.HOST + `/api/finance/ap_adjust/update/${id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function cancelApAdjust(id) {
  return request(HOST.HOST + `/api/finance/ap_adjust/cancel/${id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function checkApAdjust(id) {
  return request(HOST.HOST + `/api/finance/ap_adjust/check/${id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UndoApAdjust(ap_no) {
  return request(HOST.HOST + `/api/finance/ap_adjust/undo/${ap_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

