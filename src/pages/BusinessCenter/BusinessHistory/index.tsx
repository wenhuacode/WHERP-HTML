import React from "react";
import OrderBase from "@/pages/BusinessCenter/OrderBase";
import {getOrderBusinessHistoryList} from "@/services/ant-design-pro/sale_order";



const BusinessHistory: React.FC = () => {

  return (
    <OrderBase
      businessType={2}
      getOrderListApi={getOrderBusinessHistoryList}
    />
  )
}
export default BusinessHistory;
