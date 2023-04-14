import type {ProColumns, FormInstance, ActionType} from "@ant-design/pro-components";
import {useRef} from "react";

import {useLocation} from "@umijs/max";
import {SaleDiscountDetail} from "@/services/ant-design-pro/data-center/sale/sale";
import {DataDetail} from "../../components/DataDetail"
import {Table} from "antd"

const SaleDataDetailHandler = () => {
  //params
  let {state}: any =  useLocation();
  if (state == undefined){
    state={}
  }

  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();

  //合计列设置
  const onSummary = (viewData: any) => {
    const data = ( viewData ).reduce((total: any, currentValue: any) => {
        return {
          sale_total:total.sale_total + (currentValue?.sale_total || 0),
          discount_amount: total.discount_amount + (currentValue?.discount_amount || 0),
          order_amount: total.order_amount + (currentValue?.order_amount || 0),
        };
      },
      {sale_total:0, discount_amount:0,  order_amount:0},
    );
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={2} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={9}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={9}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{data.sale_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>{data.discount_amount.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={10}>{data.order_amount.toFixed(2)}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  const product_purchase_columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 30,
      hideInSearch: true,
    },
    {
      title: "单据日期",
      dataIndex: "signed_data",
      width: 60,
      hideInSearch: true,
    },
    {
      title: "单据编号",
      dataIndex: "order_no",
      width: 140,
      hideInSearch: true,
    },
    {
      title: "单位编号",
      dataIndex: "customer_no",
      width: 60,
      hideInSearch: true,
    },
    {
      title: "单位名称",
      dataIndex: "customer_name",
      width: 220,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "销售金额",
      dataIndex: "sale_total",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 80,
    },
    {
      title: "优惠金额",
      dataIndex: "discount_amount",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:0,
      },
      width: 80,
    },
    {
      title: "优惠后金额",
      dataIndex: "order_amount",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 80,
    },
  ]

  return (
      <DataDetail
        columns={product_purchase_columns}
        onSummary={onSummary}
        requests={SaleDiscountDetail}
        query={state}
        actionRef={actionRef}
        formRef={formRef}
        title={"销售优惠明细"}
        width={1600}
      />

  )
}

export default SaleDataDetailHandler;
