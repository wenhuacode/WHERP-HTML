import React, {useState} from "react";
import type {ProColumns} from "@ant-design/pro-components";
import {ProTable} from "@ant-design/pro-components";
import {queryCustomer} from "@/services/ant-design-pro/customer";
import {message, Modal, Table, ConfigProvider} from "antd";
import themeConfig from "../../../../utils/tableThemeConfig"

const SelectCustomer: React.FC<any>= (props: any) => {
  const {createCustomerModalVisible, handleCustomerModalVisible, formRef, type} = props
  const [customerCheckedRows, setCustomerCheckedRows] = useState<any>([]);
  const [selectTreeKeys, setSelectTreeKeys] = useState<any>([1]);

  const handleCustomerOk = () => {
    if (customerCheckedRows.length > 0 && type === "detail") {
      //设置省市区初始值
      let area: any[] = []
      if (customerCheckedRows[0].province_id == null
        || customerCheckedRows[0].city_id == null || customerCheckedRows[0].district_id == null){
        area = []
      }else{
        area = [customerCheckedRows[0].province_id, customerCheckedRows[0].city_id, customerCheckedRows[0].district_id]
      }

      if (customerCheckedRows[0].customer_id != null) {
        formRef.current?.setFieldsValue?.({
          contact_person: customerCheckedRows[0].person_contact,
          phone_number: customerCheckedRows[0].mobile,
          customer_name: customerCheckedRows[0].customer_name,
          customer_id: customerCheckedRows[0].customer_id,
          area:area,
          address: customerCheckedRows[0].address,
        })
      }else{
        message.error("请选择单个基础资料，不要选择分类")
        return
      }
    }
    if (customerCheckedRows.length > 0 && type === "query") {
      if (customerCheckedRows[0].customer_classify_id != null) {
        formRef.current?.setFieldValue("customer_name", [customerCheckedRows[0].customer_name,
          {"customer_classify_id":customerCheckedRows[0].parent_path, "type":'customer_classify'}])
      }
      else if (customerCheckedRows[0].customer_id != null) {
        formRef.current?.setFieldValue("customer_name", [customerCheckedRows[0].customer_name,
          {"customer_id":customerCheckedRows[0].customer_id, "type":'customer'}])
      }

    }
    setCustomerCheckedRows([]);
    handleCustomerModalVisible(false);
    setSelectTreeKeys([1]);
  };

  const customer_columns: ProColumns<API.Customer>[]= [
    {
      title: '单位编号',
      dataIndex: 'customer_no',
      width: 60,
    },
    {
      title: '单位名称',
      dataIndex: 'customer_name',
      ellipsis: true,
      width: 200,
    },
    {
      title: '应收',
      dataIndex: 'ar_amount',
      width: 40,
      hideInSearch: true,
    },
    {
      title: '应付',
      dataIndex: 'ap_amount',
      width: 40,
      hideInSearch: true,
    },
    // {
    //   title: '分类',
    //   // hideInTable: true,
    //   dataIndex: 'customer_classify',
    //   valueType: 'treeSelect',
    //   fieldProps: {
    //     options: initialState?.CustomerClassify,
    //   },
    //   width: 60,
    // },
  ];

  return (
    <ConfigProvider theme={themeConfig}>
    <Modal
      title={'选择客户'}
      open={createCustomerModalVisible}
      maskClosable={true}
      destroyOnClose={true}
      width={960}
      onOk={handleCustomerOk}
      onCancel={()=>{
        handleCustomerModalVisible(false);
        setCustomerCheckedRows(null);
        setSelectTreeKeys([1]);
      }}
    >
      <ProTable
        search={{span:8, labelWidth:80,defaultCollapsed:false, defaultColsNumber:20}}
        size={'small'}
        options={false}
        rowKey="customer_no"
        columns={customer_columns}
        scroll={{y: 600}}
        params={{
          "node_id": selectTreeKeys,
        }}
        request={(params, sort) => {
          const value = {params: params, sort:sort}
          return queryCustomer(value)
        }}
        pagination={false}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          type: "radio",
          onChange:(selectedRowKeys, selectedRows)=>{
            setCustomerCheckedRows(selectedRows);
          },
        }}
        onRow={(record)=>{
          return {onDoubleClick: () => {
              if(record.customer_classify_id != null) {
                setSelectTreeKeys([record.customer_classify_id]);
                setCustomerCheckedRows([]);
              }
            }}
        }}
      />
    </Modal>
    </ConfigProvider>
  )
}

export default SelectCustomer;
