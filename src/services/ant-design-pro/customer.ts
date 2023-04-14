// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getCustomer(params?) {
  return request(HOST.HOST + `/api/customer/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function createCustomer(Customer: API.Customer) {
  return request(HOST.HOST + `/api/customer/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: Customer,
  })
}

export async function updateCustomer(Customer: API.Customer) {
  return request(HOST.HOST + `/api/customer/update/${Customer.id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: Customer,
  })
}

export async function deleteCustomer(id: number) {
  return request(HOST.HOST + `/api/customer/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}


//导出excel
export async function exportCustomerExcelApi(params) {
  return request(HOST.HOST + `/api/customer/export/`, {
    method: "GET",
    data:{},
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    responseType: 'blob',
    params,
  })
}

export async function importCustomerExcelApi(data) {
  return request(HOST.HOST + '/api/customer/import/',{
    method: "POST",
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: data
  })
}

export async function GetAccountCurrentList(params) {
  return request(HOST.HOST + '/api/customer/account_current_list/',{
    method: "GET",
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  })
}

//客户应收
export async function getAccountReceivable() {
  return request(HOST.HOST + `/api/customer/account_receivable/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function GetAccountReceivableDetailList(params) {
  return request(HOST.HOST + `/api/customer/account_receivable/detail_list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}


export async function queryCustomer(value?) {
  return request(HOST.HOST + `/api/customer/query_customer/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function BatchUpdateCustomer(value?) {
  return request(HOST.HOST + `/api/customer/batch/customerclassify/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}


