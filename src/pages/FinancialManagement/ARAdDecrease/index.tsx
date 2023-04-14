import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const ARAdDecreaseOrder: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={15}
        serviceType={5}
      />
    </>

  );
}

export default ARAdDecreaseOrder;
