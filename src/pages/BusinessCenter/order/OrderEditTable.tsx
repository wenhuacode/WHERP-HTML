import type {ProColumns} from "@ant-design/pro-components";
import {EditableProTable, ProTable, ProForm} from "@ant-design/pro-components";
import {CopyOutlined, DeleteOutlined, FileAddOutlined, PlusOutlined} from "@ant-design/icons";
import {getProduct} from "@/services/ant-design-pro/product";
import {Button, message, Modal, Table} from "antd";
import React, {useState} from "react";
import {isNaN} from "lodash";
import {getAsNo} from "@/services/ant-design-pro/finance";
import {getGeneralCostASNO} from "@/services/ant-design-pro/general_cost";
import {GetIncomeAS} from "@/services/ant-design-pro/ar_adjust";
import {SelectSaleProduct} from "@/pages/BusinessCenter/order/SelectProduct/SelectProduct";

//设置数字格式
const FormatNum = (value: number, places: number) => {
  return parseFloat(value.toFixed(places))
}

//销售采购库存
export const SaleOrderEditTable: React.FC<any> = (props) => {
   const {actionRef, editableFormRef, formRef, form,
  orderType, editableKeys, setEditableRowKeys, summaryData,
     tableTotalHandler, ViewOrderNo, Type, formF} = props;

  //产品多选单选设置
  const [productChecked, setProductChecked] = useState(false);
  const [productCheckedRows, setProductCheckedRows] = useState([]);
  //正在编辑的商品行
  const [tableRowIndex, setTableRowIndex] = useState<number>();
  // const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);

  const [productModelOpen, setProductModelOpen] = useState(false);

  const [selectTreeKeys, setSelectTreeKeys] = useState([1]);

  //设置单选行内容
  const setTableRowData = (record: any, order_discount: any) => {
    editableFormRef.current?.setRowData(tableRowIndex, {
      product_name: record.product_name,
      barcode: record.barcode,
      qty: 1,
      price: record.price,
      amount: record.price,
      total: record.price,
      discount: order_discount == 1 ? 1 : order_discount,
      discount_price: FormatNum((order_discount == 1 ? record.price : record.price * order_discount),4),
      discount_total: FormatNum((order_discount == 1 ? record.price : record.price * order_discount),4),
      box_qty: ((1 / (record.box_rules ? record.box_rules : 0)) == Infinity ? 0 : (1 / record.box_rules)),
      box_rules: record.box_rules ? record.box_rules : 0,
      is_free_gift: record.price == 0,
    })
  };

  //产品添加
  const handleOk = () => {
    //获取全局折扣设置
    const order_discount = formRef.current?.getFieldValue("order_discount")
    //判断是不是子节点
    // @ts-ignore
    if (productCheckedRows[0].product_id != null) {
      //如果是单选
      if (productChecked == false && productCheckedRows.length > 0){
        setTableRowData(productCheckedRows[0], order_discount)
        setProductModelOpen(false);
      }else {
        if (productCheckedRows.length > 0) {
          //多选处理
          const tableDataSource = formRef.current?.getFieldValue("table") as API.OrderDetail[];
          let data_arr: any[] = []
          productCheckedRows.map((values: any, index)=>{
            data_arr.push(
              {
                id: Date.now()+index,
                product_name: values.product_name,
                barcode: values.barcode,
                qty: 1,
                price: values.price,
                amount: values.price,
                total: values.price,
                discount: order_discount == 1 ? 1 : order_discount,
                discount_price: FormatNum((order_discount == 1 ? values.price : values.price * order_discount),4),
                discount_total: FormatNum((order_discount == 1 ? values.price : values.price * order_discount),4),
                box_qty: ((1 / (values.box_rules ? values.box_rules : 0)) == Infinity ? 0 : (1 / values.box_rules)),
                box_rules: values.box_rules ? values.box_rules : 0,
                is_free_gift: values.price == 0,
              }
            )
          });
          if (tableDataSource != undefined){
            data_arr = [...tableDataSource, ...data_arr]
          }
          formRef?.current?.setFieldsValue({
            table: data_arr
          })
          //处理多选编辑项
          setEditableRowKeys(data_arr.map(({ id }) => id));
        }
      }
    }else {
      message.error("请选择单个基础资料，不要选择分类")
      return
    }
    setSelectTreeKeys([1]);
    setProductModelOpen(false);
  };

  //数量设置
  const tableQtyHandler = async (rowIndex: any) => {
    const rowData = await editableFormRef.current?.getRowData?.(rowIndex);
    if (rowData.product_name == undefined) {
      await editableFormRef.current?.setRowData?.(rowIndex, {qty:undefined})
    }
    else {
      await editableFormRef.current?.setRowData?.(rowIndex, {
        qty: (isNaN(rowData.qty) || rowData.qty == 0) ? 1 : rowData.qty,
        total: (isNaN(rowData.qty) || rowData.qty == 0) ? rowData.price : rowData.qty * rowData.price,
        discount_total: (isNaN(rowData.qty) || rowData.qty == 0) ? rowData.discount_price : rowData.qty * rowData.discount_price,
        box_qty: (((isNaN(rowData.qty) || rowData.qty == 0) ? 1 : rowData.qty) / rowData.box_rules)==Infinity ? 0 : FormatNum((((isNaN(rowData.qty) || rowData.qty == 0) ? 1 : rowData.qty) / rowData.box_rules),2),
      });

      await tableTotalHandler()
    }
  }

  //折扣设置
  const tableDiscountHandler = async (rowIndex: any) => {
    const rowData = await editableFormRef.current?.getRowData?.(rowIndex);
    if (rowData.product_name == undefined) {
      await editableFormRef.current?.setRowData?.(rowIndex, {discount: undefined})
    } else {
      await editableFormRef.current?.setRowData?.(rowIndex, {
        discount: isNaN(rowData.discount) ? 0 : rowData.discount,
        discount_price: FormatNum((isNaN(rowData.discount) ? 0 : rowData.price * rowData.discount),4),
        discount_total: FormatNum((isNaN(rowData.discount) ? 0 : (rowData.discount * rowData.price) * rowData.qty),2),
        is_free_gift: rowData.discount == 0,
      });

      await tableTotalHandler()
    }
  }

  //折后单价设置
  const tableDiscountPrice = async (rowIndex: any)=>{
    const rowData = await editableFormRef.current?.getRowData?.(rowIndex);
    if (rowData.product_name == undefined) {
      await editableFormRef.current?.setRowData?.(rowIndex, {discount_price:undefined})
    } else {
      await editableFormRef.current?.setRowData?.(rowIndex, {
        discount_price: FormatNum((isNaN(rowData.discount_price) ? 0 : rowData.discount_price), 4),
        discount: FormatNum(((isNaN(rowData.discount_price) ? 0 : rowData.discount_price) / rowData.price) > 1 ? 1
          : (isNaN((isNaN(rowData.discount_price) ? 0 : rowData.discount_price) / rowData.price) ? 0 : (isNaN(rowData.discount_price) ? 0 : rowData.discount_price) / rowData.price),2),
        discount_total: FormatNum(((isNaN(rowData.discount_price) ? 0 : rowData.discount_price) * (rowData.qty)), 2),
        is_free_gift: rowData.discount_price == 0,
      });

      await tableTotalHandler();
    }
  }

  //折后金额设置
  const tableDiscountTotal = async (rowIndex: any) => {
    const rowData = await editableFormRef.current?.getRowData?.(rowIndex);
    if (rowData.product_name == undefined) {
      await editableFormRef.current?.setRowData?.(rowIndex, {discount_total:undefined})
    }else {
      await editableFormRef.current?.setRowData?.(rowIndex, {
        discount_total: FormatNum((isNaN(rowData.discount_total) ? 0 : rowData.discount_total), 2),
        discount_price: FormatNum((isNaN(rowData.discount_total) ? 0 : rowData.discount_total / rowData.qty),4),
        discount: FormatNum(((rowData.discount_total / rowData.qty) / rowData.price) > 1 ? 1 : isNaN((rowData.discount_total / rowData.qty) / rowData.price) ? 0 : (rowData.discount_total / rowData.qty) / rowData.price, 2),
        is_free_gift: rowData.discount_total == 0,
      })

      await tableTotalHandler()
    }
  }

  const deleteRowBtn = (row: any) => (
    <Button
      key={`delete` + row.id}
      title={"删除"}
      size={'small'}
      icon={<DeleteOutlined/>}
      onClick={async () => {
        const tableDataSource = formF.getFieldValue("table") as API.OrderDetail[];

        const data = tableDataSource.filter((item) => (item.id !== row.id))
        await formF.setFieldValue("table", data);

        await tableTotalHandler()
      }}
    />
  );

  const copyRowBtn = (row: any) => (
    <Button
      key={`copy` + row.id}
      style={{marginLeft:3}}
      title={"复制"}
      size={'small'}
      icon={<CopyOutlined/>}
      onClick={async () => {
        const data = editableFormRef.current?.getRowData(row.id)
        actionRef.current?.addEditRecord?.(
          {...data, id: Date.now(),},
          {newRecordType:'dataSource', position:'bottom'});
      }}
      onBlur={async () => {
        await tableTotalHandler()
      }}
    />
  );

  const addRowBtn = (row: any) => (
    <Button
      key={`add` +  row.id}
      style={{marginLeft:3}}
      size={'small'}
      title={"新增"}
      icon={<FileAddOutlined/>}
      onClick={()=>{
        const newRow ={id: Date.now()}
        let tableDataSource = formRef.current?.getFieldValue('table') as API.OrderDetail[];
        if (tableDataSource === undefined) {
          tableDataSource = [newRow]
        }else {
          tableDataSource = [...tableDataSource, newRow];
        }
        formF.setFieldsValue({
          table: tableDataSource,
        });
        setEditableRowKeys(tableDataSource.map(({ id }) => id));
      }}
    />
  );

  const addTableNewLine = () => {
    const newRow ={id: Date.now()}
    let tableDataSource = formRef.current?.getFieldValue('table') as API.OrderDetail[];
    if (tableDataSource === undefined) {
      tableDataSource = [newRow]
    }else {
      tableDataSource = [...tableDataSource, newRow];
    }
    formF.setFieldsValue({
      table: tableDataSource,
    });
    setEditableRowKeys(tableDataSource.map(({ id }) => id));
  }


  const columns: ProColumns<API.OrderDetail>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 45,
      shouldCellUpdate: (record, prevRecord) =>  record.product_name !== prevRecord.product_name
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      hideInTable: ViewOrderNo != undefined || ViewOrderNo != null || Type == "query",
      width: 88,
      shouldCellUpdate: (record, prevRecord) =>  record.product_name !== prevRecord.product_name
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      valueType:'select',
      ellipsis: true,
      key: "product_name",
      formItemProps: {
        required:true,
        rules: [{ required: true },{ warningOnly: true }, ],
      },
      width: 320,
      fieldProps: (_,schema)=>{
        return {
          // autoFocus:true,
          showArrow:false,
          open:false,
          size:'small',
          allowClear:false,
          // showSearch:true,
          onClick: ()=> {
            setProductChecked(false);
            setProductModelOpen(true);
            setTableRowIndex(schema?.rowIndex);
          },
        }
      },
      shouldCellUpdate: (record, prevRecord) => record.product_name !== prevRecord.product_name,
    },
    {
      title: '产品条码',
      dataIndex: 'barcode',
      width: 120,
      ellipsis: true,
      key: 'barcode',
      readonly:true,
      initialValue:' ',
      fieldProps:{
        disabled:true,
        size:'small',
      },
      shouldCellUpdate: (record, prevRecord) => record.barcode !== prevRecord.barcode,
    },
    {
      title: '数量',
      dataIndex: 'qty',
      valueType: 'digit',
      formItemProps: {
        rules: [{ required: true, message: '请填写商品数量' }, {pattern: (/^[0-9]+$/), message: "请填写数量"}],
      },
      fieldProps:(_, { rowIndex })=>{
        return {
          controls:false,
          precision: 0,
          // min:1,
          size:'small',
          style:{width:68},
          onBlur: async()=>{await tableQtyHandler(rowIndex)},
        }
      },
      shouldCellUpdate: (record, prevRecord) => record.qty !== prevRecord.qty,
      width: 70,
    },
    {
      title: '单价',
      dataIndex: 'price',
      valueType: 'digit',
      readonly:true,
      formItemProps: {
        rules: [{ required: true, message: '请填写单价' }],
      },
      fieldProps:{
        //小数位
        precision:2,
        disabled:true,
        defaultValue:0,
        size:'small',
      },
      shouldCellUpdate: (record, prevRecord) => record.price !== prevRecord.price,
      width: 60,
    },
    {
      title: '金额',
      width: 80,
      dataIndex: 'total',
      valueType: 'digit',
      readonly:true,
      fieldProps:{
        //小数位
        controls:false,
        precision:2,
        disabled:true,
        size:'small',
      },
      shouldCellUpdate: (record, prevRecord) =>  record.product_name !== prevRecord.product_name
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      valueType: 'digit',
      formItemProps: {
        rules: [{required: true ,message: "请输入折扣"},],
      },
      fieldProps:(_, { rowIndex }) => {
        return {
          controls:false,
          precision: 2,
          min:0,
          max:1,
          size:'small',
          style:{width:68},
          onBlur:async ()=>{await tableDiscountHandler(rowIndex)}
        }},
      shouldCellUpdate: (record, prevRecord) => record.discount !== prevRecord.discount,
      width: 70,
    },
    {
      title: '折后单价',
      dataIndex: 'discount_price',
      valueType: 'digit',
      formItemProps: {
        rules: [{ required: true, message: '请输入折后单价' }],
      },
      fieldProps:(_, { rowIndex })=>{
        return {
          controls:false,
          precision: 2,
          min:0,
          size:'small',
          style:{width:80},
          onBlur: async () => {await tableDiscountPrice(rowIndex)}
        }},
      shouldCellUpdate: (record, prevRecord) => record.discount_price !== prevRecord.discount_price,
      width: 80,
    },
    {
      title: '折后金额',
      dataIndex: 'discount_total',
      valueType: 'digit',
      formItemProps: {
        rules: [{ required: true, message: '请输入折后金额' }],
      },
      fieldProps:(_, { rowIndex })=>{
        return {
          //小数位
          controls:false,
          precision:2,
          size:'small',
          style:{width:105},
          onBlur: async () => {await tableDiscountTotal(rowIndex)}
        }
      },
      width: 105,
      shouldCellUpdate: (record, prevRecord) => record.discount_total !== prevRecord.discount_total,
      // hideInTable:true,
    },
    {
      title: '赠品',
      dataIndex: 'is_free_gift',
      // valueType: 'select',
      readonly:true,
      formItemProps: {
        // rules: [{ required: true, message: '' }],
      },
      valueEnum: {
        false: {
          text: '否',
        },
        true: {
          text: '是',
        },
      },
      shouldCellUpdate: (record, prevRecord) => record.is_free_gift !== prevRecord.is_free_gift,
      width: 45,
    },
    {
      title: '箱',
      dataIndex: 'box_qty',
      valueType: 'digit',
      readonly:true,
      fieldProps:{
        //小数位
        precision:2,
        disabled:true,
        size:'small',
        style:{width:50},
      },
      width: 50,
      shouldCellUpdate: (record, prevRecord) => record.box_qty !== prevRecord.box_qty,
      // hideInTable:true,
    },
    {
      title: '箱规',
      dataIndex: 'box_rules',
      width: 50,
      readonly:true,
      fieldProps:{
        //小数位
        precision:0,
        disabled:true,
        size:'small',
        style:{width:50},
      },
      shouldCellUpdate: (record, prevRecord) => record.box_rules !== prevRecord.box_rules,
    },
    {
      title: '备注',
      dataIndex: 'note',
      ellipsis: true,
      width: 150,
      fieldProps:{size:'small',},
      shouldCellUpdate: (record, prevRecord) => record.note !== prevRecord.note,
    },
  ];


  //合计列设置
  const onSummary = (currentData: any) => {
    const data = ( currentData as API.OrderDetail[]).reduce((total, currentValue, ) => {
        //设置产品合计金额
        const discountTotalCount = total.discount_total_count + (currentValue?.discount_total || 0)
        const orderQtyTotal = total.qtyTotal + (currentValue?.qty || 0);

        const express_fee = formRef.current?.getFieldValue('express_fee');
        const discount_amount = formRef.current?.getFieldValue('discount_amount');
        const order_amount = ((discountTotalCount) + express_fee - discount_amount);

        formRef.current?.setFieldsValue({
          total_sales_amount: FormatNum(discountTotalCount, 2),
          order_amount: FormatNum(order_amount,2),
          order_qty:orderQtyTotal,
        })
        return {
          qtyTotal:total.qtyTotal + (currentValue?.qty || 0),
          discount_total_count: total.discount_total_count + (currentValue?.discount_total || 0),
          box_qty_total: total.box_qty_total + (currentValue?.box_qty || 0),
        };
      },
      {qtyTotal:0, discount_total_count:0,  box_qty_total:0},
    );

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          {ViewOrderNo != undefined || ViewOrderNo != null || Type == "query"?
            null :
            <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
          }
          <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={2} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{data.qtyTotal}</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={6}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={7}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={9}>{data.discount_total_count.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={10}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={11}>{data.box_qty_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={12}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={13}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={14}>{null}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (

    <>
      {ViewOrderNo != undefined || ViewOrderNo != null || Type == "query" ?
        null
        :
        <Button
          type={"primary"}
          key={"addProduct"}
          onClick={()=>{
            setProductChecked(true);
            setProductModelOpen(true)
          }}
        >
          添加产品
        </Button>
      }
      <ProForm.Item
        shouldUpdate
        name={"table"}
        key={"table"}
        style={{marginBottom:0}}
        rules={[{required:true, message:"请至少添加一个产品"}]}
      >
        <EditableProTable<API.OrderDetail>
          rowKey="id"
          bordered={true}
          scroll={ViewOrderNo != undefined || ViewOrderNo != null || Type == "query" ? { y:420} : {x:1680, y:420}}
          form={{ignoreRules:false}}
          size={'small'}
          actionRef={actionRef}
          editableFormRef={editableFormRef}
          columns={columns}
          // options={{density:false, fullScreen:false, reload:false, setting:true}}
          recordCreatorProps={false}
          summary={() => {return onSummary(summaryData)}}
          cardProps={{bodyStyle:{'padding':0}}}
          formItemProps={{style:{marginBottom:0}}}
          editable={{
            type: 'multiple',
            editableKeys,
            form: form,
            deleteText: <DeleteOutlined/>,
            onChange: setEditableRowKeys,
            actionRender: (row) => {
              return [
                <div key={`actionButtom${row.id}`} style={{gap:15}}>{deleteRowBtn(row)} {copyRowBtn(row)} {addRowBtn(row)}</div>];
            },
          }}
        />
      </ProForm.Item>
      {ViewOrderNo != undefined || ViewOrderNo != null || Type == "query" ?
        null
        :
        <Button
          type="dashed"
          size={'small'}
          style={{margin:0}}
          block
          onClick={() => {addTableNewLine()}}
          icon={<PlusOutlined />}
        >
          新建一行
        </Button>
      }


      <SelectSaleProduct
        productModelOpen={productModelOpen}
        setProductModelOpen={setProductModelOpen}
        formRef={formRef}
        handleOk={handleOk}
        tableTotalHandler={tableTotalHandler}
        orderType={orderType}
        productChecked={productChecked}
        setProductCheckedRows={setProductCheckedRows}
        selectTreeKeys={selectTreeKeys}
        setSelectTreeKeys={setSelectTreeKeys}
        type={"edit"}
      />
    </>
  )
}

//成本调整
export const InventoryOrderEditTable: React.FC<any> = (props) => {
  const {actionRef, initialState, editableFormRef, formRef, form,
    orderType, editableKeys, setEditableRowKeys, summaryData,
    tableTotalHandler, ViewOrderNo, Type} = props;

  //产品多选单选设置
  const [productChecked, setProductChecked] = useState(false);
  const [productCheckedRows, setProductCheckedRows] = useState([]);
  //正在编辑的商品行
  const [tableRowIndex, setTableRowIndex] = useState<number>();
  // const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);

  const [productModelOpen, setProductModelOpen] = useState(false);

  //设置单选行内容
  const setTableRowData = (record: any, order_discount: any) => {
    editableFormRef.current?.setRowData(tableRowIndex, {
      product_name: record.name,
      barcode: record.barcode,
      qty: 1,
      price: record.cost_price,
      amount: record.cost_price,
      total: record.cost_price,
      discount: order_discount == 1 ? 1 : order_discount,
      discount_price: FormatNum((order_discount == 1 ? record.cost_price : record.cost_price * order_discount),4),
      discount_total: FormatNum((order_discount == 1 ? record.cost_price : record.cost_price * order_discount),4),
      box_qty: ((1 / (record.box_rules ? record.box_rules : 0)) == Infinity ? 0 : (1 / record.box_rules)),
      box_rules: record.box_rules ? record.box_rules : 0,
      is_free_gift: record.cost_price == 0,
    })
  };

  //产品添加
  const handleOk = () => {
    //获取全局折扣设置
    const order_discount = formRef.current?.getFieldValue("order_discount")

    //如果是单选
    if (!productChecked && productCheckedRows.length > 0){
      setTableRowData(productCheckedRows[0], order_discount)
      setProductModelOpen(false);
    }else {
      if (productCheckedRows.length > 0) {
        //多选处理
        const tableDataSource = formRef.current?.getFieldValue("table") as API.OrderDetail[];

        let data_arr: any = []
        productCheckedRows.map((values: any, index)=>{
          data_arr.push(
            {
              id: Date.now()+index,
              product_name: values.name,
              barcode: values.barcode,
              qty: 1,
              price: values.price,
              amount: values.price,
              total: values.price,
              discount: order_discount == 1 ? 1 : order_discount,
              discount_price: FormatNum((order_discount == 1 ? values.price : values.price * order_discount),4),
              discount_total: FormatNum((order_discount == 1 ? values.price : values.price * order_discount),4),
              box_qty: ((1 / (values.box_rules ? values.box_rules : 0)) == Infinity ? 0 : (1 / values.box_rules)),
              box_rules: values.box_rules ? values.box_rules : 0,
              is_free_gift: values.price == 0,
            }
          )
        });
        if (tableDataSource != undefined){
          data_arr = [...tableDataSource, ...data_arr]
        }
        formRef.current?.setFieldsValue({
          table: data_arr
        })
        //处理多选编辑项
        // @ts-ignore
        setEditableRowKeys(data_arr.map(({ id }) => id));
      }
    }
    setProductModelOpen(false);
  };

  //数量设置
  const tableQtyHandler = async (rowIndex: any) => {
    const rowData = await editableFormRef.current?.getRowData?.(rowIndex);
    if (rowData.product_name == undefined) {
      await editableFormRef.current?.setRowData?.(rowIndex, {qty:undefined})
    }
    else {
      await editableFormRef.current?.setRowData?.(rowIndex, {
        qty: (isNaN(rowData.qty) || rowData.qty == 0) ? 1 : rowData.qty,
        total: (isNaN(rowData.qty) || rowData.qty == 0) ? rowData.price : rowData.qty * rowData.price,
        discount_total: (isNaN(rowData.qty) || rowData.qty == 0) ? rowData.discount_price : rowData.qty * rowData.discount_price,
        box_qty: (((isNaN(rowData.qty) || rowData.qty == 0) ? 1 : rowData.qty) / rowData.box_rules)==Infinity ? 0 : FormatNum((((isNaN(rowData.qty) || rowData.qty == 0) ? 1 : rowData.qty) / rowData.box_rules),2),
      });

      await tableTotalHandler()
    }
  }

  //折后单价设置
  const tableDiscountPrice = async (rowIndex: any)=>{
    const rowData = await editableFormRef.current?.getRowData?.(rowIndex);
    if (rowData.product_name == undefined) {
      await editableFormRef.current?.setRowData?.(rowIndex, {discount_price:undefined})
    } else {
      await editableFormRef.current?.setRowData?.(rowIndex, {
        discount_price: FormatNum((isNaN(rowData.discount_price) ? 0 : rowData.discount_price), 4),
        discount: FormatNum(((isNaN(rowData.discount_price) ? 0 : rowData.discount_price) / rowData.price) > 1 ? 1
          : (isNaN((isNaN(rowData.discount_price) ? 0 : rowData.discount_price) / rowData.price) ? 0 : (isNaN(rowData.discount_price) ? 0 : rowData.discount_price) / rowData.price),2),
        discount_total: FormatNum(((isNaN(rowData.discount_price) ? 0 : rowData.discount_price) * (rowData.qty)), 2),
        is_free_gift: rowData.discount_price == 0,
      });

      await tableTotalHandler();
    }
  }

  //折后金额设置
  const tableDiscountTotal = async (rowIndex: any) => {
    const rowData = await editableFormRef.current?.getRowData?.(rowIndex);
    if (rowData.product_name == undefined) {
      await editableFormRef.current?.setRowData?.(rowIndex, {discount_total:undefined})
    }else {
      await editableFormRef.current?.setRowData?.(rowIndex, {
        discount_total: FormatNum((isNaN(rowData.discount_total) ? 0 : rowData.discount_total), 2),
        discount_price: FormatNum((isNaN(rowData.discount_total) ? 0 : rowData.discount_total / rowData.qty),4),
        discount: FormatNum(((rowData.discount_total / rowData.qty) / rowData.price) > 1 ? 1 : isNaN((rowData.discount_total / rowData.qty) / rowData.price) ? 0 : (rowData.discount_total / rowData.qty) / rowData.price, 2),
        is_free_gift: rowData.discount_total == 0,
      })

      await tableTotalHandler()
    }
  }

  const deleteRowBtn = (row: any) => (
    <Button
      key={`delete` + row.id}
      title={"删除"}
      size={'small'}
      icon={<DeleteOutlined/>}
      onClick={async () => {
        const tableDataSource = formRef.current?.getFieldValue("table") as API.OrderDetail[];

        const data = tableDataSource.filter((item) => (item.id !== row?.id))
        await formRef?.current?.setFieldValue("table", data);

        await tableTotalHandler()
      }}
    />
  );

  const copyRowBtn = (row: any) => (
    <Button
      key={`copy` + row.id}
      style={{marginLeft:3}}
      title={"复制"}
      size={'small'}
      icon={<CopyOutlined/>}
      onClick={async () => {
        const data = editableFormRef.current?.getRowData(row.id)
        actionRef.current?.addEditRecord?.(
          {...data, id: Date.now(),},
          {newRecordType:'dataSource', position:'bottom'});
      }}
      onBlur={async () => {
        await tableTotalHandler()
      }}
    />
  );

  const addRowBtn = (row: any) => (
    <Button
      key={`add` +  row.id}
      style={{marginLeft:3}}
      size={'small'}
      title={"新增"}
      icon={<FileAddOutlined/>}
      onClick={()=>{
        actionRef.current?.addEditRecord?.(
          {id: Date.now(),},
          {newRecordType:'dataSource', position:'bottom'});
      }}
    />
  );

  const addTableNewLine = () => {
    const newRow ={id: Date.now()}
    let tableDataSource = formRef.current?.getFieldValue('table') as API.OrderDetail[];
    if (tableDataSource === undefined) {
      tableDataSource = [newRow]
    }else {
      tableDataSource = [...tableDataSource, newRow];
    }
    formRef.current?.setFieldsValue({
      table: tableDataSource,
    });
    setEditableRowKeys(tableDataSource.map(({ id }) => id));
  }


  const columns: ProColumns<API.OrderDetail>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 38,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      hideInTable: ViewOrderNo != undefined || ViewOrderNo != null,
      width: 80,
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      valueType:'select',
      ellipsis: true,
      key: "product_name",
      formItemProps: {
        required:true,
        rules: [{ required: true },{ warningOnly: true }, ],
      },
      width: 320,
      fieldProps: (_,schema)=>{
        return {
          // maxTagCount:1,
          // autoFocus:true,
          showArrow:false,
          open:false,
          size:'small',
          allowClear:false,
          onClick: ()=> {
            setProductChecked(false);
            setProductModelOpen(true);
            setTableRowIndex(schema?.rowIndex);
          },
        }
      },
      shouldCellUpdate: (record, prevRecord) => record.product_name !== prevRecord.product_name,
    },
    {
      title: '产品条码',
      dataIndex: 'barcode',
      width: 98,
      ellipsis: true,
      key: 'barcode',
      readonly:true,
      initialValue:' ',
      fieldProps:{
        disabled:true,
        size:'small',
      },
      shouldCellUpdate: (record, prevRecord) => record.barcode !== prevRecord.barcode,
    },
    {
      title: '数量',
      dataIndex: 'qty',
      valueType: 'digit',
      key: 'qty',
      formItemProps: {
        rules: [{ required: true, message: '请填写商品数量' }, {pattern: (/^[0-9]+$/), message: "请填写数量"}],
      },
      fieldProps:(_, { rowIndex })=>{
        return {
          controls:false,
          precision: 0,
          // min:1,
          size:'small',
          style:{width:78},
          onBlur: async()=>{await tableQtyHandler(rowIndex)},
        }
      },
      shouldCellUpdate: (record, prevRecord) => record.qty !== prevRecord.qty,
      width: 78,
    },
    {
      title: '调整前单价',
      dataIndex: 'price',
      valueType: 'digit',
      readonly:true,
      formItemProps: {
        rules: [{ required: true, message: '请填写单价' }],
      },
      fieldProps:{
        //小数位
        precision:2,
        disabled:true,
        defaultValue:0,
        size:'small',
      },
      shouldCellUpdate: (record, prevRecord) => record.price !== prevRecord.price,
      width: 70,
    },
    {
      title: '调整前金额',
      width: 70,
      dataIndex: 'total',
      valueType: 'digit',
      readonly:true,
      fieldProps:{
        //小数位
        controls:false,
        precision:2,
        disabled:true,
        size:'small',
      },
    },
    // {
    //   title: '折扣',
    //   dataIndex: 'discount',
    //   valueType: 'digit',
    //   readonly: true,
    //   formItemProps: {
    //     rules: [{required: true ,message: "请输入折扣"},],
    //   },
    //   fieldProps:(_, { rowIndex }) => {
    //     return {
    //       controls:false,
    //       precision: 2,
    //       min:0,
    //       max:1,
    //       size:'small',
    //       style:{width:68},
    //       onBlur:async ()=>{await tableDiscountHandler(rowIndex)}
    //     }},
    //   shouldCellUpdate: (record, prevRecord) => record.discount !== prevRecord.discount,
    //   width: 70,
    // },
    {
      title: '调整后单价',
      dataIndex: 'discount_price',
      valueType: 'digit',
      formItemProps: {
        rules: [{ required: true, message: '请输入折后单价' }],
      },
      fieldProps:(_, { rowIndex })=>{
        return {
          controls:false,
          precision: 2,
          min:0,
          size:'small',
          style:{width:70},
          onBlur: async () => {await tableDiscountPrice(rowIndex)}
        }},
      shouldCellUpdate: (record, prevRecord) => record.discount_price !== prevRecord.discount_price,
      width: 70,
    },
    {
      title: '调整后金额',
      dataIndex: 'discount_total',
      valueType: 'digit',
      formItemProps: {
        rules: [{ required: true, message: '请输入折后金额' }],
      },
      fieldProps:(_, { rowIndex })=>{
        return {
          //小数位
          controls:false,
          precision:2,
          size:'small',
          style:{width:70},
          onBlur: async () => {await tableDiscountTotal(rowIndex)}
        }
      },
      width: 70,
      shouldCellUpdate: (record, prevRecord) => record.discount_total !== prevRecord.discount_total,
      // hideInTable:true,
    },
    {
      title: '赠品',
      dataIndex: 'is_free_gift',
      // valueType: 'select',
      readonly:true,
      formItemProps: {
        // rules: [{ required: true, message: '' }],
      },
      valueEnum: {
        false: {
          text: '否',
        },
        true: {
          text: '是',
        },
      },
      shouldCellUpdate: (record, prevRecord) => record.is_free_gift !== prevRecord.is_free_gift,
      width: 40,
    },
    {
      title: '箱',
      dataIndex: 'box_qty',
      valueType: 'digit',
      readonly:true,
      fieldProps:{
        //小数位
        precision:2,
        disabled:true,
        size:'small',
        style:{width:50},
      },
      width: 50,
      shouldCellUpdate: (record, prevRecord) => record.box_qty !== prevRecord.box_qty,
      // hideInTable:true,
    },
    {
      title: '箱规',
      dataIndex: 'box_rules',
      width: 50,
      readonly:true,
      fieldProps:{
        //小数位
        precision:0,
        disabled:true,
        size:'small',
        style:{width:50},
      },
      shouldCellUpdate: (record, prevRecord) => record.box_rules !== prevRecord.box_rules,
    },
    {
      title: '备注',
      dataIndex: 'note',
      ellipsis: true,
      width: 150,
      fieldProps:{size:'small',},
      shouldCellUpdate: (record, prevRecord) => record.note !== prevRecord.note,
    },
  ];

  const product_columns: ProColumns<API.Product>[] = [
    {
      title: '产品条码',
      dataIndex: 'barcode',
      width: 88,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 240,
    },
    {
      title: '数量',
      dataIndex: 'qty',
      width: 60,
      hideInSearch: true,
    },
    {
      title: '成本单价',
      dataIndex: 'cost_price',
      width: 60,
      hideInTable: orderType === 10,
      hideInSearch: true,
    },
    // {
    //   title: '图片',
    //   dataIndex: 'product_image',
    //   valueType: 'image',
    //   width: 60,
    //   hideInSearch: true,
    // },
    {
      title: '产品分类',
      dataIndex: 'product_classify_id',
      valueType: 'treeSelect',
      hideInTable: true,
      fieldProps: {
        options: initialState?.ProductClassify,
        treeDefaultExpandAll:true,
      },
      width: 60,
    },
  ];

  //合计列设置
  const onSummary = (currentData: any) => {
    const data = ( currentData as API.OrderDetail[]).reduce((total, currentValue, ) => {
        //设置产品合计金额
        const discountTotalCount = total.discount_total_count + (currentValue?.discount_total || 0)
        const orderQtyTotal = total.qtyTotal + (currentValue?.qty || 0);

        const express_fee = formRef.current?.getFieldValue('express_fee');
        const discount_amount = formRef.current?.getFieldValue('discount_amount');
        const order_amount = (discountTotalCount + express_fee - discount_amount);

        formRef.current?.setFieldsValue({
          total_sales_amount: FormatNum(discountTotalCount, 2),
          order_amount: FormatNum(order_amount,2),
          order_qty:orderQtyTotal,
        })
        return {
          qtyTotal:total.qtyTotal + (currentValue?.qty || 0),
          discount_total_count: total.discount_total_count + (currentValue?.discount_total || 0),
          box_qty_total: total.box_qty_total + (currentValue?.box_qty || 0),
        };
      },
      {qtyTotal:0, discount_total_count:0,  box_qty_total:0},
    );

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          {ViewOrderNo != undefined || ViewOrderNo != null ?
            null :
            <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
          }
          <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={2} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{data.qtyTotal}</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={6}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={7}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={8}>{data.discount_total_count.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={9}>{null}</Table.Summary.Cell>
          {/*<Table.Summary.Cell index={10}>{null}</Table.Summary.Cell>*/}
          <Table.Summary.Cell index={10}>{data.box_qty_total.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={11}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={12}>{null}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <>
      {ViewOrderNo != undefined || ViewOrderNo != null || Type == "query" ?
        null
        :
        <Button
          type={"primary"}
          key={"addProduct"}
          onClick={() => {
            setProductChecked(true);
            setProductModelOpen(true)
          }}
        >
          添加产品
        </Button>
      }

      <ProForm.Item
        name={"table"}
        key={"table"}
        style={{marginBottom:0}}
        rules={[{required:true, message:"请至少添加一个产品"}]}
      >
        <EditableProTable<API.OrderDetail>
          rowKey="id"
          bordered={true}
          scroll={{y: 900}}
          form={{ignoreRules:false}}
          size={'small'}
          actionRef={actionRef}
          editableFormRef={editableFormRef}
          columns={columns}
          // options={{density:false, fullScreen:false, reload:false, setting:true}}
          recordCreatorProps={false}
          summary={() => {return onSummary(summaryData)}}
          cardProps={{bodyStyle:{'padding':0}}}
          formItemProps={{style:{marginBottom:0}}}
          editable={{
            type: 'multiple',
            editableKeys,
            form: form,
            deleteText: <DeleteOutlined/>,
            onChange: setEditableRowKeys,
            actionRender: (row) => {
              return [
                <div key={`actionButtom${row.id}`} style={{gap:15}}>{deleteRowBtn(row)} {copyRowBtn(row)} {addRowBtn(row)}</div>];
            },
          }}
        />
      </ProForm.Item>

      {ViewOrderNo != undefined || ViewOrderNo != null || Type == "query" ?
        null
        :
        <Button
          type="dashed"
          size={'small'}
          style={{ margin: 0 }}
          block
          onClick={() => {
            addTableNewLine()
          }}
          icon={<PlusOutlined />}
        >
          新建一行
        </Button>
      }

      <Modal
        title="选择产品"
        open={productModelOpen}
        maskClosable={true}
        width={960}
        destroyOnClose={true}
        onOk={handleOk}
        onCancel={()=>{setProductModelOpen(false)}}
        afterClose={async ()=>{
          //处理合计
          await tableTotalHandler()
        }}
      >
        <ProTable
          search={{span:8, labelWidth:80,defaultCollapsed:false, defaultColsNumber:20}}
          size={'small'}
          options={false}
          rowKey={"barcode"}
          scroll={{y: 400}}
          columns={product_columns}
          request={(params) => {
            params.storehouse_id = formRef?.current?.getFieldValue('storehouse_id')
            return getProduct(params)
          }}
          pagination={{
            showQuickJumper: true,
            defaultPageSize: 20,
            showSizeChanger:true,
          }}
          rowSelection={{
            // 注释该行则默认不显示下拉选项
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            type:(productChecked == true) ? "checkbox" : "radio",
            onChange:(selectedRowKeys, selectedRows)=>{
              // @ts-ignore
              setProductCheckedRows(selectedRows);
            },
          }}
        />
      </Modal>
    </>
  )
}

//财务类型
export const FinanceOrderEditTable: React.FC<any> = (props) => {
  const {actionRef, editableFormRef, formRef, form,
    orderType, editableKeys, setEditableRowKeys, summaryData,
    tableTotalHandler, ViewOrderNo, Type} = props;

  //产品多选单选设置
  const [productChecked, setProductChecked] = useState(false);
  const [productCheckedRows, setProductCheckedRows] = useState([]);
  //正在编辑的商品行
  const [tableRowIndex, setTableRowIndex] = useState<number>();
  // const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);

  const [productModelOpen, setProductModelOpen] = useState(false);


  //设置单选行内容
  const setTableRowData = (record: any) => {
    editableFormRef.current?.setRowData(tableRowIndex, {
      product_name: record.name,
      barcode: record.as_no,
      discount_total: 0.00,
    })
  };

  //产品添加
  const handleOk = () => {
    //如果是单选
    if (productChecked == false && productCheckedRows.length > 0){
      setTableRowData(productCheckedRows[0])
      setProductModelOpen(false);
    }else {
      if (productCheckedRows.length > 0) {
        //多选处理
        const tableDataSource = formRef.current?.getFieldValue("table") as API.OrderDetail[];
        let data_arr: any = []
        productCheckedRows.map((values: any, index)=>{
          data_arr.push(
            {
              id: Date.now()+index,
              product_name: values.name,
              barcode: values.as_no,
              discount_total: 0.00,
            }
          )
        });
        if (tableDataSource != undefined){
          data_arr = [...tableDataSource, ...data_arr]
        }
        formRef.current?.setFieldsValue({
          table: data_arr
        })
        //处理多选编辑项
        // @ts-ignore
        setEditableRowKeys(data_arr.map(({ id }) => id));
      }
    }
    setProductModelOpen(false);
  };


  //折后金额设置
  const tableDiscountTotal = async (rowIndex: any) => {
    const rowData = await editableFormRef.current?.getRowData?.(rowIndex);
    if (rowData.product_name == undefined) {
      await editableFormRef.current?.setRowData?.(rowIndex, {discount_total:undefined})
    }else {
      await editableFormRef.current?.setRowData?.(rowIndex, {
        discount_total: FormatNum((isNaN(rowData.discount_total) ? 0 : rowData.discount_total), 2),
      })

      await tableTotalHandler()
    }
  }

  const deleteRowBtn = (row: any) => (
    <Button
      key={`delete` + row.id}
      title={"删除"}
      size={'small'}
      icon={<DeleteOutlined/>}
      onClick={async () => {
        const tableDataSource = formRef.current?.getFieldValue("table") as API.OrderDetail[];

        const data = tableDataSource.filter((item) => (item.id !== row?.id))
        await formRef?.current?.setFieldValue("table", data);

        await tableTotalHandler()
      }}
    />
  );

  const copyRowBtn = (row: any) => (
    <Button
      key={`copy` + row.id}
      style={{marginLeft:3}}
      title={"复制"}
      size={'small'}
      icon={<CopyOutlined/>}
      onClick={async () => {
        const data = editableFormRef.current?.getRowData(row.id)
        actionRef.current?.addEditRecord?.(
          {...data, id: Date.now(),},
          {newRecordType:'dataSource', position:'bottom'});
      }}
      onBlur={async () => {
        await tableTotalHandler()
      }}
    />
  );

  const addRowBtn = (row: any) => (
    <Button
      key={`add` +  row.id}
      style={{marginLeft:3}}
      size={'small'}
      title={"新增"}
      icon={<FileAddOutlined/>}
      onClick={()=>{
        actionRef.current?.addEditRecord?.(
          {id: Date.now(),},
          {newRecordType:'dataSource', position:'bottom'});
      }}
    />
  );

  const addTableNewLine = () => {
    const newRow ={id: Date.now()}
    let tableDataSource = formRef.current?.getFieldValue('table') as API.OrderDetail[];
    if (tableDataSource === undefined) {
      tableDataSource = [newRow]
    }else {
      tableDataSource = [...tableDataSource, newRow];
    }
    formRef.current?.setFieldsValue({
      table: tableDataSource,
    });
    setEditableRowKeys(tableDataSource.map(({ id }) => id));
  }


  const columns: ProColumns<API.OrderDetail>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "index",
      width: 20,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      hideInTable: ViewOrderNo != undefined || ViewOrderNo != null,
      width: 30,
    },
    {
      title: '科目编号',
      dataIndex: 'barcode',
      width: 60,
      ellipsis: true,
      readonly:true,
      initialValue:' ',
      fieldProps:{
        disabled:true,
        size:'small',
      },
      shouldCellUpdate: (record, prevRecord) => record.barcode !== prevRecord.barcode,
    },
    {
      title: '科目名称',
      dataIndex: 'product_name',
      valueType:'select',
      ellipsis: true,
      key: "product_name",
      formItemProps: {
        required:true,
        rules: [{ required: true },{ warningOnly: true }, ],
      },
      width: 100,
      fieldProps: (_,schema)=>{
        return {
          // maxTagCount:1,
          // autoFocus:true,
          showArrow:false,
          open:false,
          size:'small',
          allowClear:false,
          onClick: ()=> {
            setProductChecked(false);
            setProductModelOpen(true);
            setTableRowIndex(schema?.rowIndex);
          },
        }
      },
      shouldCellUpdate: (record, prevRecord) => record.product_name !== prevRecord.product_name,
    },
    {
      title: '金额',
      dataIndex: 'discount_total',
      valueType: 'digit',
      key: "discount_total",
      formItemProps: {
        rules: [{ required: true, message: '请输入折后金额' }],
      },
      fieldProps:(_, { rowIndex })=>{
        return {
          //小数位
          controls:false,
          precision:2,
          onBlur: async () => {await tableDiscountTotal(rowIndex)}
        }
      },
      width: 50,
      shouldCellUpdate: (record, prevRecord) => record.discount_total !== prevRecord.discount_total,
      // hideInTable:true,
    },
    {
      title: '备注',
      dataIndex: 'note',
      ellipsis: true,
      width: 150,
      fieldProps:{size:'small',},
      shouldCellUpdate: (record, prevRecord) => record.note !== prevRecord.note,
    },
  ];

  const as_columns: ProColumns<API.Product>[] = [
    {
      title: '科目编号',
      dataIndex: 'as_no',
      key: "barcode",
      width: 88,
    },
    {
      title: '科目名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 240,
    },
  ];

  //合计列设置
  const onSummary = (currentData: any) => {
    const data = ( currentData as API.OrderDetail[]).reduce((total, currentValue, ) => {
        //设置产品合计金额
        const discountTotalCount = total.discount_total_count + (currentValue?.discount_total || 0)

        formRef.current?.setFieldsValue({
          order_amount: FormatNum(discountTotalCount, 2),
        })
        return {
          discount_total_count: total.discount_total_count + (currentValue?.discount_total || 0),
        };
      },
      {discount_total_count:0},
    );

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          {ViewOrderNo != undefined || ViewOrderNo != null ?
            null :
            <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
          }
          <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={2} >{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{null}</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{data.discount_total_count.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={11}>{null}</Table.Summary.Cell>

        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <>
      {ViewOrderNo != undefined || ViewOrderNo != null || Type == "query" ?
        null
        :
        <Button
          type={"primary"}
          key={"addProduct"}
          onClick={() => {
            setProductChecked(true);
            setProductModelOpen(true)
          }}
        >
          选择科目
        </Button>
      }

      <ProForm.Item
        name={"table"}
        key={"table"}
        style={{marginBottom:0}}
        rules={[{required:true, message:"请至少添加一个产品"}]}
      >
        <EditableProTable<API.OrderDetail>
          rowKey="id"
          bordered={true}
          scroll={{y: 700}}
          form={{ignoreRules:false}}
          size={'small'}
          actionRef={actionRef}
          editableFormRef={editableFormRef}
          columns={columns}
          // options={{density:false, fullScreen:false, reload:false, setting:true}}
          recordCreatorProps={false}
          summary={() => {return onSummary(summaryData)}}
          cardProps={{bodyStyle:{'padding':0}}}
          formItemProps={{style:{marginBottom:0}}}
          editable={{
            type: 'multiple',
            editableKeys,
            form: form,
            deleteText: <DeleteOutlined/>,
            onChange: setEditableRowKeys,
            actionRender: (row) => {
              return [
                <div key={`actionButtom${row.id}`} style={{gap:15}}>{deleteRowBtn(row)} {copyRowBtn(row)} {addRowBtn(row)}</div>];
            },
          }}
        />
      </ProForm.Item>

      {ViewOrderNo != undefined || ViewOrderNo != null || Type == "query" ?
        null
        :
        <Button
          type="dashed"
          size={'small'}
          style={{ margin: 0 }}
          block
          onClick={() => {
            addTableNewLine()
          }}
          icon={<PlusOutlined />}
          hidden={ViewOrderNo != undefined || ViewOrderNo != null}
        >
          新建一行
        </Button>
      }

      <Modal
        title="选择科目"
        open={productModelOpen}
        maskClosable={true}
        width={800}
        destroyOnClose={true}
        onOk={handleOk}
        onCancel={()=>{setProductModelOpen(false)}}
        afterClose={async ()=>{
          //处理合计
          await tableTotalHandler()
        }}
      >
        <ProTable
          search={{span:8, labelWidth:80,defaultCollapsed:false, defaultColsNumber:20}}
          size={'small'}
          options={false}
          rowKey={"as_no"}
          scroll={{y: 400}}
          columns={as_columns}
          request={async (params) => {
            if (orderType === 11 || orderType === 12) {
              return getAsNo(params)
            }else if (orderType === 13) {
              return getGeneralCostASNO(params)
            }else if (orderType === 14) {
              return GetIncomeAS(params)
            }else if (orderType === 15) {
              return getGeneralCostASNO(params)
            }else if (orderType === 16) {
              return getGeneralCostASNO(params)
            }else if (orderType === 17) {
              return GetIncomeAS(params)
            }else if (orderType === 18) {
              return getAsNo(params)
            }
          }}
          pagination={false}
          rowSelection={{
            // 注释该行则默认不显示下拉选项
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            type:productChecked ? "checkbox" : "radio",
            onChange:(selectedRowKeys, selectedRows)=>{
              // @ts-ignore
              setProductCheckedRows(selectedRows);
            },
          }}
        />
      </Modal>
    </>
  )
}

export default {SaleOrderEditTable, InventoryOrderEditTable, FinanceOrderEditTable};
