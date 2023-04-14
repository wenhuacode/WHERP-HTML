import type {ProColumns, FormInstance, ActionType} from "@ant-design/pro-components";
import {useRef} from "react";

import {useLocation} from "@umijs/max";
import {ProductSaleQueryDetailApi} from "@/services/ant-design-pro/data-center/sale/sale";
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
          add_qty:total.add_qty + (currentValue?.add_qty || 0),
          discount_total: total.discount_total + (currentValue?.discount_total || 0),
        };
      },
      {add_qty:0, discount_total:0},
    );
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={2} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={6}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={7}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={9}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={10}>{data.add_qty}</Table.Summary.Cell>
          <Table.Summary.Cell index={11}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={12}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={13}>{data.discount_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={14}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={15}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={16}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={17}>{null}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  const product_purchase_columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 60,
      hideInSearch: true,
    },
    {
      title: "日期",
      dataIndex: "signed_data",
      valueType: 'date',
      width: 120,
      hideInSearch: true,
    },
    {
      title: "单据编号",
      dataIndex: "order_no",
      width: 220,
      hideInSearch: true,
    },
    {
      title: "条码",
      dataIndex: "product_barcode",
      width: 140,
      hideInSearch: true,
    },
    {
      title: "商品名称",
      dataIndex: "product_name",
      width: 220,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "品牌编号",
      dataIndex: "classify_no",
      width: 100,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "品牌名称",
      dataIndex: "classify_name",
      width: 100,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "单位编号",
      dataIndex: "customer_no",
      width: 120,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "单位名称",
      dataIndex: "customer_name",
      width: 260,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "销售数量",
      dataIndex: "add_qty",
      sorter: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "退货数量",
      dataIndex: "reduce_qty",
      sorter: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "单价",
      dataIndex: "discount_price",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 120,
    },
    {
      title: "折后金额",
      dataIndex: "discount_total",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 120,
    },
    // {
    //   title: "入库单价",
    //   dataIndex: "cost_price",
    //   valueType: 'digit',
    //   sorter: true,
    //   hideInSearch: true,
    //   fieldProps: {
    //     precision:2,
    //   },
    //   width: 120,
    // },
    // {
    //   title: "入库金额",
    //   dataIndex: "cost_total",
    //   valueType: 'digit',
    //   sorter: true,
    //   hideInSearch: true,
    //   fieldProps: {
    //     precision:2,
    //   },
    //   width: 120,
    // },
    {
      title: "仓库编号",
      dataIndex: 'storehouse_no',
      width: 80,
    },
    {
      title: "仓库名称",
      valueType: "select",
      dataIndex: 'storehouse_name',
      // request: async ()=>{
      //   return initialState?.Storehouse
      // },
      width: 80,
    },
    {
      title: "备注",
      dataIndex: 'note',
      width: 80,
    },
  ]

  return (
      <DataDetail
        columns={product_purchase_columns}
        onSummary={onSummary}
        requests={ProductSaleQueryDetailApi}
        query={state}
        actionRef={actionRef}
        formRef={formRef}
        title={"销售明细"}
        width={600}
      />

  )
}

export default SaleDataDetailHandler;
