/*
*
* name：全部产品合计地域分布图 echart折线柱状混合图
* time：2019/6/4
* author：xingxiaodong
*
*/
import React, { PureComponent } from 'react';
import isEqual from "lodash/isEqual";
import echarts from "echarts";
import styles from './echart.less';
import FontSizeEchart from './fontSizeEchart';



class ProductViewAreaEchart extends PureComponent {

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
  };

  createChart=(chartData)=>{
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    if(!chartData){return null}
    if(!chartData.chartX){return null}
    // console.log("全部产品合计地域分布图");
    // console.log(chartData);
    const color=["#61B6DA"];
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight, titleFamily,xAxisSize, yAxisSize, tooltipSize,legendSize}=fontsize;
    // const NewChartData={
    //   title:"全部产品合计地域分布图",
    //   indexType:"1",
    //   unit:"户",
    //   chartX:["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "山东", "河南", "上海", "江苏", "浙江", "安徽",
    //     "福建", "江西", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆"],
    //   chart:["820", "932", "901", "934", "1290", "1330", "1320","1100","1001","1021","820", "932", "901", "934", "1290", "1330",
    //     "820", '932', '901', '934', '1290', '1330', '1320','1100','1001','1021','820', '932', '901', '934', '1290'],
    //   example:['出账用户数', '环比'],
    //   lineData:["820", "932", "901", "934", "1290", "1330", "1320","1100","1001","1021","820", "932", "901", "934", "1290", "1330",
    //     "820", '932', '901', '934', '1290', '1330', '1320','1100','1001','1021','820', '932', '901', '934', '1290'],
    // };
    // const {title,unit,chartX,chart,lineData,example}=NewChartData;
    const {indexType,title,unit,chartX,chart,lineData,example}=chartData;
    const newLineData=lineData.map((item)=>(
      {
        "value":this.formatData(item),
        "normalData":item,
        "unit":"%",
      }
    ) );
    const newChart=chart.map((item)=>(
      {
        "value":this.formatData(item),
        "normalData":item,
        "unit":unit,
      }
    ) );
    // console.log(newLineData);
    // console.log(newChart);
    let strOrient = "horizontal";
    let legendTop = 10;
    const wScreen = window.screen.width;
    if( wScreen < 1315){
      strOrient = "vertical";
      legendTop = 0;
    }
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
        top:legendTop,
        right:5,
        orient: strOrient,
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
        left: wScreen > 1866 ? gridLeft+15 : gridLeft,
        top: 80,
        right: 10,
        bottom: wScreen > 1866 ? 60 : 50,
      },
      xAxis:{
        type: 'category',
        axisLine:{show:false, // x轴坐标轴线不展示
        },
        axisTick:{show:false, // x轴坐标刻度不展示
        },
        axisLabel: {
          interval: 0,
          margin: 2,
          fontFamily: "Microsoft YaHei",
          textStyle: {fontSize:xAxisSize},
          formatter(xAxisData) {
            if (xAxisData.length > 4) {
              return xAxisData
                .substr(0, 4)
                .split("")
                .join("\n");
            }
            return xAxisData.split("").join("\n");
          } // 使x轴字体竖向显示
        },
        data:chartX,
      },
      yAxis: [
        {
          type: 'value',
          // show:false,
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
      series: [{
        name:example[0],
        type:'bar',
        yAxisIndex: 0,
        data:newChart,
        barWidth: '70%',
        barMaxWidth:20,
        itemStyle:{ barBorderRadius:5, },
      },{
        name:example[1],
        type:'line',
        yAxisIndex: 1,
        symbol: "emptyCircle",
        itemStyle: {
          color: "#989898"
        },
        lineStyle:{
          color: "#CDCDCD"
        },
        label: {
          show: false,
          formatter: "{c}%",
          position: "top"
        },
        data:newLineData,
      }]
    };
    // 只有折线图
    const option1= {
      // "color":color, // 柱状图颜色
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
        left: '10%',
        top: 80,
        right: '10%',
        bottom: 40,
      },
      xAxis:{
        type: 'category',
        axisLine:{show:false, // x轴坐标轴线不展示
        },
        axisTick:{show:false, // x轴坐标刻度不展示
        },
        axisLabel: {
          interval: 0,
          margin: 2,
          fontFamily: "Microsoft YaHei",
          textStyle: {fontSize:xAxisSize},
          formatter(xAxisData) {
            if (xAxisData.length > 4) {
              return xAxisData
                .substr(0, 4)
                .split("")
                .join("\n");
            }
            return xAxisData.split("").join("\n");
          } // 使x轴字体竖向显示
        },
        data:chartX,
      },
      yAxis: [
        {
          type: 'value',
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
      series: [{
        name:example[1],
        type:'line',
        yAxisIndex: 0,
        symbol: "emptyCircle",
        itemStyle: {
          color: "#989898"
        },
        lineStyle:{
          color: "#CDCDCD"
        },
        label: {
          show: false,
          formatter: "{c}%",
          position: "top"
        },
        data:newLineData,
      }]
    };
    myChart.setOption(indexType==="1"?option:option1);
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
export default ProductViewAreaEchart
