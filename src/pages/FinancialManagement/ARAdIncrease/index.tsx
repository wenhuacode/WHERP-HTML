import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const ARAdIncreaseOrder: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={14}
        serviceType={5}
      />
    </>

  );
}

export default ARAdIncreaseOrder;
