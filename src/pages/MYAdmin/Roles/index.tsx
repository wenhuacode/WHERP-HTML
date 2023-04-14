import type {ProColumns, ActionType} from '@ant-design/pro-components';
import React, {useEffect, useRef, useState} from 'react';
import {
  createRole,
  deleteRole,
  getRoleMenus,
  getRoles,
  updateRole,
  updateRoleMenu,
} from '@/services/ant-design-pro/roles';
import {getMenus} from '@/services/ant-design-pro/menus';
import {Button, Checkbox, Form, Input, InputNumber, message, Modal, Space} from 'antd';
import {DeleteOutlined, EditOutlined, SettingOutlined} from '@ant-design/icons';
import type {DataNode} from 'antd/lib/tree';
import {PageContainer} from "@ant-design/pro-components";
import {ProCard, ProTable} from "@ant-design/pro-components";
import TreeTransfer from "@/pages/MYAdmin/Roles/components/TreeTrans";
import {getMenuPagePermissions} from "@/services/ant-design-pro/page_permissions";

const handleSaveRole: (role: API.Role) => Promise<boolean> = async (role) => {
  const hide = message.loading(`正在${role.id ? '修改' : '创建'}角色....`);

  const resp = role.id ? await updateRole(role) : await createRole(role);

  hide();
  if (resp && resp.success) {
    message.success('角色添加成功!');
    return true;
  }
  message.error('角色添加失败!');
  return false;
};

const handleDeleteRole: (id: string) => Promise<boolean> = async (id) => {
  const hide = message.loading('正在删除角色....');
  const resp = await deleteRole(id);
  hide();
  if (resp && resp.success) {
    message.success('角色删除成功!');
    return true;
  }
  message.error('角色删除失败!');
  return false;
};

const handleEditRoleMenu: (id: string, meuns: string[]) => Promise<boolean> = async (id, menus) => {
  const hide = message.loading('正在修改角色菜单....');
  const resp = await updateRoleMenu(id, menus);
  hide();
  if (resp && resp.success) {
    message.success('修改角色菜单删除成功!');
    return true;
  }
  message.error('修改角色菜单删除失败!');
  return false;
};


