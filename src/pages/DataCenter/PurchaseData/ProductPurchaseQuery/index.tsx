import DataTable from "../../components/DataTable";
// @ts-ignore
import {useModel} from "@umijs/max";
import type {ProColumns, FormInstance} from "@ant-design/pro-components";
import {useRef, useState} from "react";
import { ProductPurchaseQueryApi} from "@/services/ant-design-pro/data-center/purchase/purchase";
import dayjs from 'dayjs';
import {Table} from "antd";
import SelectCustomer from "@/pages/BusinessCenter/order/SelectCustomer/SelectCustomer";
import {history} from "@@/core/history";

const ProductPurchaseQueryHandler = () => {
  const { initialState } = useModel('@@initialState');
  //客户model
  const [createCustomerModalVisible, handleCustomerModalVisible] = useState<boolean>(false);

  const formRef = useRef<FormInstance>();

  const JumpPath = (record: any) => {
    const data = formRef?.current?.getFieldsValue?.()
    const tmp = {
      barcode: record.barcode,
      startTime: data.dateRange[0].format("YYYY-MM-DD"),
      endTime: data.dateRange[1].format("YYYY-MM-DD"),
      employee: data.employee,
      customer_classify_id: data.customer_name ? data.customer_name[1].customer_classify_id : undefined,
      customer_id: data?.customer_name ? data.customer_name[1].customer_id : undefined,
      storehouse: data.storehouse,
    }
    history.push('/data_center/purchase_data/purchase_query_detail', tmp)
  }


  //合计列设置
  const onSummary = (viewData: any) => {
    const data = ( viewData ).reduce((total: any, currentValue: any) => {
        return {
          qtyTotal:total.qtyTotal + (currentValue?.qty || 0),
          discount_total: total.discount_total + (currentValue?.discount_total || 0),
          cost_total: total.cost_total + (currentValue?.cost_total || 0),
        };
      },
      {qtyTotal:0, discount_total:0,  cost_total:0},
    );

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={2} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{data.qtyTotal}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>{data.discount_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={11}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={10}>{data.cost_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={11}>{null}</Table.Summary.Cell>
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
      title: "编号",
      dataIndex: "no",
      width: 80,
      hideInSearch: true,
    },
    {
      title: "名称",
      dataIndex: "name",
      width: 220,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "数量",
      dataIndex: "qty",
      sorter: true,
      width: 80,
      hideInSearch: true,
    },
    {
      title: "平均单价",
      dataIndex: "avg_price",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 80,
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
      width: 80,
    },
    {
      title: "入库单价",
      dataIndex: "cost_price",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 80,
    },
    {
      title: "入库金额",
      dataIndex: "cost_total",
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
      title: "单位名称",
      dataIndex: 'customer_name',
      valueType: "select",
      fieldProps: {
        allowClear: false,
        showArrow:false,
        open:false,
        onClick: ()=>{
          handleCustomerModalVisible(true);
        },
      },
      hideInTable:true,
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
    {
      title: "仓库名称",
      valueType: "select",
      dataIndex: 'storehouse',
      hideInTable:true,
      request: async ()=>{
        return initialState?.Storehouse
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={product_purchase_columns}
        treeData={initialState?.ProductClassify}
        tableData={ProductPurchaseQueryApi}
        formRef={formRef}
        onSummary={onSummary}
        JumpPath={JumpPath}
      />
      <SelectCustomer
        createCustomerModalVisible={createCustomerModalVisible}
        handleCustomerModalVisible={handleCustomerModalVisible}
        formRef={formRef}
        type={"query"}
      />
    </>
  )
}

export default ProductPurchaseQueryHandler;
