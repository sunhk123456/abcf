/* eslint-disable operator-assignment,prefer-template,no-else-return,react/no-array-index-key */
import React,{ PureComponent} from "react";
import echarts from "echarts";
import { Icon } from 'antd';
import echartFontSize from '../ProductView/fontSizeEchart';
import DownloadFile from "@/utils/downloadFile"; // 下载封装方法
import styles from './terminalPriceBar.less';

class PriceBar extends PureComponent {

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

  componentDidUpdate(){
    const { chartData,colors } = this.props;
    if( JSON.stringify(chartData) !== "{}" ){
      this.initpriceBarChart(chartData,colors);
    }
  }
  
  /**
   * 刻画饼图所需的数据格式类型
   * @param nameArray,名称数组
   * @param valueArray,值数组
   * @returns {XML},返回需要的数组格式
   */
  createPieData=(nameArray,valueArray,unit)=>{
    const pieData =[];
    valueArray.forEach((item,index)=>{
      pieData[index] = {
        "name":nameArray[index],
        "value": this.formatData(item),
        'normalData': item,
        'unit': unit,
      }
    });
    return pieData;
  };
  
  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };

  /*
  * 绘制折线图
  * */
  initpriceBarChart=(chartData,colors)=> {
    const {xNamelineFeed} = this.props;
    const sc = window.screen.width;
    const barWidth = sc < 1200 ? 25 : 40;
    // const self =this;
    const myFontSzie=echartFontSize();
    const priceBar = echarts.init(this.priceBarRef.current); // 初始化折线图所需dom
    const series=[];
    if(chartData.chart&&chartData.chart.length>0){
      chartData.chart.forEach((item)=>{
        series.push(
          {
            type: 'bar',
            color: colors || [],
            data: this.createPieData(chartData.chartX,item.value,item.unit),
            barWidth,
          }
        )
      })
    }
    const priceBarOption = {
      title : {
        text: chartData.title,
        left: 3,
        top: 10,
        textStyle: {
          fontSize: myFontSzie.titleSize,
          // color: "#000000a6", // 主标题文字颜色
          fontWeight: myFontSzie.titleWeight,
          fontFamily: myFontSzie.titleFamily
        }
      },
      grid: {
        top:'20%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      // backgroundColor: '#F7F7F7',
      tooltip: {
        trigger: "axis",
        show: true,
        confine:true, // 限制在图标区域内
        formatter(params) {
          // let showTip = '';
          // const useValue = self.cutNumber(params[0].value);
          // showTip += `${params[0].name}:<br/>${useValue}${params[0].value === '-' ? '' : chartData.chart[0].unit}`;
          // return `${showTip}`;
          // console.log(params)
          return `${params[0].marker}${params[0].name}:${params[0].data.normalData}${params[0].data.normalData === '-' ? '' : params[0].data.unit}`;
        },
        // formatter: "{b} : <br/> {c}"+chartData.chart[0].unit,
        textStyle:{
          fontSize:myFontSzie.tooltipSize
        }
      },
      xAxis: {
        show:true,
        type: 'category',
        name:chartData.xName,
        data: chartData.chartX,
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
          color:'#999',
          interval:0,
          formatter(xAxisData) {
            return xNamelineFeed ? xAxisData.replace(/(.{3})/g, '$1\n') : xAxisData;
          } // 使x轴字体竖向显示
        }
      },
      yAxis: {
        show:true,
        type: 'value',
        name:chartData.yName,
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

  /**
   * 为数字增加千分号
   * @param value，原来的数字
   * @returns newArray，返回一个新的字符串数组（由于仅仅要进行的是展示操作，无需再转化回number类型）
   */
  // cutNumber = (value) => {
  //   const oldArray = value
  //     .toString()
  //     .split('')
  //     .reverse(); // 先将原有数字转化为字符串类型，并按单个字符切割，再头尾反转
  //   const newArray = []; // 新的数组来存放带有逗号分隔符的数据
  //   oldArray.forEach((item, index) => {
  //     newArray.push(item);
  //     // 每三个字符进行一次分割（由于已经是逆转顺序的数组，即是从个位数开始计算，并且首尾是不允许出现分割符的）
  //     if (index % 3 === 2 && index !== 0 && index !== oldArray.length - 1) {
  //       newArray.push(',');
  //     }
  //   });
  //   newArray.reverse(); // 将新数组再次逆转回来
  //   let finalString=''; // 最终需要的字符串
  //   newArray.forEach((item)=>{
  //     finalString+=item;
  //   })
  //   return finalString;
  // };

  // // 处理数据格式,去掉逗号
  // formatData = (data) => {
  //   const newData=[];
  //   data.forEach((item,index)=>{
  //     newData[index]=item.indexOf(',') === -1
  //       ? parseFloat(item)
  //       : parseFloat(item.replace(/,/g, ''));
  //   })
  //   return newData;
  // };

  render() {
    const {chartData,echartId,download} = this.props;
    if (JSON.stringify(chartData) !== "{}") {
      return (
        <div className={styles.priceBarDiv} id={echartId}>
          <div ref={this.priceBarRef} className={styles.priceBarChart} />
          {download &&
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
