/**
 * @Description: 业务结构图  边框的
 *
 * @author: liuxiuqian
 *
 * @date: 2019/1/25
 */

import React, { PureComponent } from 'react';
import echarts from "echarts";
import { Button } from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from "@/utils/downloadFile"
import styles from './businessStructure.less';
import EchartFontSize from './echartFontSize';

class BusinessStructure extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {

    };
    this.businessStructureRef = React.createRef(); // 创建业务结构图ref
  }

  componentDidMount() {
    this.initEchart();
  }

  componentDidUpdate(prevProps){
    const {data} = this.props;
    if(!isEqual(prevProps.data, data)){
      this.initEchart();
    }
  }

  /**
   * @date: 2019/1/25
   * @author liuxiuqian
   * @Description: 处理数据方法
   * @method handleChartData
   * @param data 要处理的数据
   */
  handleChartData = data => {
    const numberArr = [];
    data.map((item) =>{
      const single = {};
      single.name = item.name;
      single.percent = item.percent;
      if (item.value.indexOf(",") !== -1) {
        single.value = parseFloat(item.value.replace(/,/g, ""));
      } else if (item.value === "-") {
        single.value = item.value;
      } else {
        single.value = item.value;
      }
      numberArr.push(single);
      return null;
    });
    return numberArr;
  };

  /*
   *初始化当业务结构图
   * */
  initEchart() {
    const { data } = this.props;
    const businessData = data;
    const showCont = "本月累计";
    const {unit, chart} = businessData.data[0];
    const chartPie = chart;
    const numberArr = this.handleChartData(chartPie);
    const legendData = [];
    const {isMinus,isPercentage} = businessData;// 是否是百分比指标（1表示是百分比指标，0表示不是）-如果是，饼图改为柱状图显示

    const fontsize = EchartFontSize();
    const {pietextSize, legendSize, tooltipSize} = fontsize;
    let {titleSize} = fontsize;

    chartPie.map(item => {
      legendData.push(item.name);
      return null
    });

    const { pattern } = this.props; // 大图小图模式标记
    let tooltipShow = true; // 是否显示tooltip
    // let titleSize = 18;
    let titleTop = 10;
    let gridTop = 70;
    let gridBottom = 60;
    let gridLeftAndRight = "10%";
    let barWidth = 30;
    let barGap = "100%";
    const sw=window.screen.width;
    if(sw>1870){
      barGap = "250%";
      gridTop = 100;
    }else if(sw<1870 && sw>1389){
      barGap = "180%";
    }else if(sw<1389 && sw>1315){
      barGap = "150%";
    }
    if (pattern === "small") {
      tooltipShow = false;
      titleSize = 12;
      titleTop = 0;
      gridTop = 25;
      gridBottom = 10;
      gridLeftAndRight = "5%";
      barWidth = 10;
      barGap = "50%";
    }

    const option = {
      title: {
        text: "业务结构",
        left: "center",
        top: titleTop,
        textStyle: {
          fontSize: titleSize,
          color: "#333333", // 主标题文字颜色
          fontWeight: "normal",
          fontFamily: "Microsoft YaHei"
        }
      },
      legend: {
        show: tooltipShow,
        bottom: "0%",
        left: "center",
        textStyle:{
          fontSize:legendSize
        },
        data: legendData,
      },
      tooltip: {
        trigger: "item",
        show: tooltipShow,
        textStyle:{
          fontSize: tooltipSize
        },
        axisPointer: {
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        position(point) {
          return [point[0] - 60, point[1] - 10];
        },
        formatter(params) {
          return `${params.marker}  ${chartPie[params.dataIndex].name} <br/>  ${showCont} ：${chartPie[params.dataIndex].value}  ${unit}`;
        }
      },
      color: ["#5CD5E3", "#DC68AC", "#60ADDE", "#DE9461","#f76e72"],
      // color: ["#72b1dd", "#7195db", "#de9c72", "#dd7071"],
      series: [
        {
          type: "pie",
          center: ["50%", "53%"], // 设置饼图位置，第一个是x轴
          radius: ["35%", "60%"],
          label: {
            show: tooltipShow,
            formatter: "{d}%",
            fontsize: pietextSize
          },
          itemStyle: {
            borderWidth: 10,
            borderColor: "#FFFFFF"
          },
          data: numberArr
        }
      ]
    };

    // 柱状图
    const seriesData = numberArr.map(item => {
      const obj = {
        name: item.name,
        type: "bar",
        barWidth,
        barGap,
        barCategoryGap: "0%",
        label: {
          show: tooltipShow,
          position: "top",
          textStyle: {
            color: "#857D7D",
            fontSize: 12
          },
          formatter(params) {
            return `${parseFloat(params.data.value).toFixed(2)} ${unit}\n ( ${params.data.percent} % )`;
          }
        },
        data: [item]
      }
      return obj;
    });
    const option2 = {
      title: {
        text: "业务结构",
        left: "center",
        top: titleTop,
        textStyle: {
          fontSize: titleSize,
          color: "#333333", // 主标题文字颜色
          fontWeight: "normal",
          fontFamily: "Microsoft YaHei"
        }
      },
      legend: {
        show: tooltipShow,
        bottom: "0%",
        left: "center",
        textStyle:{
          fontSize:legendSize
        },
        data: legendData
      },
      grid: {
        top: gridTop,
        bottom: gridBottom,
        left: gridLeftAndRight,
        right: gridLeftAndRight
      },
      tooltip: {
        trigger: "item",
        show: false,
        textStyle:{
          fontSize: tooltipSize
        },
      },
      color: [
        "#E0E7EF",
        "#DE65AD",
        "#F97373 ",
        "#56D5E4",
        "#5CACE0",
        "#E0E7EF"
      ],
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

    const myChart = echarts.init(this.businessStructureRef.current); // 初始化当日趋势图所需dom
    // 使用刚指定的配置项和数据显示图表
    myChart.clear();
    myChart.resize();
    if (isMinus === "1" || isPercentage === "1") {
      myChart.setOption(option2);
    } else {
      myChart.setOption(option);
    }
  }

  download(e){
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"businessStructure");
  }

  jsonHandle(){
    const {downloadData, data} = this.props;
    const {title, selectUnit, selectCity, selectPro, date, selectNameData} = downloadData;
    const conditionVlue = []
    // console.log(selectNameData)
    selectNameData.forEach((item)=>{
      const valurNameArr = [];
      item.value.forEach((itemValue)=>{
        valurNameArr.push(itemValue.sname)
      })
      conditionVlue.push([item.screenTypeName, ...valurNameArr]);

     // conditionVlue.push([item.screenTypeName, item.value[0].sname]);
    })
    const tableData = data ;
    const tableValue = [];
    const chartY = tableData.data[0].chart;
    chartY.forEach((item)=>{
      tableValue.push([item.name,item.value])
    })
    const condition = {
      name: "业务结构",
      value: [
        ["专题名称:", title, `(${selectUnit.unitName})`],
        ["筛选条件:"],
        // ["地域",selectPro.proName, selectCity.cityName],
        ["省分:", selectPro.proName],
        ["地市:", selectCity.cityName],
        ["日期:", date],
        ...conditionVlue,
      ],
    }
    const  table = {
      title: [
        ["业务类型", "本月累计值"]
      ],
      value: [
        ...tableValue
      ]
    }


    const newJson = {
      fileName: `${title}-业务结构`,
      condition,
      table
    }
    return newJson;
  }

  render() {
    const {downloadData}=this.props;
    const {downloadSize} = EchartFontSize();
    return (
      <div id="businessStructure" className={styles.businessStructureCss}>
        <div
          ref={this.businessStructureRef}
          className={styles.echart}
        />
        {downloadData ? <div className={styles.downloadName}><Button size={downloadSize} icon="download" onClick={(e)=>{this.download(e)}}>下载</Button></div> : null}
      </div>
    );
  }
}

export default BusinessStructure;
