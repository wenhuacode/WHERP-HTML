import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import React, {useEffect, useRef, useState} from 'react';
import {
  createPagePermissions,
  deletePagePermissions,
  getPagePermissions,
  updatePagePermissions
} from '@/services/ant-design-pro/page_permissions';
import {Button, Checkbox, Form, Input, InputNumber, message, Modal, Space, TreeSelect} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
// @ts-ignore
import {useModel} from '@umijs/max';
import type {MenuDataItem} from "@umijs/route-utils";
import {PageContainer} from "@ant-design/pro-components";
import type {DataNode} from "antd/lib/tree";
import {getMenus} from "@/services/ant-design-pro/menus";

const handleSaveMenu: (permissions: API.PagePermissions) => Promise<boolean> = async (permissions) => {
  const hide = message.loading(`正在${permissions.id ? '修改' : '创建'}权限....`);
  const resp = permissions.id ? await updatePagePermissions(permissions) : await createPagePermissions(permissions);
  hide();
  if (resp && resp.success) {
    message.success('权限添加成功!');
    return true;
  }
  message.error('权限添加失败!');
  return false;
};

const handleDeleteMenu: (id: number) => Promise<boolean> = async (id) => {
  const hide = message.loading('正在删除权限....');
  const resp = await deletePagePermissions(id);
  hide();
  if (resp && resp.success) {
    message.success('权限删除成功!');
    return true;
  }
  message.error('权限删除失败!');
  return false;
};


const PermissionsList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [menuClassify, setMenuClassify] = useState<any>();
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const { initialState, setInitialState } = useModel('@@initialState');


  //获取菜单信息
  const fetchMenuClassify = async () => {
    const result = await getMenus();
    const menu2Node: (menu: any) => DataNode = (menu) => {
        return menu.map((item: any) => {
          return {
            ...item,
            value: item.id,
            label: item.name,
            children: item.children ? menu2Node(item.children) : undefined,
          };
        })
    };
    const data = menu2Node(result.data)
    setMenuClassify(data);
  }


  useEffect(() => {
    fetchMenuClassify().then().catch();
  },[])

  const columns: ProColumns<API.Menu>[] = [
    {
      title: "ID",
      dataIndex: 'id', // data.id or data["id"]
      hideInTable: true,
    },
    {
      title: "标识符",
      dataIndex: 'identifier',
    },
    {
      title: "权限名称",
      dataIndex: 'name',
    },
    {
      title: "所属菜单",
      dataIndex: 'menu_name',
    },
    {
      title: "是否隐藏",
      dataIndex: 'hide',
      // renderText: (text: any, record: API.Role, index: number) => {
      //   return record.enabled ? "已启用": "未启用"
      // }
      valueEnum: {
        true: {
          text: "隐藏",
          status: 'Warning',
        },
        false: {
          text: "显示",
          status: 'Success',
        },
      },
    },
    {
      title: "优先级",
      dataIndex: 'order',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (dom: any, entity: API.Menu) => {
        return (
          <>
            <Space>
              <Button
                id={`menus-update-${entity.id}`}
                icon={<EditOutlined />}
                onClick={() => {
                  setModalVisible(true);
                  form.setFieldsValue(entity);
                }}
              />
              <Button
                id={`menus-delete-${entity.id}`}
                icon={<DeleteOutlined />}
                onClick={async () => {
                  const result = await handleDeleteMenu(entity.id);
                  if (result) {
                    // @ts-ignore
                    const menus: MenuDataItem[] = await initialState?.fetchMenus?.();
                    tableRef.current?.reload()

                    setModalVisible(false);
                    if (menus) {
                      await setInitialState({
                        ...initialState,
                        menus,
                      });
                      tableRef.current?.reload()
                    }
                  }
                }}
              />
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <PageContainer
      title={false} header={{ title:false, breadcrumb: {} }}
    >
      <ProTable<API.Menu>
        rowKey="id"
        actionRef={tableRef}
        columns={columns}
        size={'small'}
        request={async () => {
          // TODO 怎么去请求网络.
          return await getPagePermissions();
        }}
        toolbar={{
          actions: [
            <Button
              type="primary"
              id="permissions-create"
              key={'permissions-create'}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              {"新建"}
            </Button>,
          ],
        }}
      />

      <Modal
        title={"新建权限"}
        onCancel={() => {
          form.resetFields();
          setModalVisible(false);
        }}
        onOk={() => {
          form.validateFields().then(async (values) => {
            const result = await handleSaveMenu(values);
            if (result) {
              // @ts-ignore
              const menus: MenuDataItem[] = await initialState?.fetchMenus?.();

              setModalVisible(false);
              if (menus) {
                await setInitialState({
                  ...initialState,
                  menus,
                });
                form.resetFields()
                tableRef.current?.reload();
              }

              if (tableRef.current) {
                tableRef.current?.reload();
              }
            }
          });
        }}
        visible={modalVisible}
      >
        <Form form={form}>
          <Form.Item
            label={"ID"}
            name="id"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"所属菜单"}
            name="menu_id"
            required={true}
            // hidden
          >
            <TreeSelect
              treeData={menuClassify}
            />
          </Form.Item>

          <Form.Item
            label={"标识符"}
            name="identifier"
            required={true}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"权限名称"}
            name="name"
            required={true}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={"优先级"}
            name="order"
            required={true}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label={"是否隐藏"}
            name="hide"
            valuePropName="checked"
            required={true}
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default PermissionsList;
