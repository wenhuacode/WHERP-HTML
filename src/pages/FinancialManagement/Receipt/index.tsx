import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const ReceiptOrder: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={11}
        serviceType={5}
      />
    </>

  );
}

export default ReceiptOrder;
