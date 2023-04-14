import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";
import {useLocation} from "@umijs/max";


const PurchaseReturnOrder: React.FC<any> = () => {
  //params
  const {state}: any =  useLocation();

  return (
    <>
      <EditOrder
        orderType={state ? state.order_type : 4}
      />
    </>

  );
}

export default PurchaseReturnOrder;
