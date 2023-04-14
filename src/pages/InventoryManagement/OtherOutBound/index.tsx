import EditOrder from "@/pages/BusinessCenter/order/EditOrder";
import React from "react";


const OtherOutBound: React.FC<any> = () => {
  return (
    <>
      <EditOrder
        orderType={7}
        serviceType={3}
      />
    </>

  );
}

export default OtherOutBound;
