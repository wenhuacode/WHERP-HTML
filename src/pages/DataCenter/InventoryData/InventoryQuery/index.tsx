import DataTable from "../../components/DataTable";
// @ts-ignore
import {useModel} from "@umijs/max";
import type {ProColumns, FormInstance} from "@ant-design/pro-components";
import {useRef, useState} from "react";
import {InventoryQueryAPI} from "@/services/ant-design-pro/data-center/sale/sale";
import { Table, message, Form } from 'antd';
import {history} from "@@/core/history";
import {SelectSaleProduct} from "@/pages/BusinessCenter/order/SelectProduct/SelectProduct";
import { ModalForm, ProFormDateRangePicker } from '@ant-design/pro-components';
import dayjs from 'dayjs';

const InventoryQueryHandler = () => {
  const { initialState } = useModel('@@initialState');

  //产品多选单选设置
  const [productCheckedRows, setProductCheckedRows] = useState<any>([]);
  //商品model
  const [productModelOpen, setProductModelOpen] = useState(false);
  const [selectTreeKeys, setSelectTreeKeys] = useState([1]);
  const formRef = useRef<FormInstance>();

  const [form] = Form.useForm<{ name: string; company: string }>();
  const [modalVisit, setModalVisit] = useState(false);

  const [tmpCheckRecord, setTmpCheckRecord] = useState<any>();

  const JumpPath = (record: any) => {
    setModalVisit(true);
    setTmpCheckRecord(record);
  }

  const NewJumpPath = async (value: any) => {
    setModalVisit(false)
    const data = formRef?.current?.getFieldsValue()
    const tmp = {
      barcode: tmpCheckRecord.barcode,
      storehouse: data.storehouse,

      startTime: value.dateRange[0],
      endTime: value.dateRange[1],
    }
    await history.push('/data_center/inventory_data/inventory_query_detail', tmp)
    return true
  }



  //添加查询商品信息
  const handleOk = () => {
    if (productCheckedRows[0].product_classify_id != null) {
      // formRef.current?.setFieldValue("product_name", [productCheckedRows[0].product_name,
      //   {"product_classify_id":productCheckedRows[0].parent_path, "type":'product_classify'}])
      message.error("请选择单个基础资料")
      return
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
          amount_total: total.amount_total + (currentValue?.total || 0),
        };
      },
      {qtyTotal:0, amount_total:0},
    );

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={1} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={2}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{data.qtyTotal}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{data.amount_total.toFixed(2)}</Table.Summary.Cell>
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
      width: 40,
      hideInSearch: true,
    },
    {
      title: "名称",
      dataIndex: "name",
      width: 160,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "条码",
      dataIndex: "barcode",
      width: 80,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "数量",
      dataIndex: "qty",
      sorter: true,
      width: 60,
      hideInSearch: true,
    },
    {
      title: "库存金额",
      dataIndex: "total",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 60,
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
      hideInSearch: true,
      hideInTable:true,
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
        tableData={InventoryQueryAPI}
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

      <ModalForm
        title={false}
        form={form}
        autoFocusFirstInput
        onFinish={async (values) => {
          await NewJumpPath(values)
        }}
        open={modalVisit}
        onOpenChange={setModalVisit}
        width={500}
      >
        <ProFormDateRangePicker
          name="dateRange"
          label="选择时间"
          initialValue={[dayjs().subtract(1, "months"), dayjs()]}
          rules={[{ required: true, message: '时间不能为空' }]}
          fieldProps={{
            allowClear:false,
            ranges:{
              "最近7天": [dayjs().subtract(7, "days"), dayjs()],
              '最近14天': [dayjs().subtract(14, "days"), dayjs()],
              '最近30天': [dayjs().subtract(30, "days"), dayjs()],
              '最近90天': [dayjs().subtract(90, "days"), dayjs()],
              '最近1年': [dayjs().subtract(1, "years"), dayjs()],
            }
          }}
        />
      </ModalForm>
    </>
  )
}

export default InventoryQueryHandler;
