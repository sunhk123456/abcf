/**
 *   xingxiaodong 20190227
 *   移动业务计费收入分析专题echarts图组件
 * */
import React, { PureComponent, Fragment } from 'react';
import echarts from "echarts";
import styles from './analysisChart.less';


class AnalysisChart extends PureComponent{
  constructor(props){
    super(props)
    this.chartDom=React.createRef();
    this.state={
      chartData:null,
    }
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const {chartData}=nextProps
    if (chartData && chartData !== prevState.chartData) {
      return {
        chartData,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const {chartData}=this.state
    if(chartData && chartData !== prevState.chartData){
      this.createChart(chartData)
    }
  }

  // 渲染用户群分布echart图
  createChart=(chartData)=>{
    const colors=["rgb(223,230,238)",'rgb(221,101,172)','rgb(248,114,114)','rgb(85,212,227)','rgb(92,171,223)','#E0E7EF'];// 柱子颜色
    const sw= window.screen.width; // 获取屏幕宽度
    let titleSize = 18;
    let barwidth=30;
    let fontSizeLabel=12;
    let fontSize=14;
    if((sw>=1316)&&(sw<1879)) {
      // 标题字体大小
      titleSize = 18
      barwidth = 30
      // divheight=300;
      fontSizeLabel=12
      fontSize=16;
    }
    else if((sw>=1200)&&(sw<1315)) {
      // 标题字体大小
      titleSize = 16
      barwidth=20
      // divheight=285;
      fontSizeLabel=10
      fontSize=14;
    }
    else if((sw>=750)&&(sw<1200)) {
      // 标题字体大小
      titleSize = 14
      barwidth=16
      // divheight=280;
      fontSizeLabel=8
      fontSize=12;
    }
    else if((sw>=1870)&&(sw<2159)) {
      // 标题字体大小
      titleSize = 24
      barwidth=25
      // divheight=400;
      fontSizeLabel=12
      fontSize=18;
    }
    const chartNum=chartData.chart.map((el)=>({name:el.name,percent:el.percent,value:parseFloat(el.value.replace(/,/g,''))}));
    const LabelTop = {
      normal:{
        show: true,
        position:'top',
        textStyle:{
          color:'#857D7D',
          fontSize:fontSizeLabel,
        },
      },
      emphasis: {
        show: true,
        position:'top',
        textStyle:{
          color:'#857D7D',
          fontSize:fontSizeLabel,
        },
      }
    };
    const LabelBottom = {
      normal:{
        show: true,
        position:'bottom',
        textStyle:{
          color:'#857D7D',
          fontSize:fontSizeLabel,
        },
      },
      emphasis: {
        show: true,
        position:'bottom',
        textStyle:{
          color:'#857D7D',
          fontSize:fontSizeLabel,
        },
      }
    };
    const charts=[]
    chartData.chart.map( (el)=>{
      if(el.value===""|| el.value==="-"){
        charts.push({value:"-",percent:(el.percent)})
      }
      else if(parseFloat(el.value.replace(/,/g,''))>0){
          if((el.percent)==='') {
            charts.push({value: parseFloat(el.value.replace(/,/g,'')), percent: '-', label: LabelTop,valueData:el.value})
          }else{
            charts.push({value: parseFloat(el.value.replace(/,/g,'')), percent: (el.percent), label: LabelTop,valueData:el.value})
          }
      }
      else if(parseFloat(el.value.replace(/,/g,''))<=0){
          if((el.percent)==='') {
            charts.push({value: parseFloat(el.value.replace(/,/g,'')), percent: '-', label: LabelBottom,valueData:el.value})
          }else{
            charts.push({value: parseFloat(el.value.replace(/,/g,'')), percent: (el.percent), label: LabelBottom,valueData:el.value})
          }
      }
      return null
    });
    const chartHelp1=chartNum.map( (el)=> (el.value));
    const helpNums=Math.max.apply(null, chartHelp1)
    const dataShadow = [];
    for (let i = 0; i < chartHelp1.length; i+=1) {
      dataShadow.push(helpNums);
    }
    const res=[]
    for(let i=0;i<chartData.chart.length;i+=1){
      res.push(
        chartData.chart[i].name
      )
    }
    const legendSize=12;      // 图例字体大小
    const SHOW=true
    const {selects}=this.props
    const  selectOne=selects;
    let seriesData1=[];
    if(chartNum.length>1){
      seriesData1=chartNum.map((contents,index)=>
        ({
            name:`${contents.name}`,
            type:'bar',
            barHeight:barwidth, // 柱子宽度
            itemStyle : {
              normal: {
                color:colors[index],
              }
            },
            data:[0,0]
          })
      );
    }
    else{
      seriesData1=chartNum.map((contents)=>
        (
          {
            name:contents.name,
            type:'bar',
            barHeight:barwidth,// 柱子宽度
            itemStyle : {
              normal: {
                color:colors[selectOne],
              }
            },
            data:[0,0]
          })
      );
    }
    const seriesData=seriesData1;
    seriesData.splice(0,0, {
      // name:res,
      type: 'bar',
      barWidth:barwidth,
      // barGap:'10%',
      barCategoryGap:'10%',
      itemStyle: {
        normal: {
          color: (params)=>{
            const colorList = colors;
            if( selectOne && chartNum.length===1){
              return colorList[selectOne]
            }
            return colorList[params.dataIndex]
          },
          label : {
            show: true,
            formatter : (params)=> (`${params.data.valueData}\n(${params.data.percent})`),
            textStyle:{
              color:'#857D7D',
              fontSize:legendSize,
            },
          }
        },
      },
      data: charts,
    });
    seriesData.splice(0,0,{ // For shadow,找出最大值，防止数值过小是点击不了，颜色设置为透明
      type: 'bar',
      barWidth:barwidth,
      itemStyle: {
        normal: {color: 'rgba(36,41,44,0)'}
      },
      barGap:'-100%',
      barCategoryGap:'10%',
      data: dataShadow,
      animation: false
    },)
    const {titleName}=this.props;
    const option = {
      backgroundColor:'#F7F8FC',
      title : {
        text: titleName,
        subtext:`(万元/累计环比)`,
        x:'center',
        textStyle: {
          fontSize: titleSize,
          color: '#333333', // 主标题文字颜色
          fontWeight:'normal',
          fontFamily:'Microsoft YaHei',
        },
      },
      tooltip: {
        trigger: 'item',
        show:true,
        showContent: false,
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
          },
          shadowStyle: {
            color: 'rgba(86,84,86,0.2)'
          },
        },
        textStyle:{
          fontSize,
        },
        backgroundColor:'#DCD4C5',
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
        show:SHOW,
        orient : 'horizontal',
        selectedMode:false,// 图例不可点击
        x : 'center',
        y : 'bottom',
        padding:[1,0,0,0],
        itemGap: 2,
        textStyle: {
          fontSize: fontSizeLabel,
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
      series : seriesData
    };
    const myChart = echarts.init(this.chartDom.current);
    myChart.setOption(option);
    myChart.off('click');
    myChart.on('click',  (param)=>{
      const {callBackChart}=this.props
      callBackChart(param.name,chartData.chart[param.dataIndex].id,param.dataIndex)
    })
  };

  render() {
    return(
      <Fragment>
        <div className={styles.page}>
          <div ref={this.chartDom} className={styles.chartWrapper} />
        </div>
      </Fragment>
    )
  }
}
export default AnalysisChart
