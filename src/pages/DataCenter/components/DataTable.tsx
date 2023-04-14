import {ProTable} from '@ant-design/pro-components';
import type {ActionType} from '@ant-design/pro-components';
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React, {useRef, useState} from 'react';
import { ProCard } from "@ant-design/pro-components";
import {PageContainer} from "@ant-design/pro-components";

const DataTable: React.FC<any> = (props: any) => {
  const {columns, treeData, tableData, formRef, onSummary, JumpPath} = props;

  const [selectTreeKeys, setSelectTreeKeys] = useState([1]);
  const [viewData, setViewData] = useState([]);
  const actionRef = useRef<ActionType>();

  return(
    <PageContainer title={false} header={{ title:false, breadcrumb: {} }} >
      <ProCard
        size={'small'}
        ghost
      >
        <ProTable
          columns={columns}
          rowKey="no"
          pagination={false}
          actionRef={actionRef}
          formRef={formRef}
          bordered
          size={'small'}
          scroll={{x: 'auto', y: 680}}
          columnEmptyText={''}
          tableRender={(_, dom) => (
            <ProCard
              size={'small'}
              ghost
            >
              <ProCard
                colSpan={"16%"}
                bordered
                style={{height:800}}
              >
                <Tree
                  showLine
                  switcherIcon={<DownOutlined />}
                  height={760}
                  treeData={treeData}
                  selectedKeys={selectTreeKeys}
                  defaultExpandAll={true}
                  showIcon={false}
                  onSelect={(selectedKeys: any[])=>{
                    if (selectedKeys.length > 0) {
                      setSelectTreeKeys(selectedKeys)
                    }
                  }}
                />
              </ProCard>
              <ProCard
                bordered
                colSpan={"84%"}
                style={{height:800}}
              >
                {dom}
              </ProCard>
            </ProCard>
          )}
          options={false}
          params={{
            "node_id": selectTreeKeys,
          }}
          request={async (params, sort) => {
            const value = {params: params, sort:sort}
            const tableValue =  await tableData(value);
            setViewData(tableValue.data);
            return tableValue
          }}
          // manualRequest={true}
          search={{span:6, defaultCollapsed:true}}
          dateFormatter="string"
          onRow={(record)=>{
            return {onDoubleClick: () => {
              if(record.id != null) {
                setSelectTreeKeys([record.id])
              }else {
                JumpPath(record)
              }
            }}
          }}
          summary={() => {return onSummary(viewData)}}

        />
      </ProCard>
    </PageContainer>
  )
};

export default DataTable;

