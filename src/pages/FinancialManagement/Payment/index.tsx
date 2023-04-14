import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const PaymentOrder: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={12}
        serviceType={5}
      />
    </>

  );
}

export default PaymentOrder;
