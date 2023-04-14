import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const GoodsIncrease: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={6}
        serviceType={4}
      />
    </>

  );
}

export default GoodsIncrease;
