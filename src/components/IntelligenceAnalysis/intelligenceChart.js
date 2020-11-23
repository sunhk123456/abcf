/**
 *   xingxiaodong 20190227
 *   移动业务计费收入分析专题echarts图组件
 * */
import React, { PureComponent, Fragment } from 'react';
import isEqual from 'lodash/isEqual';
import { Icon } from 'antd';
import echarts from "echarts";
import FontSizeEchart from '../ProductView/fontSizeEchart';
import DownloadFile from "@/utils/downloadFile"
import styles from './intelligenceAnalysis.less';




class IntelligenceChart extends PureComponent{

  static defaultProps={
    'chartTypeItem': {
      'type': 'bar',
      'typeId': 'typeIdd',
      'name': '渠道',
      'ord': '4',
      'span': '3',
    },
    "echartId":"HomeBasisBarEchart",
    "chartData":{
      "percentName":"累计环比",
      "barName":"累计值",
      "title":"计费收入业务结构",
      "chartType": "peopleBardata",
      "unit":"万元",
      "chart": [
        {
          "name":"线下实体",
          "id":"01",
          "value": "10,855.09"
        },
        {
          "name": "线上电商",
          "id":"02",
          "value": "4,277.53"
        },
        {
          "name": "集客渠道",
          "id":"03",
          "value": "1,486.41"
        },
        {
          "name": "其他",
          "id":"04",
          "value": "72.89"
        }
      ],
      "subtitle":"(万元/累计值)",
      "desc":"地域方面:主要由于山东河北出账收入下降影响"
    },
    "selects":0,
    // "downloadData":{}
  };

  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={
       colors:[
         '#8DC9EB',
         '#A5D3BC',
         '#CFE7D1',
         '#AFD3F3',
         '#9DBAE6',
         '#F08EAB',
         '#F0AC93',
         '#E07E7E',
         '#F4CFD0',
         '#EEB8B7',
         '#D284AB',
         '#85abd2',
         '#F27D94',
         '#B361E5',
         '#EC9296',
         '#578CC1',
         '#D28484',
         '#AB84D2',
         '#E35F65',

      ]// 柱子颜色
    }
  }


  componentDidMount() {
    const {chartData} = this.props;
    this.createChart(chartData)
  }

  componentDidUpdate(prevProps){
    const {chartData} = this.props;
    if(!isEqual(prevProps.chartData, chartData)){
      this.createChart(chartData)
    }
  }

  // 处理数据格式
  formatData = (data) => data.indexOf(',') === -1
    ? parseFloat(data)
    : parseFloat(data.replace(/,/g, ''));



  // 渲染用户群分布echart图
  createChart=(chartData)=>{
    const {colors}=this.state;
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    if(!chartData){return null}
    const sw= window.screen.width; // 获取屏幕宽度
    // let titleSize = 18;
    let barwidth=30;
    let fontSize=14;
    if((sw>=1316)&&(sw<1879)) {
      // 标题字体大小
      // titleSize = 18
      barwidth = 25
      fontSize=16;
    }
    else if((sw>=1200)&&(sw<1315)) {
      // 标题字体大小
      // titleSize = 16
      barwidth=15
      // divheight=285;

      fontSize=14;
    }
    else if((sw>=750)&&(sw<1200)) {
      // 标题字体大小
      // titleSize = 14
      barwidth=11

      fontSize=12;
    }
    else if((sw>=1870)&&(sw<2159)) {
      // 标题字体大小
      // titleSize = 24
      barwidth=20

      fontSize=18;
    }
    const {titleSize}=FontSizeEchart();
    const charts=[];
    chartData.chart.map( (el)=> {
      //  累计值展示柱状图
      // if (!el.value || el.value === "-") {
      //   charts.push({ name:el.name,value: "-", percent: (el.percent) ,valueData:el.value})
      // }else {
      //   charts.push({ name:el.name,value: this.formatData(el.value), percent: (el.percent), valueData: el.value });
      // }
      //  累计环比展示柱状图
      if (!el.percent || el.percent === "-") {
        charts.push({ name:el.name,value: "-", total: (el.value) ,valueData:el.value})
      }else {
        charts.push({ name:el.name,value: el.percent.substring(0, el.percent.length-1), total: this.formatData(el.value), valueData: el.value });
      }
      return null;
    });
    const res=chartData.chart.map(item=>({name:item.name,icon:'rect'}));
    const {selects}=this.props;
    const  selectOne=selects;
    const seriesData={
    //  name:item.name,
      type: 'bar',
      barWidth:barwidth,
      barGap:'100%',
      // barCategoryGap:'10%',
      itemStyle: {
        normal: {
          color: (params)=>{
            const colorList = colors;
            if( selectOne && chartData.chart.length===1){
              return colorList[selectOne]
            }
            return colorList[params.dataIndex]


          },
        },
      },
      data: charts,
    };

    const newSeriesData=charts.map((item,index)=>
      ({
        name:item.name,
        type: 'bar',
        barGap:'-100%',
        barWidth:barwidth,
        // barGap:'100%',
        // // barCategoryGap:'10%',
        itemStyle: {
          normal: {
            color: ()=>{
              const colorList = colors;
              if( selectOne && chartData.chart.length===1){
                return colorList[selectOne]
              }
                return colorList[index]


            },
          },
        },
        data: [0,0],
      })
    );
    newSeriesData.splice(0,0,seriesData);
    // newSeriesData.splice(0,0,{
    //   type: 'bar',
    //   barWidth:barwidth,
    //   barMinHeight:200,
    //   itemStyle: {
    //     normal: {color: 'rgba(36,41,44,0)'} // rgba(36,41,44,0)
    //   },
    //   barGap:'-100%',
    //   data:charts,
    //   animation: false
    // },);

    const option = {
      backgroundColor:'#F7F8FC',
      title : {
        text: chartData.title,
        subtext:chartData.subtitle,
        x:'center',
        textStyle: {
          fontSize: titleSize,
          color: '#333333', // 主标题文字颜色
          fontWeight:'normal',
          fontFamily:'Microsoft YaHei',
        },
      },
      tooltip: {
        // trigger: 'item',
        trigger:'axis',
        show:true,
        showContent: true,
        textStyle:{
          fontSize,
        },
        axisPointer: {
          type: 'line',
         //  shadowOffsetY: 100,
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        // formatter(params) {
        //   let  showTip = "";
        //   showTip += `${params.marker} ${chartData.barName} : ${params.data.valueData}  ${ params.data.value==="-" ? '': chartData.unit}  <br/>`;
        //   showTip += `${params.marker} ${chartData.percentName} : ${params.data.value}% <br/>`;
        //   return `${params.name} <br/> ${showTip}`;
        // },
        formatter(params) {
          let  showTip = "";
          showTip += `${params[0].marker} ${chartData.barName} : ${params[0].data.valueData}  ${ params[0].data.value==="-" ? '': chartData.unit}  <br/>`;
          showTip += `${params[0].marker} ${chartData.percentName} : ${params[0].data.value}% <br/>`;
          return `${params[0].name} <br/> ${showTip}`;
        },
        // backgroundColor:'#DCD4C5',
      },
      grid:{
        left: '10%',
        top: 90,
        right: '10%',
        bottom: 60,
        x: '13%',
        y: '12%',
        x2:'6%',
        borderWidth: 0,
        y2:'0%'
      },
      legend : {
        show:true,
        orient : 'horizontal',
        selectedMode:false,// 图例不可点击
        left : 'center',
        top : 'bottom',
        padding:[1,0,0,0],
        itemGap: 2,
        textStyle: {
          fontSize: 12,
        },
        data:res
      },

      xAxis: [
        {
          type: 'category',
          axisLabel:{
            show:false,
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
              color: '#CCCCCC'
            }
          },
          data: res
        }
      ],
      yAxis: [
        {
          type: 'value',
          show: false
        }
      ],
      series :newSeriesData
    };

    const {echartId,chartTypeItem} = this.props;
    myChart.setOption(option);
   // console.log(newSeriesData);
    // myChart.off('click');
    // myChart.on('click',  (param)=>{
    //   const {callBackChart}=this.props
    //   callBackChart(param.name,chartData.chart[param.dataIndex].id,param.dataIndex,echartId,chartTypeItem)
    // });
    //  获取点击位置的坐标
    myChart.getZr().off('click');
    myChart.getZr().on('click', params => {
      const pointInPixel = [params.offsetX, params.offsetY];
      //  判断坐标是否在 所限定的区域内（限定index为0和1的grid区域）
      if (myChart.containPixel({gridIndex: [0,1] }, pointInPixel)) {
        //  获取点击位置对应的  index，使用index获取数据 进行后续操作
        const xIndex = myChart.convertFromPixel({seriesIndex:0},[params.offsetX, params.offsetY])[0];
          const {callBackChart}=this.props;
          callBackChart(chartData.chart[xIndex].name,chartData.chart[xIndex].id,xIndex,echartId,chartTypeItem)
      }
    });
    return null
  };

  download = (e) => {
    const {echartId} = this.props;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),echartId);
  };

  jsonHandle=()=>{
    const {chartData,downloadData}=this.props;
    const{specialName, conditionValue}=downloadData;
    const {chart,title,unit}=chartData;
    const xxdValue=[];
    if(chart.length>0){
      chart.map((item)=> xxdValue.push([item.name,item.value,item.percent])
      )
    }
    const table = {
      title: [
        ["产品结构", "业务值", "百分比"]
      ],
      value:xxdValue,
    };
    return {
      fileName: `${specialName}--${title}`,
      condition:{
        name:title,
        value:[["专题名称",specialName,unit],...conditionValue],
      },
      table
    };
  };

  render() {
    const {downloadData,echartId}=this.props;
    return(
      <Fragment>
        <div className={styles.page} id={echartId}>
          <div ref={this.chartDom} className={styles.chartWrapper} />
          { downloadData &&
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
          }
        </div>
      </Fragment>
    )
  }
}
export default IntelligenceChart
