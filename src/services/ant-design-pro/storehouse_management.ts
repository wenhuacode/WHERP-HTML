// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getStorehouseManagement(params?) {
  return request(HOST.HOST + `/api/storehouse_management/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  });
}

export async function CreateStorehouseManagement(value) {
  return request(HOST.HOST + `/api/storehouse_management/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value
  });
}

export async function UpdateStorehouseManagement(id, value) {
  return request(HOST.HOST + `/api/storehouse_management/update/${id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value
  });
}

export async function DeleteStorehouseManagement(id) {
  return request(HOST.HOST + `/api/storehouse_management/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}

export async function getInventoryQueryList(params?) {
  return request(HOST.HOST + `/api/inventory_query/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  });
}

