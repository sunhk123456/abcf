/*
*
* name：全部产品合计时间趋势图 echart折面积图
* time：2019/6/4
* author：xingxiaodong
*
*/
import React, { PureComponent } from 'react';
import echarts from "echarts";
import {Icon} from "antd";
import isEqual from "lodash/isEqual";
import FontSizeEchart from "./fontSizeEchart";
import DownloadFile from "@/utils/downloadFile";
import styles from './echart.less';

class ProductViewTimeEchart extends PureComponent {

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
    if(!isEqual(chartData,prevState.chartData)){
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
    if(!chartData.chart){return null}
    // console.log("全部产品合计时间趋势图");
    // console.log(chartData);
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight,titleFamily, xAxisSize, yAxisSize, tooltipSize}=fontsize;
    // const NewChartData={
    //   title:"全部产品合计时间趋势图",
    //   xName:"账期",
    //   unit:"单位：户",
    //   yName:"户",
    //   chartX:[201906, 201907, 201908, 201909, 201910, 201911],
    //   chart:["-", "-","-","-","1300","1500",],
    // };
    // const {title,xName,unit,yName,chartX,chart}=NewChartData;
    const {title,xName,yName,unit,chartX,chart}=chartData;
    const newChart=chart.map((item)=>(
      {
        "value":this.formatData(item),
        "normalData":item,
        "unit":unit,
      }
    ) );
    const color=["#FEA27E","#FE74A4"];
    const wScreen = window.screen.width;
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
      tooltip: {
        trigger: "axis",
        show: true,
        textStyle:{
           fontSize: tooltipSize,
        },
        axisPointer: {
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        formatter(par) {
          return `${par[0].marker} ${par[0].name} : ${par[0].data.normalData}${ par[0].data.normalData==="-" ? '': par[0].data.unit}`;
        },
      },
      grid: {
        left: wScreen > 1866 ? gridLeft+15 : gridLeft,
        top: 80,
        right: '10%',
        bottom: 90,
      },
      xAxis: {
        type: 'category',
        name:xName,
        nameTextStyle: {
          fontSize:xAxisSize, // x轴名称样式
          padding:[ 25, 0, 0, 0],
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
          rotate:45,
          fontSize:xAxisSize,
        },
      },
      yAxis: {
        type: 'value',
        name:`单位：${yName}`,
        nameTextStyle: {
          fontSize:yAxisSize, // y轴名称样式
          padding:[ 0, 25, 0, 0],
        },
        axisLine:{
          show:false, // y轴坐标轴线不展示
        },
        axisTick:{
          show:false, // y轴坐标刻度不展示
        },
        axisLabel:{
          show:true, // y轴坐标标签展示
          fontSize:yAxisSize,
        },
        splitLine:{
          show:false, // y轴分割线展示
        },

      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      },
        {
        start: 0,
        end: 100,
        left:75,
        // eslint-disable-next-line
        width:window.screen.width>1870?"75%":window.screen.width>1315?"70%":"65%",
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
      series: {
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
      }
    };
    myChart.resize();
    myChart.setOption(option);
    return null
  };

  /**
   * @date: 2019/12/12
   * @author 风信子
   * @Description: 方法描述 下载
   * @method download
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  download(){
    const {chartData,downloadData} = this.props;
    const {title,chart,chartX,xName,example,unit} = chartData;
    const {specialName,conditionValue} = downloadData;

    const tableValue = chartX.map((item,index)=>[item,chart[index]]);

    const table={
      title: [
        [xName,example]
      ],
      value: tableValue

    };
    const jsonDown = {
      fileName: `${specialName}--${title}`,
      condition:{
        name:title,
        value:[["专题名称",specialName,unit],...conditionValue],
      },
      table
    };
    DownloadFile(jsonDown,"timeEchartLine");
  }

  render() {
    const {downloadData} = this.props;
    return(
      <div className={styles.page}>
        <div id="timeEchartLine" ref={this.chartDom} className={styles.chartWrapper} />
        {downloadData&&
        <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
          <div><Icon type="download" /></div>
          <div>下载</div>
        </div>
        }
      </div>
    )
  }

}
export default ProductViewTimeEchart
