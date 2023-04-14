import React from "react";
import {PageContainer} from "@ant-design/pro-components";
import { ProTable} from "@ant-design/pro-components";
import type {ProColumns} from "@ant-design/pro-components"
import {GetSubsidiaryLedger} from "@/services/ant-design-pro/subsidiary_ledger";

const SubsidiaryLedger: React.FC = () => {

  const SubsidiaryLedgerColumns: ProColumns<API.SubsidiaryLedger>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      title: '序号',
      key: 'index',
      hideInSearch: true,
      fixed: 'left',
      width: 48
    },
    {
      dataIndex: 'order_type',
      title: "单据类型",
      width: 98,
    },
    {
      dataIndex: 'date',
      title: "日期",
      width: 98,
      valueType: 'date',
      hideInSearch: true,
    },
    {
      dataIndex: 'order_no',
      title: "订单编号",
      width: 188,
    },
    {
      dataIndex: 'customer',
      title: "单位名称",
      width: 188,
    },
    {
      dataIndex: 'employee',
      title: "经手人",
      width: 98,
    },
    {
      dataIndex: 'as_name',
      title: "科目名称",
      width: 148,
    },
    {
      dataIndex: 'add_amount',
      title: "增加金额",
      width: 98,
      hideInSearch: true,
    },
    {
      dataIndex: 'sub_amount',
      title: "减少金额",
      width: 98,
      hideInSearch: true,
    },
    {
      dataIndex: 'total',
      title: "累计金额",
      width: 98,
      hideInSearch: true,
    },
    {
      dataIndex: 'note',
      title: "备注",
      width: 98,
    },
    {
      dataIndex: 'create_user',
      title: "创建人",
      width: 98,
      hideInSearch: true,
    },
    {
      dataIndex: 'add_time',
      title: "创建时间",
      width: 140,
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ]

  return (
    <PageContainer>
        <ProTable<API.SubsidiaryLedger>
          columns={SubsidiaryLedgerColumns}
          size={"small"}
          rowKey={'id'}
          // scroll={{ y: 1080 }}
          search={{  labelWidth: 'auto', span: 6, defaultCollapsed: false, defaultColsNumber:20 }}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
            showSizeChanger:true,
          }}
          request={async () => {
            return GetSubsidiaryLedger()
          }}
          toolbar={{
            title: '往来明细',
            // subTitle: '这里是子标题',
            tooltip: '往来明细管理',
            multipleLine: true,
          }}
        />
    </PageContainer>
  )
}

export default SubsidiaryLedger;
