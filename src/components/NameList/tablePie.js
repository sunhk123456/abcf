/* eslint-disable operator-assignment,prefer-template,no-else-return,react/no-array-index-key */
import React, { PureComponent } from 'react';
import echarts from 'echarts';
import { Icon } from 'antd';
import isEqual from 'lodash/isEqual';
import echartFontSize from '../ProductView/fontSizeEchart';
import styles from './tablePie.less';
import DownloadFile from '@/utils/downloadFile';


class NameListTablePie extends PureComponent {

  static defaultProps = {
    chartData:{
      "title": "5G终端NR登网情况",
      "chartX": ["联通", "移动", "电信"],
      "chart": [{
        "unit": "台",
        "name": "5G终端NR登网情况",
        "type": "pie",
        "value": [
          {
            "data": "456,45",
            "id": "012",
            "percent": "45.23",
            "percentUnit": "%"
          },
          {
            "data": "456,45",
            "id": "013",
            "percent": "45.23",
            "percentUnit": "%"
          },
          {
            "data": "456,45",
            "id": "014",
            "percent": "45.23",
            "percentUnit": "%"
          }
        ]
      }]
    },
    colors:[
      "#5CD5E3",
      "#DC69AB",
      "#61ADDD",
      "#DE9462",
      "#91C7AE",
      "#919BC6",
      "#C391C6",
      "#DC6868",
      "#B6DC6B",
      "#D0C862"],
    hasBorder:false,
    hasLegend:true,
    titlePosition:"left",
    centerData:['50%','50%'],
    hasClockWise:true,// 是否顺时针布局
    hasPercent:true, // 展示是否显示百分比
  };

  constructor(props) {
    super(props);
    this.chartDomPie=React.createRef();
    this.state={}
  }

  componentDidMount() {
    const { chartData } = this.props;
    this.createChart(chartData);
  }

  componentDidUpdate(prevProps) {
    const { chartData } = this.props;
    if (!isEqual(chartData, prevProps.chartData)) {
      this.createChart(chartData);
    }
  }

  /*
  * 绘制折线图
  * */
  createChart=(chartData) => {
    const rosePie = echarts.init(this.chartDomPie.current); // 初始化折线图所需dom
    const {colors,hasBorder,hasLegend,hasClockWise} = this.props;
    rosePie.clear();
    if(!chartData){return null}
    if(!chartData.chart){return null}
    const myFontSzie=echartFontSize();
    const rosePieOption = {
      tooltip: {
        show:true,
        trigger: 'item',
        formatter(params) {
          return `${params.marker}${params.name}
            <br />&emsp;金额:${params.data.normalData.data}${params.data.normalData.data === '-' ? '' : params.data.unit}
            <br />&emsp;同比:${params.data.normalData.percent}${params.data.normalData.percent === '-' ? '' : params.data.normalData.percentUnit}`;
        },
        textStyle:{
          fontSize:myFontSzie.tooltipSize
        }
      },
      legend: {
        show:hasLegend||false,
        data: chartData.chartX,
        icon: 'rect',
        bottom: 10,
        textStyle:{
          fontSize:myFontSzie.legendSize
        }
      },
      color: colors,
      series: [{
        type: 'pie',
        roseType: "radius",
        radius: ["30%", '50%'],
        center:['50%', '40%'],
        clockwise:hasClockWise, // 是否顺时针分布
        itemStyle:{
          borderWidth: hasBorder?10:0,
          borderColor: "#FFFFFF"
        },
        data: this.createPieData(chartData.chartX,chartData.chart[0].value,chartData.chart[0].unit),
        labelLine: {
          show: false,
          length: 10,
          length2: 30,
          lineStyle: {
            width: 1
          }
        },
        label: {
          show: false,
          height: 70,
          fontSize: myFontSzie.pietextSize,
          align: 'center',
          formatter:(data) =>hasLegend?'':data.name+"\n"
        },
      }

      ]
    };
    rosePie.resize();
    rosePie.setOption(rosePieOption);
    rosePie.off('click');
    rosePie.on('click', (e)=>this.selectPie(e.data));
    return null
  };

  selectPie=(data)=>{
    const {callbackPie} = this.props;
    console.log(data);
    callbackPie(data.normalData.id)
  };

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
        "value": this.formatData(item.data),
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
    const {chartData,downloadData,titlePosition} = this.props;
    const {echartId} = this.props;
    const myFontSize=echartFontSize();

    return (
      <div className={styles.rosePieDiv} id={echartId}>
        {chartData&&chartData.title&&
        <div
          className={styles.titleDiv}
          style={{
            fontSize:myFontSize.titleSize,
            fontWeight:myFontSize.titleWeight,
            fontFamily:myFontSize.titleFamily,
            textAlign:titlePosition==='center'?'center':'left',
            marginLeft:titlePosition==='center'?0:5,
          }}
        >
          {chartData.title}
        </div>
        }
        <div ref={this.chartDomPie} className={styles.rosePieChart} />
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
export default NameListTablePie;
