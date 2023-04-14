import React from "react";
import OrderBase from "@/pages/BusinessCenter/OrderBase";
import {getOrderList} from "@/services/ant-design-pro/sale_order";



const OrderIndex: React.FC = () => {

  return (
    <OrderBase
      businessType={1}
      getOrderListApi={getOrderList}
    />
  )
}
export default OrderIndex;
