import React,{ PureComponent } from 'react';
import echarts from 'echarts';
import {Icon} from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from "@/utils/downloadFile"
import FontSizeEchart from '../ProductView/fontSizeEchart';


import styles from './nameBrEchart.less';


class NameBrEchart extends PureComponent{
  
  static defaultProps={
    'color':["#FF719E","#2DA9FA","#C91717"], // 图例颜色
    'chartData':{
      "title": "当前用户月度贡献",
      "example":["新增用户数","新增收入"],
      "chartX":["科学研究和技术服务业","制造业","农、林牧、渔业","交通运输、仓储和邮政","居民服务、修理和其他服务业","租赁和商务服务业"],
      "chart":[
        {
          "name":"新增用户数",
          "value":["-","754","523","135","489","858"],
          "unit":"户",
          "type":"bar",
        }
      ]
    }
  };
  
  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={
      chartData: null,
      echartId:"buildingViewBarEchart",
    };
  };
  
  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const { chartData } = nextProps;
    if (chartData && !isEqual(chartData, prevState.chartData)) {
      return {
        chartData,
      };
    }
    return null;
  }
  
  componentDidMount() {
    const { chartData } = this.state;
    this.createChart(chartData);
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { chartData } = this.state;
    if (chartData && !isEqual(chartData, prevState.chartData)) {
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
    const {color} = this.props;
    const fontsize = FontSizeEchart();
    const { titleSize, titleWeight, titleFamily, xAxisSize, yAxisSize, tooltipSize, legendSize } = fontsize;
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
        itemStyle: {
          //  barBorderRadius: [9, 9, 0, 0],// 圆角
        },
        barWidth:"10px",
      }),
    );
    const chartXData = data.chartX;
    const legendData = data.example;
    let unit=[data.chart[0].unit];
    if(data.chart[1]){
      unit=[data.chart[0].unit,data.chart[1].unit];
    }

    const { title } = data;
    const option = {
      color, // 柱状图颜色
      title: {
        text: title,
        x:"center",
        top:10,
        textStyle: {
          fontSize: titleSize,
          fontWeight: titleWeight,
          fontFamily: titleFamily,
          textAlign: "center",
        },
      },
      grid: {
        top: 100,
        left: '3%',
        right: '3%',
        bottom: 10,
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
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${par.data.normalData === '-' ? '' : par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
      },
      legend: {
        show: true,
        data: legendData,
        top: '5px',
        right: '70px',
        textStyle: {
          fontSize: legendSize,
        },
        itemWidth:  25 , // 间距
      },
      xAxis: {
        type: 'category',
        data: chartXData,
        axisTick: {show: false},// 不显示刻度
        axisLine: {show: false},// 不显示轴线
        axisLabel: {
          show: true, // y轴坐标标签展示
          fontSize: xAxisSize,
          color: '#333',
          interval: 0,
          margin: 2,
          fontFamily: "Microsoft YaHei",
          textStyle: {fontSize:xAxisSize},
          formatter(xAxisData) {
            return xAxisData.replace(/(.{3})/g, '$1\n');
          } // 使x轴字体竖向显示
        },
      },
      yAxis: [{
        type: 'value',
        name: `(${unit[0]})`,
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
            width: 1,
          }
        }
      },
        {
          type: 'value',
          name: unit[1]?`(${unit[1]})`:"",
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
              width: 1,
            }
          }
        }],
      series: seriesData,
    };
    
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);
    
    return null;
  };
  
  download = (e) => {
    const {echartId} = this.state;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),echartId);
  };
  
  jsonHandle=()=>{
    const {chartData,downloadData} = this.props;
    const {title,chartX,chart}=chartData;
    const {specialName,conditionValue} = downloadData;
    let unitCopy = "";
    const tableValue = chart.map((item)=>{
      unitCopy = item.unit;
      const value = item.value.map((itemValue)=>`${itemValue}`);
      return  [item.name,...value]
    });
    const table={
      title: [
        ["维度",...chartX]
      ],
      value: tableValue
      
    };
    return {
      fileName: `${specialName}--${title}`,
      condition:{
        name:title,
        value:[["专题名称",specialName,unitCopy],...conditionValue],
      },
      table
    };
  };
  
  render() {
    const {echartId} = this.state;
    const {downloadData}=this.props;
    return (
      <div id={echartId} className={styles.page}>
        <div className={styles.wrapper} ref={this.chartDom} />
        {downloadData&&
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
        }
     
      </div>
    );
  }
}

export default NameBrEchart;
