/*
*
* name：全部产品合计出账收入频次图 echart折线区域状混合图
* time：2019/6/10
* author：xingxiaodong
*
*/
import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import { connect } from 'dva/index';
import echarts from "echarts";
import moment from 'moment';
import styles from './echart.less';
import FontSizeEchart from '../ProductView/fontSizeEchart';

const { MonthPicker } = DatePicker;

@connect(({ productViewModels}) => ({
  productViewModels
}))
class ProductFeaturesTwoLineEchart extends PureComponent {

  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={
      chartData:null,
      date:"",
      benchDate:'',
    }
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const {chartData}=nextProps;
    if (chartData && chartData !== prevState.chartData && chartData.data) {
      const {example}=chartData.data;
      return {
        benchDate:example[1],
        date:example[0],
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
    if(chartData && chartData !== prevState.chartData){
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
    if(!chartData){return null}
    if(!chartData.data){return null}
    const color=["#E7A450","#60C3E9",'rgba(0,0,0,0)',"#61ADDC","#FEA27F"];
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight, titleFamily,xAxisSize, yAxisSize, tooltipSize,legendSize}=fontsize;
     const {title,unit,xName,chartX,chart,benchmarkingData,example}=chartData.data;
     example.push("增加");
     example.push("减少");
    const newLineData=benchmarkingData.map((item)=>(
      {
        "value":this.formatData(item),
        "normalData":item,
        "unit":unit,
      }
    ) );
    const newChart=chart.map((item)=>(
      {
        "value":this.formatData(item),
        "normalData":item,
        "unit":unit,
      }
    ) );
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
    const wScreen = window.screen.width;
    // 下面的柱状图辅助(透明柱状图)
    const barData1 = chart.map((value,index)=>{
      if(this.formatData(value)<= this.formatData(benchmarkingData[index])){
        return this.formatData(value);
      }
        return this.formatData(benchmarkingData[index]);
    });
    // 差值-增加
    const barDataAdd = chart.map((value,index)=>{
      const diff=this.formatData(value)-this.formatData(benchmarkingData[index]);
      let target=0;
      if(diff>0){
        target= diff;
      }
      return target
    });

    // 差值-增加
    const barDataReduce = chart.map((value,index)=>{
      const diff=this.formatData(benchmarkingData[index])-this.formatData(value);
      let target=0;
      if(diff>0){
        target= diff;
      }
      return target
    });
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
      legend: {
        top:20,
        padding:0,
        right:5,
        orient:'vertical',
        textStyle:{
        //   color:"#999999",
          fontSize:legendSize
        },
        data:example,
        selectedMode:false,
      },
      tooltip: {
        trigger: "axis",
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
          let showTip = "";
          params.forEach((par,index) => {
            if (par.axisDim === "x"&&index<2) {
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${ par.data.normalData==="-" ? '': par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
      },
      grid: {
        left: wScreen > 1866 ? gridLeft+15 : gridLeft,
        top: 80,
        right: '10%',
        bottom: 70,
      },
      xAxis:{
        type: 'category',
        name:xName,
        nameTextStyle: {
          fontSize:xAxisSize, // x轴名称样式
          color:"#656565",
          padding:[ 25, 0, 0, 0],
        },
        axisLine:{
          show:true, // x轴坐标轴线不展示
          lineStyle:{
            color:"#C8C8C8",
          },
        },
        axisTick:{show:false, // x轴坐标刻度不展示
        },
        axisLabel: {
          color:"#656565",
          margin: 10,
          fontFamily: "Microsoft YaHei",
          textStyle: {
            fontSize:xAxisSize,
          },
        },
        data:chartX,
      },
      yAxis: [
        {
          type: 'value',
          color:"#ccc",
          name:`单位：${unit}`,
          nameTextStyle: {
            fontSize:yAxisSize, // x轴名称样式
            color:"#656565",
            padding:[ 25, 0, 0, 0],
          },
          textStyle: {fontSize:yAxisSize},
          splitLine:{
            show:false, // x轴分割线展示
          },
          axisLine:{
            show:true, // x轴坐标轴线不展示
            lineStyle:{
              color:"#C8C8C8",
            },
          },
          axisTick:{
            show:false, // x轴坐标刻度不展示
          },
          axisLabel:{
            show:true, // x轴坐标标签展示
            color:"#656565",
            fontSize:yAxisSize,
            margin: 10,
          },

        }
      ],
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      },
        {
          start: 0,
          end: 100,
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
      series: [{
        name:example[0],
        yAxisIndex: 0,
        data:newChart,
        type: 'line',
        smooth:true,
        // itemStyle: {
        //   color: "#989898"
        // },
        // lineStyle:{
        //   color: "#E7A450"
        // },
      },{
        name:example[1],
        type:'line',
        smooth:true,
        yAxisIndex: 0,
        symbol: "emptyCircle",
        // itemStyle: {
        //   color: "#989898"
        // },
        // lineStyle:{
        //   color: "#60C3E9"
        // },
        label: {
          show: false,
          formatter: "{c}%",
          position: "top"
        },
        data:newLineData,
      },{
        name:"辅助性透明柱状图",
        type:'bar',
        yAxisIndex: 0,
        stack:"one",
        data:barData1,
      },{
        name:"增加",
        type:'bar',
        yAxisIndex: 0,
        stack:"one",
        barWidth:"50%",
        data:barDataAdd,
      },{
        name:"减少",
        type:'bar',
        yAxisIndex: 0,
        stack:"one",
        barWidth:"50%",
        data:barDataReduce,
      }]
    };
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.setOption(option);
    return null
  };

  // 日期控件日期改变触发函数
  onChangeStartDate = (date, dateString) => {
    // this.setState({
    //   date:dateString
    // });
    const {callbackMonth}=this.props;
      callbackMonth(dateString)
  };

  render() {
    const {benchDate}=this.state;
    const monthFormat = 'YYYY-MM';
    const {date}=this.state;
    const {productViewModels}=this.props;
    const {maxDate}=productViewModels;
    // console.log("maxDate")
    // console.log(maxDate)
    const disabledDate = current =>
      (current == moment(benchDate,monthFormat).valueOf() || current > moment(maxDate).valueOf());
    return(
      <div className={styles.page}>
        <div className={styles.benchMarking}>
          <div className={styles.itemLeft}>
            <span>标杆账期：</span>
            <span>{benchDate}</span>
          </div>
          <div className={styles.benchMarkingDate}>
            <span>对标账期：</span>
            <span>
              <MonthPicker
                format={monthFormat}
                onChange={this.onChangeStartDate}
                disabledDate={disabledDate}
                allowClear={false}
                showToday={false}
                value={moment(date, monthFormat)}
              />
            </span>
          </div>
        </div>
        <div ref={this.chartDom} className={styles.chartWrapper} />
      </div>
    )
  }

}
export default ProductFeaturesTwoLineEchart
