import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import styles from './index.less';
import FontSizeEchart from '../../../ProductView/fontSizeEchart';


class Top10 extends Component {

  constructor(props) {
    super(props);
    this.chartDom = React.createRef();
    this.state = {
      chartData: null,
    };
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const { chartData } = nextProps;
    if (chartData && chartData !== prevState.chartData) {
      return {
        chartData,
      };
    }
    return null;
  }

  componentDidMount() {
    console.log(22222222222222222)
    const { chartData } = this.state;
    this.createChart(chartData);
  }

  componentDidUpdate(prevProps, prevState) {
    const { chartData } = this.state;
    if (chartData && chartData !== prevState.chartData) {
      this.createChart(chartData);
    }
  }


  // 处理数据格式
  formatData = (data) =>
    (
      data.indexOf(',') === -1
      ? parseFloat(data)
      : parseFloat(data.replace(/,/g, ''))
    );

  createChart=(chartData)=>{
    console.log(11111111111)
    console.log(chartData)
    if(!chartData){return null}
    if(!chartData.chartX){return null}
    // console.log(chartData);
    const color=["#61B6DA"];
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight, titleFamily,xAxisSize, yAxisSize, tooltipSize,legendSize}=fontsize;
    // const NewChartData={
    //   title:"top10",
    //   unit:"户",
    //   yName:"",
    //   xName:"",
    //   chartX:["小兵神卡", "芝麻冰激凌", "陌陌冰激凌", "超值特惠冰激凌", "畅爽全国冰激凌套餐", "辽宁", "吉林", "黑龙江", "山东", "河南"],
    //   chart:["820", "932", "901", "934", "1290", "1330", "1320","1100","1001","1021"],
    //   example:['出账用户数'],
    // };
    const {title,unit,chartX,chart,example,yName,xName}=chartData;
    const newChart=chart.map((item)=>(
      {
        "value":this.formatData(item),
        "normalData":item,
        "unit":unit,
      }
    ) );
    const newChartX=chartX.map((item)=>{
      if(item.length>3){
        return ` ${item.substring(0, 3)}...`
      }
      return item
    });




    const option = {
      "color":color, // 柱状图颜色
      title:{
        text:title,
        x:"center",
        top:10,
        textStyle:{
          fontSize: titleSize,
          fontWeight:titleWeight,
          fontFamily:titleFamily,
          textAlign:"center",
        },
      },
      legend: {
        top:10,
        left:5,
        textStyle:{
          color:"#999999",
          fontSize:legendSize
        },
        data:example,
      },
      tooltip: {
        trigger: "axis",
        show: true,
        confine:true, // 限制在图标区域内
        textStyle:{
          fontSize: tooltipSize
        },
        axisPointer: {
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        formatter(params) {
          let showTip = "";
          const index=params[0].dataIndex;
          params.forEach((par,) => {
            if (par.axisDim === "x") {
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${ par.data.normalData==="-" ? '': par.data.unit}  <br/>`;
            }
          });
          return `${chartX[index]} <br/> ${showTip}`;
        },
      },
      grid: {
        left:  40,
        top: 80,
        right: 40,
        bottom: 50,
      },
      xAxis:{
        name:xName,
        type: 'category',
        axisLine:{show:false, // x轴坐标轴线不展示
        },
        axisTick:{show:false, // x轴坐标刻度不展示
        },
        axisLabel: {
          interval: 0,
          margin: 2,
          rotate: '30',
          fontFamily: "Microsoft YaHei",
          fontSize:xAxisSize,
        },
        data:newChartX,
      },
      yAxis: [
        {
          type: 'value',
          // show:false,
          name:yName,
          textStyle: {fontSize:yAxisSize},
          splitLine:{
            show:false, // x轴分割线展示
          },
          axisLine:{
            show:false, // x轴坐标轴线不展示
          },
          axisTick:{
            show:false, // x轴坐标刻度不展示
          },
          axisLabel:{
            show:false, // x轴坐标标签展示
            fontSize:yAxisSize,
          },

        },
        {
          type: 'value',
          show:false,
          textStyle: {fontSize:yAxisSize},
          splitLine:{
            show:false, // x轴分割线展示
          },
          axisLine:{
            show:false, // x轴坐标轴线不展示
          },
          axisTick:{
            show:false, // x轴坐标刻度不展示
          },
          axisLabel:{
            show:true, // x轴坐标标签展示
            fontSize:yAxisSize,
          },
          // boundaryGap: [0.2, 0.2]
        },
      ],
      series: [
        {
          name: example[0],
          type: 'bar',
          data: newChart,
          width:"100%",
          height:"100%",
          barWidth: 8,
          barCategoryGap: '50%',
          itemStyle: {
            textOverflow: "ellipsis",
            emphasis: {
              barBorderRadius: 30
            },
            normal: {
              color:"rgb(219,107,104)",
              barBorderRadius: [10, 10, 10, 10],
            },
          },
        },
      ]
    };
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.setOption(option);
    return null
  };

  download = (e) => {
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"top10");
  };

  jsonHandle=()=>{
    const {downloadData, chartData} = this.props;
    if(!chartData){return null}
    const {title,unit,example}=chartData;
    const thData=["维度",example[0]];
    const tbodyData=chartData.chartX.map((item,index)=>([item,chartData.chart[index]]));
    const conditionValue=[];
    downloadData.condition.forEach((item)=>{
      conditionValue.push([item.key,...item.value])
    });
    const {specialName}=downloadData;
    const condition = {
      name: `${title}`,
      value: [
        ["专题名称:", specialName, unit],
        ["筛选条件:"],
        ...conditionValue,
      ],
    };
    const table = {
      title: [
        thData
      ],
      value: [
        ...tbodyData
      ]
    };
    return {
      fileName: `${specialName}--${title}`,
      condition,
      table
    };
  };

  render() {
    const {downloadData}=this.props;
    return (
      <div id="top10" className={styles.page}>
        <div ref={this.chartDom} className={styles.chart} />
        {downloadData?(
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
        ):null}
      </div>
    );
  }

}

export default Top10;

