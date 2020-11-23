import React, { Component } from 'react';
import { Icon } from 'antd';
import echarts from 'echarts';
import isEqual from 'lodash/isEqual';
import Style from './contrastChart.less';
import FontSizeEchart from '../ProductView/fontSizeEchart';
// import EchartFontSize from "../Echart/echartFontSize";
import DownloadFile from '@/utils/downloadFile'; // 下载封装方法

export default class ContrastChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.contrastChartId = React.createRef(); // 产品结构图ref
  }

  componentDidMount() {
    const {echartData} = this.props;
    if (JSON.stringify(echartData) !== "{}"){
      this.initEchart();
    }
  }

  componentDidUpdate(nextProps) {
    const {echartData} = this.props;
    if (JSON.stringify(echartData) !== "{}" && !isEqual(nextProps.echartData, echartData)) {
      this.initEchart();
    }
  }

  // 处理数据格式
  formatData = (data) => data.indexOf(",") === -1
      ? parseFloat(data)
      : parseFloat(data.replace(/,/g, ""));

  // 设置Echars各项属性的主方法
  initEchart() {
    // 接受组件适配信息
    // 获取页面主要数据
    const {echartData: {title, Legend, chartX, chartL, chartY, chartD, unit, yName}, Long} = this.props;
    // 获取适配数据
    const fontsize = FontSizeEchart();
    const {titleSize, tooltipSize,titleWeight, xAxisSize, yAxisSize, titleFamily, legendSize} = fontsize;
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(this.contrastChartId.current);
    // 绘制图表
    // 50%
    const option = {
      title: {
        text: title,
        textStyle: {
          fontSize: titleSize,
          fontWeight: titleWeight,
          fontFamily: titleFamily,
          textAlign: "center",
        },
      },
      color: ['#FC595E', '#A6D2A5', '#6EADDB'],
      legend: {
        show: true,
        data: Legend,
        top: '20px',
        right: '40px',
        textStyle: {
          fontSize: legendSize,
        },
        itemWidth: Long ? 25 : 14, // 间距
      },
      grid: {
        // width: '100%',
        // height: '74%',
        top: 70,
        left: Long ? 5 : 20, // 距左侧位置
        right: Long ? 5 : 20, //
        bottom: 10,
        containLabel: true
      },
      tooltip: {
        trigger: "axis",
        show: true,
        confine:true, // 限制在图标区域内
        textStyle:{
          fontSize:tooltipSize
        },
        formatter(params){
          let str = "";
          params.forEach((item)=>{
            const {data:{itemValue}, marker, seriesName} = item;
            str += `<br /> ${marker} ${seriesName} : ${itemValue} ${unit}`;
          })
          return `${params[0].name}${str}`;
        }
      },
      xAxis: {
        type: 'category',
        data: chartX,
        axisTick: {show: false},// 不显示刻度
        axisLine: {show: false},// 不显示轴线
        axisLabel: {
          interval: 0,
          margin: 20,
          textStyle: {
            // color: "#999999",
            color: (value) => value.indexOf('*') !== -1 ? "#c91717" : "#999999",
            fontSize: xAxisSize
          },
          formatter(value) {
            const str = value.split("");
            if (Long) {
              return str.splice(0,4).join("\n");
            }
            return str.join("");
          }
        },
      },
      yAxis: {
        type: 'value',
        name: `(${yName})`,
        nameTextStyle: {
          align: 'left'
        },
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {
          textStyle: {
            color: "#999999",
            fontSize: yAxisSize
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#EEEFF1',
            width: 2,
          }
        }
      },
      series: [
        {
          name: Legend[0],
          type: 'bar',
          barWidth: Long ? '6px' : '23px', // 圆柱宽度
          label: {
            show: !Long,
            position: 'top'
          },
          itemStyle: {
            barBorderRadius: [9, 9, 0, 0],// 圆角
          },
          data: chartL.map((item) => ({
            value: this.formatData(item),
            itemValue: item,
            label: {
              position: this.formatData(item) < 0 ? "bottom" : 'top'
            },
            itemStyle: {
              barBorderRadius: this.formatData(item) < 0 ? [0, 0, 9, 9] : [9, 9, 0, 0]
            }
          })),
        },
        {
          name: Legend[1],
          type: 'bar',
          barWidth: Long ? '6px' : '23px', // 圆柱宽度
          itemStyle: {
            barBorderRadius: [9, 9, 0, 0]
          },
          data: chartY.map((item) => ({
            value: this.formatData(item),
            itemValue: item,
            label: {
              position: this.formatData(item) < 0 ? "bottom" : 'top'
            },
            itemStyle: {
              barBorderRadius: this.formatData(item) < 0 ? [0, 0, 9, 9] : [9, 9, 0, 0]
            }
          })),
        },
        {
          name: Legend[2],
          type: 'bar',
          barWidth: Long ? '6px' : '23px', // 圆柱宽度
          itemStyle: {
            barBorderRadius: [9, 9, 0, 0]
          },
          data: chartD.map((item) => ({
            value: this.formatData(item),
            itemValue: item,
            label: {
              position: this.formatData(item) < 0 ? "bottom" : 'top'
            },
            itemStyle: {
              barBorderRadius: this.formatData(item) < 0 ? [0, 0, 9, 9] : [9, 9, 0, 0]
            }
          })),
        },
      ],
    };
    // 100%

    // 检测屏幕宽度发生变化时,重新渲染
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);
  }

  // 下载方法
  download(e) {
    const {echartId} = this.props;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(), echartId);
  }

  jsonHandle() {
    const {echartData} = this.props;
    const {echartData: {download: {title, value}}, selectName} = this.props;
    // 文件信息
    const condition = {
      name: echartData.title,
      value: [
        ["专题名称:", echartData.title, `(${echartData.unit})`],
        ["筛选条件"],
        ["地域:", selectName]
      ],
    };

    // 表头数据+数据  运营商///新增携出用户///新增携入用户///净携入用户
    const table = {
      title: [
        ...title
      ],
      value
    };

    // 拼接json数据  文件名/表头/数据
    return {
      fileName: `${echartData.title}-图表数据`,
      condition,
      table
    };
  }

  render() {
    const {echartId} = this.props;
    return (
      <div className={Style.contrastChart}>
        <div ref={this.contrastChartId} id={echartId} className={Style.contrastChartClass} />
        <div className={Style.downLoad} onClick={(e)=>this.download(e)}>
          <div><Icon type="download" /></div>
          <div>下载</div>
        </div>
      </div>
    );
  }
}
