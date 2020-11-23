import React,{ PureComponent } from 'react';
import echarts from 'echarts';
import {Icon} from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from "@/utils/downloadFile"
import FontSizeEchart from '../ProductView/fontSizeEchart';


import styles from './basisEchart.less';


class TerminalQueryEchart extends PureComponent{

  static defaultProps={
    'specialName': '政企楼宇转交情况',
    'proName': '全国',
    'cityName': '全国',
    "download":false,
    'date': '2019-11-20',
    'color':["#2DA9FA","#C91717","#FF719E"],
    'chartData':{
      "title": "当前用户月度贡献",
      "subtitle":"近12个月该用户语音/流量时间趋势",
      "example":["新增用户数","新增收入"],
      "chartX":["1月","2月","3月","4月","5月","6月"],
      "chart":[
        {
          "name":"新增用户数",
          "value":["-","754","523","135","489","858"],
          "unit":"户",
          "type":"line",
        },
        {
          "name":"新增收入",
          "value":["-","-","423","235","789","258"],
          "unit":"万元",
          "type":"line",
        }
      ]
    }
  };

  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={
      chartData: null,
      isNull:false,
      subtitle:"cc",
      echartId:"buildingBarEchart",
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
    if (data.chartX.length === 0) {
      this.setState({
        isNull:true
      })
      return null;
    }
    if (data.chartX.length !== 0) {
      this.setState({
        isNull:false
      })
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

    const { title,subtitle } = data;
    this.setState({
      subtitle
    });
    const option = {
      color, // 柱状图颜色
      title: {
        left:15,
        top:20,
        text: title,
        textStyle: {
          fontSize: titleSize,
          fontWeight: titleWeight,
          fontFamily: titleFamily,
        },
      },
      grid: {
        top: 120,
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
        top: '80px',
        right: '60px',
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
    const tableValue = chart.map((item)=>{
      const value = item.value.map((itemValue)=>`${itemValue}（${item.unit}）`);
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
        value:[["专题名称",specialName],...conditionValue],
      },
      table
    };
  };

  render() {
    const {echartId,subtitle, isNull,chartData} = this.state;
    const {download}=this.props;
    return (
      <div id={echartId} className={styles.page}>
        { !isNull &&
          <div className={styles.wrapper} ref={this.chartDom} />
        }
        {
          isNull ? (
            <div>
              <div className={styles.titleStyle}>{chartData.title}</div>
              <p className={styles.welcomeStyle}>抱歉!该账号没有匹配信息</p>
            </div>
         ):
            (<div className={styles.subtitle}>{subtitle}</div>)
        }
        {download &&
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
        }

      </div>
    );
  }
}

export default TerminalQueryEchart;
