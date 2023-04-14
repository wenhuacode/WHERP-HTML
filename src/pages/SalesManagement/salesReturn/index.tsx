import EditOrder from "@/pages/BusinessCenter/order/EditOrder"
import React from "react";
import {useLocation} from "@umijs/max";


const SalesReturn: React.FC= () => {
//params
  const {state}: any =  useLocation();

  return (
    <>
      <EditOrder
        orderType={state ? state.order_type : 2}
      />
    </>

  );
};

export default SalesReturn;
