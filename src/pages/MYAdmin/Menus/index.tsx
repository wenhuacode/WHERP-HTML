import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import React, {useRef, useState} from 'react';
import {createMenu, deleteMenu, getMenus, updateMenu} from '@/services/ant-design-pro/menus';
import {Button, Checkbox, Form, Input, InputNumber, message, Modal, Space} from 'antd';
import {DeleteOutlined, EditOutlined, FileAddOutlined} from '@ant-design/icons';
// @ts-ignore
import {useModel} from '@umijs/max';
import type {MenuDataItem} from "@umijs/route-utils";
import {PageContainer} from "@ant-design/pro-components";

const handleSaveMenu: (role: API.Menu) => Promise<boolean> = async (menu) => {
  const hide = message.loading(`正在${menu.id ? '修改' : '创建'}菜单....`);

  const resp = menu.id ? await updateMenu(menu) : await createMenu(menu);

  hide();
  if (resp && resp.success) {
    message.success('菜单添加成功!');
    return true;
  }

  message.error('菜单添加失败!');
  return false;
};

const handleDeleteMenu: (id: number) => Promise<boolean> = async (id) => {
  const hide = message.loading('正在删除菜单....');

  const resp = await deleteMenu(id);

  hide();
  if (resp && resp.success) {
    message.success('菜单删除成功!');
    return true;
  }

  message.error('菜单删除失败!');
  return false;
};

const RoleList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const { initialState, setInitialState } = useModel('@@initialState');

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
      title: "菜单名称",
      dataIndex: 'name',
    },
    {
      title: "图标",
      dataIndex: 'icon',
    },
    {
      title: "菜单路径",
      dataIndex: 'path',
    },

    {
      title: "优先级",
      dataIndex: 'order',
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
      title: 'Action',
      dataIndex: 'action',
      render: (dom: any, entity: API.Menu) => {
        return (
          <>
            <Space>
              <Button
                id={`menus-add-${entity.id}`}
                icon={<FileAddOutlined />}
                onClick={() => {
                  // 增加子菜单.
                  setModalVisible(true);
                  form.setFieldsValue({
                    parent_id: entity.id,
                  });
                }}
              />
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
          return await getMenus();
        }}
        toolbar={{
          actions: [
            <Button
              type="primary"
              id="menu-create"
              key={'menu-create'}
              onClick={() => {
                // 增加一级菜单
                setModalVisible(true);
                form.setFieldsValue({
                  parent_id: 0,
                });
              }}
            >
              {"新建"}
            </Button>,
          ],
        }}
      />

      <Modal
        title={"新建菜单"}
        onCancel={() => {
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
            label={"父级菜单"}
            name="parent_id"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={"标识符"}
            name="identifier"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"菜单名称"}
            name="name"
            required={true}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={"菜单图标"}
            name="icon"
            required={true}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"菜单路径"}
            name="path"
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

export default RoleList;
