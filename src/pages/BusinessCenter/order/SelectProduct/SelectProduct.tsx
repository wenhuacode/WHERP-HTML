import React, {useEffect, useState} from "react";
import {Modal, Table} from "antd";
import type {ProColumns} from "@ant-design/pro-components";
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {getProduct} from "@/services/ant-design-pro/product";
// @ts-ignore
import {useModel} from "@@/plugin-model";

export const SelectSaleProduct: React.FC<any>= (props: any) => {
  const {productModelOpen, setProductModelOpen, handleOk, formRef,
    tableTotalHandler, orderType, productChecked, setProductCheckedRows,
    selectTreeKeys, setSelectTreeKeys, type} = props

  const { initialState } = useModel('@@initialState');

  const [storehouse, setStorehouse] = useState<any>();

  const fetchStoreHouse = ()=>{
    //采购单无库存
    if (orderType == 3){
      return
    }
    const data = formRef?.current?.getFieldValue('storehouse_id')
    setStorehouse(data)
  }

  useEffect(() => {
    fetchStoreHouse()
  },[productModelOpen])

  const product_columns: ProColumns<API.Product>[] = [
    {
      title: '产品编码',
      dataIndex: 'product_no',
      // hideInTable: true,
      // hideInSearch: true,
      width: 88,
    },
    {
      title: '产品条码',
      dataIndex: 'barcode',
      hideInTable: true,
      // hideInSearch: true,
      width: 88,
    },
    {
      title: '产品名称',
      dataIndex: 'product_name',
      ellipsis: true,
      width: 240,
    },
    {
      title: '数量',
      dataIndex: 'qty',
      width: type == "query" ? 0 : 60,
      hideInTable: type == "query",
      hideInSearch: true,
    },
    {
      title: '成本单价',
      dataIndex: 'cost_price',
      width: orderType != 1 ? 0 : 60,
      hideInTable: orderType != 10,
      hideInSearch: true,
    },
    {
      title: '仓库',
      dataIndex: 'storehouse_id',
      readonly: true,
      valueType: 'select',
      hideInSearch: !storehouse,
      hideInTable: true,
      initialValue:storehouse,
      request: async ()=>{
        return initialState?.Storehouse
      },
      ellipsis: true,
      width: 240,
    },
  ];

  return (
      <Modal
        title="选择产品"
        open={productModelOpen}
        maskClosable={true}
        width={960}
        destroyOnClose={true}
        onOk={handleOk}
        onCancel={()=>{
          setProductModelOpen(false);
          setSelectTreeKeys([1]);
        }}
        afterClose={async ()=>{
          //处理合计
          if (type == "edit"){
            await tableTotalHandler()
          }
        }}
      >
        <ProTable
          search={{span:8, labelWidth:80,defaultCollapsed:false, defaultColsNumber:20}}
          size={'small'}

          options={false}
          rowKey={"product_no"}
          scroll={{y: 400}}
          columns={product_columns}
          params={{
            "node_id": selectTreeKeys,
          }}
          request={(params: any, sort) => {
            const value = {params: params, sort:sort}
            return getProduct(value)
          }}
          pagination={false}
          rowSelection={{
            // 注释该行则默认不显示下拉选项
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            type:(productChecked == true) ? "checkbox" : "radio",
            onChange:(selectedRowKeys, selectedRows)=>{
              setProductCheckedRows(selectedRows);
            },
          }}
          onRow={(record)=>{
            return {onDoubleClick: () => {
                if(record.product_classify_id != null) {
                  setSelectTreeKeys([record.product_classify_id]);
                  setProductCheckedRows([]);
                }
              }}
          }}
        />
      </Modal>
  )
}

export default {SelectSaleProduct};
