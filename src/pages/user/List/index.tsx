import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import React, {useEffect, useRef, useState} from 'react';
import {createUser, deleteUser, getUsers, updateUser} from '@/services/ant-design-pro/user';
import {Button, Drawer, Form, Input, message, Modal, Select, Space, TreeSelect} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {getRoles} from '@/services/ant-design-pro/roles';
import {PageContainer} from "@ant-design/pro-components";
import EmployeeTree from "@/pages/user/List/components/EmployeeTree";
import {useModel} from "@umijs/max";


const handleSaveUser: (user: API.User) => Promise<boolean> = async (user) => {
  const hide = message.loading(`正在${user.id ? '修改' : '创建'}用户....`);
  const resp = user.id ? await updateUser(user) : await createUser(user);
  hide();
  if (resp && resp.success) {
    message.success('用户添加成功!');
    return true;
  }
  message.error('用户添加失败!');
  return false;
};

const handleDeleteUser: (id: string) => Promise<boolean> = async (id) => {
  const hide = message.loading('正在删除用户....');
  const resp = await deleteUser(id);
  hide();
  if (resp && resp.success) {
    message.success('用户删除成功!');
    return true;
  }
  message.error('用户删除失败!');
  return false;
};

const UserList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<API.User | null>(null);
  const [roles, setRoles] = useState<API.Role[]>([]);
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');

  const [showDetail2, setShowDetail2] = useState<boolean>(false);

  const fetchRoles = async () => {
    const result = await getRoles();
    setRoles(result.data);
  };


  useEffect(() => {
    fetchRoles();
  }, []);

  const columns: ProColumns<API.User>[] = [
    {
      title: "用户ID",
      dataIndex: 'id', // data.id or data["id"]
    },
    {
      title: "姓名",
      dataIndex: 'name',
    },
    {
      title: "手机号码",
      dataIndex: 'phone',
    },
    {
      title: "部门",
      dataIndex: 'employee_classify_id',
      valueType: 'treeSelect',
      fieldProps: {
        options: initialState?.EmployeeClassify
      },
    },
    {
      title: "状态",
      dataIndex: 'status',
      valueEnum: {
        true: {
          text: '正常',
          status: 'Success',
        },
        false: {
          text: '停用',
          status: 'Error',
        }
      }
    },

    {
      title: '操作',
      dataIndex: 'action',
      render: (dom: any, entity: API.User) => {
        return (
          <>
            <Space>
              <Button
                id={`user-update-${entity.id}`}
                icon={<EditOutlined />}
                onClick={() => {
                  setModalVisible(true);
                  setSelectedUser(entity);
                  form.setFieldsValue(entity);
                }}
              />
              <Button
                id={`user-delete-${entity.id}`}
                icon={<DeleteOutlined />}
                onClick={async () => {
                  const result = await handleDeleteUser(entity.id);
                  if (result) {
                    setModalVisible(false);
                    if (tableRef.current) {
                      tableRef.current.reload();
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
      <ProTable<API.User>
        rowKey="id"
        actionRef={tableRef}
        size={'small'}
        columns={columns}
        request={async (params) => {
          // TODO 怎么去请求网络.
          return await getUsers(params);
        }}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          // showSizeChanger:true,
        }}
        search={{  labelWidth: 'auto', }}
        toolbar={{
          actions: [
            <Button
              type="primary"
              id="user-create"
              key={'add'}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              创建
            </Button>,
            <Button
              key="4"
              onClick={() => {
              setShowDetail2(true);
            }}>
              分类管理
            </Button>,
          ],
        }}
      />

      <Modal
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelectedUser(null);
        }}
        title={selectedUser ? '修改用户信息' : "新建用户"}
        onOk={() => {
          form.validateFields().then(async (values) => {
            const result = await handleSaveUser(values);
            if (result) {
              setModalVisible(false);
              setSelectedUser(null);
              if (tableRef.current) {
                tableRef.current.reload();
              }
            }
          });
        }}
        visible={modalVisible}
      >
        <Form
          form={form}
          initialValues={{selectedUser}}
        >
          <Form.Item
            label={"id"}
            name="id"
            hidden
            rules={[
              {
                required: true,
                message: "此项为必填项",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"姓名"}
            name="name"
            required={true}
            rules={[
              {
                required: true,
                message: "此项为必填项",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={"手机号码"}
            name="phone"
            required={true}
            rules={[
              {
                required: true,
                message: '此项为必填项',
              },
              {
                min: 11,
                max: 11,
                message: '请检查手机号格式',
              },
              {
                pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                message: '请输入正确的手机号',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"密码"}
            name="password"
            required={true}
            rules={[{required: true, message: "此项为必填项",}]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={"部门"}
            name="employee_classify_id"
            required={true}
            rules={[
              {required: true, message: '请选择你的部门!'}
            ]}
          >
            <TreeSelect
              treeDefaultExpandAll={true}
              onSelect={(_, node,)=>{
                form.setFieldValue('employee_classify_id', node.value);
              }}
              treeData={initialState?.EmployeeClassify}
            />
          </Form.Item>
          <Form.Item
            label={"状态"}
            name="status"
            required={true}
            rules={[
              {
                required: true,
                message: "此项为必填项",
              },
            ]}
          >
            <Select>
              <Select.Option value={true}>正常</Select.Option>
              <Select.Option value={false}>停用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={"角色"}
            name="roles"
            required={true}
            rules={[
              {
                required: true,
                message: "此项为必填项",
              },
            ]}
          >
            <Select
              mode="tags"
            >
              {roles.map((r) => (
                <Select.Option
                  key={`${r.id}`}
                  value={`${r.id}`}
                >
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        width={600}
        visible={showDetail2}
        extra={true}
        onClose={() => {
          setShowDetail2(false);
        }}
        closable={true}
      >
        <EmployeeTree/>
      </Drawer>

    </PageContainer>
  );
};

export default UserList;
