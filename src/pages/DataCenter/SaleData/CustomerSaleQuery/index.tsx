import DataTable from "../../components/DataTable";
// @ts-ignore
import {useModel} from "@umijs/max";
import type {ProColumns, FormInstance} from "@ant-design/pro-components";
import {useRef, useState} from "react";
import {
  CustomerSaleQueryApi,
} from "@/services/ant-design-pro/data-center/sale/sale";
import dayjs from 'dayjs';
import {Table} from "antd";
import {history} from "@@/core/history";
import {SelectSaleProduct} from "@/pages/BusinessCenter/order/SelectProduct/SelectProduct";

const CustomerSaleQueryHandler = () => {
  const { initialState } = useModel('@@initialState');

  //产品多选单选设置
  const [productCheckedRows, setProductCheckedRows] = useState<any>([]);
  //商品model
  const [productModelOpen, setProductModelOpen] = useState(false);
  const [selectTreeKeys, setSelectTreeKeys] = useState([1]);
  const formRef = useRef<FormInstance>();

  const JumpPath = (record: any) => {
    const data = formRef?.current?.getFieldsValue()
    const tmp = {
      customer_id: record.customer_id,
      startTime: data.dateRange[0].format("YYYY-MM-DD"),
      endTime: data.dateRange[1].format("YYYY-MM-DD"),
      employee: data.employee,
      product_classify_id: data.product_name ? data.product_name[1].product_classify_id : undefined,
      product_id: data?.product_name ? data.product_name[1].product_id : undefined,
      storehouse: data.storehouse,
    }

    history.push('/data_center/sale_data/sale_query_detail', tmp)
  }

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
          qtyTotal:total.qtyTotal + (currentValue?.qty || 0),
          discount_total: total.discount_total + (currentValue?.discount_total || 0),
          gift_total: total.gift_total + (currentValue?.gift_total || 0),
          gift_qty: total.gift_qty + (currentValue?.gift_qty || 0),
        };
      },
      {qtyTotal:0, discount_total:0,  gift_qty:0, gift_total:0},
    );

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={1} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={2}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{data.qtyTotal}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>{data.discount_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={6}>{data.gift_qty}</Table.Summary.Cell>
          <Table.Summary.Cell index={7}>{data.gift_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>{null}</Table.Summary.Cell>
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
      title: "赠品数量",
      dataIndex: "gift_qty",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:0,
      },
      width: 80,
    },
    {
      title: "赠品金额",
      dataIndex: "gift_total",
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
      <DataTable
        columns={product_purchase_columns}
        treeData={initialState?.CustomerClassify}
        tableData={CustomerSaleQueryApi}
        formRef={formRef}
        onSummary={onSummary}
        JumpPath={JumpPath}
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

export default CustomerSaleQueryHandler;
