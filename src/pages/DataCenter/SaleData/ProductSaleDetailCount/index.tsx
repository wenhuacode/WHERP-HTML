import type {ProColumns, FormInstance, ActionType} from "@ant-design/pro-components";
import {useRef, useState} from "react";

import {useLocation} from "@umijs/max";
import { ProductSaleDetailCountAPI} from "@/services/ant-design-pro/data-center/sale/sale";
import {DataDetail} from "../../components/DataDetail"
import {Table} from "antd"
import dayjs from 'dayjs';
import {useModel} from "@umijs/max";
import SelectCustomer from "@/pages/BusinessCenter/order/SelectCustomer/SelectCustomer";
import {SelectSaleProduct} from "@/pages/BusinessCenter/order/SelectProduct/SelectProduct";

const ProductSaleDetailCount = () => {
  //params
  let {state}: any =  useLocation();
  if (state == undefined){
    state={}
  }

  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const [createCustomerModalVisible, handleCustomerModalVisible] = useState<boolean>(false);
  //商品model
  const [productModelOpen, setProductModelOpen] = useState(false);
  const [selectTreeKeys, setSelectTreeKeys] = useState([1]);
  //产品多选单选设置
  const [productCheckedRows, setProductCheckedRows] = useState<any>([]);

  //添加查询商品信息
  const handleOk = () => {
    if (productCheckedRows[0].product_classify_id != null) {
      formRef.current?.setFieldValue("product_name", [productCheckedRows[0].product_name,
        {"product_classify_id":productCheckedRows[0].parent_path, "type":'product_classify'}])
    }
    else if (productCheckedRows[0].product_id != null) {
      formRef.current?.setFieldValue("product_name", [productCheckedRows[0].product_name,
        {"product_id":productCheckedRows[0].barcode, "type":'product'}])
    }
    setSelectTreeKeys([1]);
    setProductModelOpen(false);
  };

  //合计列设置
  const onSummary = (viewData: any) => {
    const data = ( viewData ).reduce((total: any, currentValue: any) => {
        return {
          qty_total:total.qty_total + (currentValue?.qty || 0),
          data_total: total.data_total + (currentValue?.total || 0),
          order_amount: total.order_amount + (currentValue?.order_amount || 0),
        };
      },
      {qty_total:0, data_total:0,  order_amount:0},
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
          <Table.Summary.Cell index={10}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={11}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={12}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={13}>{data.qty_total}</Table.Summary.Cell>
          <Table.Summary.Cell index={14}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={15}>{data.data_total.toFixed(2)}</Table.Summary.Cell>
          {/*<Table.Summary.Cell index={4}>{data.sale_total.toFixed(2)}</Table.Summary.Cell>*/}
          {/*<Table.Summary.Cell index={8}>{data.discount_amount.toFixed(2)}</Table.Summary.Cell>*/}
          <Table.Summary.Cell index={10}>{null}</Table.Summary.Cell>
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
      title: "单据日期",
      dataIndex: "signed_data",
      width: 80,
      hideInSearch: true,
    },
    {
      title: "单据类型",
      dataIndex: "order_type",
      width: 80,
      valueType: 'select',
      hideInSearch: true,
      request: ()=>{
        return initialState?.OrderType
      }
    },
    {
      title: "单据编号",
      dataIndex: "order_no",
      ellipsis: true,
      width: 140,
      hideInSearch: true,
    },
    {
      title: "单位编号",
      dataIndex: "customer_no",
      ellipsis: true,
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
      title: "商品编号",
      dataIndex: "product_no",
      width: 80,
      ellipsis: true,
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
      title: "职员名称",
      dataIndex: "employee_name",
      width: 100,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "职员部门",
      dataIndex: "employee_classic_name",
      width: 100,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "仓库编号",
      dataIndex: "storehouse_no",
      ellipsis: true,
      width: 60,
      hideInSearch: true,
    },
    {
      title: "仓库名称",
      dataIndex: "storehouse_name",
      width: 100,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "数量",
      dataIndex: "qty",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:0,
      },
      width: 60,
    },
    {
      title: "单价",
      dataIndex: "price",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 80,
    },
    {
      title: "金额",
      dataIndex: "total",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 80,
    },
    {
      title: "折后单价",
      dataIndex: "discount_price",
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
      title: "摘要",
      dataIndex: "note",
      width: 220,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "时间",
      valueType: "dateRange",
      dataIndex: 'dateRange',
      hideInTable:true,
      initialValue: [dayjs().subtract(1, "weeks"), dayjs()],
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
      title: "商品名称",
      dataIndex: 'product_name',
      valueType: "select",
      fieldProps: {
        allowClear: false,
        showArrow:false,
        open:false,
        onClick: ()=>{
          setProductModelOpen(true);
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
      <DataDetail
        columns={product_purchase_columns}
        onSummary={onSummary}
        requests={ProductSaleDetailCountAPI}
        query={state}
        actionRef={actionRef}
        formRef={formRef}
        title={"销售明细"}
        search={true}
        width={2400}
      />
      <SelectCustomer
        createCustomerModalVisible={createCustomerModalVisible}
        handleCustomerModalVisible={handleCustomerModalVisible}
        formRef={formRef}
        type={"query"}
      />
      <SelectSaleProduct
        productModelOpen={productModelOpen}
        setProductModelOpen={setProductModelOpen}
        handleOk={handleOk}
        setProductCheckedRows={setProductCheckedRows}
        selectTreeKeys={selectTreeKeys}
        setSelectTreeKeys={setSelectTreeKeys}
        formRef={formRef}
        type={"query"}
      />
    </>
  )
}

export default ProductSaleDetailCount;
