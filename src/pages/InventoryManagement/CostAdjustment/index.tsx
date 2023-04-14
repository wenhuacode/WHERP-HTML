import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const CostAdjustment: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={10}
        serviceType={4}
      />
    </>

  );
}

export default CostAdjustment;
