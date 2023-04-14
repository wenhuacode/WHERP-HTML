import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const OtherPutInStorage: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={8}
        serviceType={3}
      />
    </>

  );
}

export default OtherPutInStorage;
