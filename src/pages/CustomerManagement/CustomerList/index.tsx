import {Button, Drawer, message, Row, Col, Upload, Table, Divider, Form, Popconfirm, Typography} from 'antd';
import React, {useRef, useState} from 'react';
import type { ProColumns, ActionType , ProDescriptionsItemProps } from '@ant-design/pro-components';
import {PageContainer} from '@ant-design/pro-components';
import {
  ProTable, DrawerForm, ProFormSelect, ProFormText, ProFormTreeSelect, ProFormCascader,
  ProFormDigit, ProFormTextArea, ProFormMoney, ProDescriptions, ProFormSwitch
} from '@ant-design/pro-components';
import CustomerClassifyTree from './components/CustomerClassifyTree'
import {UploadOutlined, ExportOutlined} from "@ant-design/icons";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  importCustomerExcelApi,
  updateCustomer
} from "@/services/ant-design-pro/customer";
import {onExportExcel, onImportExcel} from "@/utils/import_and_export"
import {ProCard} from "@ant-design/pro-components";
import { useAccess, Access } from '@umijs/max';
import {BatchCustomer} from '@/utils/batch';
import {useModel} from "@@/plugin-model";


const Customer: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [showDetail2, setShowDetail2] = useState<boolean>(false);
  const[editCustomer, setEditCustomer] = useState<API.Customer>()
  const [currentRow, setCurrentRow] = useState<API.Customer>();
  const [showCustomerDetail, setShowCustomerDetail] = useState<boolean>(false);

  const [modalVisit, setModalVisit] = useState<any>(false);
  const [customerCheckedRows, setCustomerCheckedRows] = useState<any[]>([]);

  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const access = useAccess();


  const handleSaveCustomer: (customer: API.Customer) => Promise<boolean> = async (customer) => {
    const hide = message.loading(`正在${customer.id ? '修改' : '创建'}客户....`);
    const resp = customer.id ? await updateCustomer(customer) : await createCustomer(customer);
    hide();
    if (resp && resp.success) {
      message.success('客户添加成功!');
      return true;
    }
    message.error('客户添加失败!');
    return false;
  };

  const changeCustomerData: (values: any) => object = async(values) => {
    values.ar_amount = parseFloat(values?.ar_amount).toFixed(2);
    values.ap_amount = parseFloat(values?.ap_amount).toFixed(2);
    return values
  }

  const handleDeleteCustomer: (id: number) => Promise<boolean> = async (id) => {
    const hide = message.loading('正在删除客户....');
    const resp = await deleteCustomer(id);

    hide();
    if (resp && resp.success) {
      message.success('客户删除成功!');
      return true;
    }

    message.error('客户删除失败!');
    return false;
  };

  const customer_columns: ProColumns<API.Customer>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      title: '序号',
      hideInSearch: true,
      fixed: 'left',
    },
    {
      dataIndex: 'uk_customer_no',
      title: '客户编号',
      width: 100,
      fixed: 'left',
      render: (text, record) => [
        <a
          onClick={() => {
            setCurrentRow(record);
            setShowCustomerDetail(true);
          }}
          target="_blank" rel="noopener noreferrer" key="view">
          {text}
        </a>,
      ]
    },
    {
      dataIndex: 'name',
      title: '姓名',
      fixed: 'left',
      width: 280,
      copyable: true,
      ellipsis: true,
    },
    {
      dataIndex: 'person_contact',
      title: '联系人',
      width: 80,
      ellipsis: true,
      hideInSearch:true,
    },
    {
      dataIndex: 'mobile',
      title: '手机号码',
      width: 120,
      copyable: true,
      // ellipsis: true,
    },
    {
      dataIndex: 'phone',
      title: '座机',
      copyable: true,
      width: 140,
    },
    {
      dataIndex: 'area',
      title: '省市区',
      hideInSearch: true,
      valueType: 'cascader',
      width: 160,
      request: ()=>{
        return initialState?.Address
      }
    },
    {
      dataIndex: 'address',
      title: '地址',
      width: 280,
      // copyable: true,
      ellipsis: true,
      fieldProps: {
        options: initialState?.Address,
        fieldNames: {
          children: 'children',
          label: 'label',
          value: 'value',
        },
        showSearch: true,
        changeOnSelect: true,
      },
      valueType: 'cascader',
    },
    {
      dataIndex: 'employee',
      title: '负责人',
      width: 80,
      valueType: "select",
      fieldProps: {
        options: initialState?.EmployeeData,
        fieldNames: {
          label: 'label',
          value: 'value',
        },
        showSearch: true,
      },
    },
    {
      dataIndex: 'customer_classify',
      title: '客户分类',
      width: 100,
      fieldProps: {
        options: initialState?.CustomerClassify,
        fieldNames: {
          children: 'children',
          label: 'label',
          value: 'value',
        },
        showSearch: true,
        treeNodeFilterProp: 'title',
      },
      valueType: 'treeSelect',
    },
    {
      dataIndex: 'customer_type',
      title: '客户类型',
      width: 100,
      filters: true,
      onFilter: true,
      valueEnum: {
        0: {
          text: '总门店',
          status: 'Success',
        },
        1: {
          text: '子门店',
          status: 'Default',
        },
      },
    },
    {
      dataIndex: 'ar_amount',
      title: '期初应收金额',
      width: 100,
      hideInSearch: true,
    },
    {
      dataIndex: 'ap_amount',
      title: '期初应付金额',
      width: 100,
      hideInSearch: true,
    },
    {
      dataIndex: 'note',
      title: '备注',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    // {
    //   dataIndex: 'is_stop',
    //   title: '是否停用',
    //   width: 100,
    //   filters: true,
    //   onFilter: true,
    //   valueEnum: {
    //     0: {
    //       text: '正常',
    //       status: 'Processing',
    //     },
    //     1: {
    //       text: '停用',
    //       status: 'Error',
    //     },
    //   },
    // },
    {
      dataIndex: 'create_user',
      title: '创建人',
      width: 100,
      hideInSearch: true,
    },
    {
      dataIndex: 'add_time',
      title: '创建时间',
      key: 'showTime',
      valueType: 'dateTime',
      width: 150,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: access.permissions_customer_update && access.permissions_customer_delete ? 90 : 50,
      fixed: 'right',
      hideInDescriptions: true,
      render: (text, record, _, action) => [
        <Access key={"permissions_customer_update"} accessible={access.permissions_customer_update}>
          <Button
            key="editable"
            size={'small'}
            onClick={() => {
              form?.setFieldsValue(record)
              handleModalVisible(true);
            }}
          >
            改
          </Button>
        </Access>,

        <Access key={"permissions_customer_delete"} accessible={access.permissions_customer_delete}>
          <Popconfirm
            title="确定是否删除？删除后无法恢复"
            key={'redInkWriteOff'+ record.id}
            onConfirm={function(){
              handleDeleteCustomer(record.id).then();
              action?.reload();
            }}
            // onVisibleChange={() => console.log('visible change')}
          >
            <Button
              size={'small'}
              danger={true}
              style={{marginRight:-10}}
              target="_blank" rel="noopener noreferrer" key="delete">
              删
            </Button>
          </Popconfirm>
        </Access>
      ],
    },
  ];


  return (
    <PageContainer
      title={false} header={{ title:false, breadcrumb: {} }}
    >
      <ProTable<API.Customer>
        columns={customer_columns}
        actionRef={actionRef}
        options={{ fullScreen:true }}
        size={'small'}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          type: "checkbox",
          onChange:(selectedRowKeys, selectedRows)=>{
            const data = selectedRows.map((value) => {
              return value.id
            })
            setCustomerCheckedRows(data);
          },
        }}
        request={(params) => {
          return getCustomer(params)
        }}
        rowKey="uk_customer_no"
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 20,
          showSizeChanger:true,
        }}
        search={{  labelWidth: 'auto', span:6 , defaultColsNumber:20}}
        scroll={{ x: 2000 }}
        editable={{}}
        toolbar={{
          title: '客户管理',
          tooltip: '客户信息管理',
          multipleLine: true,
        }}
        toolBarRender={() => [
          <Button
            key="show"
            type={'primary'}
            onClick={()=>{
              if (customerCheckedRows.length == 0){
                message.error("请选择需要修改的数据")
              }else{
                setModalVisit(true)
              }
            }}>
            批量修改
          </Button>,
          <Access key="permissions_customer_import" accessible={access.permissions_customer_import} >
            <Upload
              key="5"
              beforeUpload={(file) => {
                return onImportExcel(file, importCustomerExcelApi);
              }}
              onRemove={() => {}}
              showUploadList={false}
            >
              <Button key="3" icon={<UploadOutlined />}>导入</Button>
            </Upload>
          </Access>,

          <Button key="2" onClick = {() => {return onExportExcel}} icon={<ExportOutlined />}>导出</Button>,

          <Button key="1" type="primary" onClick={() => {
            handleModalVisible(true);
          }}>
            新增
          </Button>,
          <Button key="4"  onClick={() => {
            setShowDetail2(true);
          }}>
            分类管理
          </Button>,
        ]}
      />

      <DrawerForm <API.Customer>
        form={form}
        title={"新增客户"}
        width="700px"
        drawerProps={{
          destroyOnClose: true,
          onClose:()=>{
            form.resetFields?.();
            setEditCustomer(undefined);
          },
          title:(editCustomer?.id) ? "更新客户" : "新建客户",
        }}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={ async (values) => {
          try {
            const data = await changeCustomerData(values);
            // @ts-ignore
            const result  = await handleSaveCustomer(data);
            form.resetFields?.();
            if(result){
              handleModalVisible(false);
              actionRef?.current?.reload();
            }
          }catch (errors) {
            form.setFieldsValue?.(null)
            message.error("操作失败")
          }
          return true;
        }
        }
      >
        <Row gutter={12}>
          <Col span={12}>
            <ProFormText
              name="id"
              label="客户编码"
              placeholder="请输入客编码"
              hidden={true}
            />
            <ProFormText
              name="uk_customer_no"
              label="客户编号"
              placeholder="请输入客户编号"
              rules={[{required: true,message: "此项为必填项",},]}
            />
            <ProFormText
              name="person_contact"
              label="联系人"
              placeholder="请输入联系人名称"
            />
            <ProFormText
              name="mobile"
              label="手机号码"
              placeholder="请输入手机号码"
              rules={[
                {
                  min: 11,
                  max: 11,
                  message: '请检查手机号格式',
                },
                {
                  pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
                  message: '请输入正确的手机号',
                },
              ]}
            />
            <ProFormCascader
              name="area"
              label="地址"
              rules={[{required: true,message: "此项为必填项",},]}
              fieldProps={{
                allowClear:true,
              }}
              request={async ()=> {
                return initialState?.Address;
              }}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="name"
              label="客户名称"
              placeholder="请输入客户名称"
              rules={[{required: true,message: "此项为必填项",},]}
            />
            <ProFormText
              name="phone"
              label="座机"
              placeholder="请输入座机号码"
            />
            <ProFormText
              name="address"
              label="详细地址"
              placeholder="请输入详细地址"
            />
          </Col>
        </Row>
        <Divider style={{marginTop: 0}}/>
        <Row gutter={16}>
          <Col span={12}>
            <ProFormSelect
              name="employee"
              label="负责人"
              placeholder="请选择负责人"
              rules={[{required: true,message: "此项为必填项",},]}
              request={async () => {
                return initialState?.EmployeeData;
              }}
            />
            <ProFormSelect
              name="customer_type"
              label="客户类型"
              placeholder="请选择客户类型"
              valueEnum={{
                0: {
                  text: '总门店',
                },
                1: {
                  text: '子门店',
                },
              }}
            />
          </Col>
          <Col span={12}>
            <ProFormTreeSelect
              name="customer_classify"
              label="客户分类"
              placeholder="请选择客户分类"
              rules={[{required: true,message: "此项为必填项",},]}
              request={async () => {
                return initialState?.CustomerClassify;
              }}
            />
            <ProFormSwitch
              name="is_stop"
              label="是否停用"
              placeholder="请选择状态"
              fieldProps={{
                checkedChildren:"停用",
                unCheckedChildren: '正常',
              }}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              name="bank"
              label="银行"
              placeholder="请输入银行"
            />
            <ProFormText
              name="tax_no"
              label="纳税号码"
              placeholder="请输入纳税号码"
            />
          </Col>
          <Col span={12}>
            <ProFormDigit
              name="bank_account"
              label="银行账户"
              placeholder="请输入银行账户"
              fieldProps={{ precision: 0 }}
            />
          </Col>
        </Row>
        <Divider style={{marginTop: 0}}/>
        <Row gutter={16}>
          <Col span={12}>
            <ProFormMoney
              name="ar_amount"
              label="期初应收金额"
              placeholder="请输入应收金额"
              initialValue={0.00}
              fieldProps={{
                precision:2,
              }}/>
          </Col>
          <Col span={12}>
            <ProFormMoney
              name="ap_amount"
              label="期初应付金额"
              placeholder="请输入应付金额"
              initialValue={0.00}
              fieldProps={{
                precision:2,
              }}/>
          </Col>
        </Row>
        <Divider style={{marginTop: 0}}/>
        <Row gutter={16}>
          <Col span={24}>
            <ProFormTextArea
              name="note"
              label="备注"
              placeholder="请输入备注"
            />
          </Col>
        </Row>
      </DrawerForm>
      <Drawer
        width={600}
        title={"客户分类管理"}
        open={showDetail2}
        extra={true}
        onClose={() => {
          setShowDetail2(false);
        }}
        closable={true}
      >
        <CustomerClassifyTree/>
      </Drawer>
      <Drawer
        width={480}
        open={showCustomerDetail}
        title={"客户详情"}
        key={'uk_customer_no'}
        onClose={() => {
          setCurrentRow(undefined);
          setShowCustomerDetail(false);
        }}
        closable={true}
      >
        {currentRow?.uk_customer_no && (
          <ProCard
            size={'small'}
          >
            <Typography>
              <ProDescriptions<API.Customer>
                column={1}
                // title={currentRow?.name}
                request={async () => ({
                  data: currentRow || {},
                })}
                params={{
                  id: currentRow?.uk_customer_no,
                }}
                columns={customer_columns as ProDescriptionsItemProps<API.Customer>[]}
              />
            </Typography>
          </ProCard>
        )}
      </Drawer>

      <BatchCustomer
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        customerCheckedRows={customerCheckedRows}
      />


    </PageContainer>
  );
};

export default Customer;
