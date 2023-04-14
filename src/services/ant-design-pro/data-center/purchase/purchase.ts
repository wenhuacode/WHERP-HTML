// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('../../default_host')

export async function ProductPurchaseQueryApi(value?) {
  return request(HOST.HOST + `/api/data_center/purchase/product_purchase_query/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function CustomerPurchaseQueryApi(value?) {
  return request(HOST.HOST + `/api/data_center/purchase/customer_purchase_query/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function ProductPurchaseQueryDetailApi(value?) {
  return request(HOST.HOST + `/api/data_center/purchase/product_purchase_query_detail/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}
