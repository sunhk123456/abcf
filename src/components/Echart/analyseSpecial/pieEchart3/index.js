import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import styles from './index.less';
import FontSizeEchart from '../../../ProductView/fontSizeEchart';


class PieEchart3 extends Component {

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
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };

  // 渲染echart
  createChart=(chartData)=>{
    if(!chartData){return null}
    if(!chartData.chartX){return null}
    // console.log("全部产品合计4G网络用户占比");
    // console.log(chartData);
   
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight,titleFamily, tooltipSize,legendSize,pietextSize,pieEchartColor}=fontsize;
    const color=pieEchartColor;
    // const NewChartData={
    //   title:"全部产品合计4G网络用户占比",
    //   chart: ["20000000", "20000000", "20000000"],
    //   chartX: ["2G", "3G", "4G"],
    //   example: ["2G", "3G", "4G"],
    //   unit:"户",
    // };
    const {title,chartX,chart,example,unit,isMinus,isPercentage}=chartData;
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
        bottom: "0%",
        left: "center",
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
        minAngle:30,
     //    roseType: "radius", // 南丁格尔玫瑰图模式，'radius'（半径） | 'area'（面积）
        center: ["50%", "50%"],
        radius: ['35%', '55%'],
        label: {
          show: true,
          formatter: "{d}%",
          fontsize: pietextSize,
        },
        itemStyle: {
          borderWidth: 10,
          // borderColor: "#F6F6F6"
          borderColor: "#fff"
        },
        emphasis:{
          itemStyle: {
            // borderColor: "#F6F6F6"
            borderColor: "#fff"
          },
        }
      }
    };

    // 柱状图
    const seriesData=newChart.map((item)=>(
      {
        name:item.name,
        type: "bar",
        barWidth:30,
        barGap:'100%',
        barCategoryGap: "10%",
        label: {
          show: true,
          position: "top",
          textStyle: {
            color: "#857D7D",
            fontSize: 12
          },
          formatter(params) {
            return `${params.data.name}\n ( ${params.data.normalData} ${unit} )`;
          }
        },
        data:[item]
      }
      )

    );
    const option2 = {
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
        bottom: "0%",
        left: "center",
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
      xAxis: [
        {
          type: "category",
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#CCCCCC"
            }
          },
          data: [""]
        }
      ],
      yAxis: [
        {
          type: "value",
          show: false
        }
      ],
      series: seriesData
    };
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    if (isMinus === "1" || isPercentage === "1") {
      myChart.setOption(option2);
    } else {
      myChart.setOption(option);
    }
    return null
  };

  download = (e) => {
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"pieEchart3");
  };

  jsonHandle=()=>{
    const {downloadData, chartData} = this.props;
    if(!chartData){return null}
    const thData=["维度","值"];
    const tbodyData=chartData.chartX.map((item,index)=>([item,chartData.chart[index]]));
    const {title,unit}=chartData;
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
      <div id="pieEchart3" className={styles.page}>
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

export default PieEchart3;

