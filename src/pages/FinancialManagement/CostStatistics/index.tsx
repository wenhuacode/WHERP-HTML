import type {ProColumns} from '@ant-design/pro-components';
import { ProCard } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
// import {  Button } from 'antd';
import React, {useEffect, useState} from 'react';
// @ts-ignore
import styles from './split.less';
import {getCostStatistics} from "@/services/ant-design-pro/accounting_subject";
import {GetSubsidiaryLedgerCashBank} from "@/services/ant-design-pro/subsidiary_ledger";
import {ProFormDateRangePicker, ModalForm} from "@ant-design/pro-components";
import {PageContainer} from "@ant-design/pro-components";
import {Table} from "antd";
import moment from "moment";
import dayjs from 'dayjs';

type SubsidiaryLedger = {
  id?: number;
  order_type?: string;
  date?: string;
  order_no?: string;
  employee_id?: number;
  employee?: string;
  as_id?: number;
  as_name?: string;
  add_amount?: number;
  sub_amount?: number
  note?: string;
  create_user_id?: number;
  create_user?: string;
};

type SubsidiaryLedgerProps = {
  id: number;
  dateRange: object;
};

const SubsidiaryLedgerlList: React.FC<SubsidiaryLedgerProps> = (props) => {
  const { id, dateRange } = props;
  const [beforeBalance, setBeforeBalance] = useState<any>();

  //合计列设置
  const onSummary = (currentData: any) => {
    const data = (currentData as API.SubsidiaryLedger[]).reduce((total: any, currentValue, ) => {
        return {
          add_amount:total.add_amount + parseFloat((currentValue?.add_amount || 0).toString()),
          sub_amount: total.sub_amount + parseFloat((currentValue?.sub_amount || 0).toString()),
        };
      },
      {add_amount:0, sub_amount:0,},
    );
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={1}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={2}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>{data.add_amount.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={6}>{data.sub_amount.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={7}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>{null}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  const subsidiary_ledger_columns: ProColumns<SubsidiaryLedger>[] = [
    {
      title: '排序',
      valueType: 'index',
      width: 48,
    },
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: '单据类型',
      // key: 'id',
      dataIndex: 'order_type',
      width: 102,
      hideInSearch: true,
    },
    {
      title: '单据编号',
      // key: 'id',
      dataIndex: 'order_no',
      hideInSearch: true,
    },
    {
      title: '科目名称',
      // key: 'id',
      dataIndex: 'as_name',
      hideInSearch: true,
    },
    {
      title: '日期',
      // key: 'id',
      dataIndex: 'date',
      valueType: 'date',
      width: 108,
    },
    {
      title: '增加金额',
      // key: 'id',
      dataIndex: 'add_amount',
      width: 88,
      hideInSearch: true,
    },
    {
      title: '减少金额',
      // key: 'id',
      dataIndex: 'sub_amount',
      width: 88,
      hideInSearch: true,
    },
    {
      title: '余额',
      // key: 'id',
      dataIndex: 'total',
      width: 88,
      hideInSearch: true,
    },
    {
      title: '创建人',
      // key: 'id',
      dataIndex: 'create_user',
      width: 78,
      hideInSearch: true,
    },
  ];

  return (
    <ProTable<SubsidiaryLedger>
      headerTitle={"明细查询"}
      columns={subsidiary_ledger_columns}
      size={'small'}
      rowKey="id"
      request={async (params) => {
        if (id != 0) {
          const result = await GetSubsidiaryLedgerCashBank(params)
          await setBeforeBalance(result.before_balance);
          return result
        }
      }}
      params={{
        id, ...dateRange,
      }}
      bordered={true}
      search={false}
      toolbar={{
        subTitle: `此前余额: ${beforeBalance ? beforeBalance : '0'}`,
        tooltip: "此前余额未添加期初金额",
      }}
      summary={(currentData) => onSummary(currentData)}
    />
  );
};



export type AccountingSubject = {
  id?: number;
  as_no?: string;
  name?: string;
  parent_id?: number;
  initial_balance?: number;
  actual_amount?: number;
};

type AccountingSubjectProps = {
  id: number;
  onChange: (id: number, dateRange: object) => void;
  defaultExpanded: [number];
};

const AccountingSubjectList: React.FC<AccountingSubjectProps> = (props) => {
  const { onChange, id,  defaultExpanded} = props;

  const [createDetailModalVisible, handleDetailModalVisible] = useState<boolean>(false);
  const [chenkedRowData, setChenkedRowData] = useState<any>();

  const columns: ProColumns<AccountingSubject>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: '科目名称',
      key: 'name',
      dataIndex: 'name',
      width: 220,
    },
    // {
    //   title: '期初',
    //   key: 'initial_balance',
    //   dataIndex: 'initial_balance',
    //   width: 80,
    //   // hideInTable: true,
    // },
    {
      title: '余额',
      key: 'actual_amount',
      tooltip: '计算公式: 期初+(增加-减少)',
      dataIndex: 'actual_amount',
      width: 80,
    },
  ];

  return (
    <>
    <ProTable<AccountingSubject>
      headerTitle={"费用统计"}
      tooltip={'双击科目查询明细'}
      columns={columns}
      request={() => {
        return getCostStatistics();
      }}
      size={'small'}
      rowKey="id"
      rowClassName={(record) => {
        return record.id === id ? styles['split-row-select-active'] : '';
      }}
      bordered={true}
      // options={false}
      pagination={false}
      search={false}
      expandable={{
        defaultExpandedRowKeys:defaultExpanded,
        expandRowByClick:true,
        // expandIcon: ({ expanded, onExpand, record }) => (</>),
      }}
      // scroll={{ y: 1080 }}
      onRow={(record) => {
        return {
          onDoubleClick: () => {
            handleDetailModalVisible(true);
            if (record.id) {
              setChenkedRowData(record)
            }
          },
        };
      }}
    />
    <ModalForm
      title={'查询明细'}
      visible={createDetailModalVisible}
      onVisibleChange={handleDetailModalVisible}
      width={400}
      onFinish={async ({dateRange}) => {
        const DataRange = {
          startDate: dateRange?.[0],
          endDate: dateRange?.[1],
        }
        await onChange(chenkedRowData.id, DataRange);
        return true;
      }}
    >
      <ProFormDateRangePicker
        name="dateRange"
        rules={[{required:true}]}
        label={'选择时间范围'}
        fieldProps={{
          ranges: {
            "今天": [dayjs(), dayjs()],
            '本月': [dayjs().startOf('month'), dayjs().endOf('month')],
          },
        }}
      />
    </ModalForm>
    </>
  );
};


const CostStatistics: React.FC = () => {
  const [id, setID] = useState(0);
  const [defaultExpanded, setDefaultExpanded] = useState<any>();
  const [dateRange, setDateRange] = useState<object>({});

  const getNewExpandedKeys = () => {
    const newExpandedKeys: any = [];
    getCostStatistics().then(value => {
      const data = value.data;
      const render = (datas: any) => {
        datas.map((item: any) => {
          if (item.children) {
            newExpandedKeys.push(item.id)
            render(item.children)
          }
        })
        return newExpandedKeys;
      }
      // @ts-ignore
      setDefaultExpanded(render(data))
    });
  };

  useEffect(() => {
    getNewExpandedKeys();
  }, [])

  return (
    <PageContainer>
      <ProCard split="vertical" size={'small'}>
        <ProCard
          colSpan="27%"
          size={'small'}
          loading={defaultExpanded}
        >
          <AccountingSubjectList
            onChange={(cId, DateR) => {setID(cId);  setDateRange(DateR);}}
            id={id}
            defaultExpanded={defaultExpanded}/>
        </ProCard>
        <ProCard colSpan="73%" size={'small'}  >
          <SubsidiaryLedgerlList
            id={id}
            dateRange={dateRange}/>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default CostStatistics;
