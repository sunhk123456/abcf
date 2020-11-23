/*
*
* name：全部产品合计4G网络用户占比 echart饼图
* time：2019/6/4
* author：xingxiaodong
*
*/
import React, { PureComponent } from 'react';
import isEqual from "lodash/isEqual";
import echarts from "echarts";
import styles from './echart.less';
import FontSizeEchart from './fontSizeEchart';



class ProductViewPieEchart extends PureComponent {

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
    if(!chartData.data){return null}
    // console.log("全部产品合计4G网络用户占比");
    // console.log(chartData);
    const color=["#5CACE0", "#F97373","#DE65AD", "#E0E7EF", "#56D5E4",];
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight,titleFamily, tooltipSize,legendSize,pietextSize}=fontsize;
    // const NewChartData={
    //   title:"全部产品合计4G网络用户占比",
    //   chart: ["20000000", "20000000", "20000000"],
    //   chartX: ["2G", "3G", "4G"],
    //   example: ["2G", "3G", "4G"],
    //   unit:"户",
    // };
    // const {title,chartX,chart,example}=NewChartData;
    // const newChart=[ {value:335, name:"4G网络用户数"}, {value:555, name:"非4G网络用户数"},];
    const {title,chartX,chart,example,unit}=chartData.data;
    const newChart=chart.map((item,index)=>
      ({
        name:chartX[index]||"",
        "value":this.formatData(item),
        "normalData":item,
        unit,
      })
    );
    const option = {
      "color":color,
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
        top:80
      },
      legend: {
        orient:'vertical',
        top:'middle',
        left:'70%',
        itemGap: 30,
        textStyle:{
          fontSize:legendSize
        },
        data:example,
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
      series: {
        data:newChart,
        type: 'pie',
        roseType: "radius", // 南丁格尔玫瑰图模式，'radius'（半径） | 'area'（面积）
        center: ["35%", "50%"],
        radius: ['35%', '55%'],
        formatter: "{d}%",
        label: {
          show: false,
          fontsize: pietextSize,
        },
      }
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
export default ProductViewPieEchart
