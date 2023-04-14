// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function query() {
  return request<API.CurrentUser[]>(HOST.HOST + '/api/users');
}

export async function queryCurrent() {
  return request<API.CurrentUser>(HOST.HOST + '/api/user/current');
}

export async function queryCurrentMenus() {
  return request<{
    code: number;
    data: API.Menu[];
  }>('/api/menu/current');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconItem[] }>('/api/notices');
}

export async function getUsers(params?) {
  return request(HOST.HOST + `/api/employee/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  });
}

export async function createUser(user: API.User) {
  return request(HOST.HOST + `/api/employee/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: user,
  });
}

export async function updateUser(user: API.User) {
  return request(HOST.HOST + `/api/employee/${user.id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: user,
  });
}

export async function deleteUser(id: string) {
  return request(HOST.HOST + `/api/employee/${id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}

export async function getUserMenus() {
  return request(HOST.HOST + `/api/employee/menus/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}


export async function getEmployeeClassify() {
  return request(HOST.HOST + '/api/employee_classify/list/', {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createEmployeeClassify(value) {
  return request(HOST.HOST + `/api/employee_classify/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function updateEmployeeClassify(value) {
  return request(HOST.HOST + `/api/employee_classify/update/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function deleteEmployeeClassify(id) {
  return request(HOST.HOST + `/api/employee_classify/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}
