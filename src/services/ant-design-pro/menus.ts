// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getMenus() {
  return request(HOST.HOST + `/api/menu/list/`, {
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}

export async function createMenu(menu: API.Menu) {
  return request(HOST.HOST + `/api/menu/create/`, {
    method: 'post',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: menu,
  });
}

export async function updateMenu(menu: API.Menu) {
  return request(HOST.HOST + `/api/menu/${menu.id}/`, {
    method: 'patch',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: menu,
  });
}

export async function deleteMenu(id: number) {
  return request(HOST.HOST + `/api/menu/${id}/`, {
    method: 'delete',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}
