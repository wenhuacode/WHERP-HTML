import {PageContainer} from "@ant-design/pro-components";
import {ProTable, ProCard} from "@ant-design/pro-components";
import type {ActionType, ProColumns} from "@ant-design/pro-components";
import {ModalForm, ProForm, ProFormText, ProFormSelect, ProFormDigit} from "@ant-design/pro-components";
import {
  createAccountingSubject,
  getAccountingSubject,
  updateAccountingSubject
} from "@/services/ant-design-pro/finance";
import {Button, Form, message, Space} from "antd";
import {EditOutlined, FileAddOutlined} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";


const handleSaveAccountingSubject: (subject: API.AccountingSubject) => Promise<boolean> = async (subject) => {
  const hide = message.loading(`正在${subject.id ? '修改' : '创建'}菜单....`);
  const resp = subject.id ? await updateAccountingSubject(subject) : await createAccountingSubject(subject);
  hide();

  if (resp && resp.success) {
    message.success('科目添加成功!');
    return true;
  }

  message.error('科目添加失败!');
  return false;
};


const AccountingSubject: React.FC = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();

  const [defaultExpanded, setDefaultExpanded] = useState<[number]>()

  const getNewExpandedKeys = () => {
    const newExpandedKeys: any = [];

    getAccountingSubject().then(value => {
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

  if (defaultExpanded == null) {
    return <>loading</>
  }


  const accounting_subject: ProColumns<API.AccountingSubject>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      title: '序号',
      key: 'index',
      hideInSearch: true,
      fixed: 'left',
    },
    {
      dataIndex: 'as_no',
      key: 'as_no',
      title: "科目编号",
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: "科目名称",
    },
    {
      dataIndex: 'level',
      key: 'level',
      title: "层级",
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: "是否停用",
      valueEnum:{
        '1':{text: '启用', status:'success'},
        '0':{text: '停用', status:'error'}}
    },
    {
      dataIndex: 'order_num',
      key: 'order_num',
      title: "优先级",
    },
    {
      dataIndex: 'initial_balance',
      key: 'initial_balance',
      title: "期初金额",
    },
    {
      dataIndex: 'option',
      key: 'option',
      title: "操作",
      render: (text, record: any, ) => [
          <Space key={record.id}>
            <Button
              key={`as-add-${record.id}`}
              icon={<FileAddOutlined />}
              onClick={()=>{
                form.setFieldsValue?.({
                  'parent_id': record.id,
                  'level': record.level+1
                })
                setModalVisit(true);
              }}
            />
            <Button
              key={`as-edit-${record.id}`}
              icon={<EditOutlined />}
              onClick={()=>{
                form.setFieldsValue(record);
                setModalVisit(true);
              }}
            />
          </Space>
      ]
    },
  ]

  return(
    <PageContainer
      title={false} header={{ title:false, breadcrumb: {} }}
    >
      <ProCard
        size={'small'}
      >
        <ProTable<API.AccountingSubject>
          size={"small"}
          columns={accounting_subject}
          request={(params) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            return getAccountingSubject(params)
          }}
          actionRef={tableRef}
          expandable={{defaultExpandedRowKeys:defaultExpanded, expandRowByClick:true, }}
          rowKey="id"
          search={false}
          toolbar={{
            title: '科目管理',
            // subTitle: '这里是子标题',
            tooltip: '科目管理',
            multipleLine: true,
          }}
        />
      </ProCard>
      <ModalForm
        form={form}
        title="新建科目"
        width={600}
        modalProps={{destroyOnClose:true, forceRender:true, onCancel:()=>{form.resetFields()}}}
        visible={modalVisit}
        onVisibleChange={setModalVisit}
        onFinish={async (values) => {
            values.initial_balance = values.initial_balance.toString();
            const result = await handleSaveAccountingSubject(values);
            if (result) {
              form.resetFields()
              tableRef.current?.reload();
              return true;
            }
            // if (tableRef.current) {
            //   await tableRef.current.reload();
            // }
          }
        }
      >
        <ProForm.Group>
          <ProFormText
            width="sm"
            name="id"
            hidden
          />
          <ProFormText
            width="sm"
            name="as_no"
            label="科目编号"
            rules={[{required:true}]}
            placeholder="请输入科目编号"
          />
          <ProFormText
            width="sm"
            name="name"
            label="科目名称"
            rules={[{required:true}]}
            placeholder="请输入科目名称"
          />
          <ProFormText
            width="sm"
            name="parent_id"
            label="父级目录id"
            disabled={true}
          />
          <ProFormText
            width="sm"
            name="level"
            label="层级"
            disabled={true}
          />
          <ProFormSelect
            width="sm"
            name="status"
            label="是否启用"
            rules={[{required:true}]}
            placeholder="请输入科目名称"
            initialValue={'1'}
            // valueEnum={
            //   {1:{text: '启用'}, 0:{text: '停用'}}
            // }
            options={[
              {value: '1', label: '启用'}, {value: '0', label: '停用'},
            ]}
          />
          <ProFormDigit
            width="sm"
            name="order_num"
            label="优先级"
            rules={[{required:true}]}
            placeholder="请输入优先级"
            min={1}
            fieldProps={{ precision: 0,}}
          />
          <ProFormDigit
            width="sm"
            name="initial_balance"
            label="期初金额"
            initialValue={0}
            rules={[{required:true}]}
            placeholder="请输入期初金额"
            fieldProps={{
              precision: 2,
            }}
          />
        </ProForm.Group>

      </ModalForm>
    </PageContainer>

  )
};
export default AccountingSubject;

