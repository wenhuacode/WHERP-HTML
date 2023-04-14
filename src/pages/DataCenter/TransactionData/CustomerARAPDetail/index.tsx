import type {ProColumns, FormInstance, ActionType} from "@ant-design/pro-components";
import { useRef } from 'react';

import {useLocation} from "@umijs/max";
import {CustomerARAPDetailQueryAPI} from "@/services/ant-design-pro/data-center/sale/sale";
import {DataDetail} from "../../components/DataDetail"
import {Table} from "antd"
import {useModel} from "@umijs/max";

const SaleDataDetailHandler = () => {
  //params
  let {state}: any =  useLocation();
  if (state==undefined){
    state={}
  }

  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');


  //合计列设置
  const onSummary = (viewData: any) => {
    const data = ( viewData ).reduce((total: any, currentValue: any) => {
        return {
          add_total:total.add_total + (currentValue?.add_amount || 0),
          sub_total:total.sub_total + (currentValue?.sub_amount || 0),
        };
      },
      {add_total:0, sub_total:0,},
    );
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={1} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={2}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{data.add_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>{data.sub_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={6}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{null}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  const customer_arap_columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 20,
      hideInSearch: true,
    },
    {
      title: "单据类型",
      dataIndex: "order_type",
      valueType: 'select',
      width: 40,
      hideInSearch: true,
      fieldProps: {
        options: initialState?.OrderType,
      },
    },
    {
      title: "单据日期",
      dataIndex: "signed_data",
      width: 40,
      hideInSearch: true,
    },
    {
      title: "单据编号",
      dataIndex: "order_no",
      width: 100,
      hideInSearch: true,
    },
    {
      title: "增加金额",
      dataIndex: "add_amount",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 40,
    },
    {
      title: "减少金额",
      dataIndex: "sub_amount",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:0,
      },
      width: 40,
    },
    {
      title: state.check_list === 1 ? "应收金额" : "应付金额",
      dataIndex: "amount",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 40,
    },
    {
      title: "摘要",
      dataIndex: "note",
      ellipsis: true,
      hideInSearch: true,
      width: 80,
    },
  ]

  return (
    <DataDetail
      columns={customer_arap_columns}
      onSummary={onSummary}
      requests={CustomerARAPDetailQueryAPI}
      query={state}
      actionRef={actionRef}
      formRef={formRef}
      title={state.check_list === 1 ? "单位应收明细账本" : "单位应付明细账本"}
      width={600}
    />

  )
}

export default SaleDataDetailHandler;
