// @ts-ignore
import {Access, useAccess} from "@@/plugin-access";
import {message, Button, Popconfirm} from "antd";
import {TableDropdown} from "@ant-design/pro-components";
import {
  cancelOrder,
  CheckAPAdDecreaseOrderHandler,
  CheckAPAdIncreaseOrderHandler,
  CheckARAdDecreaseOrderHandler,
  CheckARAdIncreaseOrderHandler,
  CheckCapitalAdjustOrderHandler,
  CheckCostAdjustOrderHandler,
  CheckGeneralCostOrderHandler,
  CheckGoodsLossOrderHandler,
  CheckGoodsOverflowOrderHandler,
  CheckOtherOutOrderHandler,
  CheckOtherPutInOrderHandler,
  CheckPaymentOrderHandler,
  CheckPurchaseOrderHandler,
  CheckPurchaseOrderReturnHandler,
  CheckReceiptOrderHandler,
  CheckSaleOrderHandler,
  CheckSaleOrderReturnHandler,
  CheckTransfersOrderHandler,
  refuseOrder,
  UnCostAdjustOrderHandler, UnFinanceOrderHandler,
  UnGoodsLossOrderHandler,
  UnGoodsOverflowOrderHandler,
  UnOtherOutOrderHandler,
  UnOtherPutInOrderHandler,
  UnPurchaseOrder,
  UnPurchaseOrderReturn,
  UnSaleOrder,
  UnSaleOrderReturn,
  UnTransfersOrderHandler
} from "@/services/ant-design-pro/sale_order";
import {history} from "@umijs/max";

import {urlMapping} from "./UrlMapping"