const RoleList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [editMenuRoleId, setEditMenuRoleId] = useState<string | null>(null);
  const [menuDatas, setMenuDatas] = useState<DataNode[]>([]);
  const [editRole, setEditRole] = useState<API.Role | null>(null);
  const [form] = Form.useForm();
  const [per_form] = Form.useForm();
  const tableRef = useRef<ActionType>();


  //设置菜单权限
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const onChange = (keys: string[]) => {
    setTargetKeys(keys);
  };
  //设置按钮操作权限
  const [permissions, setPermissions] = useState<any[]>([]);
  //已选中的按钮权限
  const [checkedPermissions, setCheckedPermissions] = useState<any[]>([]);

  const fetchMenus = async () => {
    const menus = await getMenus();

    const menuCombine: (m: API.Menu, p?: API.Menu) => API.Menu & { name: string } = (m, p) => {
      return {
        ...m,
        name: p && p.name ? `${m.name}` : `${m.name}`,
        children: m.children?.map((c) =>
          menuCombine(c, {
            ...m,
            name: p && p.name ? `${m.name}` : `${m.name}`,
          }),
        ),
      };
    };

    const combineMenus = menus.data.map((c: any) => menuCombine(c));
    const menu2Node: (m: API.Menu) => DataNode = (m) => {
      return {
        key: m.id,
        title: m.name,
        children: m.children?.map(menu2Node),
      };
    };

    const nodes = combineMenus.map(menu2Node);

    setMenuDatas(nodes);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const columns: ProColumns<API.Role>[] = [
    {
      title: "ID",
      dataIndex: 'id', // data.id or data["id"]
    },
    {
      title: "角色名称",
      dataIndex: 'name',
    },
    {
      title: "标识符",
      dataIndex: 'identifier',
    },
    {
      title: "优先级",
      dataIndex: 'order',
    },
    {
      title: "状态",
      dataIndex: 'disabled',
      valueEnum: {
        true: {
          text: "禁用",
          status: 'Warning',
        },
        false: {
          text: "启用",
          status: 'Success',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (dom: any, entity: API.Role) => {
        return (
          <>
            <Space>
              <Button
                id={`roles-update-${entity.identifier}`}
                icon={<EditOutlined />}
                onClick={() => {
                  setEditRole(entity);
                  setModalVisible(true);
                  form.setFieldsValue(entity);
                }}
              />
              <Button
                id={`roles-delete-${entity.identifier}`}
                icon={<DeleteOutlined />}
                onClick={async () => {
                  const result = await handleDeleteRole(entity.id);
                  if (result) {
                    if (tableRef.current) {
                      tableRef.current.reload();
                    }
                  }
                }}
              />
              <Button
                id={`roles-menu-update-${entity.identifier}`}
                icon={<SettingOutlined />}
                onClick={async () => {
                  const resp = await getRoleMenus(entity.id);
                  const per = await getMenuPagePermissions();
                  //设置选中菜单
                  setTargetKeys(resp.data.menus);
                  //获取菜单及权限
                  setPermissions(per.data)
                  //获取已选中{拥有}的按钮权限
                  setCheckedPermissions(resp.data.page_permissions)
                  per_form.setFieldsValue(resp.data.page_permissions)

                  setEditMenuRoleId(entity.id);
                  setEditRole(entity);
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
      <ProTable<API.Role>
        rowKey="id"
        actionRef={tableRef}
        size={'small'}
        columns={columns}
        request={async () => {
          return await getRoles();
        }}
        toolbar={{
          actions: [
            <Button
              type="primary"
              id="role-create"
              key={"create"}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              {"创建角色"}
            </Button>,
          ],
        }}
      />

      <Modal
        onCancel={() => {
          setModalVisible(false);
          setEditRole(null);
        }}
        onOk={() => {
          form.validateFields().then(async (values) => {
            const result = await handleSaveRole(values);
            if (result) {
              setModalVisible(false);
              setEditRole(null);
              if (tableRef.current) {
                tableRef.current.reload();
              }
            }
          });
        }}
        open={modalVisible}
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
            label={"角色名称"}
            name="name"
            required={true}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={"标识符"}
            name="identifier"
            required={true}
          >
            <Input disabled={!!editRole?.id} />
          </Form.Item>

          <Form.Item
            label={"优先级"}
            name="order"
            required={true}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label={"是否禁用"}
            name="disabled"
            valuePropName="checked"
            required={true}
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={"权限设置"}
        width={800}
        open={editMenuRoleId !== null}
        onCancel={() => {
          setEditMenuRoleId(null);
          per_form.resetFields();
        }}
        destroyOnClose={true}
        onOk={async () => {
          const data: any = {}
          if (editMenuRoleId) {
            data.menus = targetKeys
            //检查权限按钮是否选中
            const formChanged = per_form.isFieldsTouched()
            if (formChanged){
              per_form.validateFields().then(async (values) => {
                data.permissions = values
              })
            }
            const result = await handleEditRoleMenu(editMenuRoleId, data);
            if (result) {
              setEditMenuRoleId(null);
              if (tableRef.current) {
                tableRef.current.reload();
                per_form.resetFields();
              }
            }
          }
        }}
      >
          <ProCard
            size={"small"}
            ghost
            bordered={true}
            tabs={{type: 'card',}}
          >
            <ProCard.TabPane key={"menus"} tab={"菜单权限设置"}>
              <TreeTransfer
                dataSource={menuDatas}
                targetKeys={targetKeys}
                onChange={onChange}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key={"buttons"} tab={"按钮权限设置"}>
              <ProCard
                bordered={true}
                ghost
                size={"small"}
                headerBordered
                wrap
                gutter={[16, 16]}
              >
                {permissions.map((value)=>{
                  return(
                    <ProCard title={value.menu_name}  colSpan={12}>
                      <Form
                        initialValues={checkedPermissions[value.menu_id]}
                        form={per_form}
                      >
                        <Form.Item
                          name={value.menu_id}
                        >
                          <Checkbox.Group
                            options={value.page_permissions}
                            key={value.page_permissions.key}
                          />
                        </Form.Item>
                      </Form>
                    </ProCard>
                  )

                })}

              </ProCard>

            </ProCard.TabPane>
            <ProCard.TabPane key={"datas"} tab={"数据权限设置"}>
              数据权限
            </ProCard.TabPane>
          </ProCard>
      </Modal>
    </PageContainer>
  );
};

export default RoleList;
