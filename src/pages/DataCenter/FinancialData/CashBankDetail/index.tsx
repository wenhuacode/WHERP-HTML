import type {ProColumns, FormInstance, ActionType} from "@ant-design/pro-components";
import { useRef } from 'react';

import {useLocation} from "@umijs/max";
import { CashBankQueryDetailAPI } from '@/services/ant-design-pro/data-center/sale/sale';
import DataDetail from "../../components/DataDetail"
import { Table } from 'antd';
import { useModel } from '@@/exports';

const CashBankDetail = () => {
  //params
  let {state}: any =  useLocation();
  if (state == undefined) {
    state = {}
  }

  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();

  const { initialState } = useModel('@@initialState');

  //合计列设置
  const onSummary = (viewData: any) => {
    const data = ( viewData ).reduce((total: any, currentValue: any) => {
        return {
          add_amount:total.add_amount + (currentValue?.add_amount || 0),
          sub_amount: total.sub_amount + (currentValue?.sub_amount || 0),
        };
      },
      {add_amount:0, sub_amount:0,},
    );
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={1} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={2} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={4} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={5} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={6} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={7} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>{data.add_amount}</Table.Summary.Cell>
          <Table.Summary.Cell index={9}>{data.sub_amount.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={10} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={11} >{null}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  const product_purchase_columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 40,
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
      title: "科目编号",
      dataIndex: "as_no",
      ellipsis: true,
      width: 140,
      hideInSearch: true,
    },
    {
      title: "科目名称",
      dataIndex: "as_name",
      ellipsis: true,
      width: 140,
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
      title: "增加金额",
      dataIndex: "add_amount",
      sorter: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "减少金额",
      dataIndex: "sub_amount",
      sorter: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "余额",
      dataIndex: "amount",
      sorter: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "备注",
      dataIndex: 'note',
      width: 80,
    },

  ]

  return (
    <>
      <DataDetail
        columns={product_purchase_columns}
        onSummary={onSummary}
        requests={CashBankQueryDetailAPI}
        query={state}
        actionRef={actionRef}
        formRef={formRef}
        title={"账户明细"}
        search={false}
        width={'auto'}
      />
    </>

  )
}

export default CashBankDetail;
