// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

//现金银行
export async function getCashBank() {
  return request(HOST.HOST + `/api/finance/accounting_subject/cash_bank/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//费用统计
export async function getCostStatistics() {
  return request(HOST.HOST + `/api/finance/accounting_subject/cost_statistics/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}
