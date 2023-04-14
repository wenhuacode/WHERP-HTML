// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getProductClassify() {
  return request(HOST.HOST + '/api/productclassify/list/', {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createProductClassify(value) {
  return request(HOST.HOST + `/api/productclassify/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function updateProductClassify(value) {
  return request(HOST.HOST + `/api/productclassify/update/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function deleteProductClassify(id) {
  return request(HOST.HOST + `/api/productclassify/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}
