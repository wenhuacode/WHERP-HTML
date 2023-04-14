// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function GetSubsidiaryLedger(param?) {
  return request(HOST.HOST + `/api/finance/subsidiary_ledger/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    param,
  })
}

export async function GetSubsidiaryLedgerCashBank(params) {
  return request(HOST.HOST + `/api/finance/subsidiary_ledger/cash_bank/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

