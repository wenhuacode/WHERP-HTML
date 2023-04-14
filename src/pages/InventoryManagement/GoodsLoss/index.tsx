import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const GoodsLoss: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={5}
        serviceType={4}
      />
    </>

  );
}

export default GoodsLoss;
