import {Tree, Button, Dropdown, Menu, message, Form, Popconfirm} from 'antd';
// import type { DataNode, TreeProps } from 'antd/lib/tree';
import { SettingOutlined } from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import {ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText} from "@ant-design/pro-components";
import {
  createProductClassify, deleteProductClassify,
  getProductClassify,
  updateProductClassify
} from "@/services/ant-design-pro/product_classify";
import type {DataNode} from "antd/lib/tree";

interface EmployeeClassData{
  id: number;
  classify_no: string;
  classify_name: string
  parent_id: number;
  level: number;
  parent_path: string;
  status: string;
  order_num: number;
  initial_balance: number;
  create_user_id: number;
  create_user: string;
  modified: string;
  type: string
  children: [];
}


const ProductClassifyTree: React.FC = () => {
  const [customerClassifyData, setCustomerClassifyData] = useState<any>();
  const [modalVisit, setModalVisit] = useState(false);
  const [form] = Form.useForm();

  // 获取产品分类信息
  const fetchCustomerClassify = async () => {
    const result = await getProductClassify();
    const menu2Node: (m: EmployeeClassData) => DataNode = (m) => {
      return {
        ...m,
        key: m.classify_no,
        title: m.classify_name,
        children: m.children?.map(menu2Node),
      };
    };
    const data = menu2Node(result.data?.[0])
    setCustomerClassifyData([data]);
  }

  const handleSaveCustomerClassify: (subject: EmployeeClassData) => Promise<boolean> = async (subject) => {
    const hide = message.loading(`正在${subject.id ? '修改' : '创建'}目录....`);
    const resp = subject.id ? await updateProductClassify(subject) : await createProductClassify(subject);
    hide();
    if (resp && resp.success) {
      message.success('分类添加成功!');
      return true;
    }
    message.error('分类添加失败!');
    return false;
  };

  const onDeleteClassify: (item) => Promise<boolean> =  async (item) => {
    try {
      const hide = message.loading(`正在删除分类....`);
      const resp = await deleteProductClassify(item.id);
      hide();

      if (resp && resp.success) {
        message.success('分类删除成功!');
        await fetchCustomerClassify().then().catch();
        return true;
      }else {
        message.error('分类删除失败!');
        return false;
      }
    } catch (error) {
        // message.error("unknown error");
    }
  };

  useEffect(() => {
    fetchCustomerClassify().then().catch();
  },[]);

  if(customerClassifyData == null){
    return <div>loading</div>
  }

  const onTitleRender = (item: any) => {
    const menu = (
      <Menu
        items={[
          {
            key: '1',
            label: (
              <Button
                type="link"
                onClick={() =>
                {
                  form.setFieldsValue?.({
                    'parent_id': item.id,
                    'level': item.level+1
                  })
                  setModalVisit(true);
                }}
              >
                添加子节点
              </Button >
            ),
          },
          {
            key: '2',
            label: (
              <Button
                type="link"
                onClick={() => {
                  form.setFieldsValue?.(item);
                  setModalVisit(true);}}
              >
                编辑节点
              </Button >
            ),
          },
          {
            key: '3',
            label: (
              <Popconfirm
                title="确定是否删除？"
                key={'redInkWriteOff'+ item.id}
                onConfirm={function(){
                  onDeleteClassify(item).then();
                }}
                // onVisibleChange={() => console.log('visible change')}
              >
                <Button
                  type="link"
                  // onClick={() => onDeleteClassify(item)}
                >
                  删除节点
                </Button >
              </Popconfirm>
            ),
          },
        ]}
      />
    );
    return (
      <div >
        <span>{item.title}</span>
        <div style={{float:"right" }}>
            <Dropdown overlay={menu} placement="bottom" arrow>
              <Button shape="circle" icon={<SettingOutlined/>} style={{color:'#999999'}}/>
            </Dropdown>
        </div>
      </div>
    );
  };

  // @ts-ignore
  return (
    <div
    >
    <Tree
      className="draggable-tree"
      blockNode
      defaultExpandAll
      treeData={customerClassifyData}
      titleRender={onTitleRender}
    />
      <ModalForm
        form={form}
        title="新建分类"
        width={600}
        modalProps={{destroyOnClose:true, forceRender:true, onCancel:()=>{form.resetFields()}}}
        visible={modalVisit}
        onVisibleChange={setModalVisit}
        onFinish={async (values) => {
          const result = await handleSaveCustomerClassify(values);
          if (result) {
            form.resetFields()
            await fetchCustomerClassify().then().catch();
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
            name="classify_no"
            label="分类编号"
            rules={[{required:true}]}
            placeholder="请输入分类编号"
          />
          <ProFormText
            width="sm"
            name="classify_name"
            label="分类名称"
            rules={[{required:true}]}
            placeholder="请输入分类名称"
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
        </ProForm.Group>

      </ModalForm>
  </div>
  );
};

export default ProductClassifyTree;
