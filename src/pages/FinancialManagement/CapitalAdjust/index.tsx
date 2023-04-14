import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const CapitalAdjustOrder: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={18}
        serviceType={5}
      />
    </>

  );
}

export default CapitalAdjustOrder;
