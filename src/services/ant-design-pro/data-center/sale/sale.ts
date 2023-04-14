// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('../../default_host')

export async function ProductSaleQueryApi(value?: any) {
  return request(HOST.HOST + `/api/data_center/sale/product_sale_query/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function CustomerSaleQueryApi(value?: any) {
  return request(HOST.HOST + `/api/data_center/sale/customer_sale_query/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function ProductSaleQueryDetailApi(value?: any) {
  return request(HOST.HOST + `/api/data_center/sale/product_sale_query_detail/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}


export async function SaleDiscount(value?: any) {
  return request(HOST.HOST + `/api/data_center/sale/product_sale_discount/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function SaleDiscountDetail(value?: any) {
  return request(HOST.HOST + `/api/data_center/sale/product_sale_discount_detail/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function ProductSaleDetailCountAPI(value?: any) {
  return request(HOST.HOST + `/api/data_center/sale/product_sale_detail_count/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function InventoryQueryAPI(value?: any) {
  return request(HOST.HOST + `/api/data_center/inventory/inventory_query/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

//库存详情查询
export async function InventoryQueryDetailAPI(value?: any) {
  return request(HOST.HOST + `/api/data_center/inventory/inventory_query_detail/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function CustomerARAPQueryAPI(value?: any) {
  return request(HOST.HOST + `/api/data_center/transaction/customer_arap/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function CustomerARAPDetailQueryAPI(value?: any) {
  return request(HOST.HOST + `/api/data_center/transaction/customer_arap_detail/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function CashBankQueryAPI(params?: any) {
  return request(HOST.HOST + `/api/data_center/financial/cash_bank/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  })
}

export async function CashBankQueryDetailAPI(value?: any) {
  return request(HOST.HOST + `/api/data_center/financial/cash_bank_detail/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function CostTotalStatisticsQueryAPI(params?: any) {
  return request(HOST.HOST + `/api/data_center/financial/cost_total_statistics/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params
  })
}
