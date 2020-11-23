/* eslint-disable operator-assignment,prefer-template,no-else-return,react/no-array-index-key */
import React, { PureComponent } from 'react';
import echarts from 'echarts';
import { Icon, Tooltip } from 'antd';
import isEqual from 'lodash/isEqual';
import echartFontSize from '../ProductView/fontSizeEchart';
import styles from './catPie.less';
import DownloadFile from '@/utils/downloadFile';
import waSai from '../BuildingView/pic/ganTan.png';

class CatPie extends PureComponent {
  
  static defaultProps = {
    chartData: {
      'chartXList': [
        [
          { 'name': '华为', 'value': '1' },
          { 'name': '小米', 'value': '1' },
          { 'name': 'iPhone', 'value': '1' },
        ],
        [
          { 'name': '海信', 'value': '1' },
          { 'name': '海尔', 'value': '1' },
        ],
        [
          { 'name': '戴尔', 'value': '1' },
          { 'name': '华为', 'value': '1' },
        ],
      ],
      'xName': '',
      'yName': '',
      'title': '智能终端',
      'chartX': ['手机', '电视', '电脑'],
      'chart': [
        {
          'value': ['2,536', '536', '536'],
          'name': '智能终端',
          'unit': '台',
          'type': 'pie',
        },
      ],
    },
    colors: [
      '#5CD5E3',
      '#DC69AB',
      '#61ADDD',
      '#DE9462',
      '#91C7AE',
      '#919BC6',
      '#C391C6',
      '#DC6868',
      '#B6DC6B',
      '#D0C862'],
    hasBorder: false,
    hasLegend: true,
    titlePosition: 'left',
    centerData: ['50%', '50%'],
    radiusData:['0%', '55%'],
    hasClockWise: true,// 是否顺时针布局
    hasPercent: false, // 展示是否显示百分比
  };
  
  constructor(props) {
    super(props);
    this.rosePieRef = React.createRef(); // 创建玫瑰饼图ref
    this.state={}
  }
  
  componentDidMount(){
    const { chartData,colors,hasBorder,hasLegend,centerData,hasClockWise,hasPercent,radiusData } = this.props;
    if( JSON.stringify(chartData) !== "{}"){
      this.initCutPieChart(chartData,colors,hasBorder,hasLegend,centerData,hasClockWise,hasPercent,radiusData);
    }
  }
  
  componentDidUpdate(prevProps){
    const { chartData,colors,hasBorder,hasLegend,centerData,hasClockWise,hasPercent,radiusData} = this.props;
    if( JSON.stringify(chartData) !== "{}" && !isEqual(chartData,prevProps.chartData) ){
      this.initCutPieChart(chartData,colors,hasBorder,hasLegend,centerData,hasClockWise,hasPercent,radiusData);
    }
  }
  
