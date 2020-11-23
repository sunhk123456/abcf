/* eslint-disable */
/**
 * @Description: 分地域情况
 *
 * @author: liuxiuqian
 *
 * @date: 2019/1/22
 */
import React, { PureComponent } from 'react';
import echarts from "echarts";
import {connect} from 'dva';
import {Icon,Button} from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from "@/utils/downloadFile"
import iconFont from '../../icon/Icons/iconfont';
import Cookie from '@/utils/cookie';
import EchartFontSize from './echartFontSize';

import styles from './regionSituation.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

@connect(({proCityModels}) =>({
  ...proCityModels,
}))
class RegionSituation extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      sortdata:null,
      selectIndex:0,// 环比同比切换
      sortSelectData: [
        { id: "001", type: 1, name: "默认排序" },
        { id: "002", type: 1, name: "环比升序" },
        { id: "003", type: 0, name: "环比降序" },
        { id: "004", type: 1, name: "绝对值升序" },
        { id: "005", type: 0, name: "绝对值降序" }
      ],
      selectSortIndex: 0, // 选中的索引
      selectShow: false, // 是否显示下拉

    };
    this.regionSituationRef = React.createRef(); // 创建分地域情况图ref
  }

  componentDidMount() {
    this.handleData();
  }

  componentDidUpdate(prevProps){
    const {data, selectPro} = this.props;
    if(!isEqual(data, prevProps.data)){
      this.setState({selectSortIndex:0},()=>{this.handleData()})
    }
    // 处理选中省分高亮
    if(Object.keys(selectPro).length > 0 && !isEqual(selectPro, prevProps.selectPro)){
      const { example } = data.data[0].chart[0];
      const { unit } = data.data[0];
      const { isPercentage, isMinus } = data;
      const {sortdata} = this.state;
      if (isMinus === "0") {
        this.initEchart(sortdata, { example, unit, isPercentage });
      }else {
        this.initIsMinusEchart(sortdata, { example, unit, isPercentage });
      }
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

  /*
   * 处理数据
   *
   * sortType 排序方式
   * */
  handleData() {
    const { data } = this.props; // 请求到的数据
    const regionSituationData = data
    const chartData = []; // 数据组合到一起排序用
    // 环比数据 x轴数据  累计值数据 图例类型
    const { sequentialData, chartX, totalData, YoYData, example } = regionSituationData.data[0].chart[0];
    const { unit } = regionSituationData.data[0];
    const dataLen = chartX.length;
    const { isPercentage, isMinus } = regionSituationData;
    for (let i = 0; i < dataLen; i += 1) {
      const obj = {
        sequential: sequentialData[i],
        chartX: chartX[i],
        total: totalData[i],
        YoYData: YoYData ? YoYData[i] : null
      };
      chartData.push(obj);
    }

    const sortdata = this.sortData(chartData);
    // console.log(sortdata);

    this.setState({
      sortdata,
    });
    if (isMinus === "0") {
      this.initEchart(sortdata, { example, unit, isPercentage });
    } else {
      this.initIsMinusEchart(sortdata, { example, unit, isPercentage });
    }
  }

  /*
   * 排序数据
   * */
  sortData(chartData) {
    const { selectSortIndex, selectIndex } = this.state; // selectSortIndex排序方式0-4
    // a - b 小到大
    const sortNumber = (a, b) => {
      const Avalue = selectIndex === 0 ? a.sequential : a.YoYData;
      const Bvalue = selectIndex === 0 ? b.sequential : b.YoYData;
      if (selectSortIndex === 0) {
        return chartData;
      }
      if (selectSortIndex === 1) {
        // 环比升序
        return (Avalue === "-" ? Infinity : this.formatData(Avalue) ) - (Bvalue === "-" ? Infinity : this.formatData(Bvalue));
      }
      if (selectSortIndex === 2) {
        // 环比降序
        return (Bvalue === "-" ? -Infinity : this.formatData(Bvalue) ) - (Avalue === "-" ? -Infinity : this.formatData(Avalue));
      }
      if (selectSortIndex === 3) {
        // 绝对值升序
        return (
          Math.abs(this.formatData(a.total)) -
          Math.abs(this.formatData(b.total))
        );
      }
      if (selectSortIndex === 4) {
        // 绝对值降序
        return (
          Math.abs(this.formatData(b.total)) -
          Math.abs(this.formatData(a.total))
        );
      }
      return null;
    };
    return chartData.sort(sortNumber);
  }

  /*
   * 初始化分地域情况图
   *
   * */
  initEchart(data, other) {
    const {power} = Cookie.getCookie('loginStatus');
    const { pattern,searchPage, selectPro } = this.props; // 大图小图模式标记
    const {selectIndex} = this.state;
    const {proName } = selectPro;
    const xData = [];
    const lineData = [];
    const barData = [];
    const legendData = [];
    legendData.push(other.example[0]);
    legendData.push(other.example[selectIndex+1]);
    const showUnit = other.isPercentage === "1" ? "PP" : "%";
    let provinceName = [];
    data.map(item => {
      xData.push(item.chartX);
      lineData.push({
        value: this.formatData(selectIndex === 0 ? item.sequential : item.YoYData),
        normalData: selectIndex === 0 ? item.sequential : item.YoYData,
        unit: showUnit
      });
      barData.push({
        value: this.formatData(item.total),
        normalData: item.total,
        unit: other.unit
      });
      return null;
    });
    const fontsize = EchartFontSize();
    const {xAxisSize, legendSize, yAxisSize, tooltipSize} = fontsize;
    let {titleSize} = fontsize;
    let tooltipShow = true; // 是否显示tooltip
    // let titleSize = 18;
    // let xAxisFontSize = 12;
    // let legnedSize = 12;
   // const { width } = window.screen;
    let titleTop = 10;
    if (pattern === "small") {
      tooltipShow = false;
      titleSize = 12;
      titleTop = 0;
    }
    if(searchPage==="1"){
      provinceName=xData;
    }else if(proName === "北十省"){
      provinceName=["北京","天津","辽宁","内蒙古","河南","吉林","山西","河北","黑龙江","山东"]
    }else if(proName === "南二十一省"){
      provinceName=["上海","江苏","浙江","安徽","福建","江西","湖北","湖南","广东","广西","海南","重庆","四川","贵州","云南","西藏","陕西","甘肃","青海","宁夏","新疆"]
    }else if(proName === "全国" || power!=="all"){
      provinceName=xData;
    }else{
      provinceName=[proName];
    }

    const option = {
      title: {
        text: "分地域情况",
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
        textStyle:{
          fontSize: tooltipSize
        },
        show: tooltipShow,
        position(point, params, dom, rect, size){
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
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${par.data.normalData==="-"?'':par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
        axisPointer: {
          // type: "shadow",
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        backgroundColor: "rgba(108,109,111,0.7)",
        showDelay: 0 // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
      },
      grid: [
        { x: "10%", y: "15%", height: "30%" },
        { x: "10%", y: "50%", height: "30%" }
        // { left: "10%", top: "15%", height: "25%", right: 0 },
        // { left: "10%", top: "45%", height: "30%", right: 0 }
      ],
      legend: {
        show: tooltipShow,
        data: legendData,
        left: "center",
        bottom: "0%",
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
          data: xData,
          axisLabel: {
            // 坐标轴刻度文字样式设置
            textStyle: {
              color: "#999999",
              fontSize:xAxisSize
            }
          },
        },
        {
          type: "category",
          show: tooltipShow,
          gridIndex: 1, // 对应前面grid的索引位置（第二个）
          boundaryGap: [0, 0], // 坐标轴两边留白策略
          axisLine: {
            show: false,
            lineStyle: {
              color: "#99a5bd",
              width: 1
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            interval: 0,
            margin: 2,
            fontFamily: "Microsoft YaHei",
            color: "#999999",
            textStyle: {
              color: "#999999",
              fontSize:xAxisSize
            },
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
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          data: xData
        }
      ],
      yAxis: [
        {
          type: "value",
          show: tooltipShow,
          gridIndex: 0, // 对应前面grid的索引位置（第一个）
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#90979c"
            }
          },
          axisLabel: {
            show: true,
            interval: 2,
            textStyle: {
              color: "#B2B3B4",
              fontSize: yAxisSize
            }
          }
        },
        {
          type: "value",
          show: tooltipShow,
          gridIndex: 1, // 对应前面grid的索引位置（第二个）
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#90979c"
            }
          },
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              color: "#B2B3B4",
              fontSize: yAxisSize
            }
          }
        }
      ],
      series: [
        {
          name: legendData[1],
          type: "line",
          xAxisIndex: 0, // 对应前面x的索引位置（第一个）
          yAxisIndex: 0, // 对应前面y的索引位置（第一个）
          smooth: false, // 是否平滑曲线显示。
          symbol: "emptyCircle",
          itemStyle: {
            color: "#989898"
          },
          lineStyle:{
            color: selectIndex === 0?"rgb(205,205,205)":"#989898"
          },
          label: {
            show: false,
            formatter: "{c}%",
            position: "top"
          },
          data: lineData
        },
        {
          name: legendData[0],
          type: "bar",
          smooth: false, // 是否平滑曲线显示。
          symbol: "emptyCircle",
          barMaxWidth: 14,
          xAxisIndex: 1, // 对应前面x的索引位置（第二个）
          yAxisIndex: 1, // 对应前面y的索引位置（第一个）
          itemStyle: {
            // "#5AB7E0"
            color(params){
              let colorTsyle = "#D7D7D7"
              provinceName.forEach((item) =>{
                if(item === params.name){
                  colorTsyle =  params.data.value < 0 ?  "#A6D2A4":"#5AB7E0"
                }
              })
              return colorTsyle;
            } ,
             barBorderRadius: 30
          },
          data: barData
        }
      ]
    };
    const myChart = echarts.init(this.regionSituationRef.current); // 初始化当日趋势图所需dom
    // 使用刚指定的配置项和数据显示图表
    myChart.clear();
    myChart.setOption(option);
  }

  /*
   *  选中排序方式initEchart
   *  index 索引
   * */
  HandleSelect(index) {
    this.setState(
      {
        selectSortIndex: index,
        selectShow: false
      },
      () => {
        this.handleData();
      }
    );
  }

  initIsMinusEchart(data, other) {
    const { power} = Cookie.getCookie('loginStatus');
    const { pattern, searchPage, selectPro } = this.props; // 大图小图模式标记
    const {selectIndex} = this.state;
    const {proName } = selectPro
    const xData = [];
    const lineData = [];
    const barData = [];
    const showUnit = other.isPercentage === "1" ? "PP" : "%";
    const legendData = [];
    let provinceName = [];
    legendData.push(other.example[0]);
    legendData.push(other.example[selectIndex+1]);
    data.map(item => {
      xData.push(item.chartX);
      lineData.push({
        value: this.formatData(selectIndex === 0 ? item.sequential : item.YoYData),
        normalData: selectIndex === 0 ? item.sequential : item.YoYData,
        unit: showUnit
      });
      barData.push({
        value: this.formatData(item.total),
        normalData: item.total,
        unit: other.unit
      });
      return null;
    });

    let tooltipShow = true; // 是否显示tooltip
    const fontsize = EchartFontSize();
    const {xAxisSize, legendSize, yAxisSize, tooltipSize} = fontsize;
    let {titleSize} = fontsize;
    // let titleSize = 18;
    // const { width } = window.screen;
    // if(width > 1870){
    //   titleSize = 32;
      // xAxisFontSize = 16;
      // legnedSize = 16;
    // }
    let titleTop = 10;
    if (pattern === "small") {
      tooltipShow = false;
      titleSize = 12;
      titleTop = 0;
    }
    if(searchPage==="1"){
      provinceName=xData;
    }else if(proName === "北十省"){
      provinceName=["北京","天津","辽宁","内蒙古","河南","吉林","山西","河北","黑龙江","山东"]
    }else if(proName === "南二十一省"){
      provinceName=["上海","江苏","浙江","安徽","福建","江西","湖北","湖南","广东","广西","海南","重庆","四川","贵州","云南","西藏","陕西","甘肃","青海","宁夏","新疆"]
    }else if(proName === "全国" || power!=="all"){
      provinceName=xData;
    }else{
      provinceName=[proName];
    }

    const option = {
      title: {
        text: "分地域情况",
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
        position(point, params, dom, rect, size){
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
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${par.data.normalData==="-"?'':par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
        axisPointer: {
          // type: "shadow",
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        backgroundColor: "rgba(108,109,111,0.7)",
        showDelay: 0 // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
      },
      grid: [
        { x: "10%", y: "15%", height: "30%" }, // xingxiaodong 5.5 防止y轴重叠。
        { x: "10%", y: "50%", height: "30%" }
        // { x: "10%", y: "20%", height: "30%" },
        // { x: "10%", y: "50%", height: "30%" }
      ],
      legend: {
        show: tooltipShow,
        data: legendData,
        left: "center",
        bottom: "0%",
        selectedMode: false,
        textStyle:{
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
          data: xData,
        },
        {
          type: "category",
          show: tooltipShow,
          gridIndex: 1, // 对应前面grid的索引位置（第二个）
          boundaryGap: [0, 0], // 坐标轴两边留白策略
          axisLine: {
            show: false,
            lineStyle: {
              color: "#99a5bd",
              width: 1
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            interval: 0,
            margin: 2,
            fontFamily: "Microsoft YaHei",
            color: "#999",
            textStyle: {
              fontSize:xAxisSize
            },
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
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          data: xData
        }
      ],
      yAxis: [
        {
          type: "value",
          show: tooltipShow,
          gridIndex: 0, // 对应前面grid的索引位置（第一个）
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#90979c"
            }
          },
          axisLabel: {
            show: true,
            interval: 2,
            textStyle: {
              color: "#B2B3B4",
              fontSize: yAxisSize
            }
          }
        },
        {
          type: "value",
          show: tooltipShow,
          gridIndex: 1, // 对应前面grid的索引位置（第二个）
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#90979c"
            }
          },
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              color: "#B2B3B4",
              fontSize: yAxisSize
            }
          }
        }
      ],
      series: [
        {
          name: legendData[1],
          type: "line",
          xAxisIndex: 0, // 对应前面x的索引位置（第一个）
          yAxisIndex: 0, // 对应前面y的索引位置（第一个）
          smooth: false, // 是否平滑曲线显示。
          symbol: "emptyCircle",
          itemStyle: {
            color: "#989898"
          },
          lineStyle:{
            color: selectIndex === 0?"rgb(205,205,205)":"#989898"
          },
          label: {
            show: false,
            formatter: "{c}%",
            position: "top"
          },
          data: lineData
        },
        {
          name: legendData[0],
          type: "bar",
          smooth: false, // 是否平滑曲线显示。
          symbol: "emptyCircle",
          xAxisIndex: 1, // 对应前面x的索引位置（第二个）
          yAxisIndex: 1, // 对应前面y的索引位置（第一个）
          itemStyle: {
            // "#5AB7E0"
            color(params){
              let colorTsyle = "#D7D7D7";
              provinceName.forEach((item) =>{
                if(item === params.name){
                  colorTsyle  = params.data.value > 0 ?  "#5AB7E0" : "#A6D2A4"
                }
              });
              return colorTsyle;
            } ,
             barBorderRadius: 30
          },

          markLine: {
            symbol: "none",
            data: [
              {
                type: "average",
                name: "平均值",
                label: {
                  show: true,
                  formatter() {
                    // 判断用户类型
                    return power === "all" ? "全国" : "全省";
                  }
                },
                itemStyle: {
                  fontSize: 8,
                  color: "#999"
                }
              },
              // {
              //   name: "水平线",
              //   value: 0,
              //   xAxis: -1,
              //   yAxis: 20,
              //   lineStyle: {
              //     type: "solid",
              //     color: "#999",
              //     width: 1
              //   },
              //   label: {
              //     show: false
              //   },
              //   emphasis: {
              //     label: {
              //       show: false
              //     }
              //   }
              // }
            ]
          },
          data: barData
        }
      ]
    };
    const myChart = echarts.init(this.regionSituationRef.current); // 初始化当日趋势图所需dom
    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
  }

  /*
   * 点击下拉显示
   *
   * */
  HandleSelectShow(e) {
    this.setState({
      selectShow: true
    });
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  handleListHide(e) {
    this.setState({
      selectShow: false
    });
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  download(e){
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"regionSituation");
  }

  jsonHandle(){
    const {downloadData, data} = this.props;
    const { example } = data.data[0].chart[0]
    const {sortdata, selectIndex } = this.state;
    const {title, selectUnit, selectCity, selectPro, date, selectNameData} = downloadData;
    const conditionVlue = []
    selectNameData.forEach((item)=>{
      const valurNameArr = [];
      item.value.forEach((itemValue)=>{
        valurNameArr.push(itemValue.sname)
      })
      conditionVlue.push([item.screenTypeName, ...valurNameArr]);
    })

    const tableTitleDown = example.map((item, index)=>{
      if(index < 2){
        if(index < 1){
          return item;
        }
        return example[selectIndex+1]
      }
      return "";
    })

    const tableValue = sortdata.map((item)=>{
      const tableValueItem = [];
      tableValueItem.push(item.chartX);
      tableValueItem.push(item.total);
      if(selectIndex === 0){
        tableValueItem.push(item.sequential);
      }else {
        tableValueItem.push(item.YoYData);
      }
      return tableValueItem;
    })

    const condition = {
      name: "分地域情况",
      value: [
        ["专题名称:", title, `(${selectUnit.unitName})`],
        ["筛选条件:"],
        ["省分:", selectPro.proName],
        ["地市:", selectCity.cityName],
        ["日期:", date],
        // ["排序方式", ],
        ...conditionVlue,
      ],
    }
    const table={
      title:[
        ["省分", ...tableTitleDown]
      ],
      value: tableValue
    }

    const newJson = {
      fileName: `${title}-分地域情况`,
      condition,
      table
    }
    return newJson;
  }

  conditionHandle (index,e) {
    this.setState({
      selectIndex: index,
      selectSortIndex:0
    },()=>{
      const {data} = this.props;
      const { example } = data.data[0].chart[0];
      const { unit } = data.data[0];
      const { isPercentage } = data;
      // const {sortdata} = this.state;
      this.handleData();
      // this.initEchart(data, { example, unit, isPercentage });
    });
    if (!e) window.event.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  render() {
    const {downloadData, pattern, data, btuVisible} = this.props;
    const {  example } = data.data[0].chart[0];
    const condition = example.slice(-2);
    const {downloadSize} = EchartFontSize();
    // 是否显示下拉  选中索引 排序数据
    const { selectShow, selectSortIndex, sortSelectData, selectIndex  } = this.state;
    const sortLi = sortSelectData.map((item, index) =>{
      const liItem = (
        <li
          key={item.id}
          onClick={e => {
            this.HandleSelect(index);
            e.stopPropagation(); // 阻止事件向上传播
          }}
        >
          {item.type === 0 ? <IconFont className={styles.sortIcon} type="icon-paixu-jiang" /> : <IconFont className={styles.sortIcon} type="icon-paixu-sheng" />}
          {index > 0 && index < 3 ? `${condition[selectIndex].slice(-2)}${item.name.slice(-2)}` : item.name}
        </li>
      )
      return liItem;
    });

    const conditionDom = condition.map((item, index) => {
      let select = "";
      if (selectIndex === index) {
        select = "select";
      }
      return (
        <li
          key={item}
          className={styles[select]}
          onClick={(e) => this.conditionHandle(index,e)}
        >
          {item.slice(-2)}
        </li>
      );
    });

    return (
      <div id="regionSituation" className={styles.regionSituationCss}>
        {pattern === "big" && btuVisible  ? (<ul className={styles.btnUl}>{conditionDom}</ul>) : null}
        {pattern === "big" && btuVisible ?
          (
            <div className={styles.selectContent}>
              <div
                className={styles.selectContent2}
                onClick={(e) => this.HandleSelectShow(e)}
              >
                <div className={styles.selectTitle}>
                  {selectSortIndex > 0 && selectSortIndex < 3 ? `${condition[selectIndex].slice(-2)}${sortSelectData[selectSortIndex].name.slice(-2)}` : sortSelectData[selectSortIndex].name}
                  {/* {sortSelectData[selectSortIndex].name} */}
                  <i className={styles.triangle} />
                </div>
                {selectShow ? (
                  <ul
                    className={styles.selectContentUl}
                    onMouseLeave={(e) => this.handleListHide(e)}
                  >
                    {sortLi}
                  </ul>) : null}
              </div>
            </div>
          )
          :
          null
        }
        <div ref={this.regionSituationRef} className={styles.echart} />
        {downloadData ? <div className={styles.downloadName}><Button size={downloadSize} icon="download" onClick={(e)=>{this.download(e)}}>下载</Button></div> : null}
      </div>
    );
  }
}

export default RegionSituation;
