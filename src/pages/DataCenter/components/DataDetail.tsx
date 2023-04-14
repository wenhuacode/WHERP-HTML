import {ProTable, PageContainer, ProCard} from "@ant-design/pro-components";
import { history } from "@umijs/max";
import {urlMapping} from "@/pages/BusinessCenter/order/UrlMapping";
import React, {useState} from "react";

export const DataDetail: React.FC<any> = (props: any) => {
  const {columns, onSummary, requests, query, actionRef, formRef,
    title, search, width, setModalVisit, setTmpCheckRecord} = props;
  const [viewData, setViewData] = useState([]);

  return (
    <PageContainer
      title={false} header={{ title:false, breadcrumb: {} }}
    >
      <ProCard
        title={title}
        size={'small'}
      >
        <ProTable
          columns={columns}
          rowKey={"no"}
          pagination={false}
          actionRef={actionRef}
          formRef={formRef}
          bordered
          size={'small'}
          scroll={{ x:width, y: 800}}
          columnEmptyText={''}
          options={false}
          request={async (params, sort) => {
            let value = {}
            if (Object.keys(params).length > 0){
              value = {params: params, sort:sort}
            } else if (Object.keys(query).length > 0){
              value = {params: query, sort:sort}
            } else {
              value = {}
            }
            // console.log(query)
            const data = await requests(value);
            setViewData(data.data);
            return data
          }}
          search={search ? search : false}
          manualRequest={!!search}
          dateFormatter={"string"}
          expandRowByClick={true}
          onRow={(record)=>{
            return {onDoubleClick: () => {
              if (query.type !== "query") {
                const data = {
                  order_no: record.order_no,
                  order_type: record.order_type,
                  type: "query",
                }
                history.push(urlMapping[record.order_type], data)
              } else {
                setModalVisit(true);
                setTmpCheckRecord(record);
              }
              }}
          }}
          summary={() => {return onSummary(viewData)}}
        />
      </ProCard>
    </PageContainer>
  )
}

export default DataDetail;