  /*
  * 绘制饼图
  * */
  initCutPieChart=(chartData,colors,hasBorder,hasLegend,centerData,hasClockWise,hasPercent,radiusData)=> {
    if(!chartData||!chartData.chartX||chartData.chartX.length===0){return null}
    const myFontSzie=echartFontSize();
    const myChart = echarts.init(this.rosePieRef.current); // 初始化折线图所需dom
    const option = {
      title : { show:false },
      tooltip: {
        trigger: 'item',
        formatter(params) {
          let showTip = "";
            params.data.chartXList.forEach((item,) => {
              showTip += `${params.marker} ${item.name} : ${item.value}  ${ item.value==="-" ? '': params.data.unit}  <br/>`;
            });
            return showTip
          // return `${params.marker}${params.name}:${params.data.normalData}${params.data.normalData === '-' ? '' : params.data.unit}<br/> ${showTip}`;
        },
        textStyle:{
          fontSize:myFontSzie.tooltipSize
        }
      },
      legend: {
        show:hasLegend||false,
        data: chartData.chartX,
        icon: 'rect',
        bottom: '5%',
        textStyle:{
          fontSize:myFontSzie.legendSize
        }
      },
      color: colors,
      series: [{
        type: 'pie',
        radius: radiusData,
        center: centerData, // 圆心位置
        clockwise:hasClockWise, // 是否顺时针分布
        itemStyle:{
          borderWidth: hasBorder?10:0,
          borderColor: "#FFFFFF"
        },
        data: this.createPieData(chartData.chartX,chartData.chart[0].value,chartData.chart[0].unit,chartData.chartXList),
        labelLine: {
          show: true,
          length: 10,
          length2: 30,
          lineStyle: {
            width: 1
          }
        },
        label: {
          height: 70,
          fontSize: myFontSzie.pietextSize,
          position:"inside",
          // align: 'center',
          // eslint-disable-next-line no-nested-ternary,no-unused-expressions
          formatter:(data) =>{
            console.log("dataLabel");
            console.log(data);
            const name= hasLegend?'':data.name+"\n";
            const percent= hasPercent?data.percent.toFixed(2)+"%":data.data.normalData+data.data.unit;
            return name + percent
          }
        },
      }
      
      ]
    };
    
    // 检测屏幕宽度发生变化时,重新渲染
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);
    return null
  };
  
  /**
   * 刻画饼图所需的数据格式类型
   * @param nameArray,名称数组
   * @param valueArray,值数组
   * @returns {XML},返回需要的数组格式
   */
  createPieData=(nameArray,valueArray,unit,chartXList)=>{
    const pieData =[];
    valueArray.forEach((item,index)=>{
      pieData[index] = {
        "name":nameArray[index],
        "value": this.formatData(item),
        'normalData': item,
        'unit': unit,
        "chartXList":chartXList[index]
      }
    });
    return pieData;
  };
  
  // 处理数据格式
  formatData = (data) => {
    if(data==="-"){
      return 0
    }
    const dataA =
      data.indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };
  
  jsonHandle=()=>{
    const {chartData,downloadData} = this.props;
    const {title,chartX,chart}=chartData;
    const {specialName,conditionValue} = downloadData;
    let unitCopy = "";
    const tableValue = chart.map((item)=>{
      unitCopy = item.unit;
      const value = item.value.map((itemValue)=>`${itemValue}`);
      return  [item.name,...value]
    });
    const table={
      title: [
        ["维度",...chartX]
      ],
      value: tableValue
      
    };
    return {
      fileName: `${specialName}--${title}`,
      condition:{
        name:title,
        value:[["专题名称",specialName,unitCopy],...conditionValue],
      },
      table
    };
  };
  
  download = (e) => {
    const {echartId} = this.props;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),echartId);
  };
  
  render() {
    const {chartData,downloadData,titlePosition,redMark} = this.props;
    const {echartId} = this.props;
    const myFontSize=echartFontSize();
    if (JSON.stringify(chartData) !== "{}") {
      return (
        <div className={styles.rosePieDiv} id={echartId}>
          {chartData&&chartData.title&&
          <div
            className={styles.titleDiv}
            style={{
              fontSize:myFontSize.titleSize,
              fontWeight:myFontSize.titleWeight,
              fontFamily:myFontSize.titleFamily,
              color:myFontSize.titleColor,
              textAlign:titlePosition==='center'?'center':'left',
              paddingLeft:titlePosition==='center'?0:"5px",
            }}
          >
            {chartData.title}
            {
              chartData&&chartData.subtitle&&redMark&&
              <Tooltip
                title={chartData.subtitle?chartData.subtitle:''}
                trigger='hover'
                placement='bottom'
                overlayClassName={styles.toolTip}
              >
                <img
                  src={waSai}
                  alt=''
                  style={{height:myFontSize.titleSize,width:myFontSize.titleSize,cursor:'pointer'}}
                />
              </Tooltip>
            }
          </div>
          }
          <div ref={this.rosePieRef} className={styles.rosePieChart} />
          {downloadData&&
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
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
export default CatPie;
