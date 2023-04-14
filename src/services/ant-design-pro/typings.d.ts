// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    avatar: any;
    name?: string;
    id?: number;
    department?: [];
    notifyCount?: number;
    unreadCount?: number;
    access?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
    token?: string;
  };

  type RegisterResult = {
    status?: string;
    id?: string;
    success?: any;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: string;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type RegisterParams = {
    username?: string;
    password?: string;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  export type Role = {
    id: string;
    name: string;
    identifier: string;
    order: number;
    disabled: boolean;
    // 过期时间. 非必须
    expireTime?: number;
    // 角色所属菜单
    menus: Menu[];
  };
  export type Menu = {
    id: number;
    name: string;
    icon: string;
    identifier: string;
    // 路径
    key: string;
    path: string;
    parent_id: number;
    hide: boolean;
    order: number;

    // 子菜单
    children?: Menu[];
    type?: 'inner' | 'outter' | undefined;
  };

  export type User = {
    id: string;
    password: string;
    phone: string;
    name: string;
    department: string;
    notify_count: number;
    unread_count: number;
    status: string;
    roles: number[];
  };

  export type Customer = {
    id: number;
    uk_customer_no: string;
    name: string;
    person_contact?: string;
    mobile?: string;
    phone?: string;
    province_id?: string;
    city_id?: string;
    district_id?: string;
    address?: string;
    employee?: number;
    customer_classify_id?: number;
    customer_classify_path?: string;
    customer_type?: string;
    bank?: string;
    bank_account?: string;
    tax_no?: string;
    ar_amount?: number;
    ap_amount?: number;
    note?: string;
    is_stop?: boolean;
    create_user_id?: number;
    add_time?: number;
  };

  export type CustomerManager = {
    label?: string;
    value?: string;
  }

  export type CustomerClassify = {
    id?: number;
    value?: string;
    lable?: string;
    title?:string;
    key?: string;
    children?: CustomerClassify[];
  }

  export type AddressClassify = {
    id?: number;
    value?: string;
    lable?: string;
    title?:string;
    key?: string;
    children?: CustomerClassify[];
  }

  export type Product = {
    id?: number;
    product_no?: string;
    name?: string;
    barcode?:string;
    product_image?: string;
    product_classify_id?: number;
    product_classify_path?: string;
    product_classify?: string;
    price?: number;
    cost?: number;
    product_unit?: string;
    box_rules?: number;
    validity?: number;
    product_introduction?: string;
    supplier_id?: number;
    supplier?: string;
    is_stop?: string;
    create_user_id?: number;
    create_user?: string;
    modified?: string;
  }

  export type ProductClassify = {
    id?: number;
    value?: string;
    lable?: string;
    title?:string;
    key?: string;
    children?: CustomerClassify[];
  }

  export type OrderDetail = {
    id: React.Key;
    order_id?: number;
    order_no?: string;
    order_type?: number;
    customer_id?: number;
    customer?: string[];
    storehouse_id? : number;
    storehouse_name? : string;
    storehouse2_id? : number;
    storehouse2_name? : string;
    customer_classify_id?: number;
    customer_classify_path?: string;
    customer_classify?: string;
    employee_id?: number;
    employee?: string;
    employee_classify_id?: number;
    signed_data?: string;
    barcode?: string;
    product_name?: string;
    product_classify_id?: number;
    product_classify?: string;
    qty?: number;
    discount?: number;
    discount_price?: number;
    discount_total?: number;
    discount_amount?: number;
    express_fee?: number;
    order_amount?: number;
    price?: number;
    amount?: number;
    total?: number;
    note?: string;
    box_qty?: number;
    box_rules?: number;
    province_id?: number;
    province?: string;
    city_id?: number;
    city?: string;
    district_id?: number;
    district?: string;
    address?: string;
    contact_person?: string;
    total_sales_amount?: number;
    phone_number?: string;
    order_discount?: number;
    order_qty?: number;
    order_state?: number;
    is_free_gift?: string;
    is_push_jst?: string;
    courier_company?: string;
    courier_number?: string;
    supplier_id?: number;
    supplier?: string;
  }

  export type AccountCurrent = {
    id?: number;
    order_no?: string;
    order_type?: string;
    customer_id?: number;
    customer?: string;
    date?: string;
    add_amount?: number;
    minus_amount?: number
    create_user_id?: number;
    create_user?: string;
    add_time?: number;
  }

  export type Supplier = {
    id?: number;
    uk_supplier_no?: string;
    name?: string;
    person_contact?: string;
    mobile?: string;
    province_id?: number;
    province?: string;
    city_id?: number;
    city?: string;
    district_id?: number;
    district?: string;
    address?: string;
    customer_id?: number;
    customer?: string;
    supplier_type?: string;
    ar_amount?: number;
    ap_amount?: number;
    note?: string;
    is_stop?: string;
    is_delete?: string;
    create_user_id?: number;
    create_user?: string;
    modified?: string;
  }

  export type AccountingSubject = {
    id?: number;
    as_no?: string;
    name?: string;
    parent_id?: number;
    level?: number;
    parent_path?: string;
    status?: number;
    order_num?: number;
    initial_balance?: number;
    create_user_id?: number;
    create_user?: string;
    modified?: string;
    children?: AccountingSubject[];
  }

  export type Receipt = {
    id?: number;
    re_no?: string;
    order_type?: string;
    order_state?: string;
    customer_id?: number;
    customer?: string;
    data?: string;
    as_id?: number;
    as_name?: string;
    amount?: number;
    ec_id?: number;
    ec_name?: string;
    note?: string;
    create_user_id?: number;
    create_user?: string;
    modified?: string;
    add_time?: string;
  }

  export type SubsidiaryLedger = {
    id?: number;
    order_state?: string;
    order_type?: string;
    date?: string;
    order_no?: string;
    employee_id?: number;
    employee?: string;
    as_id?: number;
    as_name?: string;
    add_amount?: number;
    sub_amount?: number;
    note?: string;
    create_user_id?: number;
    create_user?: string;
    modified?: string;
    add_time?: string;
  }

  export type Payment = {
    id?: number;
    pay_no?: string;
    order_state?: string;
    order_type?: string;
    supplier_id?: number;
    supplier?: string;
    data?: string;
    as_id?: number;
    as_name?: string;
    amount?: number;
    ec_id?: number;
    ec_name?: string;
    note?: string;
    create_user_id?: number;
    create_user?: string;
    modified?: string;
    add_time?: string;
  }

  export type GeneralCost = {
    id?: number;
    gc_no?: string;
    order_state?: string;
    order_type?: string;
    customer_id?: number;
    customer?: string;
    employee_id?: number;
    employee?: string;
    data?: string;
    cost_as_id?: number;
    cost_as_name?: string;
    expense_amount?: number;
    bank_as_id?: number;
    bank_as_name?: string;
    amount?: number;
    ec_id?: number;
    ec_name?: string;
    note?: string;
    create_user_id?: number;
    create_user?: string;
    modified?: string;
    add_time?: string;
  }

  export type ArAdjust = {
    id?: number;
    ar_no?: string;
    order_state?: string;
    order_type?: string;
    adjust_type?: string;
    customer_id?: number;
    customer?: string;
    date?: string;
    as_id?: number;
    as_name?: string;
    amount?: number;
    ec_id?: number;
    ec_name?: string;
    note?: string;
    create_user_id?: number;
    create_user?: string;
    modified?: string;
    add_time?: string;
  }

  export type ApAdjust = {
    id?: number;
    ap_no?: string;
    order_state?: string;
    order_type?: string;
    adjust_type?: string;
    supplier_id?: number;
    supplier?: string;
    date?: string;
    as_id?: number;
    as_name?: string;
    amount?: number;
    ec_id?: number;
    ec_name?: string;
    note?: string;
    create_user_id?: number;
    create_user?: string;
    modified?: string;
    add_time?: string;
  }

  export type CapitalAdjust = {
    id?: number;
    ca_no?: string;
    order_state?: string;
    order_type?: string;
    ca_type?: string;
    date?: string;
    out_as_id?: number;
    out_as_name?: string;
    into_as_id?: number;
    into_as_name?: string;
    amount?: number;
    ec_id?: number;
    ec_name?: string;
    note?: string;
    create_user_id?: number;
    create_user?: string;
    modified?: string;
    add_time?: string;
  }

  export type StorehouseManagement = {
    id?: number;
    storehouse_no?: string;
    storehouse_name?: string;
    employee_id?: number;
    employee?: string;
    is_stop?: string;
    note?: string;
    jst_storehouse_no?: string;
    create_user_id?: number;
    create_user?: string;
    modified_id?: number;
    modified_name?: string;
    add_time?: string
    modified?: string;
  }

  export type InventoryQuery = {
    id?: number;
    barcode?: string;
    storehouse_id?: string;
    qty?: number;
    cost_price?: string;
    total?: string;
    modified_id?: number;
    modified_name?: string;
    add_time?: string
    modified?: string;
  }

  export type PagePermissions = {
    id?: number;
    name?: string;
    identifier?: string;
    menu_id?: number;
    menu_name?: string;
    hide?: string;
    order?: number;
    create_user_id?: number;
    create_user?: string;
    modified_id?: number;
    modified_name?: string;
    add_time?: string
    modified?: string;
  }

}
