import React, {useEffect, useRef, useState} from "react";
import type {ActionType, EditableFormInstance, ProFormInstance} from "@ant-design/pro-components";
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormCascader,
  ProFormDatePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
// @ts-ignore
import {useModel} from "@@/plugin-model";
import {
  createOrder,
  getOrderDetail,
  createInventoryOrder,
  updateOrderDetailData
} from "@/services/ant-design-pro/sale_order";
import {GetOrderNO} from "@/services/public-api/api";
import { useLocation } from "@umijs/max"
import dayjs from 'dayjs';
import SelectCustomer from "@/pages/BusinessCenter/order/SelectCustomer/SelectCustomer"
import {SaleOrderEditTable, InventoryOrderEditTable, FinanceOrderEditTable} from "@/pages/BusinessCenter/order/OrderEditTable";
import {createFinanceOrder} from "@/services/ant-design-pro/finance";


const EditOrder: React.FC<any> = (props: any) => {
  //params
  let {state}: any =  useLocation();
  if (state == undefined) {
    state = {}
  }

  const {orderType, ViewOrderNo} = props;

  const actionRef = useRef<ActionType>();
  const formRefTable = useRef<ProFormInstance>();
  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();
  const editableFormRef = useRef<EditableFormInstance>();
  const { initialState } = useModel('@@initialState');

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);

  //客户model
  const [createCustomerModalVisible, handleCustomerModalVisible] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any[]>([]);
  //订单编号
  const [orderNo, setOrderNo] = useState<string>();

  //订单表数据
  const [defaultTableData, setDefaultTableData] = useState<any>(null);


  //设置数字格式
  const FormatNum = (value: number, places: number) => {
    return parseFloat(value.toFixed(places))
  }

  //合计列金额更新
  const tableTotalHandler = () => {
    // @ts-ignore
    const data = editableFormRef.current?.getRowsData()
    // @ts-ignore
    setSummaryData(data)
  }

  const GetOrderDetail = async (order_no: any) => {
    const rsp = await getOrderDetail(order_no)
    if (rsp && rsp.success) {
      return rsp.data
    }
  }

  //获取订单编号 => 设置初始状态
  const GetOrderNoData = async () => {

    //检查是否为编辑状态
    if (state.type == "edit") {
      //处理编辑订单
      setOrderNo(state.order_no);
      const data = await GetOrderDetail(state.order_no);
      //TODO 订单初始数据
      form.setFieldsValue(data)
      // @ts-ignore
      setEditableRowKeys(data.table.map(({ id }) => id));
      setSummaryData(data.table)
    }else if(ViewOrderNo != undefined || ViewOrderNo != null || state.type == "query" ) {
      let data
      if (state.type == "query"){
        data = await GetOrderDetail(state.order_no);
        setOrderNo(state.order_no);
      }else {
        data = await GetOrderDetail(ViewOrderNo);
        setOrderNo(ViewOrderNo);
      }
      //处理查看订单
      // await setEditableRowKeys(data.table.map(({ id }) => id));

      //TODO 订单初始数据
      form.setFieldsValue(data)
      //设置合计列数据
      setSummaryData(data.table)
    }
    else {
      //新建订单
      const resp = await GetOrderNO(orderType)
      await setOrderNo(resp);
      return resp
    }
  }

  useEffect(() => {
    GetOrderNoData().then().catch();
  }, []);


  //设置整单折扣
  const totalDiscountHandler = async (value: number) => {
    const tableData: any = tableForm.getFieldsValue()

    if (Object.keys(tableData).length !== 0){
      Object.entries(tableData).map((values: any) => {
        if (values[1].product_name !== undefined && (value >= 0 && value <=1) ){
          const data: any = values[1]
          data.discount = value
          data.discount_price = FormatNum((value * data.price),4)
          data.discount_total = FormatNum((data.qty * (value * data.price)), 2)
          data.is_free_gift = (value === 0)
          // @ts-ignore
          editableFormRef.current?.setRowData(values[0], data)
        }
      })
      await tableTotalHandler()
    }
  };

  //保存订单数据
  const saveOrderData = async (fromData: any) => {
    let resp;

    const hide = message.loading(`正在保存订单....`);
    if (Object.keys(state).length == 0) {
      if (orderType == 1 || orderType == 2 || orderType == 3 || orderType == 4) {
        resp = await createOrder(fromData);
      }else if(orderType == 5 || orderType == 6 || orderType == 7 || orderType == 8 || orderType == 9 || orderType == 10){
        resp = await createInventoryOrder(fromData);
      }else if(orderType == 11 || orderType == 12 || orderType == 13 || orderType == 14 || orderType == 15 || orderType == 16
        || orderType == 17 || orderType == 18){
        resp = await createFinanceOrder(fromData);
      }
    }
    else {
      if (orderType == 1 || orderType == 2 || orderType == 3 || orderType == 4) {
        resp = await updateOrderDetailData(fromData.order_no, fromData);
      }else if(orderType == 5 || orderType == 6 || orderType == 7 || orderType == 8 || orderType == 9 || orderType == 10){
        resp = await createInventoryOrder(fromData);
      }else if(orderType == 11 || orderType == 12 || orderType == 13 || orderType == 14 || orderType == 15 || orderType == 16
        || orderType == 17 || orderType == 18){
        resp = await createFinanceOrder(fromData);
      }
      history.back();
    }
    hide();
    if (resp && resp.success) {
      message.success('订单保存成功!');
      return true;
    }
    message.error('订单保存失败!');
    return false;
  }


  return (
    <PageContainer
      title={false} header={{ title:false, breadcrumb: {} }}
    >
      <ProCard
        size={'small'}
        // ghost={true}
        // ghost={true}
        loading={orderNo == null && defaultTableData == null}
      >
        <ProForm
          formRef={formRefTable}
          form={form}
          initialValues={defaultTableData}
          readonly={ViewOrderNo != undefined || ViewOrderNo != null || state.type == "query"}
          size={'small'}
          submitter={ViewOrderNo != undefined || ViewOrderNo != null ? false :{
            render:(r, e, )=>{
              // 判断新增及修改按钮
            return state.type == "edit"?
              [
                <Button key={"submit"}  type={"primary"} onClick={()=>{
                  r.submit()
                }}>
                  提交
                </Button>,
                <Button key={"cancel"} onClick={()=>{history.back()}}>
                  取消
                </Button>
              ]
              :
              state.type == "query" ? null :
                [
                  <Button key={"submits"}  type={"primary"} onClick={()=>{
                    r.submit()
                  }}>
                    提交
                  </Button>,
                  <Button key={"cancels"} onClick={()=>{r.reset()}}>
                    重置
                  </Button>
                ]
          }}}

          onFinish={async ()=>{
            //处理整体表格数据
            await formRefTable?.current?.validateFieldsReturnFormatValue?.().then(async (fromValue) =>{
              if ( fromValue.hasOwnProperty('rp_amount')) {
                if (fromValue.rp_amount != fromValue.order_amount) {
                  message.error("付款金额与明细金额不相等！")
                  return false
                }
              }
              await editableFormRef?.current?.validateFieldsReturnFormatValue?.().then(async () => {
                //更改table数据
                const newArr: any = []
                // @ts-ignore
                editableFormRef?.current?.getRowsData?.().forEach((values) => {
                  newArr.push({
                    ...values,
                    order_no: fromValue.order_no,
                    order_type: fromValue.order_type,
                  });
                });
                fromValue.table = newArr;
                const result = await saveOrderData(fromValue);
                // 重置表单
                if (result){
                  formRefTable.current?.resetFields();

                  const rsp = await GetOrderNoData();
                  if (rsp){
                    formRefTable.current?.setFieldValue('order_no', rsp)
                  }
                  return true
                }
              })
            })
            return true
          }}
        >
          <ProForm.Group size={'small'}>
            <ProFormSelect
              width="xs"
              name="order_type"
              label="订单类型"
              disabled={true}
              rules={[{required: true}]}
              initialValue={Object.keys(state).length > 0 ? Number(state.order_type) : orderType}
              request={async () => {return initialState?.OrderType;}}
            />
            <ProFormText
              width="sm"
              name="order_no"
              allowClear={false}
              label="订单编号"
              tooltip="最长为 24 位"
              rules={[{required:true}]}
              placeholder="请输入订单编号"
              initialValue={orderNo}
              // fieldProps={{value:orderNo}}
            />

            {orderType == 11 || orderType == 12 || orderType == 13 || orderType == 14 || orderType == 15
            || orderType == 16 || orderType == 17 || orderType == 18
              ?
              <></>
              :
              <ProFormSelect
                width="xs"
                name="storehouse_id"
                label="仓库"
                // initialValue={1}
                rules={[{required: true}]}
                placeholder="请选中仓库"
                allowClear={false}
                fieldProps={{
                  showSearch:true,
                }}
                request={async () => {
                  return initialState?.Storehouse;
                }}
              />
            }

            {orderType == 9 ?
              <ProFormSelect
                width="xs"
                name="rs_storehouse"
                label="调入仓库"
                rules={[{required:orderType == 9,  message: "调入仓库"}]}
                placeholder="请选择仓库"
                allowClear={false}
                request={async () => {return initialState?.Storehouse;}}
              />
              : null
            }

            {orderType == 5 || orderType == 6 || orderType == 7 || orderType == 8
            || orderType == 9 || orderType == 10 || orderType == 18
              ? <></> :
              <>
                <ProFormText
                  width="sm"
                  name="customer_id"
                  label="客户id"
                  hidden={true}
                  placeholder=""
                />
                <ProFormSelect
                  width="md"
                  name="customer_name"
                  label="单位名称"
                  placeholder="请选择单位"
                  rules={[orderType == 13 ? {} : {required:true, message: "请选择单位"}]}
                  fieldProps={{
                  showArrow:false,
                  open:false,
                  size:'small',
                  allowClear:false,
                  onClick: ()=> {
                  handleCustomerModalVisible(true);
                  },
                 }}
                />
              </>
            }

            <ProFormSelect
              width="xs"
              name="employee_id"
              label="经手人"
              initialValue={initialState?.currentUser?.id}
              rules={[{required:true}]}
              placeholder="请输入名称"
              fieldProps={{
                showSearch:true,
              }}
              request={async () => {return initialState?.EmployeeData;}}
            />
            <ProFormDatePicker
              width="xs"
              name="signed_data"
              label="签订日期"
              rules={[{required:true}]}
              initialValue={dayjs().format('YYYY-MM-DD')}
            />

            {orderType == 5 || orderType == 6 || orderType == 10 || orderType == 11 || orderType == 12 || orderType == 13 || orderType == 14 || orderType == 15
            || orderType == 16 || orderType == 17 || orderType == 18
              ?
              <></>
              :
              <ProFormRadio.Group
                name="is_push_jst"
                label="是否推送聚水潭？"
                width={'xs'}
                rules={[{required: true}]}
                initialValue={true}
                options={[
                  {label: '是', value: true,},
                  {label: '否', value: false,},
                ]}
              />
            }
          </ProForm.Group>

          {
            orderType == 10?
              <InventoryOrderEditTable
                actionRef={actionRef}
                initialState={initialState}
                editableFormRef={editableFormRef}
                formRef={formRefTable}
                form={tableForm}
                orderType={orderType}
                editableKeys={editableKeys}
                setEditableRowKeys={setEditableRowKeys}
                summaryData={summaryData}
                setSummaryData={setSummaryData}
                tableTotalHandler={tableTotalHandler}
                ViewOrderNo={ViewOrderNo}
                Type={state.type}
              />
            : orderType == 11 || orderType == 12 || orderType == 13 || orderType == 14 || orderType == 15
              || orderType == 16 || orderType == 17 || orderType == 18 ?
              <FinanceOrderEditTable
                actionRef={actionRef}
                editableFormRef={editableFormRef}
                formRef={formRefTable}
                form={tableForm}
                orderType={orderType}
                editableKeys={editableKeys}
                setEditableRowKeys={setEditableRowKeys}
                summaryData={summaryData}
                setSummaryData={setSummaryData}
                tableTotalHandler={tableTotalHandler}
                ViewOrderNo={ViewOrderNo}
                Type={state.type}
              />
            :
                <SaleOrderEditTable
                  actionRef={actionRef}
                  editableFormRef={editableFormRef}
                  formRef={formRefTable}
                  formF={form}
                  form={tableForm}
                  orderType={orderType}
                  editableKeys={editableKeys}
                  setEditableRowKeys={setEditableRowKeys}
                  summaryData={summaryData}
                  setSummaryData={setSummaryData}
                  tableTotalHandler={tableTotalHandler}
                  ViewOrderNo={ViewOrderNo}
                  Type={state.type}
                />
          }

          <ProForm.Group size={'small'} style={{marginTop:10}}>
            {orderType == 11 || orderType == 12 || orderType == 13 || orderType == 14 || orderType == 15
            || orderType == 16 || orderType == 17 || orderType == 18 ?
              <></>
              :
              <ProFormDigit
                width="xs"
                name="order_qty"
                label="数量合计"
                disabled={true}
                min={0}
                initialValue={0}
                placeholder=""
                fieldProps={{precision:0,}}
              />
            }

            {orderType == 11 || orderType == 12 || orderType == 13 || orderType == 14 || orderType == 15
            || orderType == 16 || orderType == 17 || orderType == 18 ?
              <></>
              :
                <ProFormDigit
                  width="xs"
                  key={"total_sales_amount"}
                  name="total_sales_amount"
                  label="合计金额"
                  tooltip={"折后金额合计"}
                  initialValue={0.00}
                  disabled={true}
                  rules={[{required:true}]}
                  fieldProps={{
                    precision:2,
                  }}
                />
            }

            <ProCard ghost={true} hidden={orderType == 5 || orderType == 6 || orderType == 7 || orderType == 8
            || orderType == 9 || orderType == 10 || orderType == 11 || orderType == 12 || orderType == 13 || orderType == 14 || orderType == 15
            || orderType == 16 || orderType == 17 || orderType == 18}>
              <ProForm.Group size={'small'}>
                <ProFormDigit
                  width="xs"
                  name="order_discount"
                  label="整单折扣率"
                  max={1}
                  min={0}
                  initialValue={1.00}
                  placeholder="请输入折扣"
                  fieldProps={{
                    precision:2,
                    onBlur: async (e) => {
                      await totalDiscountHandler(parseFloat(e.target.value));
                      await tableTotalHandler();
                    }
                  }}
                />
                <ProFormDigit
                  width="xs"
                  name="express_fee"
                  label="快递费"
                  placeholder="请输入快递费"
                  initialValue={0.00}
                  fieldProps={{
                    precision:2,
                    onBlur: async () => {await tableTotalHandler()}
                  }}
                />
                <ProFormDigit
                  width="xs"
                  name="discount_amount"
                  label="优惠金额"
                  min={-999999}
                  initialValue={0.00}
                  placeholder="请输入优惠金额"
                  fieldProps={{
                    precision:2,
                    onBlur: async () => {await tableTotalHandler()}
                  }}
                />
              </ProForm.Group>
            </ProCard>

              <ProFormDigit
                width="xs"
                name="order_amount"
                label="订单金额"
                rules={[{required: true, message: "订单金额"}]}
                disabled={true}
                initialValue={0.00}
                tooltip={"最终成交金额"}
                fieldProps={{precision: 2,}}
              />
          </ProForm.Group>

          {orderType == 2 || orderType == 3 || orderType == 5 || orderType == 6 || orderType == 7 || orderType == 8
          || orderType == 9 || orderType == 10 || orderType == 11 || orderType == 12 || orderType == 13 || orderType == 14 || orderType == 15
          || orderType == 16 || orderType == 17 || orderType == 18
            ? <></> :
            <ProForm.Group size={'small'}>
              <ProFormText
                width="xs"
                name="contact_person"
                label="联系人"
                rules={[{required:true, message: "联系人"}]}
                placeholder="请输入联系人"
              />
              <ProFormText
                width="sm"
                name="phone_number"
                label="联系电话"
                rules={[{required:true, message: "联系电话"},{pattern: /^[A-Za-z0-9]+$/, message: "电话格式错误"}]}
                placeholder="请输入联系电话"
              />
              <ProFormCascader
                width="md"
                name="area"
                label="省市区"
                rules={[{required:true, message: "请选择省市区"}]}
                fieldProps={{
                  showSearch:true,
                }}
                request={async ()=> {
                  return initialState?.Address;
                }}
              />
              <ProFormText
                width="md"
                name="address"
                label="详细地址"
                rules={[{required:true, message: "详细地址"}]}
                placeholder="请输入详细地址"
              />
            </ProForm.Group>
          }

          <ProCard ghost={true}
                   hidden={
            orderType == 5 || orderType == 6 || orderType == 7 || orderType == 8
            || orderType == 9 || orderType == 10 || orderType == 11 || orderType == 12 || orderType == 13 || orderType == 14 || orderType == 15
            || orderType == 16 || orderType == 17 || orderType == 18
          }>
            <ProForm.Group size={'small'}>
              <ProFormSelect
                width="xs"
                name="courier_company"
                label="快递公司"
                placeholder="请选择快递公司"
                fieldProps={{
                  showSearch:true,
                }}
                options={[
                  {label:'圆通快递', value:1},
                  {label:'顺丰快递', value:2},
                  {label:'京东快递', value:3},
                  {label:'韵达快递', value:4},
                  {label:'申通快递', value:5},
                  {label:'现场取货', value:6},
                  {label:'其他', value:7},
                ]}
              />
              <ProFormText
                width="sm"
                name="courier_number"
                label="快递单号"
                placeholder="请输入快递单号"
                rules={[{pattern: /^[A-Za-z0-9]+$/, message: "快递单号式错误"}]}
              />
            </ProForm.Group>
          </ProCard>

          {orderType == 18 || orderType == 13?
            <ProForm.Group size={'small'}>
              <ProFormSelect
                width="xs"
                name="bank_account"
                label="银行账户"
                rules={[{required: true, message: "请选择银行账户"}]}
                request={async ()=>{
                  return initialState?.AsBank;
                }}

              />
              <ProFormDigit
                width="xs"
                name="rp_amount"
                label="付款金额"
                rules={[{required: true, message: "付款金额"}]}
                fieldProps={{precision: 2}}
              />
            </ProForm.Group>
            : null
          }

          <ProForm.Group size={'small'}>
            <ProFormTextArea
              width="lg"
              name="note"
              label="摘要"
              placeholder="请输入摘要"
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>

      <SelectCustomer
        createCustomerModalVisible={createCustomerModalVisible}
        handleCustomerModalVisible={handleCustomerModalVisible}
        formRef={formRefTable}
        type={"detail"}
      />
    </PageContainer>
  )
}

export default EditOrder;
