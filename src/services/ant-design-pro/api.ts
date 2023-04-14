/* eslint-disable */
// @ts-ignore
import { request } from '@umijs/max';
import token from '@/utils/token'

const HOST = require('./default_host')

/** 新增员工 POST /api/employee/  */
export async function createRmployee(){
  return request('/api/employee/', {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser() {
  return request(HOST.HOST + '/api/login/currentUser/', {
    method: 'GET',
    headers: {
      'content-Type': 'application/json',
      'ACCESS_TOKEN': '' + token.get(),
    },
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>(HOST.HOST + '/api/login/outLogin/', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
      'ACCESS_TOKEN': '' + token.get(),
    },
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>(HOST.HOST + '/api/login/account/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/login/account */
export async function register(body: any) {
  return request(HOST.HOST + '/api/register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>(HOST.HOST + '/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>(HOST.HOST + '/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>(HOST.HOST + '/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>(HOST.HOST + '/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>(HOST.HOST + '/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

