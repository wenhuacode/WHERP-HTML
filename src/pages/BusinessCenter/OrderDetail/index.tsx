import React, {useRef} from "react";
import type {ProColumns, ProFormInstance} from "@ant-design/pro-components";
import {
  ProForm,
  ProTable,
  ProFormCascader,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  } from "@ant-design/pro-components";
import {Table} from "antd";
import {useModel} from "@umijs/max";


const OrderDetail: React.FC<any>= ( props) => {
  const {defaultData} = props;

  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState');

  //设置数字格式
  const FormatNum = (value: any, places: any) => {
    return parseFloat(value.toFixed(places))
  }

  //合计列设置
  const onSummary = (currentData: any) => {
    const data = ( currentData as API.OrderDetail[]).reduce((total, currentValue, ) => {
        //设置产品合计金额
        const discountTotalCount = total.discount_total_count + (currentValue?.discount_total || 0)
        const orderQtyTotal = total.qtyTotal + (currentValue?.qty || 0);

        const order_discount = formRef.current?.getFieldValue('order_discount');
        const express_fee = formRef.current?.getFieldValue('express_fee');
        const discount_amount = formRef.current?.getFieldValue('discount_amount');
        const order_amount = ((discountTotalCount * order_discount) + express_fee - discount_amount);

        formRef.current?.setFieldsValue({
          total_sales_amount: FormatNum(discountTotalCount, 2),
          order_amount: FormatNum(order_amount,2),
          order_qty:orderQtyTotal,
        })
        return {
          qtyTotal:total.qtyTotal + (currentValue?.qty || 0),
          discount_total_count: total.discount_total_count + (currentValue?.discount_total || 0),
          box_qty_total: total.box_qty_total + (currentValue?.box_qty || 0),
        };
      },
      {qtyTotal:0, discount_total_count:0,  box_qty_total:0},
    );

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={3} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>{data.qtyTotal}</Table.Summary.Cell>
          <Table.Summary.Cell index={6}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={7}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={9}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={10}>{data.discount_total_count.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={11}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={12}>{data.box_qty_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={13}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={14}>{null}</Table.Summary.Cell>


        </Table.Summary.Row>
      </Table.Summary>
    );
  };


  const columns: ProColumns<API.OrderDetail>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 38,
    },

    {
      title: '商品名称',
      dataIndex: 'product_name',
      valueType:'select',
      ellipsis: true,
      key: "product_name",
      width: 320,
    },
    {
      title: '产品条码',
      dataIndex: 'barcode',
      width: 98,
      ellipsis: true,
      key: 'barcode',
      readonly:true,
      initialValue:' ',
      fieldProps:{
        disabled:true,
        size:'small',
      },
    },
    {
      title: '数量',
      dataIndex: 'qty',
      valueType: 'digit',
      key: 'qty',
      width: 46,
    },
    {
      title: '单价',
      dataIndex: 'price',
      valueType: 'digit',
      readonly:true,
      initialValue:0,
      fieldProps:{
        //小数位
        precision:2,
        disabled:true,
        defaultValue:0,
        size:'small',
      },
      width: 50,
    },
    {
      title: '金额',
      width: 70,
      dataIndex: 'total',
      valueType: 'digit',
      readonly:true,
      fieldProps:{
        //小数位
        controls:false,
        precision:2,
        disabled:true,
        size:'small',
      },
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      valueType: 'digit',
      width: 40,
    },
    {
      title: '折后单价',
      dataIndex: 'discount_price',
      valueType: 'digit',
      width: 60,
    },
    {
      title: '折后金额',
      dataIndex: 'discount_total',
      valueType: 'digit',
      width: 80,
      // hideInTable:true,
    },
    {
      title: '赠品',
      dataIndex: 'is_free_gift',
      readonly:true,
      valueEnum: {
        false: {
          text: '否',
        },
        true: {
          text: '是',
        },
      },
      width: 40,
    },
    {
      title: '箱',
      dataIndex: 'box_qty',
      valueType: 'digit',
      readonly:true,
      fieldProps:{
        //小数位
        precision:2,
        disabled:true,
        size:'small',
        style:{width:50},
      },
      width: 50,
    },
    {
      title: '箱规',
      dataIndex: 'box_rules',
      width: 50,
      readonly:true,
      fieldProps:{
        //小数位
        precision:0,
        disabled:true,
        size:'small',
        style:{width:50},
      },
    },
    {
      title: '备注',
      dataIndex: 'note',
      ellipsis: true,
      width: 150,
      fieldProps:{size:'small',},
    },
  ];


  return (
        <ProForm
          formRef={formRef}
          size={'small'}
          readonly={true}
          submitter={false}
          initialValues={defaultData}
          layout={'horizontal'}
        >
          <ProForm.Group size={'small'}>
            <ProFormSelect
              name="order_type"
              label="订单类型"
              // request={async () => {return OrderType;}}
            />
            <ProFormText
              name="order_no"
              allowClear={false}
              label="订单编号"
              tooltip="最长为 24 位"
              placeholder="请输入订单编号"
              fieldProps={{}}
            />
            <ProFormText
              name="storehouse_name_id"
              label="仓库"
              placeholder="请选中仓库"
              allowClear={false}
            />
            <ProFormText
              name="customer_id"
              label="客户id"
              hidden={true}
              placeholder="" />
            <ProFormText
              name="customer_name"
              label="客户名称"
              placeholder="请选择客户"
            />
            <ProFormText
              name="employee_id"
              label="经手人"
              placeholder="请输入名称"
            />
            <ProFormText
              name="signed_data"
              label="签订日期"
            />
            <ProFormRadio.Group
              name="is_push_jst"
              label="是否推送聚水潭？"
              options={[
                {label: "否", value: false,},
                {label: "是", value: true,},
              ]}
            />
          </ProForm.Group>
          <ProTable<API.OrderDetail>
            rowKey="id"
            bordered={true}
            size={'small'}
            options={false}
            scroll={{x:1400, y: 300 }}
            search={false}
            request={async ()=>{
              return {
                data: defaultData.table,
                success: true
              }
            }}
            pagination={false}
            columns={columns}
            summary={() => {return onSummary(defaultData.table)}}
            cardProps={{bodyStyle:{'padding':0}}}
          />
          <ProForm.Group size={'small'} style={{marginTop:10}}>
            <ProFormText
              name="order_qty"
              label="数量合计"
              placeholder=""
            />
            <ProFormText
              key={"total_sales_amount"}
              name="total_sales_amount"
              label="产品合计金额"
              tooltip={"产品折后金额合计"}
            />
            <ProFormText
              name="order_discount"
              label="整单折扣率"
              placeholder="请输入折扣"
            />
            <ProFormText
              name="express_fee"
              label="快递费"
              placeholder="请输入快递费"
            />
            <ProFormText
              name="discount_amount"
              label="优惠金额"
              placeholder="请输入优惠金额"
            />
            <ProFormText
              name="order_amount"
              label="订单金额"
              tooltip={"最终成交金额"}
              placeholder=""
            />
          </ProForm.Group>
          <ProForm.Group size={'small'}>
            <ProFormText
              name="contact_person"
              label="联系人"
              placeholder="请输入联系人"
            />
            <ProFormText
              name="phone_number"
              label="联系电话"
              placeholder="请输入联系电话"
            />
          </ProForm.Group>

          <ProForm.Group size={'small'}>
            <ProFormCascader
              name="area"
              label="省市区"
              request={async ()=> {
                return initialState?.Address;
              }}
            />
            <ProFormText
              name="address"
              label="详细地址"
              placeholder="请输入详细地址"
            />
          </ProForm.Group>
          <ProForm.Group size={'small'}>
            <ProFormText
              width="sm"
              name="note"
              label="摘要"
            />
          </ProForm.Group>
        </ProForm>
  )
}

export default OrderDetail;
