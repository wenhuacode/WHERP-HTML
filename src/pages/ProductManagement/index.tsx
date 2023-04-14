import {Button, Drawer, message, Row, Col, Upload, Table, Divider, Form, Popconfirm} from 'antd';
import React, {useRef, useState} from 'react';
import type { ProColumns, ActionType, ProDescriptionsItemProps } from '@ant-design/pro-components';
// import type { ColumnsState } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTreeSelect, ProFormUploadButton,
  ProFormDigit, ProFormTextArea} from '@ant-design/pro-components';
import ProductClassifyTree from './components/ProductClassifyTree'
import {UploadOutlined} from "@ant-design/icons";
import type { UploadFile } from 'antd/es/upload/interface';
import lodash from 'lodash'
import {
  createProduct,
  deleteProduct,
  importProductExcelApi,
  updateProduct,
  getProductImage, getProductList
} from "@/services/ant-design-pro/product";
import {ProDescriptions} from "@ant-design/pro-components";
import {onImportExcel} from "@/utils/import_and_export";
import {BatchProduct} from "@/utils/batch";
import {useModel} from "@umijs/max";


const Product: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Product>();

  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [showDetail2, setShowDetail2] = useState<boolean>(false);
  const[editProduct, setEditProduct] = useState<API.Product>()
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [defaultImage, setDefaultImage] = useState<any[]>();

  const [modalVisit, setModalVisit] = useState<any>(false);
  const [productCheckedRows, setProductCheckedRows] = useState<any>([]);
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');

  const handleSaveProduct: (product: API.Product) => Promise<boolean> = async (product: any) => {
    const formData: FormData = new FormData();
    //将数据和文件写入formData
    formData.append('data', JSON.stringify(product));
    // @ts-ignore
    formData.append('image_files', fileList[0] ? fileList[0] : undefined);

    const hide = message.loading(`正在${product.id ? '修改' : '创建'}产品....`);
    const resp = product.id ? await updateProduct(formData, product.id) : await createProduct(formData);
    hide();
    if (resp && resp.success) {
      message.success('产品添加成功!');
      return true;
    }
    message.error('产品添加失败!');
    return false;
  };

  const handleDeleteProduct: (id: number) => Promise<boolean> = async (id) => {
    const hide = message.loading('正在删除产品....');
    const resp = await deleteProduct(id);

    hide();
    if (resp && resp.success) {
      message.success('产品删除成功!');
      return true;
    }

    message.error('产品删除失败!');
    return false;
  };



  const columns: ProColumns<API.Product>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      title: '序号',
      hideInSearch: true,
      fixed: 'left',
    },
    {
      dataIndex: 'product_no',
      title: '产品编码',
      width: 100,
      fixed: 'left',
      render: (text, record) => [
        <a
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
          }}
          target="_blank" rel="noopener noreferrer" key="view">
          {text}
        </a>,
      ]
    },
    {
      dataIndex: 'name',
      title: '产品名称',
      fixed: 'left',
      width: 260,
      ellipsis: true,
    },
    {
      dataIndex: 'barcode',
      title: '产品条码',
      width: 120,
    },
    {
      dataIndex: 'product_image',
      title: '产品图片',
      width: 120,
      hideInSearch: true,
      fieldProps: {
        width:26,
        height:26,
        placeholder:true,
      },
      valueType: 'image'
    },
    {
      dataIndex: 'product_classify_id',
      title: '品牌分类',
      valueType: 'treeSelect',
      fieldProps: {
        options: initialState?.ProductClassify,
        treeDefaultExpandAll: true,
      },
      width: 80,
    },
    {
      dataIndex: 'price',
      title: '产品单价',
      width: 80,
      hideInSearch: true,
    },
    {
      dataIndex: 'cost',
      title: '成本',
      width: 80,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      dataIndex: 'box_rules',
      title: '箱规',
      width: 50,
      hideInSearch: true,
    },
    {
      dataIndex: 'validity',
      title: '保质期',
      width: 60,
      hideInSearch: true,
    },
    {
      dataIndex: 'product_introduction',
      title: '产品简介',
      width: 160,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'supplier',
      title: '供应商',
      width: 180,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'is_stop',
      title: '是否停用',
      width: 100,
      filters: true,
      onFilter: true,
      valueEnum: {
        0: {
          text: '正常',
          status: 'Processing',
        },
        1: {
          text: '停用',
          status: 'Error',
        },
      },
    },
    {
      dataIndex: 'create_user',
      title: '创建人',
      width: 100,
      hideInSearch: true,
    },
    {
      dataIndex: 'add_time',
      title: '创建时间',
      key: 'showTime',
      valueType: 'dateTime',
      width: 150,
      sorter: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'modified',
      title: '修改时间',
      valueType: 'dateTime',
      width: 150,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 100,
      fixed: 'right',
      hideInDescriptions: true,
      render: (text, record: any, _, action) => [
        <Button
          size={'small'}
          key="editable"
          onClick={() => {
            // 清除缩略图
            setDefaultImage([]);
            handleModalVisible(true);
            setEditProduct(record);
            //设置默认显示的图片,获取image链接并存到DefaultImage，必须是list
            const product = record
            if(product.product_image){
              const image = {
                url: record.product_image,
              }
              setDefaultImage([image]);

              const imageName = (record.product_image.slice(28, ))
              getProductImage(imageName).then(res => {
                const files: any = new window.File([res], imageName, { type: "image/jpeg" });
                files.uid = 'rc-upload-'+(files.lastModified).toString()
                setFileList([files])
              })
            }
            // 深拷贝,然后删除image链接
            const data = lodash.cloneDeep(product);
            delete data.product_image;
            form.setFieldsValue(data);
            form.setFieldsValue({
              supplier_id:{label: data.supplier, value: data.supplier_id},
              product_classify_id:{label: data?.product_classify, value: data?.product_classify_id},
            });
          }}
        >
          改
        </Button>,
        <Popconfirm
          title="确定是否删除？删除后无法恢复"
          key={'redInkWriteOff'+ record.id}
          onConfirm={function(){
            handleDeleteProduct(record.id);
            action?.reload()
          }}
          // onVisibleChange={() => console.log('visible change')}
        >
          <Button
            size={'small'}
            danger={true}
            onSelect={() => action?.reload()}
            target="_blank" rel="noopener noreferrer" key="delete">
            删
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer
      title={false} header={{ title:false, breadcrumb: {} }}
    >
      <ProTable<API.Product>
        columns={columns}
        actionRef={actionRef}
        size={'small'}
        options={{ fullScreen:true }}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          type: "checkbox",
          onChange:(selectedRowKeys, selectedRows)=>{
            const data = selectedRows.map((value) => {
              return value.id
            })
            setProductCheckedRows(data);
          },
        }}
        request={(params) => {
          return getProductList(params)
        }}
        rowKey="product_no"
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 20,
          showSizeChanger:true,
        }}
        search={{labelWidth: 'auto', span:6 , defaultColsNumber:20}}
        scroll={{ x: 2400 }}
        editable={{}}
        toolbar={{
          title: '产品管理',
          // subTitle: '这里是子标题',
          tooltip: '产品信息管理',
          multipleLine: true,
        }}
        toolBarRender={() => [
          <Button
            key="show"
            type={'primary'}
            onClick={()=>{
              if (productCheckedRows.length == 0){
                message.error("请选择需要修改的数据")
              }else{
                setModalVisit(true)
              }
            }}>
            批量修改
          </Button>,

          <Upload
            key="5"
            beforeUpload={(file) => {
              return onImportExcel(file, importProductExcelApi);
            }}
            onRemove={() => {}}
            showUploadList={false}
          >
            <Button key="3" icon={<UploadOutlined />}>导入</Button>
          </Upload>,

          <Button key="1" type="primary" onClick={() => {
            setDefaultImage([]);
            handleModalVisible(true);
          }}>
            新增
          </Button>,
          <Button key="4"  onClick={() => {
            setShowDetail2(true);
          }}>
            分类管理
          </Button>,

        ]}

      />
      <DrawerForm
        form={form}
        title={"新增产品"}
        width="700px"
        drawerProps={{
          onClose:()=>{
            form.resetFields();
            setEditProduct(undefined);
            // //关闭浮层清空默认图片
            // setDefaultImage([]);
            setFileList([]);
          },
          destroyOnClose: true,
          forceRender: false,
          title:(editProduct?.id) ? "更新产品" : "新建产品",

        }}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={ async (values) => {
          if(values.product_image){
            values.product_image=null
          }
          //产品分类值调整修改
          if(values.product_classify_id){
            values.product_classify=values?.product_classify_id?.label
            values.product_classify_id=values?.product_classify_id?.value
          }
          try {
            const result  = await handleSaveProduct(values);
            if(result){
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }catch (errors) {
            message.error("操作失败")
          }
          // //关闭浮层清空默认图片
          setDefaultImage([]);
          setFileList([]);
          return true;
        }}
      >
        <Row gutter={12}>
          <Col span={12}>
            <ProFormText
              name="id"
              label="ID"
              hidden={true}
            />
            <ProFormText
              name="product_no"
              label="产品编号"
              tooltip="不能重复"
              placeholder="请输入产品编号"
              rules={[
                {
                  required: true,
                  message: "此项为必填项",
                },
              ]}
            />
            <ProFormText
              name="name"
              label="产品名称"
              placeholder="请输入产品名称"
              rules={[
                {
                  required: true,
                  message: "此项为必填项",
                },
              ]}
            />
            <ProFormUploadButton
              name="product_image"
              label="产品图片"
              fieldProps={{
                listType:"picture-card",
                maxCount:1,
                defaultFileList:defaultImage,
                beforeUpload: file => {
                  setFileList([file]);
                  return false;
                },
                onRemove:() => {
                  // //关闭浮层清空默认图片
                  setDefaultImage([]);
                  setFileList([]);
                  return true
                }
              }}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="barcode"
              label="产品条码"
              tooltip="不能重复"
              placeholder="请输入产品条码"
              rules={[
                {
                  required: true,
                  message: "此项为必填项",
                },
              ]}
            />
            <ProFormTreeSelect
              name="product_classify_id"
              label="产品分类"
              placeholder="请输入产品分类"
              rules={[
                {required: true, message: "此项为必填项",},
              ]}
              fieldProps={{
                labelInValue:true,
                treeDefaultExpandAll:true,
                onSelect: (_, node )=>{
                  form.setFieldsValue({
                    product_classify_path:node.parent_path
                  })
                }
              }}
              request={async () => {
                return initialState?.ProductClassify;
              }}
            />
          </Col>
        </Row>
        <Divider style={{marginTop: 0}}/>
        <Row gutter={16}>
          <Col span={12}>
            <ProFormDigit
              name="price"
              label="产品单价"
              placeholder="请输入产品单价"
              fieldProps={{ precision: 2 }}
              rules={[
                {
                  required: true,
                  message: "此项为必填项",
                },
              ]}
            />
            <ProFormDigit
              name="validity"
              label="保质期天数"
              placeholder="请输入保质期天使"
              fieldProps={{ precision: 0 }}
            />
            <ProFormSelect
              name="is_stop"
              label="状态"
              placeholder="请选择状态"
              valueEnum={{
                '0': {
                  text: '正常',
                  status: 'Success',
                },
                '1': {
                  text: '停用',
                  status: 'Error',
                },
              }}
            />
          </Col>
          <Col span={12}>
            <ProFormDigit
              name="cost"
              label="产品成本"
              placeholder="请输入产品成本"
              fieldProps={{ precision: 2 }}
              rules={[
                {
                  required: true,
                  message: "此项为必填项",
                },
              ]}
            />
            <ProFormDigit
              name="box_rules"
              label="箱规"
              placeholder="请输入箱规"
              fieldProps={{ precision: 0 }}
            />
            {/*<ProFormSelect*/}
            {/*  name="supplier_id"*/}
            {/*  label="供应商"*/}
            {/*  placeholder="请选择供应商"*/}
            {/*  fieldProps={{labelInValue:true}}*/}
            {/*  request={async ()=> {*/}
            {/*    return initialState.;*/}
            {/*  }}*/}
            {/*/>*/}
            <ProFormText
              name="product_classify_path"
              label="路径"
              hidden={true}
              rules={[{required: true, message: "此项为必填项",},]}
            />
          </Col>
        </Row>
        <Divider style={{marginTop: 0}}/>
        <Row gutter={16}>
          <Col span={24}>
            <ProFormTextArea
              name="product_introduction"
              label="产品简介"
              placeholder="请输入产品简介"
            />
          </Col>
        </Row>
      </DrawerForm>
      <Drawer
        width={600}
        title={"产品分类管理"}
        visible={showDetail2}
        extra={true}
        onClose={() => {
          setShowDetail2(false);
        }}
        closable={true}
      >
        <ProductClassifyTree/>
      </Drawer>

      <Drawer
        width={600}
        visible={showDetail}
        extra={true}
        title={"产品详情"}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={true}
      >
        {currentRow?.product_no && (
          <ProDescriptions<API.Product>
            column={1}
            // title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.Product>[]}
          />
        )}
      </Drawer>


      <BatchProduct
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        productCheckedRows={productCheckedRows}
      />
    </PageContainer>
  );
};

export default Product;