const OrderCheck: (props: any) => JSX.Element= (props) => {
  const {record, action, style, setOrderDetail} = props;
  const access = useAccess();

  const checkOrder = async (data: any) => {
    if (data.order_state === 1){
      try{
        const hide = message.loading(`正在审核订单....`);

        let resp;
        switch (true){
          case data.order_type === 1:
            resp = await CheckSaleOrderHandler(data.order_no);
            break;
          case data.order_type === 2:
            resp = await CheckSaleOrderReturnHandler(data.order_no);
            break;
          case data.order_type === 3:
            resp = await CheckPurchaseOrderHandler(data.order_no);
            break;
          case data.order_type === 4:
            resp = await CheckPurchaseOrderReturnHandler(data.order_no);
            break;
          case data.order_type === 5:
            resp = await CheckGoodsLossOrderHandler(data.order_no);
            break;
          case data.order_type === 6:
            resp = await CheckGoodsOverflowOrderHandler(data.order_no);
            break;
          case data.order_type === 7:
            resp = await CheckOtherOutOrderHandler(data.order_no);
            break;
          case data.order_type === 8:
            resp = await CheckOtherPutInOrderHandler(data.order_no);
            break;
          case data.order_type === 9:
            resp = await CheckTransfersOrderHandler(data.order_no);
            break;
          case data.order_type === 10:
            resp = await CheckCostAdjustOrderHandler(data.order_no);
            break;
          case data.order_type === 11:
            resp = await CheckReceiptOrderHandler(data.order_no);
            break;
          case data.order_type === 12:
            resp = await CheckPaymentOrderHandler(data.order_no);
            break;
          case data.order_type === 13:
            resp = await CheckGeneralCostOrderHandler(data.order_no);
            break;
          case data.order_type === 14:
            resp = await CheckARAdIncreaseOrderHandler(data.order_no);
            break;
          case data.order_type === 15:
            resp = await CheckARAdDecreaseOrderHandler(data.order_no);
            break;
          case data.order_type === 16:
            resp = await CheckAPAdIncreaseOrderHandler(data.order_no);
            break;
          case data.order_type === 17:
            resp = await CheckAPAdDecreaseOrderHandler(data.order_no);
            break;
          case data.order_type === 18:
            resp = await CheckCapitalAdjustOrderHandler(data.order_no);
            break;
          default:
            message.error("订单类型出错, 无法提交审核.")
        }

        hide();
        if (resp && resp.success) {
          message.success(`订单审核成功`);
          return true;
        }
        message.success(`订单审核失败`);
        return false;
      }catch (e) {
      }
    }else {
      message.error(`该订单不是待审核状态`);
    }
  }

  const UnSaleOrderHandler = async (data: any) => {
    if(data.order_state == 2){
      const hide = message.loading(`正在红冲订单....`);

      let resp;

      switch (true){
        case data.order_type === 1:
          resp = await UnSaleOrder(data.order_no);
          break;
        case data.order_type === 2:
          resp = await UnSaleOrderReturn(data.order_no);
          break;
        case data.order_type === 3:
          resp = await UnPurchaseOrder(data.order_no);
          break;
        case data.order_type === 4:
          resp = await UnPurchaseOrderReturn(data.order_no);
          break;
        case data.order_type == 5:
          resp = await UnGoodsLossOrderHandler(data.order_no);
          break;
        case data.order_type == 6:
          resp = await UnGoodsOverflowOrderHandler(data.order_no);
          break;
        case data.order_type == 7:
          resp = await UnOtherOutOrderHandler(data.order_no);
          break;
        case data.order_type == 8:
          resp = await UnOtherPutInOrderHandler(data.order_no);
          break;
        case data.order_type == 9:
          resp = await UnTransfersOrderHandler(data.order_no);
          break;
        case data.order_type == 10:
          resp = await UnCostAdjustOrderHandler(data.order_no);
          break;
        case data.order_type == 11:
          resp = await UnFinanceOrderHandler(data.order_no);
          break;
        case data.order_type == 12:
          resp = await UnFinanceOrderHandler(data.order_no);
          break;
        case data.order_type == 13:
          resp = await UnFinanceOrderHandler(data.order_no);
          break;
        case data.order_type == 14:
          resp = await UnFinanceOrderHandler(data.order_no);
          break;
        case data.order_type == 15:
          resp = await UnFinanceOrderHandler(data.order_no);
          break;
        case data.order_type == 16:
          resp = await UnFinanceOrderHandler(data.order_no);
          break;
        case data.order_type == 17:
          resp = await UnFinanceOrderHandler(data.order_no);
          break;
        case data.order_type == 18:
          resp = await UnFinanceOrderHandler(data.order_no);
          break;
      }

      hide();

      if (resp && resp.success) {
        message.success(`订单红冲成功`);
        return true;
      }
      message.success(`订单红冲失败`);
      return false;
    }
    else {
      message.error('订单不是已审核状态')
    }
  }


  const cancelOrderHandle = async (data: any) => {
    if(data.order_state == 1 || data.order_state == 4){
      const hide = message.loading(`正在取消订单....`);
      const resp = await cancelOrder(data.order_no);
      hide();

      if (resp && resp.success) {
        message.success(`订单取消成功`);
        return true;
      }
      message.success(`订单取消失败`);
      return false;

    }
    else {
      message.error('订单不是待审核状态')
    }
  }

  // 拒绝
  const refuseOrderHandler = async (data: any) => {
    if(data.order_state == 1){
      const hide = message.loading(`正在拒绝订单....`);
      const resp = await refuseOrder(data.order_no);
      hide();

      if (resp && resp.success) {
        message.success(`订单拒绝成功`);
        return true;
      }
      message.success(`订单拒绝失败`);
      return false;
    }
    else {
      message.error('订单不是待审核状态')
    }
  }

  if (style ==="list") {
    return (
      <>
        <Access key={'permissions_orderList_check'} accessible={access.permissions_orderList_check}>
          <Popconfirm
            title="确定是否审核订单？"
            key={'pushConfirm'+ record.id}
            onConfirm={function(){
              checkOrder(record).then(value => {
                if(value) {
                  action?.reload();
                  //关闭弹窗
                  setOrderDetail(false);
                }
              });
            }}
          >
            <a
              key="check"
              type={'link'}
              hidden={record.order_state === 3 || record.order_state === 2 || record.order_state === 0 || record.order_state === 4}
            >
              审核
            </a>
          </Popconfirm>
        </Access>

        <Access key={'permissions_orderList_refused'} accessible={access.permissions_orderList_refused}>
          <Popconfirm
            title="确定是否拒绝订单？"
            key={'refuseConfirm'+ record.id}
            onConfirm={function(){
              refuseOrderHandler(record).then(value => {
                  if(value) {
                    action?.reload();
                    //关闭弹窗
                    setOrderDetail(false);
                  }
                }
              );
            }}
          >
            <a
              key="refuse"
              type={'link'}
              hidden={record.order_state === 3 || record.order_state === 2 || record.order_state === 0 || record.order_state === 4}
            >
              拒绝
            </a>
          </Popconfirm>
        </Access>

        <Access key={'permissions_orderList_redInkWriteOff'} accessible={access.permissions_orderList_redInkWriteOff}>
          <Popconfirm
            title="确定是否红冲订单？"
            key={'redInkWriteOff'+ record.id}
            onConfirm={function(){
              UnSaleOrderHandler(record).then(value => {
                if(value) {
                  action?.reload();
                  //关闭弹窗
                  setOrderDetail(false);
                }
              });
            }}
          >
            <a
              key="check"
              type={'link'}
              hidden={record.order_state === 3 || record.order_state === 1 || record.order_state === 0 || record.order_state === 4}
            >
              红冲
            </a>
          </Popconfirm>
        </Access>

        <TableDropdown
          key="actionGroup"
          menus={[
            {
              key: `edit${record.id}`,
              disabled: record.order_state === 3 || record.order_state === 2 || record.order_state === 0,
              name:
                <Access key={'permissions_orderList_update'} accessible={access.permissions_orderList_update}>
                  <a
                    key="edit"
                    onClick={() => {
                      const data = {
                          order_no: record.order_no,
                          order_type: record.order_type,
                          type: "edit",
                        }
                      history.push(urlMapping[record.order_type], data)
                    }}
                  >
                    修改
                  </a>
                </Access>,
            },
            {
              key: `cancel${record.id}`,
              disabled: record.order_state === 3 || record.order_state === 2 || record.order_state === 0,
              name:
                <Access key={'permissions_orderList_delete'} accessible={access.permissions_orderList_delete}>
                  <Popconfirm
                    title="确定是否取消订单？"
                    key={'cancelOff'+ record.id}
                    onConfirm={function( ){
                      cancelOrderHandle(record).then();
                      action?.reload();
                    }}
                  >
                    <a
                      key="check"
                    >
                      取消
                    </a>
                  </Popconfirm>
                </Access>,
            },
          ]}
        />
      </>
    )
  }
  else {

    return (
      <>
        <Access key={'permissions_orderList_check'} accessible={access.permissions_orderList_check}>
          <Popconfirm
            title="确定是否审核订单？"
            key={'pushConfirm'+ record.id}
            onConfirm={function(){
              checkOrder(record).then(value => {
                if(value) {
                  setOrderDetail(false);
                  action?.reload();
                }
              });
            }}
          >
            {record.order_state === 3 || record.order_state === 2 || record.order_state === 0 || record.order_state === 4 ?
              null
              :
              <Button
                key="check"
                type={'primary'}
              >
                审核订单
              </Button>
            }

          </Popconfirm>
        </Access>

        <Access key={'permissions_orderList_refused'} accessible={access.permissions_orderList_refused}>
          <Popconfirm
            title="确定是否拒绝订单？"
            key={'refuseConfirm'+ record.id}
            onConfirm={function(){
              refuseOrderHandler(record).then(value => {
                if(value) {
                  setOrderDetail(false);
                  action?.reload();
                }
                });
            }}
          >

            {
              record.order_state === 3 || record.order_state === 2 || record.order_state === 0 || record.order_state === 4
              ?
              null
              :
              <Button
                key="refuse"
                type={'default'}
              >
                拒绝
              </Button>
            }

          </Popconfirm>
        </Access>

        <Access key={'permissions_orderList_redInkWriteOff'} accessible={access.permissions_orderList_redInkWriteOff}>
          <Popconfirm
            title="确定是否红冲订单？"
            key={'redInkWriteOff'+ record.id}
            onConfirm={function(){
              UnSaleOrderHandler(record).then(value => {
                if(value) {
                  setOrderDetail(false);
                  action?.reload();
                }
              });
            }}
          >
            {record.order_state === 3 || record.order_state === 1 || record.order_state === 0 || record.order_state === 4
              ?
              null
              :
              <Button
                key="check"
                danger
                type={'default'}
              >
                红冲
              </Button>
            }

          </Popconfirm>
        </Access>


        <Access key={'permissions_orderList_update'} accessible={access.permissions_orderList_update}>
          {record.order_state === 3 || record.order_state === 2 || record.order_state === 0 ? null :
            <Button
              key="edit"
              type={'default'}
              onClick={() => {
                const data = {
                  order_no: record.order_no,
                  order_type: record.order_type,
                  type: "edit",
                }
                history.push(urlMapping[record.order_type], data)
                setOrderDetail(false);
              }}
            >
              修改
            </Button>
          }

        </Access>

        <Access key={'permissions_orderList_delete'} accessible={access.permissions_orderList_delete}>
          <Popconfirm
            title="确定是否取消订单？"
            key={'cancelOff'+ record.id}
            onConfirm={function( ){
              cancelOrderHandle(record).then(value => {
                if(value) {
                  setOrderDetail(false);
                  action?.reload();
                }
              });
            }}
          >
            {record.order_state === 3 || record.order_state === 2 || record.order_state === 0 ? null :
              <Button
                key="check"
                type={'default'}
              >
                取消
              </Button>
            }
          </Popconfirm>
        </Access>
      </>
    )
  }
}

export default OrderCheck;
