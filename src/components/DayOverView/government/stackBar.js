import React, { PureComponent } from 'react';
import echarts from 'echarts';
import {Icon, Tooltip} from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from '@/utils/downloadFile';
import FontSizeEchart from '../../ProductView/fontSizeEchart';
import styles from './stackBar.less';
import waSai from "../../BuildingView/pic/ganTan.png";


class IncomeAnalysis extends PureComponent{
  
  static defaultProps={
    'specialName': '家庭视图',
    stack:false, // 柱图是否堆叠
    vertical:false,
    "color":["#A7EDC2","#3A76F7"],
    "echartId":"HomeBasisBarEchart",
    'chartData':{
      "title": "单宽,融合家庭数量对比",
      "yName":"户",
      "xName":"户",
      subtitle:"",
      "chartX":['1月xx','2xx222','3','4','5','6','7','8','9','10','11','12'],
      "chart":[
        {
          "name":"移网",
          "value":["-","154","223","135","289","158"],
          "unit":"户",
          "type":"bar",
        },
        {
          "name":"固网",
          "value":["-","-","123","235","189","258"],
          "unit":"户",
          "type":"bar",
        }
      ],
    }
  };
  
  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={
      chartData: null,
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
  formatData = (data) => data.indexOf(',') === -1
    ? parseFloat(data)
    : parseFloat(data.replace(/,/g, ''));
  
  // 渲染echart
  createChart = (data) => {
    if (!data) {
      return null;
    }
    if (!data.chartX) {
      return null;
    }
    const {color,stack,vertical} = this.props;
    const fontsize = FontSizeEchart();
    const { xAxisSize, yAxisSize, tooltipSize, legendSize,titleSize,titleWeight,titleFamily } = fontsize;
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
    const seriesData = newChart.map((item) =>
      ({
        stack:stack?"one":null,
        type: item.type,
        name: item.name,
        data: item.value,
        itemStyle: {
          //  barBorderRadius: [9, 9, 0, 0],// 圆角
        },
        barWidth:"10px",
      }),
    );
    const chartXData = data.chartX;
    const legendData = data.chart.map((item)=>item.name);
    
    const option = {
      color, // 柱状图颜色
      title : {
        show:false,
        text: data.title,
        padding:[15,0,0,8],
        textStyle: {
          fontSize: titleSize,
          // color: "#000000a6", // 主标题文字颜色
          fontWeight: titleWeight,
          fontFamily: titleFamily
        }
      },
      grid: {
        top: 80,
        left: '5%',
        right: '5%',
        bottom: 40,
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
        bottom: '20px',
        left: 'center',
        textStyle: {
          fontSize: legendSize,
        },
        itemWidth:  25 , // 间距
        itemGap:20
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
          interval:0,
          formatter(xAxisData) {
            return vertical?xAxisData.substring(0,4).replace(/(.{1})/g, '$1\n'):xAxisData;
          } // 使x轴字体竖向显示
        },
      },
      yAxis: [{
        type: 'value',
        name: data.yName,
        axisTick: {show: false},
        axisLine: {show: false},
        min:"dataMin",
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
    
    // 检测屏幕宽度发生变化时,重新渲染
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
    return null;
  };
  
  download = (e) => {
    const {echartId} = this.props;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),echartId);
  };
  
  jsonHandle=()=>{
    const {chartData,downloadData} = this.props;
    console.log("downloadData")
    console.log(downloadData)
    const{specialName, conditionValue}=downloadData;
    const {title,chartX,chart}=chartData;
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
    const {downloadData,echartId,titlePosition}=this.props;
    const {chartData} = this.state;
    const myFontSize=FontSizeEchart();
    return (
      <div id={echartId} className={styles.page}>
        <div
          className={styles.titleDiv}
          style={{
            width:"100%",
            fontSize:myFontSize.titleSize,
            fontWeight:myFontSize.titleWeight,
            fontFamily:myFontSize.titleFamily,
            textAlign:titlePosition==='center'?'center':'left',
            left:titlePosition==='center'?0:5,
          }}
        >
          {chartData.title}
          {
            chartData&&chartData.subtitle&& chartData.subtitle!== '' &&
            <Tooltip
              title={chartData.subtitle}
              trigger='hover'
              placement='bottom'
              overlayClassName={styles.basisBarEchartToolTip}
              // defaultVisible
            >
              <img
                src={waSai}
                alt=''
                style={{height:myFontSize.titleSize,width:myFontSize.titleSize,cursor:'pointer'}}
              />
            </Tooltip>
          }
        </div>
        <div className={styles.wrapper} ref={this.chartDom} />
        { downloadData &&
        <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
          <div><Icon type="download" /></div>
          <div>下载</div>
        </div>
        }
      </div>
    );
  }
}

export default IncomeAnalysis;
