// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')


export async function getAddressClassify() {
  return request(HOST.HOST + '/api/addressclassify/list/', {
    method: 'GET',
    headers: {
      'content-Type': 'application/json',
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createAddressClassify(value: any) {
  return request(HOST.HOST + `/api/addressclassify/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function updateAddressClassify(value: any, id: any) {
  return request(HOST.HOST + `/api/addressclassify/update/${id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function deleteAddressClassify(id: any) {
  return request(HOST.HOST + `/api/addressclassify/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

