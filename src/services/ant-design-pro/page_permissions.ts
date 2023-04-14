// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getPagePermissions() {
  return request(HOST.HOST + `/api/page_permissions/list/`, {
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}

export async function createPagePermissions(permissions: API.PagePermissions) {
  return request(HOST.HOST + `/api/page_permissions/create/`, {
    method: 'post',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: permissions,
  });
}

export async function updatePagePermissions(permissions: API.PagePermissions) {
  return request(HOST.HOST + `/api/page_permissions/${permissions.id}/`, {
    method: 'patch',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: permissions,
  });
}

export async function deletePagePermissions(id: number) {
  return request(HOST.HOST + `/api/page_permissions/${id}/`, {
    method: 'delete',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}

export async function getMenuPagePermissions(params?) {
  return request(HOST.HOST + `/api/page_permissions/get_menu_permissions/`, {
    method: 'get',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  });
}

export async function SaveMenuPermissions(role_id, data) {
  return request(HOST.HOST + `/api/page_permissions/create_menu_permissions/${role_id}/`, {
    method: 'patch',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data:data,
  });
}
