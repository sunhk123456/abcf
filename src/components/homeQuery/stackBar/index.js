import React, { PureComponent } from 'react';
import echarts from 'echarts';
import {Icon, Tooltip} from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from '@/utils/downloadFile';
import FontSizeEchart from '../../ProductView/fontSizeEchart';
import styles from './index.less';
import waSai from "../../BuildingView/pic/ganTan.png";



class HomeQueryStackBarEchart extends PureComponent{
  
  static defaultProps={
    'specialName': '家庭视图',
     vertical:false,
    "color":[
      "#F67373",
      "#91C7AD",
      "#5DB3E0",
      "#F67373",
      "#5DB3E0",
      "#F67373",
      "#91C7AD",
      "#5DB3E0",
      "#F67373",
      "#5DB3E0",
    ],
    "echartId":"HomeQueryStackBarEchart",
    'chartData':{
      'title': '语音特征',
      'chartX': ['通话时长',"通话次数"],
      "yName":['分钟', '次数'],
      'chart': [
        {
          'name': '本地通话时长',
          'value': '500',
          'unit': '分钟',
          'type': 'bar',
          'stack': 'one',
        },
        {
          'name': '长途通话时长',
          'value': '500',
          'unit': '分钟',
          'type': 'bar',
          'stack': 'one',
        },
        {
          'name': '漫游通话时长',
          'value': '500',
          'unit': '分钟',
          'type': 'bar',
          'stack': 'one',
        },
        {
          'name': '本网通话时长',
          'value': '750',
          'unit': '分钟',
          'type': 'bar',
          'stack': 'two',
        },
        {
          'name': '异网通话时长',
          'value': '750',
          'unit': '分钟',
          'type': 'bar',
          'stack': 'two',
        },
      ],
      "chartAnother":[
        {
          'name': '本地通话次数',
          'value': '50',
          'unit': '次',
          'type': 'bar',
          'stack': 'one',
        },
        {
          'name': '长途通话次数',
          'value': '50',
          'unit': '次',
          'type': 'bar',
          'stack': 'one',
        },
        {
          'name': '漫游通话次数',
          'value': '50',
          'unit': '次',
          'type': 'bar',
          'stack': 'one',
        },
        {
          'name': '本网通话次数',
          'value': '75',
          'unit': '次',
          'type': 'bar',
          'stack': 'two',
          'yAxisIndex': 'right',
        },
        {
          'name': '异网通话次数',
          'value': '75',
          'unit': '次',
          'type': 'bar',
          'stack': 'two',
       
        },
      ],
    }
  };
  
  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={
      chartData: null,
      selectIndex:0
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
    
    const {color,vertical} = this.props;
    const fontsize = FontSizeEchart();
    const { xAxisSize, yAxisSize, tooltipSize, legendSize,titleSize,titleWeight,titleFamily } = fontsize;
    let newChart = data.chart.map((item) => (
      {
        "type": item.type,
        'name': item.name,
        "stack":item.stack,
        'value': [item.value].map(
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
    let legendData = data.chart.map((item)=>item.name);
    const {selectIndex}=this.state;
    if(selectIndex===1){
      newChart = data.chartAnother.map((item) => (
        {
          "type": item.type,
          'name': item.name,
          "stack":item.stack,
          "yAxisIndex":0,
          'value': [item.value].map(
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
      legendData = data.chartAnother.map((item)=>item.name);
    }
    const seriesData = newChart.map((item) =>
      ({
        stack:item.stack,
        type: item.type,
        name: item.name,
        yAxisIndex:item.yAxisIndex,
        data: item.value,
        label:{
          show:true,
          position: 'inside',
        },
        itemStyle: {
          //  barBorderRadius: [9, 9, 0, 0],// 圆角
        },
        barWidth:"50px",
      }),
    );
    const chartXData = [data.chartX[selectIndex]];
   
    const option = {
      color, // 柱状图颜色
      title : {
        show:false,
        text: data.title,
        padding:[15,0,0,8],
        textStyle: {
          color:"#333",
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
        bottom: 60,
        containLabel: true,
      },
      tooltip: {
      //  trigger: 'axis',
        trigger: 'item',
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
          // let showTip = '';
          // params.forEach((par) => {
          //   if (par.axisDim === 'x') {
          //     showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${par.data.normalData === '-' ? '' : par.data.unit}  <br/>`;
          //   }
          // });
          // return `${params[0].axisValue} <br/> ${showTip}`;
          return `${params.seriesName}：${params.data.normalData}${params.data.unit}`
        },
      },
      legend: {
        show: true,
        data: legendData,
        bottom: '5%',
        left: 'center',
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
          interval:0,
          formatter(xAxisData) {
            return vertical?xAxisData.substring(0,4).replace(/(.{1})/g, '$1\n'):xAxisData;
          } // 使x轴字体竖向显示
        },
      },
      yAxis: [
        {
        type: 'value',
        name: data.yName[selectIndex],
        axisTick: {show: false},
        axisLine: {show: false},
        // min:"dataMin",
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
      }
      ],
      series: seriesData,
    };
    const myChart = echarts.init(this.chartDom.current);
    // 检测屏幕宽度发生变化时,重新渲染
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
  
  itemClicked=(index)=>{
    
    this.setState({
      selectIndex:index
    },()=>{
      const {chartData} = this.state;
      this.createChart(chartData)
    })
  };
  
  
  render() {
    const {downloadData,echartId,titlePosition,}=this.props;
    const {chartData,selectIndex} = this.state;
    const {chartX}=chartData;
    const myFontSize=FontSizeEchart();
    const liItem = chartX.map((item,index) => (
      <div className={selectIndex===index?styles.itemSelected:styles.item} key={item} onClick={()=>this.itemClicked(index)}>{item}</div>
    ));
    return (
      <div id={echartId} className={styles.page}>
        <div
          className={styles.titleDiv}
          style={{
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
        {
          chartX&&
            <div className={styles.select}>
              {liItem}
            </div>
        }
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

export default HomeQueryStackBarEchart;
