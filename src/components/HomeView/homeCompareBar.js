/* eslint-disable operator-assignment,prefer-template,no-else-return,react/no-array-index-key */
/**
 * @Description: 家庭视图带有圆弧角度矩形柱图组件
 *
 * @author: 王健
 *
 * @date: 2019/12/13
 */
import React,{ PureComponent} from "react";
import echarts from "echarts";
import { Icon } from 'antd';
import isEqual from 'lodash/isEqual';
import echartFontSize from '../ProductView/fontSizeEchart';
import DownloadFile from "@/utils/downloadFile"; // 下载封装方法
import styles from './homeCompareBar.less';

class PriceBar extends PureComponent {

  static defaultProps = {
    chartData:{
      title:"终端采购价格分布",
      xName:"元",
      yName:"人次",
      describe:"",
      chartX:["<10","[1000,2000]","[2000,3000]","[3000,4000]","[4000,5000]"],
      chart:[
        {
          name:"价格分布",
          value:["1500","4000","3000","2000","1500"],
          unit:"元",
        }
      ]
    },
    colors:['#FF78A2']
  }

  constructor(props) {
    super(props);
    this.priceBarRef = React.createRef(); // 创建玫瑰饼图ref
  }

  componentDidMount(){
    const { chartData,colors } = this.props;
    if( JSON.stringify(chartData) !== "{}" ){
      this.initpriceBarChart(chartData,colors);
    }
  }

  componentDidUpdate(prevProps){
    const { chartData,colors } = this.props;
    if( JSON.stringify(chartData) !== "{}" && !isEqual(chartData,prevProps.chartData)){
      this.initpriceBarChart(chartData,colors);
    }
  }

  // 求和
  sumValue = (arr) =>arr.reduce((prev, curr)=>prev + curr);

  /*
  * 绘制折线图
  * */
  initpriceBarChart=(chartData,colors)=> {
    // const self =this;
    const myFontSzie=echartFontSize();
    const priceBar = echarts.init(this.priceBarRef.current); // 初始化折线图所需dom
    const series=[];
    const {valueToProportion} = this.props;  // 数据转占比功能 （数据和占比图示显示）
    if(valueToProportion){
      chartData.chart.forEach((item)=>{
        const totleValue = this.sumValue(item.value.map((item2)=>item2==="-"?0:this.formatData(item2)));
        series.push(
          {
            type: 'bar',
            color: colors || [],
            data:  item.value.map(
              (item1) => (
                {
                  value: item1==="-"?0:(((this.formatData(item1)/totleValue)*100).toFixed(2)),
                  'normalData': item1,
                  'unit': item.unit,
                }
              ),
            ),
            barWidth:15,
            itemStyle:{
              barBorderRadius: [30, 30, 30, 30],
            }
          }
        )
      })
    }else {
      chartData.chart.forEach((item)=>{
        series.push(
          {
            type: 'bar',
            color: colors || [],
            data:  item.value.map(
              (item1) => (
                {
                  value: this.formatData(item1),
                  'normalData': item1,
                  'unit': item.unit,
                }
              ),
            ),
            barWidth:15,
            itemStyle:{
              barBorderRadius: [30, 30, 30, 30],
            }
          }
        )
      })
    }

    const priceBarOption = {
      title : {
        text: chartData.title,
        padding:[15,0,0,8],
        textStyle: {
          fontSize: myFontSzie.titleSize,
          // color: "#000000a6", // 主标题文字颜色
          fontWeight: myFontSzie.titleWeight,
          fontFamily: myFontSzie.titleFamily
        }
      },
      grid:{
        top:'25%',
        left: '5%',
        right: 100,
        bottom: "5%",
        containLabel: true,
      },
      // backgroundColor: '#F7F7F7',
      tooltip: {
        // trigger: 'item',
        trigger: "axis",
        show: true,
        confine:true, // 限制在图标区域内
        formatter(params) {
          const {marker,name,data} = params[0];
          if(valueToProportion){
            return `${marker}${name} <br /> 数量：${data.normalData}${data.normalData === '-' ? '' : data.unit}<br />占比：${data.value}%`;
          }else {
            return `${marker}${name} ：${data.normalData}${data.normalData === '-' ? '' : data.unit}`;
          }

        },
        // formatter: "{b} : <br/> {c}"+chartData.chart[0].unit,
        textStyle:{
          fontSize:myFontSzie.tooltipSize
        }
      },
      xAxis: {
        show:true,
        name:`${chartData.xName}`,
        type: 'category',
        data: chartData.chartX,
        // nameLocation:"middle",
        nameGap:0,
        nameTextStyle:{
          color:'#999',
        },
        axisLine:{
          show:true,
          lineStyle:{
            color:'#EEEFF9'
          }
        },
        axisTick:{
          show:false
        },
        splitLine:{
          show:false
        },
        axisLabel:{
          fontFamily:'Microsoft YaHei',
          fontWeight:700,
          fontStyle:'normal',
          fontSize:12,
          color:'#999',
          interval:0,
          formatter(xAxisData) {
            return xAxisData.replace(/(.{3})/g, '$1\n');
          } // 使x轴字体竖向显示
        }
      },
      yAxis: {
        show:true,
        type: 'value',
        name:`${chartData.yName}`,
        axisLine:{
          show:false
        },
        axisTick:{
          show:false
        },
        splitLine:{
          show:false
        },
        axisLabel:{
          fontFamily:'Microsoft YaHei',
          fontWeight:700,
          fontStyle:'normal',
          fontSize:12,
          color:'#999'
        }
      },
      series,
    };
// 检测屏幕宽度发生变化时,重新渲染
    priceBar.clear();
    priceBar.resize();
    priceBar.setOption(priceBarOption);
    window.addEventListener('resize', () => {
      priceBar.resize();
    });
  };

  // 下载方法
  download=(e)=> {
    const {echartId,downloadData} = this.props;
    e.stopPropagation();
    const {chartData} = this.props;
    const {chartX,title,chart}=chartData;
    const{specialName, conditionValue}=downloadData;
    const downloadValue=[];
    chartX.forEach((item)=>{
      downloadValue.push([item])
    })
    chart[0].value.forEach((item,index)=>{
      downloadValue[index].push(item);
    })
    const newDownloadData={
      fileName:`${specialName}--${title}`,
      condition:{
        name: `${title}`,
        value: [
          ["专题名称:", specialName, chart[0].unit],
          ...conditionValue
        ],
      },
      table:{
        title: [
          ['名称', '总数'],
        ],
        value: downloadValue
      }
    };
    DownloadFile(newDownloadData, echartId);

  };
  
  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.toString().indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };

  render() {
    const {chartData,echartId,downloadData} = this.props;
    if (JSON.stringify(chartData) !== "{}") {
      return (
        <div className={styles.priceBarDiv} id={echartId}>
          <div ref={this.priceBarRef} className={styles.priceBarChart} />
          {downloadData &&
          <div className={styles.downLoad} onClick={(e) => this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
          }
        </div>
      )
    } else {
      return null;
    }
  }
}
export default PriceBar;
