import React, {useState} from "react";
import {ModalForm, ProFormSelect, ProFormTreeSelect} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {Form, message} from "antd";
import {BatchUpdateCustomer} from "@/services/ant-design-pro/customer";
import {BatchUpdateProduct} from "@/services/ant-design-pro/product";

export const BatchCustomer: React.FC<any> = (props: any) => {
  const {modalVisit, setModalVisit, customerCheckedRows} = props;

  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [formCheckedValue, setFormCheckedValue] = useState(null);

  const BatchUpdateCustomerEdit = async (data: any) => {
    const hide = message.loading('正在修改客户信息....');
    const resp = await BatchUpdateCustomer(data);

    hide();

    setFormCheckedValue(null);

    if (resp && resp.success) {
      message.success('客户信息修改成功!');
      return true;
    }
    message.error('客户信息修改失败!');
    return false;
  }

  return (
    <>
      <ModalForm
        title="条件选择"
        form={form}
        autoFocusFirstInput
        onFinish={async (values) => {
          const data = {
            classify: values.customer_name,
            customer_ids: customerCheckedRows,
          }
          if (values.edit_class == 1) {
            await BatchUpdateCustomerEdit(data)
          }
        }}
        open={modalVisit}
        onOpenChange={setModalVisit}
        modalProps={{
          destroyOnClose: true,
          onCancel: ()=>setFormCheckedValue(null)
        }}
        width={500}
      >
        <ProFormSelect
          label={"选择修改项"}
          // initialValue={1}
          allowClear={false}
          name={'edit_class'}
          options={[
            {label:"客户分类", value: 1},
            {label:"负责人", value: 2, disabled: true},
          ]}
          fieldProps={{
            onSelect: (value)=>{
              setFormCheckedValue(value);
            }
          }}
        />
        <ProFormTreeSelect
          label={"客户分类"}
          name={'customer_name'}
          rules={[{required: true, message: "必填项"}]}
          hidden={formCheckedValue != 1}
          allowClear={false}
          fieldProps={{
            showSearch: true,
            treeNodeFilterProp: 'title',
          }}
          request={()=>initialState?.CustomerClassify}
        />
      </ModalForm>
    </>
  )
}

export const BatchProduct: React.FC<any> = (props: any) => {
  const {modalVisit, setModalVisit, productCheckedRows} = props;

  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [formCheckedValue, setFormCheckedValue] = useState(null);

  const BatchUpdateProductEdit = async (data: any) => {
    const hide = message.loading('正在修改产品信息....');
    const resp = await BatchUpdateProduct(data);

    hide();

    setFormCheckedValue(null);

    if (resp && resp.success) {
      message.success('产品信息修改成功!');
      return true;
    }
    message.error('产品信息修改失败!');
    return false;
  }

  return (
    <>
      <ModalForm
        title="条件选择"
        form={form}
        autoFocusFirstInput
        onFinish={async (values) => {
          const data = {
            classify: values.product_name,
            product_ids: productCheckedRows,
          }
          if (values.edit_class == 1) {
            await BatchUpdateProductEdit(data)
          }
        }}
        open={modalVisit}
        onOpenChange={setModalVisit}
        modalProps={{
          destroyOnClose: true,
          onCancel: ()=>setFormCheckedValue(null)
        }}
        width={500}
      >
        <ProFormSelect
          label={"选择修改项"}
          // initialValue={1}
          allowClear={false}
          name={'edit_class'}
          options={[
            {label:"产品分类", value: 1},
          ]}
          fieldProps={{
            onSelect: (value)=>{
              setFormCheckedValue(value);
            }
          }}
        />
        <ProFormTreeSelect
          label={"产品分类"}
          name={'product_name'}
          rules={[{required: true, message: "必填项"}]}
          hidden={formCheckedValue != 1}
          allowClear={false}
          request={()=>initialState?.ProductClassify}
        />
      </ModalForm>
    </>
  )
}

export default {BatchCustomer, BatchProduct};
