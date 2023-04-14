import React, {useEffect, useState} from "react";
import {Checkbox, Form, Button, message} from 'antd';
import {getMenuPagePermissions, SaveMenuPermissions} from "@/services/ant-design-pro/page_permissions";


const PermissionsTable: React.FC<any> = (props) => {
  const { menuId, menuState, editRole} = props;
  const [ checkboxOption, setCheckboxOption] = useState([]);
  const [form] = Form.useForm();

  const getMenuPermissions: (id: number, role_id) => (object) = async (id, role_id) => {
    const params = {
      menu_id:id,
      role_id: role_id
    }
    if (id ){
      const rsp = await getMenuPagePermissions(params);
      const data = rsp.data.map((value) => {
        return{
          ...value,
          label: value.name,
          value: value.identifier,
        }
      })
      setCheckboxOption(data)

      const menu_data = []
      rsp.menu_permissions_data.map(async (value) => {
        menu_data.push(value.identifier)
      })
      //初始化选项默认值
      await form.setFieldValue('page_permissions_id', menu_data);
    }
  }

  const SaveMenuPermissionsHandler: (value, menu_id, role_id) => Promise<boolean> = async (value, menu_id, role_id) => {
    const hide = message.loading(`正在保存权限....`);
    const data = {...value, menu_id, role_id}
    const resp = await SaveMenuPermissions(data);
    hide();
    if (resp && resp.success == true) {
      message.success('权限保存成功!');
      return true;
    }
    message.error('权限保存失败!');
    return false;
  }

  useEffect(() => {
    if (menuId != undefined || editRole != undefined ) {
      getMenuPermissions(menuId, editRole.id)
    }
  },[menuId, editRole])

  return(
    <Form
      form={form}
      onFinish={async (value)=>{
        // value[]选择权限, menu_id 菜单id, editRole.id 角色id
        await SaveMenuPermissionsHandler(value, menuId, editRole.id);
      }}
    >
      <Form.Item
        name={"page_permissions_id"}
      >
        <Checkbox.Group
          disabled={menuState.checked === false}
          options={checkboxOption}
        />
      </Form.Item>
      <Form.Item
      >
        <Button
          // type="primary"
          hidden={checkboxOption.length <= 0}
          style={{float:"right"}}
          size={"small"}
          htmlType="submit"
        >
          保存
        </Button>
      </Form.Item>


    </Form>
  );
};

export default PermissionsTable;
