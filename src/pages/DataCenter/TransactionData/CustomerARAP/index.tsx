import DataTable from "../../components/DataTable";
// @ts-ignore
import {useModel} from "@umijs/max";
import type {ProColumns, FormInstance} from "@ant-design/pro-components";
import {ModalForm, ProFormDateRangePicker, ProFormRadio} from "@ant-design/pro-components";
import {useRef, useState} from "react";
import {
  CustomerARAPQueryAPI,
} from "@/services/ant-design-pro/data-center/sale/sale";
import dayjs from 'dayjs';
import {Table, Form} from "antd";
import {history} from "@@/core/history";
import SelectCustomer from "@/pages/BusinessCenter/order/SelectCustomer/SelectCustomer";

const CustomerARAPQueryHandler = () => {
  const { initialState } = useModel('@@initialState');
  //客户model
  const [createCustomerModalVisible, handleCustomerModalVisible] = useState<boolean>(false);

  const formRef = useRef<FormInstance>();

  const [form] = Form.useForm<{ name: string; company: string }>();
  const [modalVisit, setModalVisit] = useState(false);

  const [tmpCheckRecord, setTmpCheckRecord] = useState<any>();

  const JumpPath = (record: any) => {
    setModalVisit(true);
    setTmpCheckRecord(record);
  }

  const NewJumpPath = async (value: any) => {
    setModalVisit(false)

    const tmp = {
      customer_id: tmpCheckRecord.customer_id,
      startTime: value.dateRange[0],
      endTime: value.dateRange[1],
      check_list: value.check_list,
    }
    await history.push('/data_center/transaction_data/customer_arap_detail', tmp)
    return true
  }


  //合计列设置
  const onSummary = (viewData: any) => {
    const data = ( viewData ).reduce((total: any, currentValue: any) => {
        return {
          arTotal:total.arTotal + (currentValue?.ar || 0),
          apTotal: total.apTotal + (currentValue?.ap || 0),
        };
      },
      {arTotal:0, apTotal:0},
    );

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={1} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={2}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{data.arTotal.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{data.apTotal.toFixed(2)}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  const product_purchase_columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 30,
      hideInSearch: true,
    },
    {
      title: "编号",
      dataIndex: "no",
      width: 80,
      hideInSearch: true,
    },
    {
      title: "名称",
      dataIndex: "name",
      width: 220,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: "应收余额",
      dataIndex: "ar",
      sorter: true,
      width: 80,
      hideInSearch: true,
    },
    {
      title: "应付余额",
      dataIndex: "ap",
      // valueType: 'digit',
      sorter: true,
      hideInSearch: true,
      fieldProps: {
        precision:2,
      },
      width: 80,
    },
    {
      title: "单位名称",
      dataIndex: 'customer_name',
      valueType: "select",
      fieldProps: {
        allowClear: false,
        showArrow:false,
        open:false,
        onClick: ()=>{
          handleCustomerModalVisible(true);
        },
      },
      hideInTable:true,
    },
  ]

  return (
    <>
      <DataTable
        columns={product_purchase_columns}
        treeData={initialState?.CustomerClassify}
        tableData={CustomerARAPQueryAPI}
        formRef={formRef}
        onSummary={onSummary}
        JumpPath={JumpPath}
      />
      <SelectCustomer
        createCustomerModalVisible={createCustomerModalVisible}
        handleCustomerModalVisible={handleCustomerModalVisible}
        formRef={formRef}
        type={"query"}
      />

      <ModalForm
        title="条件选择"
        form={form}
        autoFocusFirstInput
        onFinish={async (values) => {
          await NewJumpPath(values)
        }}
        open={modalVisit}
        onOpenChange={setModalVisit}
        width={500}
      >
        <ProFormRadio.Group
          name="check_list"
          label="列表选择"
          rules={[{ required: true, message: '必须选择一项' }]}
          options={[
            {
              label: '应收款明细',
              value: 1,
            },
            {
              label: '应付款明细',
              value: 2,
            },
          ]}
        />
        <ProFormDateRangePicker
          name="dateRange"
          label="选择时间"
          initialValue={[dayjs().subtract(1, "months"), dayjs()]}
          rules={[{ required: true, message: '时间不能为空' }]}
          fieldProps={{
            allowClear:false,
            ranges:{
              "今天": [dayjs(), dayjs()],
              '本月': [dayjs().startOf('month'), dayjs().endOf('month')],
              '最近30天': [dayjs().subtract(1, "months"), dayjs()],
            }
          }}
        />
      </ModalForm>
    </>
  )
}

export default CustomerARAPQueryHandler;
