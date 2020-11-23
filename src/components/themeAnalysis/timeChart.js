/**
 *   xingxiaodong 20190227
 *   移动业务计费收入分析专题echarts图组件
 * */
import React, { PureComponent, Fragment } from 'react';
import echarts from "echarts";
import styles from './timeChart.less';

class AnalysisTimeChart extends PureComponent{
  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={
      chartData:null,
      time:30,
      // selectButton:1,
    }
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const {chartData,time}=nextProps
    if (chartData && chartData !== prevState.chartData) {
      return {
        chartData,time
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const {chartData}=this.state
    if(chartData !== prevState.chartData){
      this.createChart(chartData)
    }
  }

  buttonOnclick=(number)=>{ // number:1,3,6,12
    this.setState({
      // selectButton:number,
    })
    const {callBackTime}=this.props;
    callBackTime(number)
  }

  createChart=(chartData)=>{
    if(!chartData){return null;}
    const{unit}=chartData["0"];
    const dataSet=chartData["0"].data;
    const dataKey=chartData["0"].chartX;
    // 绘制时间折线图
    const myChart = echarts.init(this.chartDom.current);
    const themeColor= ["#FD9F82", "#F97494", "#FD9F82"] // 切换主题变换折线颜色
    const axisColor="#999999"// 切换主题变换x和y轴字体颜色
    const tipBackcolor="rgba(108,109,111,0.7)"// 切换主题变换提示框背景颜色
    const dataCharts = dataSet.map( (data)=> parseFloat(data.replace(/,/g,'')))
    const option = {
      tooltip : {
        show:true,
        trigger: 'axis',
        position:  (point)=> [point[0]-70, point[1]-40],
        axisPointer: {
          lineStyle: {
            color: 'rgba(86,84,86,0.2)'
          },
        },
        textStyle:{
          fontSize:14,
        },
        backgroundColor:tipBackcolor,
        formatter: (params)=> (`${params[0].name} ：${dataSet[params[0].dataIndex]}${unit}`),
      },
      calculable : false,
      xAxis : [
        {
          boundaryGap : false,
          data : dataKey,
          splitLine:{// 网格线x周样式设置
            show:false,
          },
          axisLine:{// x轴轴线样式设置
            lineStyle:{
              color:axisColor,
            }
          },
          axisLabel:{// 坐标轴刻度文字样式设置
            textStyle:{
              color:axisColor,
              fontSize: 12,
            },
            // interval:inter
          },
          axisTick:{
            show:true,
            lineStyle:{
              color:axisColor,
            }
          }
        }
      ],
      yAxis : [
        {
          type : 'value',
          splitLine:{// 网格线x周样式设置
            show:false,
          },
          axisLine:{// y轴轴线样式设置
            lineStyle:{
              color:axisColor,
            }
          },
          axisLabel : {
            formatter: '{value}',// y轴数据格式
            textStyle: {
              color:axisColor,
              fontSize: 12,
            }
          },
          axisTick:{
            show:true,
            lineStyle:{
              color:axisColor,
            }
          }
        }
      ],
      animation:false,// 是否可以有动态效果
      grid:{
        x:'7%',
        y:'7%',
        borderWidth: 0,
      },
      series : [
        {
          symbolSize:3,
          symbol:'none',
          // showAllSymbol: false,
          type:'line',
          smooth:true,
          itemStyle: {
            normal: {
              color:themeColor[2],  // 原来的颜色
              areaStyle: {
                // type: 'default',
                // color: '#D7D8DE'
                // normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color:themeColor[0]
                }, {
                  offset: 1,
                  color:themeColor[1]
                }]),
                // }
              }
            },
            lineStyle: {
              color: '#F97494'
            },
          },
          data:dataCharts
        },
      ]
    };
    myChart.setOption(option);
    return null;
  }

  render() {
    const {titleName}=this.props;
    const {time}=this.state;
    return(
      <Fragment>
        <div className={styles.page}>
          <div className={styles.titleName}> {titleName}</div>
          <div className={styles.selectMonth}>
            <div onClick={()=>this.buttonOnclick(1)} className={`${styles.selectItem} ${(Number(time)===30)?styles.active:null}`}>一月</div>
            <div onClick={()=>this.buttonOnclick(3)} className={`${styles.selectItem} ${(Number(time)===90)?styles.active:null}`}>三月</div>
            <div onClick={()=>this.buttonOnclick(6)} className={`${styles.selectItem} ${(Number(time)===180)?styles.active:null}`}>六月</div>
            <div onClick={()=>this.buttonOnclick(12)} className={`${styles.selectItem} ${(Number(time)===360)?styles.active:null}`}>一年</div>
          </div>
          <div className={styles.chart} ref={this.chartDom} />
        </div>
      </Fragment>
    )
  }
}
export default AnalysisTimeChart
