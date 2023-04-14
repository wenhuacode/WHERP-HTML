import {Button, message, Form, Popconfirm} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
// import type { ColumnsState } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import {getUsers} from "@/services/ant-design-pro/user";
import {
  CreateStorehouseManagement,
  DeleteStorehouseManagement,
  getStorehouseManagement,
  UpdateStorehouseManagement} from  "@/services/ant-design-pro/storehouse_management";


const StorehouseManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [EmployeeDate, setEmployeeDate] = useState<API.CustomerManager[]>()
  const[editCustomer, setEditCustomer] = useState<API.StorehouseManagement>()
  const [form] = Form.useForm();


  const handleSaveStorehouse: (storehouse: any) => Promise<boolean> = async (storehouse) => {
    const hide = message.loading(`正在${storehouse.id ? '修改' : '创建'}供应商....`);
    // 修改参数
    storehouse.employee = storehouse?.employee_id?.label;
    storehouse.employee_id = storehouse?.employee_id?.value;

    const resp = storehouse.id ? await UpdateStorehouseManagement(storehouse.id ,storehouse)
      : await CreateStorehouseManagement(storehouse);
    hide();
    if (resp && resp.success) {
      message.success('操作成功!');
      return true;
    }
    message.error('操作失败!');
    return false;
  };

  const handleDeleteSupplier: (id: number) => Promise<boolean> = async (id) => {
    const hide = message.loading('正在删除仓库....');
    const resp = await DeleteStorehouseManagement(id);

    hide();
    if (resp && resp.success) {
      message.success('仓库删除成功!');
      return true;
    }

    message.error('仓库删除失败!');
    return false;
  };


  //获取负责人信息
  const fetchEmployeeData = async () => {
    const result = await getUsers();
    const UsersDataItem: (u: API.User) => API.CustomerManager =(u: API.User) => {
      const item: API.CustomerManager = {
        label: u.name,
        value: u.id,
      };
      return item;
    }
    if(result?.success) {
      const employeeManger =  result.data.map(UsersDataItem)
      setEmployeeDate(employeeManger)
    }
  }

  useEffect(() => {
    fetchEmployeeData().then().catch();
  },[])

  const columns: ProColumns<API.StorehouseManagement>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      title: '序号',
      hideInSearch: true,
      fixed: 'left',
    },
    {
      dataIndex: 'storehouse_no',
      title: '仓库编号',
      width: 60,
      fixed: 'left',
    },
    {
      dataIndex: 'storehouse_name',
      title: '仓库名称',
      fixed: 'left',
      width: 80,
      ellipsis: true,
    },
    {
      dataIndex: 'employee_id',
      title: '负责人',
      width: 80,
      key: 'employee_id',
      valueType: "select",
      fieldProps: {
        options: EmployeeDate,
        fieldNames: {
          label: 'label',
          value: 'value',
        },
      },
    },
    {
      dataIndex: 'is_stop',
      title: '是否停用',
      width: 100,
      filters: true,
      onFilter: true,
      valueEnum: {
        0: {
          text: '正常',
          status: 'Processing',
        },
        1: {
          text: '停用',
          status: 'Error',
        },
      },
    },
    {
      dataIndex: 'note',
      title: '备注',
      width: 80,
    },
    {
      dataIndex: 'jst_storehouse_no',
      title: '聚水潭编码',
      width: 120,
    },
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
    // {
    //   dataIndex: 'modified_name',
    //   title: '修改人',
    //   width: 100,
    //   ellipsis: true,
    // },
    {
      dataIndex: 'modified',
      title: '修改时间',
      valueType: 'dateTime',
      width: 150,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 60,
      fixed: 'right',
      hideInDescriptions: true,
      render: (text, record, _, action) => [
        <Button
          key="editable"
          size={'small'}
          style={{marginRight:-10}}
          onClick={() => {
            handleModalVisible(true);
            form.setFieldsValue(record);
            form.setFieldsValue({employee_id:{label: record?.employee, value: record?.employee_id}});
            setEditCustomer(record)
          }}
        >
          改
        </Button>,
        <Popconfirm
          title="确定是否推送？"
          key={'pushConfirm'+ record.id}
          onConfirm={function(){
            handleDeleteSupplier(record.id).then();
            action?.reload();
          }}
          // onVisibleChange={() => console.log('visible change')}
        >
          <Button
            size={'small'}
            danger={true}
            style={{marginRight:-10}}
            onSelect={() => action?.reload()}
            target="_blank" rel="noopener noreferrer" key="delete">
            删
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer
      extra={[
        <Button key="add" type="primary" onClick={() => {
          handleModalVisible(true);
        }}>
          新增
        </Button>,
      ]}
    >
      <ProTable<API.StorehouseManagement>
        columns={columns}
        actionRef={actionRef}
        size={'small'}
        options={{ fullScreen:true }}
        request={(params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          return getStorehouseManagement(params)
        }}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          showSizeChanger:true,
        }}
        scroll={{ x: 1400 }}
        search={{  labelWidth: 'auto', span:6 }}
        editable={{}}
        // headerTitle="受控模式"
        toolbar={{
          title: '客户管理',
          // subTitle: '这里是子标题',
          tooltip: '客户信息管理',
          multipleLine: true,
        }}

      />
      <DrawerForm
        form={form}
        title={"新增仓库"}
        width="700px"
        key={'save_supplier'}
        drawerProps={{
          onClose:()=>{
            form.resetFields();
            setEditCustomer(null);
          },
          destroyOnClose:true,
          title:(editCustomer?.id) ? "更新仓库" : "新建仓库",
        }}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={ async (values) => {
          try {
            const result  = await handleSaveStorehouse(values);
            if(result){
              handleModalVisible(false);
              if (actionRef.current) {
                form.resetFields();
                actionRef.current.reload();
              }
            }
          }catch (errors) {
            message.error("操作失败")
          }
          return true;
        }
        }
      >
        <ProFormText
          name="id"
          label="仓库ID"
          hidden={true}
        />
        <ProFormText
          name="storehouse_no"
          disabled={!!editCustomer}
          label="仓库编号"
          placeholder="请输入仓库编号"
          rules={[{required: true, message: "此项为必填项",},]}
        />
        <ProFormText
          name="storehouse_name"
          label="仓库名称"
          placeholder="请输入仓库名称"
          rules={[{required: true, message: "此项为必填项",},]}
        />
        <ProFormSelect
          name="employee_id"
          label="负责人"
          placeholder="请选择负责人"
          fieldProps={{labelInValue:true}}
          request={async () => {
            return EmployeeDate;
          }}
        />
        <ProFormSelect
          name="is_stop"
          label="状态"
          placeholder="请选择状态"
          rules={[{required: true, message: "此项为必填项",},]}
          valueEnum={{
            0: {
              text: '正常',
              status: 'Success',
            },
            1: {
              text: '停用',
              status: 'Error',
            },
          }}
        />
        <ProFormTextArea
          name="note"
          label="备注"
          placeholder="请输入备注"
        />
        <ProFormText
          name="jst_storehouse_no"
          tooltip={'和聚水潭订单和库存都有关联，不要随便改'}
          label="聚水潭仓库编号"
          placeholder="请输入聚水潭仓库编号"
        />
      </DrawerForm>


    </PageContainer>
  );
};

export default StorehouseManagement;
