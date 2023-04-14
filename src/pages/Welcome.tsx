import React from 'react';
import {PageContainer} from '@ant-design/pro-components';

import EChartsReact from "echarts-for-react";
import {ProCard} from "@ant-design/pro-components";

const Welcome: React.FC = () => {

  {/*const option = ()=>{*/}
  {/*  // 配置*/}
  {/*  return {*/}
  //     title: {
  //       text: "测试"
  {/*    },*/}
  //     // 触发提示框
  {/*    tooltip: {*/}
  {/*      // 触发类型 item: 只显示出触发转折点的内容、使用{a} {b}显示内容即可*/}
  {/*      // axis: 按X轴显示，该轴上的转折点都会被触发、使用{a0} b{0} {a1} {b1}*/}
  {/*      trigger: 'item',*/}
  {/*      // 提示框内容格式器 参数根据trigger不同而不同*/}
  //       // 折线、柱状、K线图：{a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
  //       // 地图 : {a}（系列名称），{b}（区域名称），{c}（合并数值）, {d}（无）
  //       formatter: "名称：{a} <br>X轴： {b} <br>Y轴： {c}"
  //     },
  //     xAxis: {
  //       type: 'category',
  {/*      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],*/}
  {/*      alignTicks: 'true',*/}
  {/*      splitLine: { //分割线（网格线）*/}
  {/*        show: true,*/}
  {/*        //   interval: 'auto'*/}
  {/*        lineStyle: {*/}
  {/*          color: '#008c8c',*/}
  //           // type: "dashed", //分割线类型solid实线 dashed虚线
  //           type: [2, 10],
  {/*          dashOffset: 3*/}
  //         }
  {/*      },*/}
  {/*      name: "X轴",// 坐标轴名称*/}
  {/*      show: true, //是否显示坐标刻度标签*/}
  {/*      nameLocation: "end", //名称位置 默认end*/}
  {/*      // nameTextStyle: {*/}
  //       //   color: '#f40'
  //       // },
  //       axisLabel: { //刻度标签
  //         //   inside: "false", // 默认朝外
  {/*        rotate: '-0', //旋转角度*/}
  {/*        interval: 0,*/}
  {/*      },*/}
  //       axisTick: { //坐标刻度
  //         show: true, //是否显示坐标刻度
  //         alignWithLabel: 'true'
  //       },
  //       axisLine: {
  //         show: true, // 是否显示作坐标轴线
  {/*      },*/}

  {/*    },*/}
  {/*    yAxis: {*/}
  //       type: 'value',
  //       //   alignTicks:'false',
  //       name: "Y轴",
  //       axisLine: {
  //         show: true, // 是否显示作坐标轴线
  //       },
  //       axisTick: { //坐标刻度
  //         show: true, //是否显示坐标刻度
  //         alignWithLabel: 'true'
  //       },
  //     },
  //     series: [
  //       {
  //         data: [150, 230, 224, 218, 135, 147, 260],
  //         type: 'line',
  //         name: '111',
  //       },
  //       {
  //         data: [45, 500, 224, 140, 45, 500, 54],
  {/*        type: 'line',*/}
  {/*        name: '222',*/}
  {/*      },*/}
  //       {
  //         data: [77, 86, 25, 86, 7, 456, 345],
  //         type: 'line',
  //         name: '333',
  //       },
  //     ]
  //   };
  // }
  return (
    <PageContainer
      title={false} header={{ title:false, breadcrumb: {} }}
    >
      <>欢迎使用本系统</>
      {/*<ProCard gutter={8} ghost>*/}
      {/*  <ProCard colSpan={12}>*/}
      {/*    <EChartsReact option={option()} />*/}
      {/*  </ProCard>*/}
      {/*  <ProCard colSpan={12}  bordered>*/}
      {/*    <EChartsReact option={option()} />*/}
      {/*  </ProCard>*/}
      {/*</ProCard>*/}
    </PageContainer>
  );
};

export default Welcome;
