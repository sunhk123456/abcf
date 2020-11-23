/*
*
* name：全部产品合计终端使用情况 echart柱状图
* time：2019/6/4
* author：xingxiaodong
*
*/
import React, { PureComponent } from 'react';
import isEqual from 'lodash/isEqual';
import echarts from "echarts";
import styles from './echart.less';
import FontSizeEchart from './fontSizeEchart';




class ProductViewTerminalEchart extends PureComponent {

  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={
      chartData:null,
    }
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const {chartData}=nextProps;
    if (!isEqual(chartData,prevState.chartData)) {
      return {
        chartData,
      };
    }
    return null;
  }

  componentDidMount() {
    const {chartData}=this.state;
    this.createChart(chartData)
  }

  componentDidUpdate(prevProps, prevState) {
    const {chartData}=this.state;
    if (!isEqual(chartData,prevState.chartData)) {
      this.createChart(chartData)
    }
  }

  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(",") === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ""));
    return dataA;
  }

  createChart=(chartData)=>{
    const {chartType}=this.props;
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    if(!chartData){return null}
    if(!chartData.data){return null}
    // console.log("全部产品合计终端使用情况");
    // console.log(chartData);
    let color=["#D76A68"];
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight,titleFamily, xAxisSize, yAxisSize, tooltipSize,legendSize}=fontsize;
    // const NewChartData={
    //   title:"全部产品合计终端使用情况",
    //   xName:"终端",
    //   unit:"单位：户",
    //   chartX:["4G终端","2G终端","其他","3G终端"],
    //   chart:[820, 932, 901, 934],
    // };
    //  const example="出账用户数";
    // const {title,xName,unit,chartX,chart}=NewChartData;
    const {title,xName,unit,chartX,chart,example}=chartData.data;
    const newChart=chart.map((item)=>(
      {
        "value":this.formatData(item),
        "normalData":item,
        "unit":unit,
      }
    ) );
    let gridLeft=85;
    if(newChart.length>0){
      // 获取最大值
      const maxValue=newChart.reduce((prev,cur)=>prev.value>cur.value?prev:cur);
      if(maxValue.normalData.length>10){
        gridLeft= 95
      }else if(maxValue.normalData.length>6){
        gridLeft=85
      }else {
        gridLeft=70
      }
    }
    const wScreen = window.screen.width;
    const axisLabelRotate=0;
    if(chartType==="channel"){
     //  axisLabelRotate=30;
    }else if(chartType==="client"){
       color=["#61B6DA"];
    }
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
      grid: {
        left:  wScreen > 1866 ? gridLeft+15 : gridLeft,
        top: 80,
        right: '12%',
        bottom: 50,
      },
      legend: {
        top:10,
        right:5,
        textStyle:{
          color:"#999999",
          fontSize:legendSize,
        },
        data:[example],
      },
      tooltip: {
        trigger: "item",
        show: true,
        textStyle:{
           fontSize: tooltipSize
        },
        axisPointer: {
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        formatter(params) {
          return `${params.marker}${params.name}:${params.data.normalData}${params.data.normalData==="-"?"":unit}`;
        },
      },
      xAxis: {
        type: 'category',
        name:xName,
        nameTextStyle: {
           fontSize:xAxisSize, // x轴名称样式
         // padding:[ 25, 0, 0, 0],
        },
        data:chartX,
        axisLine:{
          show:false, // x轴坐标轴线不展示
        },
        axisTick:{
          show:false, // x轴坐标刻度不展示
        },
        axisLabel:{
          show:true, // x轴坐标标签展示
          rotate:axisLabelRotate,
          fontSize:xAxisSize,
        },
      },
      yAxis: {
        type: 'value',
        name:unit,
        nameTextStyle: {
          fontSize:yAxisSize, // x轴名称样式
         // padding:[ 0, 25, 0, 0],
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
        splitLine:{
          show:false, // x轴分割线展示
        },

      },
      series: [{
        name:example,
        data:newChart,
        type: 'bar',
        barWidth: '40%',
        barMaxWidth:20,
        itemStyle:{
          barBorderRadius:10,
        },
        //   barGap:"100%",// 不同系列柱子间距离
        //  barCategoryGap:"100%",// 同一系列柱子间距离
      }]
    };

    myChart.setOption(option);
    return null
  };

  render() {
    return(
      <div className={styles.page}>
        <div ref={this.chartDom} className={styles.chartWrapper} />
      </div>
    )
  }

}
export default ProductViewTerminalEchart
