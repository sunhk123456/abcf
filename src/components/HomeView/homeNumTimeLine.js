/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 家庭数量分布时间趋势图组件 </p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  caoruining
 * @date 2019/12/11
 */

/** 所需的各种插件 * */
import React, {PureComponent} from 'react';
import echarts from 'echarts';
import isEqual from "lodash/isEqual";
import DownloadFile from "@/utils/downloadFile"; // 下载封装方法
import {Icon} from "antd";
import FontSizeEchart from '../ProductView/fontSizeEchart';
import styles from "./homeNumTimeLine.less"


/** 组件 * */
class HomeNumTimeLine extends PureComponent {

  // static defaultProps={
  //   downloadData:{
  //     specialName:"xxx-xx",
  //     conditionValue: [
  //       ["name", "value"],
  //     ],
  //   },
  //   chartData:{
  //     title:"家庭数量分布时间趋势图",
  //     chartX:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  //     chart:[
  //       {
  //         name:"(家庭数)",
  //         value:["50","360","115","258","140","50","57","162","329","269","123","48",],
  //         unit:"户",
  //         type:"line"
  //       },
  //     ]
  //   }
  // };

    constructor(props) {
      super(props);
      this.chartDom=React.createRef();
      this.state = {}
    }


    componentDidMount() {
      const { chartData } = this.props;
      this.createChart(chartData)
    }

    componentDidUpdate(prevProps) {
      const { chartData } = this.props;
      if (chartData && !isEqual(chartData, prevProps.chartData)) {
        this.createChart(chartData);
      }
    }


  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };

  // 渲染echart
  createChart = (data) => {
    if (!data) {
      return null;
    }
    if (!data.chartX) {
      return null;
    }
    const { color } = this.props;
    const fontsize = FontSizeEchart();
    const { titleSize, titleWeight, titleFamily, xAxisSize, yAxisSize, tooltipSize } = fontsize;
    const newChart = data.chart.map((item) => (
      {
        "type": item.type,
        'name': item.name,
        'value': item.value.map(
          (item1) => (
            {
              value: this.formatData(item1),
              'normalData': item1,
              'unit': item.unit,
            }
          ),
        ),
      }
    ));
    const seriesData = newChart.map((item,index) =>
      ({
        type: item.type,
        yAxisIndex:index,
        name: item.name,
        data: item.value,
        smooth: true,
        symbol: 'none',
        areaStyle:{
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 0, color: color[0]},
                {offset: 1, color: color[1]}
              ]
            )
          },
          global: false // 缺省为 false
        },
        lineStyle: {
          width: 0,
        }
      }),
    );
    const chartXData = data.chartX;
    const option = {
      title : {
        text: data.title,
        left: 3,
        top: 10,
        textStyle: {
          fontSize: titleSize,
          // color: "#000000a6", // 主标题文字颜色
          fontWeight: titleWeight,
          fontFamily: titleFamily
        }
      },
      grid: {
        top: "25%",
        left: '3%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        confine:true, // 限制在图标区域内
        show: true,
        textStyle: {
          fontSize: tooltipSize,
        },
        axisPointer: {
          lineStyle: {
            color: 'rgba(86,84,86,0.2)',
          },
        },
        formatter(params) {
          let showTip = '';
          params.forEach((par) => {
            if (par.axisDim === 'x') {
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
      },
      xAxis: {
        type: 'category',
        data: chartXData,
        axisTick: {show: false},// 不显示刻度
        axisLine: {show: false},// 不显示轴线
        boundaryGap: false,
        axisLabel: {
          show: true, // x轴坐标标签展示
          fontSize: xAxisSize,
          color: '#666666',
          interval: 0,
          fontFamily: "Microsoft YaHei",
          textStyle: {fontSize:xAxisSize},
        },
      },
      yAxis: {
        type: 'value',
        name: data.yName,
        nameTextStyle:{
          color: "#666"
        },
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {
          textStyle: {
            color: "#666666",
            fontSize: yAxisSize,
          },
          // formatter : (value, index) =>{
          //   if (index % 2 === 0) {
          //     return value;
          //   }
          //   return '';
          // }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#EEEFF9',
            width: 1,
          }
        }
      },
      series: seriesData,
    };

    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);

    return null;
  };

  download = (e) => {
    const {echartId} = this.props;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),echartId);
  };

  jsonHandle=()=>{
    const {chartData,downloadData} = this.props;
    const {title,chartX,chart}=chartData;
    const {specialName,conditionValue} = downloadData;
    const tableValue = chart.map((item)=>{
      const value = item.value.map((itemValue)=>itemValue);
      return  [item.name,...value]
    });
    const table={
      title: [
        ["月份",...chartX]
      ],
      value: tableValue
    };
    return {
      fileName: `${specialName}--${title}`,
      condition:{
        name:title,
        value:[["专题名称",specialName,chart[0].unit],...conditionValue],
      },
      table
    };
  };


    render() {
      const { echartId, downloadData }= this.props;
      return (
        <div id={echartId} className={styles.outer}>
          <div className={styles.chart} ref={this.chartDom} />
          {downloadData &&
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
          }
        </div>
      );
    }
}

export default HomeNumTimeLine;
