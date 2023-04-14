import React, {useEffect, useRef, useState} from "react";
import type { ProColumns, ActionType, ProFormInstance  } from "@ant-design/pro-components";
import {ProTable, PageContainer, WaterMark} from "@ant-design/pro-components";
import {
  getOrderDetail,
} from "@/services/ant-design-pro/sale_order";
// @ts-ignore
import {useModel} from "@@/plugin-model";
// @ts-ignore
import styles from "../../../utils/tableStyle.less";
// @ts-ignore
import {useAccess} from "@@/plugin-access";
import OrderCheck from "@/pages/BusinessCenter/order/OrderCheck"
import EditOrder from "../order/EditOrder"
import {Modal } from "antd";
import SelectCustomer from "@/pages/BusinessCenter/order/SelectCustomer/SelectCustomer";
import dayjs from 'dayjs';


const OrderBase: React.FC<any> = (props) => {
  const {businessType, getOrderListApi} = props;

  const { initialState } = useModel('@@initialState');
  const[tableWidthHandler, setTableWidthHandler] = useState<any[]>([]);
  const [orderDetail, setOrderDetail] = useState<boolean>(false);
  const [orderDetailData, setOrderDetailData] = useState<any>(null);
  const [defaultData, setDefaultData] = useState<any>(null);
  //客户model
  const [createCustomerModalVisible, handleCustomerModalVisible] = useState<boolean>(false);
  const ref = useRef<ProFormInstance>();

  const tableRef = useRef<ActionType>();
  const access = useAccess();


  const GetOrderDetail = async (order_no: any) => {
    const rsp = await getOrderDetail(order_no)
    if (rsp && rsp.success) {
      setDefaultData(rsp.data)
    }
  }

  //设置操作菜单宽度，动态调整
  const settingWidthHander = async(data: any) => {
    const settingWidthData = []
    if (data.permissions_orderList_check){
      settingWidthData.push(1);
    }
    if (data.permissions_orderList_refused){
      settingWidthData.push(1);
    }
    if (data.permissions_orderList_update){
      settingWidthData.push(1);
    }
    if (data.permissions_orderList_delete){
      settingWidthData.push(1);
    }
    if (data.permissions_orderList_redInkWriteOff){
      settingWidthData.push(1);
    }
    setTableWidthHandler(settingWidthData)
  }


  useEffect(() => {
    settingWidthHander(access).then().catch();
  },[access]);


  const columns: ProColumns<API.OrderDetail>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 20,
      title: '序号',
      hideInSearch: true,
    },
    {
      dataIndex: 'order_no',
      width: 88,
      title: '订单编号',
      render: (text, record, _, action) => [
        <a
          key={record.id}
          onClick={async ()=>{
            await GetOrderDetail(record.order_no)
            const data = {
              record: record,
              action: action,
            }
            setOrderDetailData(data);
            setOrderDetail(true);
          }}
        >
          {text}
        </a>
      ]
    },
    {
      dataIndex: 'order_type',
      width: 40,
      title: '单据类型',
      valueType: 'select',
      fieldProps: {
        options: initialState?.OrderType,
        showSearch:true,
      },
    },
    {
      dataIndex: 'order_state',
      width: 36,
      title: '状态',
      // fixed: 'left',
      // eslint-disable-next-line eqeqeq
      valueEnum: businessType == 1 ? {
        0: {
          text: '已取消',
          status: 'Default',
        },
        1: {
          text: '待审核',
          status: 'Processing',
        },
        4: {
          text: '已拒绝',
          status: 'Warning',
        },
      } : {
        2: {
          text: '已审核',
          status: 'Success',
        },
        3: {
          text: '已红冲',
          status: 'Error',
        },
      },
    },
    //TODO 设置客户名称为弹框选择
    {
      dataIndex: 'customer_name',
      width: 110,
      title: '客户',
      valueType: 'select',
      ellipsis: true,
      fieldProps: {
        allowClear: false,
        showArrow:false,
        open:false,
        onClick: ()=>{
          handleCustomerModalVisible(true);
        },
      }
    },
    {
      dataIndex: 'storehouse_id',
      width: 48,
      title: '仓库',
      valueType: 'select',
      fieldProps: {
        options: initialState?.Storehouse,
        showSearch:true,
        fieldNames: {
          label: 'label',
          value: 'value',
        },
      },
    },

    {
      dataIndex: 'employee_id',
      width: 48,
      title: '经手人',
      valueType: "select",
      fieldProps: {
        options: initialState?.EmployeeData,
        showSearch:true,
      },
    },
    {
      dataIndex: 'signed_data',
      width: 48,
      title: '订单日期',
      hideInSearch: true,
      valueType: "date",
    },
    {
      title: '订单日期',
      dataIndex: 'signed_data',
      valueType: 'dateRange',
      hideInTable: true,
      hideInDescriptions:true,
      fieldProps: {
        showToday: true,
        ranges: {
          "最近7天": [dayjs().subtract(7, "days"), dayjs()],
          '最近14天': [dayjs().subtract(14, "days"), dayjs()],
          '最近30天': [dayjs().subtract(30, "days"), dayjs()],
          '最近90天': [dayjs().subtract(90, "days"), dayjs()],
          '最近1年': [dayjs().subtract(1, "years"), dayjs()],
        }
      },
      search: {
        transform: (value: any) => ({ signed_data: [value[0], value[1]]}),
      },
    },
    {
      dataIndex: 'order_qty',
      width: 48,
      title: '商品数量',
      hideInSearch:true,
    },
    {
      dataIndex: 'order_amount',
      width: 48,
      tooltip:'=(折后金额总计*整单折扣)+快递费-优惠金额',
      title: '订单金额',
      valueType: "money",
      hideInSearch:true,
    },
    {
      dataIndex: 'total_sales_amount',
      width: 60,
      tooltip:'=折后金额total',
      title: '折后金额总计',
      valueType: "money",
      hideInSearch:true,
    },
    {
      dataIndex: 'express_fee',
      width: 48,
      title: '快递费',
      valueType: "money",
      hideInSearch:true,
    },
    {
      dataIndex: 'discount_amount',
      width: 48,
      title: '优惠金额',
      valueType: "money",
      hideInSearch:true,
    },
    {
      dataIndex: 'order_discount',
      width: 48,
      title: '整单折扣',
      hideInSearch:true,
    },
    {
      dataIndex: 'note',
      width: 80,
      title: '摘要',
      ellipsis: true,
    },
    {
      dataIndex: 'contact_person',
      width: 40,
      title: '联系人',
      ellipsis: true,
    },
    {
      dataIndex: 'phone_number',
      width: 60,
      title: '联系电话',
    },
    {
      dataIndex: 'address',
      width: 48,
      title: '地址',
      ellipsis: true,
      fieldProps: {
        options: initialState?.Address,
        changeOnSelect: true,
        showSearch:true,
        fieldNames: {
          children: 'children',
          label: 'label',
          value: 'value',
        },
        // changeOnSelect: true,
      },
      valueType: 'cascader',
    },
    {
      dataIndex: 'is_push_jst',
      width: 48,
      title: '是否推单',
      hideInSearch:true,
      valueEnum:{
        '0':{text:'否'},
        '1':{text:'是'}
      },
      ellipsis: true,
    },

    {
      dataIndex: 'add_time',
      width: 80,
      title: '创建时间',
      valueType: 'dateTime',
      hideInSearch:true,
    },
    {
      dataIndex: 'create_user_id',
      width: 48,
      title: '创建人',
      fieldProps: {
        options: initialState?.EmployeeData,
        showSearch:true,
      },
      valueType:"select",
    },
    {
      dataIndex: 'update_time',
      width: 80,
      title: '修改时间',
      valueType: 'dateTime',
      hideInSearch:true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      // eslint-disable-next-line eqeqeq
      width: tableWidthHandler.length == 1 ? 15 : tableWidthHandler.length == 2 ? 30 : 45,
      fixed: 'right',
      hideInDescriptions: true,
      render: (text, record, _, action) => [
        <OrderCheck
          key={`order_check${record.id}`}
          record={record}
          action={action}
          style={"list"}
          setOrderDetail={setOrderDetail}
        />
      ],
    },
  ]

  return (
      <PageContainer
        title={false} header={{ title:false, breadcrumb: {} }}
      >
        <WaterMark content={initialState?.currentUser?.name}>
          <ProTable<API.OrderDetail>
            size={'small'}
            columns={columns}
            rowKey="id"
            options={{ fullScreen:true }}
            scroll={{ x: 3000 }}
            actionRef={tableRef}
            formRef={ref}
            request={async (params) => {
              // 表单搜索项会从 params 传入，传递给后端接口。
              return await getOrderListApi(params)
            }}
            rowClassName={(record) => {
              return record.order_state === 3 ? styles['table-order-color-red']
                : record.order_state === 2 ? styles['table-order-color-green']
                  : record.order_state === 1 ? styles['table-order-color-blue'] : '';
            }}
            dateFormatter={'string'}
            search={{labelWidth: 'auto', span: 4, defaultCollapsed: false, defaultColsNumber:20 }}
            pagination={{
              showQuickJumper: true,
              defaultPageSize: 20,
              showSizeChanger:true,
            }}
            toolbar={{
              title: '订单列表',
              // subTitle: '这里是子标题',
              tooltip: '订单列表管理',
              multipleLine: true,
            }}
          />
          <SelectCustomer
            createCustomerModalVisible={createCustomerModalVisible}
            handleCustomerModalVisible={handleCustomerModalVisible}
            formRef={ref}
            type={"query"}
          />
        </WaterMark>

        {orderDetailData != null && defaultData != null ?
          <Modal
            key={"order_detail"}
            title={"订单详情"}
            width={1080}
            destroyOnClose={true}
            open={orderDetail}
            onCancel={()=>{
              setOrderDetail(false)
              setDefaultData(null);
            }}
            footer={[
              <OrderCheck
                setOrderDetail={setOrderDetail}
                key={`order_check_detail`}
                record={orderDetailData.record}
                action={orderDetailData.action}
                style={"detail"}
              />
            ]}
            style={{paddingInline:0}}
          >
            <EditOrder
              orderType={orderDetailData.record.order_type}
              ViewOrderNo={orderDetailData.record.order_no}
            />
          </Modal> : null
        }
      </PageContainer>




  )



}
export default OrderBase;
