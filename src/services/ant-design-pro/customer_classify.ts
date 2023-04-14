// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getCustomerClassify() {
  return request(HOST.HOST + '/api/customerclassify/list/', {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createCustomerClassify(value) {
  return request(HOST.HOST + `/api/customerclassify/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function updateCustomerClassify(value) {
  return request(HOST.HOST + `/api/customerclassify/update/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function deleteCustomerClassify(id) {
  return request(HOST.HOST + `/api/customerclassify/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}
