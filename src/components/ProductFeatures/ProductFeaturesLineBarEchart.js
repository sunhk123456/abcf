/*
*
* name：全部产品合计出账收入频次图 echart折线区域状混合图
* time：2019/6/10
* author：xingxiaodong
*
*/
import React, { PureComponent } from 'react';
import echarts from "echarts";
import styles from './echart.less';
import FontSizeEchart from '../ProductView/fontSizeEchart';



class ProductFeaturesLineBarEchart extends PureComponent {

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
    if (chartData && chartData !== prevState.chartData) {
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
    if(chartData && chartData !== prevState.chartData){
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
  };

  createChart=(chartData)=>{
    if(!chartData){return null}
    if(!chartData.chartX){return null}
    const color=["#FEA27E","#FE74A4"];
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight, titleFamily,xAxisSize, yAxisSize, tooltipSize,legendSize}=fontsize;
    // const NewChartData={
    //   title:"全部产品合计出账收入频次图",
    //   unit:"户",
    //   xName:"元",
    //   chartX:["0", "10", "20", "30", "40", "50", "60", "70", "80", "90"],
    //   chart:["820", "932", "901", "934", "1290", "1330", "1320","1100","1001","1021"],
    //   example:['出账用户数', '环比'],
    //   lineData:["0.820","0.932","0.901","0.934","0.5290", "0.130", "0.1320","0.1100","0.1001","0.1021"]
    // };
    // const {title,unit,xName,chartX,chart,lineData,example}=NewChartData;
    const {title,unit,xName,chartX,chart,lineData,example}=chartData;
    // const newLineData=lineData.map((item)=>(
    //   {
    //     "value":this.formatData(item),
    //     "normalData":item,
    //     "unit":"%",
    //   }
    // ) );
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
        right:5,
        textStyle:{
          color:"#999999",
          fontSize:legendSize
        },
        data:example,
      },
      tooltip: {
        trigger: "axis",
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
          let showTip = "";
          params.forEach((par,) => {
            if (par.axisDim === "x") {
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${ par.data.normalData==="-" ? '': par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
      },
      grid: {
        left:wScreen > 1866 ? gridLeft+15 : gridLeft,
        top: 80,
        right: '10%',
        bottom: 70,
      },
      xAxis:{
        type: 'category',
        name:xName,
        nameTextStyle: {
          fontSize:xAxisSize, // x轴名称样式
          padding:[ 25, 0, 0, 0],
        },
        axisLine:{show:false, // x轴坐标轴线不展示
        },
        axisTick:{show:false, // x轴坐标刻度不展示
        },
        axisLabel: {
          margin: 8,
          fontFamily: "Microsoft YaHei",
          textStyle: {fontSize:xAxisSize},
        },
        data:chartX,
      },
      yAxis: [
        {
          type: 'value',
          name:`单位：${unit}`,
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

        },
        // {
        //   type: 'value',
        //   textStyle: {fontSize:yAxisSize},
        //   splitLine:{
        //     show:false, // x轴分割线展示
        //   },
        //   axisLine:{
        //     show:false, // x轴坐标轴线不展示
        //   },
        //   axisTick:{
        //     show:false, // x轴坐标刻度不展示
        //   },
        //   axisLabel:{
        //     show:false, // x轴坐标标签展示
        //     fontSize:yAxisSize,
        //   },
        //   // boundaryGap: [0.2, 0.2]
        // },
      ],
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      },
        {
          start: 0,
          end: 100,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }],
      series: [{
        name:example[0],
        yAxisIndex: 0,
        data:newChart,
        type: 'line',
        smooth:true,
        itemStyle:{ // 拐点样式
          opacity: 0,
        },
        lineStyle:{ // 折线样式
          opacity:0,
        },
        areaStyle:{
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#FEA27E' // 0% 处的颜色
            }, {
              offset: 1, color: '#FE74A4' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
      },
      // {
      //   name:example[1],
      //   type:'line',
      //   yAxisIndex: 1,
      //   symbol: "emptyCircle",
      //   itemStyle: {
      //     color: "#989898"
      //   },
      //   lineStyle:{
      //     color: "#CDCDCD"
      //   },
      //   label: {
      //     show: false,
      //     formatter: "{c}%",
      //     position: "top"
      //   },
      //   data:newLineData,
      // }
      ]
    };
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
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
export default ProductFeaturesLineBarEchart
