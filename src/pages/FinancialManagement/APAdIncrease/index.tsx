import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const APAdIncreaseOrder: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={16}
        serviceType={5}
      />
    </>

  );
}

export default APAdIncreaseOrder;
