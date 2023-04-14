// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getRoles() {
  return request(HOST.HOST + `/api/role/list/`, {
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}

export async function createRole(role: API.Role) {
  return request(HOST.HOST  + `/api/role/create/`, {
    method: 'post',
    data: role,
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}

export async function updateRole(role: API.Role) {
  return request(HOST.HOST  + `/api/role/${role.id}/`, {
    method: 'patch',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: role,
  });
}

export async function deleteRole(id: string) {
  return request(HOST.HOST  + `/api/role/${id}/`, {
    method: 'delete',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}

export async function getRoleMenus(id: string) {
  return request(HOST.HOST  + `/api/role/${id}/menus/`, {
    method: 'get',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}

export async function updateRoleMenu(id: string, data: string[]) {
  return request(HOST.HOST  + `/api/role/${id}/menus/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: data,
  });
}
