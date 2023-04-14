// @ts-ignore
import type { IBestAFSRoute } from "@@/plugin-layout/layout/types";

const routes: IBestAFSRoute[] =  [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './user/Register',
      },
      {
        name: 'test',
        path: '/user/test',
        component: './user/Test',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Welcome',
  },
  {
    name: '客户管理',
    path: '/customer',
    icon: 'contacts',
    access: 'customer',
    routes: [
      {
        name: '客户信息',
        path: '/customer/list',
        component: './CustomerManagement/CustomerList',
        access: 'customer_list',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '销售管理',
    path: '/sale',
    icon: 'Audit',
    access: 'sale',
    routes: [
      {
        path: '/sale/sale_bills',
        name: '销售开单',
        component: './SalesManagement/SalesOrder',
        access: 'sale_bills',
      },
      {
        path: '/sale/sales_return',
        name: '销售退货',
        component: './SalesManagement/salesReturn',
        access: 'sales_return',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/product',
    name: '产品管理',
    icon: 'Appstore',
    access: 'product',
    routes: [
      {
        path: '/product/product_management',
        name: '产品管理',
        component: './ProductManagement',
        access: 'product_management',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/financial',
    name: '财务管理',
    icon: 'Dollar',
    access: 'financial',
    routes: [
      {
        path: '/financial/accounting_subject',
        name: '会计科目',
        component: './FinancialManagement/AccountingSubject',
        access: 'accounting_subject',
      },
      {
        path: '/financial/receipt',
        name: '收款单',
        component: './FinancialManagement/Receipt',
        access: 'receipt',
      },
      {
        path: '/financial/payment',
        name: '付款单',
        component: './FinancialManagement/Payment',
        access: 'financial_payment',
      },
      {
        path: '/financial/general_cost',
        name: '一般费用单',
        component: './FinancialManagement/GeneralCost',
        access: 'financial_general_cost',
      },
      {
        path: '/financial/ar_ad_increase',
        name: '应收增加',
        component: './FinancialManagement/ARAdIncrease',
        access: 'financial_ar_increase',
      },
      {
        path: '/financial/ar_ad_decrease',
        name: '应收减少',
        component: './FinancialManagement/ARAdDecrease',
        access: 'financial_ar_decrease',
      },
      {
        path: '/financial/ap_ad_increase',
        name: '应付增加',
        component: './FinancialManagement/APAdIncrease',
        access: 'financial_ap_ad_increase',
      },
      {
        path: '/financial/ap_ad_decrease',
        name: '应付减少',
        component: './FinancialManagement/APAdDecrease',
        access: 'financial_ap_ad_decrease',
      },
      {
        path: '/financial/capital_adjust',
        name: '提现存现转账',
        component: './FinancialManagement/CapitalAdjust',
        access: 'financial_capital_adjust',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/purchase',
    name: '采购管理',
    icon: 'Wallet',
    access: 'purchase',
    routes: [
      {
        path: '/purchase/purchase_order',
        name: '采购订单',
        component: './PurchaseManagement/PurchaseOrder',
        access: 'purchase_order',
      },
      {
        path: '/purchase/purchase_returned_note',
        name: '采购退货单',
        component: './PurchaseManagement/PurchaseReturnedNote',
        access: 'purchase_returned_note',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/inventory',
    name: '库存管理',
    icon: 'layoutOutlined',
    access: 'inventory',
    routes: [
      {
        path: '/inventory/storehouse_management',
        name: '仓库管理',
        component: './InventoryManagement/StorehouseManagement',
        access: 'storehouse_management',
      },
      {
        path: '/inventory/goods_loss',
        name: '报损单',
        component: './InventoryManagement/GoodsLoss',
        access: 'inventory_goods_loss',
      },
      {
        path: '/inventory/goods_increase',
        name: '报溢单',
        component: './InventoryManagement/GoodsIncrease',
        access: 'goods_increase',
      },
      {
        path: '/inventory/other_out_bound',
        name: '其他出库单',
        component: './InventoryManagement/OtherOutBound',
        access: 'other_out_bound',
      },
      {
        path: '/inventory/other_put_in_storage',
        name: '其他入库单',
        component: './InventoryManagement/OtherPutInStorage',
        access: 'other_put_in_storage',
      },
      {
        path: '/inventory/inventory_transfers',
        name: '调拨单',
        component: './InventoryManagement/InventoryTransfers',
        access: 'inventory_transfers',
      },
      {
        path: '/inventory/cost_adjustment',
        name: '成本调价单',
        component: './InventoryManagement/CostAdjustment',
        access: 'cost_adjustment',
      },
      {
        component: './404',
      },
    ],
  },

  {
    name: '系统管理',
    path: '/my_admin',
    icon: 'fa-gear',
    access: 'my_admin',
    routes: [
      {
        name: '员工管理',
        path: '/my_admin/list',
        component: './user/List',
        access: 'my_admin_list',
      },
      {
        name: '角色管理',
        path: '/my_admin/roles',
        component: './MYAdmin/Roles',
        access: 'my_admin_roles',
      },
      {
        name: '菜单管理',
        path: '/my_admin/menus',
        component: './MYAdmin/Menus',
        access: 'my_admin_menus',
      },
      {
        name: '页面权限管理',
        path: '/my_admin/page_permissions',
        component: './MYAdmin/PagePermissions',
        access: 'my_admin_permissions',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '业务中心',
    path: '/business_center',
    icon: 'fa-gear',
    routes: [
      {
        name: '订单中心',
        path: '/business_center/order',
        component: './BusinessCenter/OrderIndex',
      },
      {
        name: '经营历程',
        path: '/business_center/business_history',
        component: './BusinessCenter/BusinessHistory',
      },
      {
        name: '订单编辑',
        path: '/business_center/order_edit',
        component: './BusinessCenter/order/EditOrder',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '数据中心',
    path: '/data_center',
    icon: 'fa-gear',
    routes: [
      {
        name: '进货查询',
        path: '/data_center/purchase_data',
        routes: [
          {
            name: '商品进货查询',
            path: '/data_center/purchase_data/product_purchase_query',
            component: './DataCenter/PurchaseData/ProductPurchaseQuery',
          },
          {
            name: '单位进货查询',
            path: '/data_center/purchase_data/customer_purchase_query',
            component: './DataCenter/PurchaseData/CustomerPurchaseQuery',
          },
          {
            name: '进货明细',
            path: '/data_center/purchase_data/purchase_query_detail',
            component: './DataCenter/PurchaseData/PurchaseDataDetail',
          },
          {
            component: './404',
          },
        ],
      },
      {
        name: '销售查询',
        path: '/data_center/sale_data',
        routes: [
          {
            name: '商品销售查询',
            path: '/data_center/sale_data/product_sale_query',
            component: './DataCenter/SaleData/ProductSaleQuery',
          },
          {
            name: '单位销售查询',
            path: '/data_center/sale_data/customer_sale_query',
            component: './DataCenter/SaleData/CustomerSaleQuery',
          },
          {
            name: '销售明细',
            path: '/data_center/sale_data/sale_query_detail',
            component: './DataCenter/SaleData/SaleDataDetail',
          },
          {
            name: '销售优惠统计',
            path: '/data_center/sale_data/sales_discount',
            component: './DataCenter/SaleData/SalesDiscount',
          },
          {
            name: '销售优惠统计明细',
            path: '/data_center/sale_data/sales_discount_detail',
            component: './DataCenter/SaleData/SalesDiscountDetail',
          },
          {
            name: '商品销售明细表',
            path: '/data_center/sale_data/product_sale_detail',
            component: './DataCenter/SaleData/ProductSaleDetailCount',
          },
          {
            component: './404',
          },
        ],
      },
      {
        name: '库存查询',
        path: '/data_center/inventory_data',
        routes: [
          {
            name: '库存状况',
            path: '/data_center/inventory_data/inventory_query',
            component: './DataCenter/InventoryData/InventoryQuery',
          },
          {
            name: '库存详情',
            path: '/data_center/inventory_data/inventory_query_detail',
            component: './DataCenter/InventoryData/InventoryQueryDetail',
          },
          {
            component: './404',
          },
        ],
      },
      {
        name: '往来查询',
        path: '/data_center/transaction_data',
        routes: [
          {
            name: '单位应收应付',
            path: '/data_center/transaction_data/customer_arap',
            component: './DataCenter/TransactionData/CustomerARAP',
          },
          {
            name: '单位应收应付详情',
            path: '/data_center/transaction_data/customer_arap_detail',
            component: './DataCenter/TransactionData/CustomerARAPDetail',
          },
          // {
          //   name: '部门应收应付',
          //   path: '/data_center/transaction_data/department_arap',
          //   component: './DataCenter/TransactionData/DepartmentARAP',
          // },
          // {
          //   name: '职员应收应付',
          //   path: '/data_center/transaction_data/employee_arap',
          //   component: './DataCenter/TransactionData/EmployeeARAP',
          // },
          // {
          //   name: '地区应收应付',
          //   path: '/data_center/transaction_data/area_arap',
          //   component: './DataCenter/TransactionData/AreaARAP',
          // },
          {
            component: './404',
          },
        ],
      },
      {
        name: '财务查询',
        path: '/data_center/financial_data',
        routes: [
          {
            name: '现金银行',
            path: '/data_center/financial_data/cash_bank',
            component: './DataCenter/FinancialData/CashBank',
          },
          {
            name: '账户明细',
            path: '/data_center/financial_data/cash_bank_detail',
            component: './DataCenter/FinancialData/CashBankDetail',
          },
          {
            name: '费用查询',
            path: '/data_center/financial_data/cost_query',
            routes: [
              {
                name: '费用合计统计',
                path: '/data_center/financial_data/cost_query/cost_total_statistics',
                component: './DataCenter/FinancialData/CostQuery/CostTotalStatistics',
              },
              {
                name: '费用明细',
                path: '/data_center/financial_data/cost_query/cost_total_statistics_detail',
                component: './DataCenter/FinancialData/CostQuery/CostTotalStatisticsDetail',
              },
              {
                name: '部门费用查询',
                path: '/data_center/financial_data/cost_query/department_cost',
                component: './DataCenter/FinancialData/CostQuery/DepartmentCost',
              },
              {
                name: '职员费用查询',
                path: '/data_center/financial_data/cost_query/employee_cost',
                component: './DataCenter/FinancialData/CostQuery/EmployeeCost',
              },
              {
                name: '地区费用查询',
                path: '/data_center/financial_data/cost_query/area_cost',
                component: './DataCenter/FinancialData/CostQuery/AreaCost',
              },
              {
                component: './404',
              },
            ]
          },
        ],
      },
    ]
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];

export default routes;
