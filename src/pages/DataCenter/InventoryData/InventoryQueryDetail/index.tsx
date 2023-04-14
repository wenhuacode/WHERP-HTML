import type {ProColumns, FormInstance, ActionType} from "@ant-design/pro-components";
import { useRef } from 'react';

import {useLocation} from "@umijs/max";
import { InventoryQueryDetailAPI } from '@/services/ant-design-pro/data-center/sale/sale';
import {DataDetail} from "../../components/DataDetail"
import { Table } from 'antd';
import { useModel } from '@@/exports';

const InventoryQueryDetail = () => {
  //params
  let {state}: any =  useLocation();
  if (state == undefined){
    state={}
  }

  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();

  const { initialState } = useModel('@@initialState');

  //合计列设置
  const onSummary = (viewData: any) => {
    const data = ( viewData ).reduce((total: any, currentValue: any) => {
        return {
          in_qty:total.in_qty + (currentValue?.in_qty || 0),
          out_qty: total.out_qty + (currentValue?.out_qty || 0),
        };
      },
      {in_qty:0, out_qty:0},
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
          <Table.Summary.Cell index={10}>{data.in_qty}</Table.Summary.Cell>
          <Table.Summary.Cell index={13}>{data.out_qty.toFixed(2)}</Table.Summary.Cell>
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
      title: "单据类型",
      dataIndex: "order_type",
      width: 120,
      valueType: 'select',
      hideInSearch: true,
      fieldProps: {
        options: initialState?.OrderType,
      },
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
      dataIndex: "barcode",
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
      title: "入库数量",
      dataIndex: "in_qty",
      sorter: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "出库数量",
      dataIndex: "out_qty",
      sorter: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "库存余量",
      dataIndex: "qty",
      sorter: true,
      width: 120,
      hideInSearch: true,
    },
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
        requests={InventoryQueryDetailAPI}
        query={state}
        actionRef={actionRef}
        formRef={formRef}
        title={"库存变动明细"}
        width={600}
      />
  )
}

export default InventoryQueryDetail;
