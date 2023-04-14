// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getProduct(value?: any) {
  return request(HOST.HOST + `/api/product/query/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}

export async function getProductList(params?: any) {
  return request(HOST.HOST + `/api/product/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

export async function createProduct(formData: any) {
  return request(HOST.HOST + `/api/product/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    // data:product,
    body:formData
  })
}

export async function updateProduct(formData: FormData, product_id: string) {
  return request(HOST.HOST + `/api/product/update/${product_id}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data:formData
  })
}

export async function deleteProduct(id: number) {
  return request(HOST.HOST + `/api/product/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}


//导出excel
export async function exportProductExcelApi(params: any) {
  return request(HOST.HOST + `/api/product/export/`, {
    method: "GET",
    data:{},
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    responseType: 'blob',
    params,
  })
}

// 导入
export async function importProductExcelApi(data: any) {
  return request(HOST.HOST + '/api/product/import/',{
    method: "POST",
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: data
  })
}

export async function getProductImage(imageName: any) {
  return request(HOST.HOST + '/api/product/getproductimage/', {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),

    },
    responseType: 'blob',
    data:imageName,
  })
}

export async function BatchUpdateProduct(value?: any) {
  return request(HOST.HOST + `/api/product/batch/productclassify/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: value,
  })
}



