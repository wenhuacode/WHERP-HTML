import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const APAdDecreaseOrder: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={17}
        serviceType={5}
      />
    </>

  );
}

export default APAdDecreaseOrder;
