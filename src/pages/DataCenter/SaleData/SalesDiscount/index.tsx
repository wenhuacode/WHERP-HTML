import DataTable from "../../components/DataTable";
// @ts-ignore
import {useModel} from "@umijs/max";
import type {ProColumns, FormInstance} from "@ant-design/pro-components";
import {useRef} from "react";
import {
  SaleDiscount,
} from "@/services/ant-design-pro/data-center/sale/sale";
import dayjs from 'dayjs';
import {Table} from "antd";
import {history} from "@@/core/history";

const SalesDiscount = () => {
  const { initialState } = useModel('@@initialState');


  const formRef = useRef<FormInstance>();
  const JumpPath = (record: any) => {
    const data = formRef?.current?.getFieldsValue()
    const tmp = {
      customer_id: record.customer_id,
      startTime: data.dateRange[0].format("YYYY-MM-DD"),
      endTime: data.dateRange[1].format("YYYY-MM-DD"),
      employee: data.employee,
    }
    history.push('/data_center/sale_data/sales_discount_detail', tmp)
  }


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
          <Table.Summary.Cell index={3}>{null}</Table.Summary.Cell>
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
      title: "单位编号",
      dataIndex: "no",
      width: 80,
      hideInSearch: true,
    },
    {
      title: "单位名称",
      dataIndex: "name",
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
    {
      title: "时间",
      valueType: "dateRange",
      dataIndex: 'dateRange',
      hideInTable:true,
      initialValue: [dayjs().subtract(1, "months"), dayjs()],
      search: {
        transform: (value: any) => ({ startTime: value[0], endTime: value[1] }),
      },
      fieldProps: {
        required:true,
        allowClear:false,
        ranges:{
          "今天": [dayjs(), dayjs()],
          '本月': [dayjs().startOf('month'), dayjs().endOf('month')],
          '最近30天': [dayjs().subtract(1, "months"), dayjs()],
        }
      },
    },
    {
      title: "经手人",
      valueType: "select",
      dataIndex: 'employee',
      hideInTable:true,
      request: async ()=>{
        return initialState?.EmployeeData
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={product_purchase_columns}
        treeData={initialState?.CustomerClassify}
        tableData={SaleDiscount}
        formRef={formRef}
        onSummary={onSummary}
        JumpPath={JumpPath}
      />
    </>
  )
}

export default SalesDiscount;
