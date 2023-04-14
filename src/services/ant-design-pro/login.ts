// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

const HOST = require('./default_host')

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(
  body: {
    // query
    /** 手机号 */
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>(HOST.HOST + '/api/login/captcha/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
