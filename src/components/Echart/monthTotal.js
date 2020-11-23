/* eslint-disable react/no-did-update-set-state */
/**
 * @Description:月累计趋势图
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/15
 */
import React, { PureComponent } from 'react';
import echarts from "echarts";
import { Button } from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from "@/utils/downloadFile"
import styles from './monthTotal.less';
import warningIcon from '../IndexDetails/u91.png';
import EchartFontSize from './echartFontSize';

class MonthTotal extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      selectIndex: 0, // 选中的条件的索引: 0
     // echartData:{},
    };
    this.monthTotalRef = React.createRef(); // 创建月累计趋势图ref
  }

  componentDidMount() {
    this.initEchart();
  }


  componentDidUpdate(prevProps){
    const {data} = this.props;
    if(!isEqual(prevProps.data, data)){
      this.setState({selectIndex:0},()=>{this.initEchart()})
    }
  }

  /**
   * @date: 2019/1/22
   * @author liuxiuqian
   * @Description: 处理数据
   * @method handleChartData
   * @param {Array} data 处理前的数据
   * @return {Array}  返回处理后的数据
   */
  handleChartData = data => {
    const numberArr = [];
    data.map(value => {
      if (typeof value === "string" && value.constructor === String) {
        if (value.indexOf(",") !== -1) {
          numberArr.push(parseFloat(value.replace(/,/g, "")));
        } else if (value === "-") {
          numberArr.push(value);
        } else {
          numberArr.push(value);
        }
      }
      return null;
    });
    return numberArr;
  };

  /*
   *初始化当日趋势图
   * */
  initEchart() {
    const { selectIndex } = this.state;
    const { pattern, data} = this.props; // 大图小图模式标记
    const monthTotalData = data;
    const {unit} = monthTotalData.data[0];
    const { chartX, title, totalData, warning }= monthTotalData.data[0].chart[0];
    const totalDataX = this.handleChartData(totalData);
    const showUnit = unit === "%" ? "PP" : "%";
    const YoYTitle = monthTotalData.data[0].chart[0].example[2]; // 获取"累计同比"字段
    const sequentialTitle = monthTotalData.data[0].chart[0].example[1]; // 获取"日均环比"字段
    const monthText = monthTotalData.data[0].chart[0].example[0]; // 获取""本月累计"字段
    let {titleSize, xAxisSize, yAxisSize, tooltipSize,legendSize} = EchartFontSize();

    /**
     * 判断是否有预警信息 有则加上一个*号
     */
    const dataX = chartX.map((datakey,index)=>{
      let datadata = chartX[index];
      if(warning){
        for(let i=0;i<warning.length;i+=1){
          const warningindex = parseInt(warning[i].warningIndex,10)
          if(index === warningindex){
            datadata = `${datakey }*`;
            break;
          }
        }
      }
      return datadata;
    });
    let lineData = [];
    let lineDataX = [];
    let legendData = [];
    if (selectIndex === 0) {
      lineData = monthTotalData.data[0].chart[0].sequentialData; // 修改同比环比数据
      lineDataX = this.handleChartData(lineData);
      legendData = [sequentialTitle, monthText];
    } else {
      lineData = monthTotalData.data[0].chart[0].YoYData;
      lineDataX = this.handleChartData(lineData);
      legendData = [YoYTitle, monthText];
    }
    let tooltipShow = true; // 是否显示tooltip
    let   titleTop = 10;

    if (pattern === "small") {
      tooltipShow = false;
      titleSize = 12;
      titleTop = 0;
    }
    const option = {
      title: {
        text: title,
        left: "center",
        top: titleTop,
        textStyle: {
          color: "#333333",
          fontWeight: "normal",
          fontFamily: "Microsoft YaHei",
          fontSize: titleSize
        }
      },
      tooltip: {
        trigger: "axis",
        show: tooltipShow,
        textStyle:{
          fontSize: tooltipSize
        },
        position(point, params, dom, rect, size) {
          // 固定在顶部
          if (point[0] > size.viewSize[0] * 0.6) {
            // 防止提示框溢出外层
            return [
              point[0] - ((point[0] - size.viewSize[0] * 0.6) * 2) / 3,
              40
            ];
          }
          return [point[0], 40];
        },
        formatter(params) {
          let showTip = "";
          params.forEach((par) => {
            if (par.axisDim === "x") {
              if (par.componentSubType === "bar") {
                showTip += `${par.marker}${par.seriesName}: ${ totalData[par.dataIndex]}${totalData[par.dataIndex]==="-"?'':monthTotalData.data[0].unit}<br/>`;
              } else {
                showTip += `${par.marker}${par.seriesName}: ${lineData[par.dataIndex]} ${lineData[par.dataIndex]==="-"?'':showUnit}<br/>`;
              }
            }
          });

          /**
           * 预警tips
           */
          let tip;
          const tips = [];
          if(warning !== undefined && warning.length !== 0){
            totalDataX.forEach((dataa,index) =>{
              for(let i=0;i<warning.length;i+=1){
                if(index === parseInt(warning[i].warningIndex,10)){
                  if(warning[i].desc !== ''){
                    tip =`${legendData[1]}：${totalDataX[params[0].dataIndex]
                        }${unit}<div style='background-color: white;width: 100%;height: 1px;text-align: center'></div>` +
                      `<div style='color: #FFCC00'>` +
                      `<img style='width: 18px;height: 18px' src=${warningIcon}>` +
                      `预警等级：${warning[i].warningLevel
                        }</div>` +
                      `<div style='width: 100%;white-space:normal;word-wrap : break-word'>` +
                      `详情：${  warning[i].desc
                        }</div>`;
                  }else {
                    tip =`{legendData[1]}：${totalDataX[params[0].dataIndex]
                        }${unit}<div style='background-color: white;width: 100%;height: 1px;text-align: center'></div>` +
                      `<div style='color: #FFCC00'>` +
                      `<img style='width: 18px;height: 18px' src=${warningIcon}>` +
                      `预警等级：${warning[i].warningLevel
                        }</div>`
                  }
                  break;
                }else{
                  tip =`${legendData[1]}：${  totalDataX[params[0].dataIndex]}${unit}`;
                }
              }
              tips.push(tip);
            });
            return tips[params[0].dataIndex];
          }
          showTip += tips;
          return `${params[0].axisValue }<br/>${showTip}`;
        },
        axisPointer: {
          type: "shadow",
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        backgroundColor: "rgba(108,109,111,0.7)",
        showDelay: 0 // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
      },
      grid: [
        { x: "5%", y: "20%", height: "30%" },
        { x: "5%", y: "50%", height: "30%" }
      ],
      legend: {
        show: tooltipShow,
        data: legendData,
        left: "center",
        bottom: "2%",
        selectedMode: false,
        textStyle:{
          color:"#999999",
          fontSize:legendSize
        }
      },
      axisPointer: {
        show: true,
        type: "none",
        link: [{ xAxisIndex: [0, 1] }],
        label: {
          show: false
        }
      },
      xAxis: [
        {
          type: "category",
          show: false,
          gridIndex: 0, // 对应前面grid的索引位置（第一个）
          data: dataX,
          axisLabel: {
            color: "#999999",
            fontSize:xAxisSize
          },
        },
        {
          type: "category",
          show: tooltipShow,
          gridIndex: 1, // 对应前面grid的索引位置（第二个）
          boundaryGap: [0, 0], // 坐标轴两边留白策略
          axisLine: {
            show: true,
            lineStyle: {
              color: "#99a5bd",
              width: 1
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            margin: 2,
            fontFamily: "Microsoft YaHei",
            fontSize:xAxisSize,
            // color: "#999999"
            color:(value)=>value.indexOf('*') !==-1 ? "#c91717" : "#999999",
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          data: dataX
        }
      ],
      yAxis: [
        {
          type: "value",
          show: false,
          gridIndex: 0 // 对应前面grid的索引位置（第一个）
        },
        {
          type: "value",
          show: false,
          gridIndex: 1 // 对应前面grid的索引位置（第二个）
        }
      ],
      series: [
        {
          name: legendData[1],
          type: "bar",
          smooth: false, // 是否平滑曲线显示。
          symbol: "emptyCircle",
          xAxisIndex: 1, // 对应前面x的索引位置（第二个）
          yAxisIndex: 1, // 对应前面y的索引位置（第一个）
          itemStyle: {
            color: "#569DE4"
          },
          data: totalDataX
        },
        {
          name: legendData[0],
          type: "line",
          xAxisIndex: 0, // 对应前面x的索引位置（第一个）
          yAxisIndex: 0, // 对应前面y的索引位置（第一个）
          smooth: false, // 是否平滑曲线显示。
          symbol: "emptyCircle",
          itemStyle: {
            color: "#989898",
          },
          lineStyle:{
            color: selectIndex === 0?"rgb(205,205,205)":"#989898"
          },
          label: {
            show: tooltipShow,
            formatter: `{c} ${showUnit}`,
            position: "top"
          },
          data: lineDataX
        },

      ]
    };
    const myChart = echarts.init(this.monthTotalRef.current); // 初始化当日趋势图所需dom
    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
  }

  conditionHandle (index,e) {
    this.setState({
      selectIndex: index
    },
      () => {
        this.initEchart();
      }
    );
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  download(e){
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"monthTotal");
  }

  jsonHandle(){
    const {downloadData, data} = this.props;

    const {title, selectUnit, selectCity, selectPro, date, selectNameData} = downloadData;
    const {selectIndex} = this.state;
    const conditionVlue = []
    selectNameData.forEach((item)=>{
      const valurNameArr = [];
      item.value.forEach((itemValue)=>{
        valurNameArr.push(itemValue.sname)
      })
      conditionVlue.push([item.screenTypeName, ...valurNameArr]);

      // conditionVlue.push([item.screenTypeName, item.value[0].sname]);
    })
    const tableData =  data ;
    // console.log("tableData")
    // console.log(tableData)
    const tableValueSequentialData = [];
    const tableValueYoYData = [];
    const chartY = tableData.data["0"].chart["0"].totalData; // 本月累计[]
    const chartYoYData=tableData.data["0"].chart["0"].YoYData; // 累计同比[]
    const chartSequentialData=tableData.data["0"].chart["0"].sequentialData; // 累计环比[]

    tableData.data[0].chart[0].chartX.forEach((item,index)=>{
      tableValueSequentialData.push([item,chartY[index],chartSequentialData[index]]);
      tableValueYoYData.push([item,chartY[index],chartYoYData[index]]);
    })
    const condition = {
      name: tableData.data[0].chart[0].title,
      value: [
        ["专题名称:", title, `(${selectUnit.unitName})`],
        ["筛选条件:"],
        ["省分:", selectPro.proName],
        ["地市:", selectCity.cityName],
        ["日期:", date],
        ...conditionVlue,
      ],
    }
    let table={}
    if(selectIndex===0){
       table = {
        title: [
          ["时间", "本月累计","累计环比"]
        ],
        value: [
          ...tableValueSequentialData
        ]
      }
    }else{
      table = {
        title: [
          ["时间", "本月累计","累计同比"]
        ],
        value: [
          ...tableValueYoYData
        ]
      }
    }

    const newJson = {
      fileName: `${title}-${tableData.data[0].chart[0].title}`,
      condition,
      table
    }
    return newJson;
  }

  render() {
    const {downloadData, btuVisible} = this.props;
    const condition = ["环比", "同比"];
    const {selectIndex} = this.state;
    const {downloadSize} = EchartFontSize();
    const conditionDom = condition.map((data, index) => {
      let select = "";
      if (selectIndex === index) {
        select = "select";
      }
      return (
        <li
          key={data}
          className={styles[select]}
          onClick={(e) => this.conditionHandle(index,e)}
        >
          {data}
        </li>
      );
    });
    const { pattern } = this.props; // 大图小图模式标记
    return (
      <div id="monthTotal" className={styles.monthTotal}>
        {pattern === "big" && btuVisible ? (<ul className={styles.btnUl}>{conditionDom}</ul>) : null}
        {downloadData ? <div className={styles.downloadName}><Button size={downloadSize} icon="download" onClick={(e)=>{this.download(e)}}>下载</Button></div> : null}
        <div className={styles.echart} ref={this.monthTotalRef} />
      </div>
    );
  }
}

export default MonthTotal;
