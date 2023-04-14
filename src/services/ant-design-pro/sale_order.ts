// @ts-ignore
import { request } from '@umijs/max';
import token from "@/utils/token";

const HOST = require('./default_host')

export async function getOrderNo(orderType: any) {
  return request(HOST.HOST + `/api/order/order_no/${orderType}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function createOrder(values: any) {
  return request(HOST.HOST + `/api/order/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

export async function createInventoryOrder(values: any) {
  return request(HOST.HOST + `/api/inventory_order/create/`, {
    method: 'POST',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

//销售草稿
export async function getOrderList(params?: any) {
  return request(HOST.HOST + `/api/order/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}

//经营历程
export async function getOrderBusinessHistoryList(params?: any) {
  return request(HOST.HOST + `/api/order/business_history/list/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    params,
  })
}


//销售订单
export async function CheckSaleOrderHandler(order_id: any) {
  return request(HOST.HOST + `/api/order/check_sale_order/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UnSaleOrder(order_no: any) {
  return request(HOST.HOST + `/api/order/un_sale_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//销售退货
export async function CheckSaleOrderReturnHandler(order_id: any) {
  return request(HOST.HOST + `/api/order/check_sale_order_return/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UnSaleOrderReturn(order_no: any) {
  return request(HOST.HOST + `/api/order/un_sale_order_return/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//采购订单
export async function CheckPurchaseOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_purchase_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UnPurchaseOrder(order_no: any) {
  return request(HOST.HOST + `/api/order/un_purchase_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//采购退货单
export async function CheckPurchaseOrderReturnHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_purchase_order_return/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UnPurchaseOrderReturn(order_no: any) {
  return request(HOST.HOST + `/api/order/un_purchase_order_return/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//报损单
export async function CheckGoodsLossOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_goods_loss_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UnGoodsLossOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/un_goods_loss_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}


//报溢单
export async function CheckGoodsOverflowOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_goods_overflow_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UnGoodsOverflowOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/un_goods_overflow_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//其他出库单
export async function CheckOtherOutOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_other_out_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UnOtherOutOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/un_other_out_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//其他入库单
export async function CheckOtherPutInOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_other_put_in_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UnOtherPutInOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/un_other_put_in_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//调拨单
export async function CheckTransfersOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_transfers_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UnTransfersOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/un_transfers_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//成本调价单
export async function CheckCostAdjustOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_cost_adjust_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function UnCostAdjustOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/un_cost_adjust_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}


//收款单
export async function CheckReceiptOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_receipt_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//红冲财务单据
export async function UnFinanceOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/un_finance_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//付款单
export async function CheckPaymentOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_payment_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//一般费用单
export async function CheckGeneralCostOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_general_cost_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//应收增加单
export async function CheckARAdIncreaseOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_arad_increase_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//应收减少单
export async function CheckARAdDecreaseOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_arad_decrease_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//应付增加单
export async function CheckAPAdIncreaseOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_apad_increase_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//应付减少单
export async function CheckAPAdDecreaseOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_apad_decrease_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

//资金调整单
export async function CheckCapitalAdjustOrderHandler(order_no: any) {
  return request(HOST.HOST + `/api/order/check_capital_adjust_order/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}


export async function cancelOrder(order_id: any) {
  return request(HOST.HOST + `/api/order/cancel/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function refuseOrder(order_id: any) {
  return request(HOST.HOST + `/api/order/refuse/${order_id}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function getOrderDetail(order_no: any) {
  return request(HOST.HOST + `/api/order/detail/${order_no}/`, {
    method: 'GET',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
  })
}

export async function updateOrderDetailData(order_no: any, values: any) {
  return request(HOST.HOST + `/api/order/update/${order_no}/`, {
    method: 'PATCH',
    headers: {
      'ACCESS_TOKEN': '' + token.get(),
    },
    data: values
  })
}

