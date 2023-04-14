import type {ProColumns, FormInstance, ActionType} from "@ant-design/pro-components";
import { useRef, useState } from 'react';

import {useLocation} from "@umijs/max";
import {CashBankQueryAPI} from "@/services/ant-design-pro/data-center/sale/sale";
import DataDetail from "../../components/DataDetail"
import { Form, Table } from 'antd';
import { ModalForm, ProFormDateRangePicker } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { history } from '@@/core/history';

const CashBank = () => {
  //params
  let {state}: any =  useLocation();
  if (state == undefined) {
    state = {type:"query"}
  }

  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm<{ name: string; company: string }>();
  const [modalVisit, setModalVisit] = useState(false);

  const [tmpCheckRecord, setTmpCheckRecord] = useState<any>();

  const NewJumpPath = async (value: any) => {
    setModalVisit(false)
    const tmp = {
      as_no: tmpCheckRecord.no,
      startTime: value.dateRange[0],
      endTime: value.dateRange[1],
    }
    await history.push('/data_center/financial_data/cash_bank_detail', tmp)
    return true
  }

  //合计列设置
  const onSummary = (viewData: any) => {
    const data = ( viewData ).reduce((total: any, currentValue: any) => {
        return {
          this_month_total_amount:total.this_month_total_amount + (currentValue?.this_month_total || 0),
          actual_amount_total: total.actual_amount_total + (currentValue?.actual_amount || 0),
        };
      },
      {this_month_total_amount:0, actual_amount_total:0,},
    );
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={1} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={1} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={2}>{data.this_month_total_amount}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{data.actual_amount_total.toFixed(2)}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  const product_purchase_columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 40,
      hideInSearch: true,
    },
    {
      title: "科目编号",
      dataIndex: "no",
      ellipsis: true,
      width: 40,
      hideInSearch: true,
    },
    {
      title: "科目名称",
      dataIndex: "as_name",
      ellipsis: true,
      width: 140,
      hideInSearch: true,
    },
    {
      title: "本月发生额",
      dataIndex: "this_month_total",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 80,
    },
    {
      title: "累计金额",
      dataIndex: "actual_amount",
      valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 80,
    },
  ]

  return (
    <>
      <DataDetail
        columns={product_purchase_columns}
        onSummary={onSummary}
        requests={CashBankQueryAPI}
        query={state}
        actionRef={actionRef}
        formRef={formRef}
        title={"现金银行"}
        search={false}
        width={'auto'}
        setModalVisit={setModalVisit}
        setTmpCheckRecord={setTmpCheckRecord}
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

export default CashBank;
