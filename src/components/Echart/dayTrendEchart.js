/* eslint-disable react/no-did-update-set-state */
/**
 * @Description:当日趋势图
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/14
 */
import React, { PureComponent } from 'react';
import echarts from "echarts";
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import { Button } from 'antd';
import DownloadFile from "@/utils/downloadFile";
import styles from './dayTrendEchart.less';
import warningIcon from '../IndexDetails/u91.png';
import EchartFontSize from './echartFontSize';

@connect(({ dayTrendEchartModels, loading }) => ({
  dayTrendEchartModels,
  loading: loading.models.dayTrendEchartModels,
}))
class DayTrendEchart extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      selectIndex: 0, // 条件选中的索引
      selectTimeData: {name: "七天", id: "7"},
      echartData:{},
    };
    // 创建当日趋势图ref
    this.dayTrendRef = React.createRef();
  }

  componentDidMount() {
    this.initEchart(this.props);
  }

  componentDidUpdate(prevProps){
    const {data} = this.props;
    if( !isEqual(prevProps.data, data)){
      this.setState({selectIndex:0,selectTimeData: {name: "七天", id: "7"}},()=>{this.initEchart(this.props);})
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
  initEchart(dataEchart) {
    const { pattern, data } = dataEchart; // 大图小图模式标记
    const dayTrendData = data;
    const dataSetnum = dayTrendData.data[0].chart;
    const dataWarning = dayTrendData.data[0].warning; // 预警信息
    const numberArr = this.handleChartData(dataSetnum);
    const dataKey = dayTrendData.chartX;
    let {titleSize, xAxisSize, yAxisSize, tooltipSize} = EchartFontSize();

    /**
     * 判断是否有预警信息 有则加上一个*号
     */
    const dataX = dataKey.map((datakey,index)=>{
      let datadata = datakey;
      if(dataWarning){
        for(let i=0;i<dataWarning.length;i+=1){
          const warningindex = parseInt(dataWarning[i].warningIndex,10)
          if(index === warningindex){
            datadata = `${datakey } *`;
          }
        }
      }
      return datadata;
    });

    let tooltipShow = true; // 是否显示tooltip
    let titleTop=10;
    // let titleSize = 18;
    // let xAxisFontSize = 12;
    // const { width } = window.screen;
    // if(width > 1870){
    //   titleSize = 32;
    //   xAxisFontSize = 16;
    // }
    let gridTop = 80;
    let gridBottom = 50;
    let gridLeftAndRight = "10%";
    if (pattern === "small") {
      tooltipShow = false;
      titleSize = 12;
      gridTop = 25;
      gridBottom = 10;
      gridLeftAndRight = "5%";
      titleTop = 0;
    }
    const option = {
      title: {
        text: "当日趋势",
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
        show: tooltipShow,
        trigger: "axis",
        textStyle:{
          fontSize: tooltipSize
        },
        position(point){
          return [point[0] - 70, point[1] - 40];
        },
        axisPointer: {
          lineStyle: {
            // rgba(86,84,86,0.2)
            color: "rgba(86,84,86,0.2)"
          }
        },
        backgroundColor: "rgba(108,109,111,0.7)",
        formatter(params) {
          const unit = params[0].value === "-" ? "" : dayTrendData.data[0].unit;
          /**
           * 预警tips
           */
          let tip;
          const tips = [];
          if(dataWarning !== undefined && dataWarning.length !== 0){
            dataSetnum.forEach((dataa,index) =>{
              for(let i=0;i<dataWarning.length;i+=1){
                if(index === parseInt(dataWarning[i].warningIndex,10)){
                  if(dataWarning[i].desc !== ''){
                    tip =`${params[0].name }：${dataSetnum[params[0].dataIndex]
                      }${ unit} <div style='background-color: white;width: 100%;height: 1px;text-align: center'></div>` +
                      `<div style='color: #FFCC00'>` +
                      `<img style='width: 18px;height: 18px' src=${warningIcon}>` +
                      `预警等级：${dataWarning[i].warningLevel
                      }</div>` +
                      `<div style='width: 100%;white-space:normal;word-wrap : break-word'>` +
                      `详情：${  dataWarning[i].desc 
                      }</div>`;
                  }else {
                    tip =`${params[0].name  }：${dataSetnum[params[0].dataIndex] 
                      }${ unit}<div style='background-color: white;width: 100%;height: 1px;text-align: center'></div>` +
                      `<div style='color: #FFCC00'>` +
                      `<img style='width: 18px;height: 18px' src=${warningIcon}>` +
                      `预警等级：${dataWarning[i].warningLevel
                      }</div>`
                  }
                  break;
                }else{
                  tip =`${params[0].name  }:${  dataSetnum[params[0].dataIndex]} ${ unit}`;
                }
              }
              tips.push(tip);
            });
            return tips[params[0].dataIndex];
          }
            return `${params[0].name} <br/> ${params[0].marker}  ${dataSetnum[params[0].dataIndex]} ${ unit}`;

          // return `${params[0].name} <br/> ${params[0].marker}  ${dataSetnum[params[0].dataIndex]} ${ unit}`;
        }
      },
      calculable: false,
      grid: {
        top: gridTop,
        bottom: gridBottom,
        left: gridLeftAndRight,
        right: gridLeftAndRight
      },
      xAxis: [
        {
          show: tooltipShow,
          boundaryGap: false,
          data: dataX,
          splitLine: {
            // 网格线x周样式设置
            show: false
          },
          axisLine: {
            // x轴轴线样式设置
            lineStyle: {
              color: "#999999"
            }
          },
          axisLabel: {
            // 坐标轴刻度文字样式设置
            // color: "#999999",
            // 指标预警x轴坐标加红
            color:(value)=>value.indexOf('*') !==-1 ? "#c91717" : "#999999",
            fontSize:xAxisSize
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: "#999999"
            }
          }
        }
      ],
      yAxis: [
        {
          show: tooltipShow,
          type: "value",
          splitLine: {
            // 网格线x周样式设置
            show: false
          },
          axisLine: {
            // y轴轴线样式设置
            lineStyle: {
              color: "#C0B298"
            }
          },
          axisLabel: {
            // formatter: "{ value }", //y轴数据格式
            color: "#999999",
            fontSize: yAxisSize,

          },
          axisTick: {
            show: false,
            lineStyle: {
              color: "#999999"
            }
          }
        }
      ],
      animation: false, // 是否可以有动态效果
      series: [
        {
          symbol: "circle", // 折线上的圆点去掉
          symbolSize: 3,
          type: "line",
          smooth: true,
          itemStyle: {
            color: "#FD9F82",
            lineStyle: {
              // #D7D8DE
              color: "#D7D8DE"
            }
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgb(255, 158, 68)"
              },
              {
                offset: 1,
                color: "rgb(255, 70, 131)"
              }
            ])
          },
          data: numberArr
        }
      ]
    };
    const myChart = echarts.init(this.dayTrendRef.current); // 初始化当日趋势图所需dom
    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
  }

  /*
   * 处理条件选中事件
   * index  选中索引
   *
   * id id值 传参用
   * */
  conditionHandle(index, timeData,e) {
    const { dispatch,lineParams } = this.props;
    const params = {
      ...lineParams,
      time: timeData.id,
    }
    dispatch({
      type: 'dayTrendEchartModels/getDayTrendEchartData',
      payload: params
    }).then((res)=>{
      this.initEchart({data:res});
      this.setState({selectIndex: index, selectTimeData:timeData, echartData: res})
    });
    // e.preventDefault();
    // e.stopPropagation();
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  download(e){
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"dayTrendEchart");
  }

  jsonHandle(){
    const {downloadData, data} = this.props;
    const {title, selectUnit, selectCity, selectPro, date, selectNameData} = downloadData;
    const {echartData, selectTimeData} = this.state;
    const conditionVlue = []
    selectNameData.forEach((item)=>{
      const valurNameArr = [];
      item.value.forEach((itemValue)=>{
        valurNameArr.push(itemValue.sname)
      })
      conditionVlue.push([item.screenTypeName, ...valurNameArr]);
    })
    const tableData = selectTimeData.id === "7" ? data : echartData;
    const tableValue = [];
    const chartY = tableData.data[0].chart;
    tableData.chartX.forEach((item,index)=>{
      tableValue.push([item,chartY[index]])
    })
    const condition = {
      name: "当日趋势图",
      value: [
        ["专题名称:", title, `(${selectUnit.unitName})`],
        ["筛选条件:"],
        ["省分:", selectPro.proName],
        ["地市:", selectCity.cityName],
        ["日期:", date],
        ...conditionVlue,
        ["时间:", selectTimeData.name]
      ],
    }
    const table = {
      title: [
        ["时间", "业务值"]
      ],
      value: [
        ...tableValue
      ]
    }
    const newJson = {
      fileName: `${title}-当日趋势图`,
      condition,
      table
    }
    return newJson;
  }

  render() {
    const { dayTrendEchartModels, pattern ,downloadData} = this.props;
    const { selectIndex } = this.state;
    const { condition }= dayTrendEchartModels;
    const {downloadSize} = EchartFontSize();
    const conditionDom = condition.map((data, index) => {
      let select = "";
      if (selectIndex === index) {
        select = "select";
      }
      return (
        <li
          key={data.id}
          className={styles[select]}
          onClick={(e) => {
            this.conditionHandle(index, data,e);
          }}
        >
          {data.name}
        </li>
      );
    });
    return (
      <div id="dayTrendEchart" className={styles.dayTrendEchart}>
        {pattern === "big" ? (<ul className={styles.btnUl}>{conditionDom}</ul>) : null}
        {downloadData ? <div className={styles.downloadName}><Button size={downloadSize} icon="download" onClick={(e)=>{this.download(e)}}>下载</Button></div> : null}
        <div className={styles.echart} ref={this.dayTrendRef} />
      </div>
    );
  }
}

export default DayTrendEchart;
