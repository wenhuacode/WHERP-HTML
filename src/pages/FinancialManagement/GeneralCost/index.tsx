import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const GeneralCostOrder: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={13}
        serviceType={5}
      />
    </>

  );
}

export default GeneralCostOrder;
