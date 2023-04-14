/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser, permissions: any } | undefined) {
  const { permissions } = initialState ?? {};
  // console.log(permissions.permissions_id)
  //菜单权限处理

  const menu_list: string[] = []
  const getMenusIdentifier  = (menus_data: any[]) => {
    menus_data.forEach((item) => {
      if(item.identifier) {
        menu_list.push(item.identifier)
        if (item.children){
          getMenusIdentifier(item.children)
        }
      }
    })
  }
  if (permissions){
    getMenusIdentifier(permissions.menus)
  }

  // console.log(menu_list)
  return {
    // 菜单权限定义
    //欢迎页面
    welcome: menu_list.includes('100'),
    //客户管理
    customer: menu_list.includes('300'),
    customer_list: menu_list.includes('301'),
    customer_account_current: menu_list.includes('302'),
    customer_ar_ap: menu_list.includes('303'),
    //产品管理
    product: menu_list.includes('400'),
    product_management: menu_list.includes('401'),
    //销售管理
    sale: menu_list.includes('500'),
    sale_bills: menu_list.includes('501'),
    sales_return: menu_list.includes('502'),
    //采购管理
    purchase: menu_list.includes('600'),
    supplier_management: menu_list.includes('601'),
    purchase_order: menu_list.includes('602'),
    purchase_order_list: menu_list.includes('603'),
    purchase_returned_note: menu_list.includes('604'),
    //库存管理
    inventory: menu_list.includes('700'),
    storehouse_management: menu_list.includes('701'),
    inventory_query: menu_list.includes('702'),
    inventory_goods_loss: menu_list.includes('703'),
    goods_increase: menu_list.includes('704'),
    other_out_bound: menu_list.includes('705'),
    other_put_in_storage: menu_list.includes('706'),
    inventory_transfers: menu_list.includes('707'),
    cost_adjustment: menu_list.includes('708'),
    //财务管理
    financial: menu_list.includes('800'),
    accounting_subject: menu_list.includes('801'),
    receipt: menu_list.includes('802'),
    financial_payment: menu_list.includes('803'),
    financial_general_cost: menu_list.includes('804'),
    financial_ar_increase: menu_list.includes('80501'),
    financial_ar_decrease: menu_list.includes('80502'),
    financial_ap_ad_increase: menu_list.includes('80503'),
    financial_ap_ad_decrease: menu_list.includes('80504'),
    financial_capital_adjust: menu_list.includes('890'),
    financial_subsidiary_ledger: menu_list.includes('891'),
    financial_cash_bank: menu_list.includes('892'),
    //系统管理
    my_admin: menu_list.includes('900'),
    my_admin_list: menu_list.includes('901'),
    my_admin_menus: menu_list.includes('902'),
    my_admin_roles: menu_list.includes('903'),
    my_admin_permissions: menu_list.includes('904'),


    //按钮权限定义
    //客户信息页面
    permissions_customer_import: permissions?.permissions_id?.includes(1),
    permissions_customer_export: permissions?.permissions_id?.includes(2),
    permissions_customer_add: permissions?.permissions_id?.includes(3),
    permissions_customer_class: permissions?.permissions_id?.includes(4),
    permissions_customer_update: permissions?.permissions_id?.includes(5),
    permissions_customer_delete: permissions?.permissions_id?.includes(6),

    //产品管理页面
    permissions_product_import: permissions?.permissions_id?.includes(7),
    permissions_product_add: permissions?.permissions_id?.includes(8),
    permissions_product_class: permissions?.permissions_id?.includes(9),
    permissions_product_update: permissions?.permissions_id?.includes(10),
    permissions_product_delete: permissions?.permissions_id?.includes(11),

    //订单列表页面
    permissions_orderList_check: permissions?.permissions_id?.includes(12),
    permissions_orderList_refused: permissions?.permissions_id?.includes(13),
    permissions_orderList_update: permissions?.permissions_id?.includes(14),
    permissions_orderList_delete: permissions?.permissions_id?.includes(15),
    permissions_orderList_redInkWriteOff: permissions?.permissions_id?.includes(16),
  };


}
