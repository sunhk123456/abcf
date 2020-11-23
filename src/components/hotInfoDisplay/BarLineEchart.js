/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 在网5G终端占比图表 </p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  caoruining
 * @date 2019/12/12
 */

import React,{ PureComponent } from 'react';
import echarts from 'echarts';
import {Icon, Tooltip} from 'antd';
import isEqual from 'lodash/isEqual';
import DownloadFile from "@/utils/downloadFile"
import {connect} from "dva";
import FontSizeEchart from '../ProductView/fontSizeEchart';
import waSai from "../BuildingView/pic/ganTan.png";


import styles from './BarLineEchart.less';


@connect(({hotInfoDisplayModels}) => ({
  hotInfoDisplayModels
}))

class BarLineEchart extends PureComponent{

  // static defaultProps={
  //   vertical:false,
  //   downloadData:{
  //     specialName:"xxx-xx",
  //     conditionValue: [
  //       ["name", "value"],
  //     ],
  //   },
  //   online5GData:{
  //     title: "在网5G终端占比",
  //     subtitle:"",
  //     chartX:["iphoneX","华为荣耀20","OPPO Reno","小米CC","华为Nova5","OPPO FindX","vivo NEX","Redmi K20Pro","华为mate 30","vivo NEX3"],
  //     chart:[
  //       {
  //         name:"终端数量",
  //         value:["1500","1250","680","1500","1050","1400","1380","1160","1300","1270"],
  //         unit:"数量",
  //         type:"bar",
  //       },
  //       {
  //         name:"占比",
  //         value:["90","80","40","90","70","85","80","75","83","80"],
  //         unit:"百分比",
  //         type:"line",
  //       }
  //     ]
  //   }
  // };

  constructor(props){
    super(props);
    this.chartDom=React.createRef();
    this.state={};
  };

  componentDidMount() {
    const { chartData } = this.props;
    this.createChart(chartData);
  }

  componentDidUpdate(prevProps) {
    const { chartData } = this.props;
    if (chartData && !isEqual(chartData, prevProps.chartData)) {
      this.createChart(chartData);
    }
  }


  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };

  // 渲染echart
  createChart = (data) => {
    const { color, single, double,vertical } = this.props;
    if (!data) {
      return null;
    }
    if (!data.chartX) {
      return null;
    }
    const example = [];
    data.chart.forEach(item => {
      example.push(item.name);
    });
    const legendData = data.example;
    const fontsize = FontSizeEchart();
    const newChart = data.chart.map((item) => (
      {
        "type": item.type,
        'name': item.name,
        'value': item.value.map(
          (item1) => (
            {
              value: this.formatData(item1),
              'normalData': item1,
              'unit': item.unit,
            }
          ),
        ),
      }
    ));
    const seriesData = newChart.map(item =>{
      if(item.type === 'bar' && single){
        return ({
          type: item.type,
          yAxisIndex:0,
          name: item.name,
          data: item.value,
          barWidth: 40,
        })
      }
      if(item.type === 'bar' && double){
        return ({
          type: item.type,
          yAxisIndex:0,
          name: item.name,
          data: item.value,
          barWidth: 10,
        })
      }
      return ({
        type: item.type,
        yAxisIndex:1,
        name: item.name,
        connectNulls: true,
        data: item.value,
      })
      }
    );
    const chartXData = data.chartX;
    let unit=[""];
    if(data.chart[0]){
      if(data.chart[1] && !data.chart[2]){
        unit=[data.chart[0].unit,data.chart[1].unit];
      } else if(data.chart[2]){
        unit=[data.chart[1].unit,data.chart[0].unit];
      }else {
        unit=[data.chart[0].unit];
      }
    }
    const option = {
      color,
      title : {
        show:false,
        text: data.title,
        left: 3,
        top: 10,
        textStyle: {
          fontSize: fontsize.titleSize,
          // color: "#000000a6", // 主标题文字颜色
          fontWeight: fontsize.titleWeight,
          fontFamily: fontsize.titleFamily
        }
      },
      grid: {
        top: '22%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        confine:true, // 限制在图标区域内
        show: true,
        textStyle: {
          fontSize: fontsize.tooltipSize,
        },
        axisPointer: {
          lineStyle: {
            color: 'rgba(86,84,86,0.2)',
          },
        },
        formatter(params) {
          let showTip = '';
          params.forEach((par) => {
            if (par.axisDim === 'x') {
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
      },
      legend: {
        show: true,
        orient: 'horizontal',
        right: '10%',
        top: 5,
        data: legendData,
        textStyle: {
          fontSize: fontsize.legendSize,
        },
        itemWidth:  25 , // 间距
      },
      xAxis: {
        type: 'category',
        data: chartXData,
        axisTick: {show: false},// 不显示刻度
        axisLine: {show: false},// 不显示轴线
        axisLabel: {
          show: true, // y轴坐标标签展示
          fontSize: fontsize.xAxisSize,
          color: '#333',
          interval:0,
          formatter(xAxisData) {
            return vertical?xAxisData.substring(0,4).replace(/(.{1})/g, '$1\n'):xAxisData;
          } // 使x轴字体竖向显示
        },

      },
      yAxis: [{
        type: 'value',
        name: `(${unit[0]})`,
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {
          textStyle: {
            color: "#999999",
            fontSize: fontsize.yAxisSize
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#EEEFF1',
            width: 1,
          }
        }
      },
        {
          type: 'value',
          name: unit[1] ? `(${unit[1]})`:"",
          axisTick: {show: false},
          axisLine: {show: false},
          axisLabel: {
            textStyle: {
              color: "#999999",
              fontSize: fontsize.yAxisSize
            },
            formatter: data.title === '在网5G终端占比' ? '{value}%' : '{value}'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#EEEFF1',
              width: 1,
            }
          }
        }],
      series: seriesData,
    };

    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);

    return null;
  };

  download = (e) => {
    const {echartId} = this.props;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),echartId);
  };

  jsonHandle=()=>{
    const {chartData,downloadData} = this.props;
    const {title,chartX,chart}=chartData;
    const {specialName,conditionValue} = downloadData;
    const tableValue = chart.map((item)=>{
      const value = item.value.map((itemValue)=>itemValue);
      return  [item.name,...value]
    });
    const table={
      title: [
        ["手机类型",...chartX]
      ],
      value: tableValue

    };
    let unit=[""];
    if(chart[0] && !chart[1]){
      unit=[chart[0].unit];
    }else if(chart[1] && !chart[2]){
      unit=[chart[0].unit,chart[1].unit];
    } else if(chart[2]){
      unit=[chart[1].unit,chart[0].unit];
    }
    return {
      fileName: `${specialName}--${title}`,
      condition:{
        name:title,
        value:[["专题名称",specialName,...unit],...conditionValue],
      },
      table
    };
  };

  render() {
    const { downloadData, echartId ,chartData,addRedMark}=this.props;
    const myFontSize=FontSizeEchart();
    return (
      <div id={echartId} className={styles.outer}>
        <div
          className={styles.titleDiv}
          style={{
            fontSize:myFontSize.titleSize,
            fontWeight:myFontSize.titleWeight,
            fontFamily:myFontSize.titleFamily,
          }}
        >
          {chartData.title}
          {
            addRedMark &&
            <Tooltip
              title='数据取自9月1日开始正式采集的预装客户端上报DM2.0数据'
              trigger='hover'
              placement='bottom'
              overlayClassName={styles.basisBarEchartToolTip}
              // defaultVisible
            >
              <img
                src={waSai}
                alt=''
                style={{height:myFontSize.titleSize,width:myFontSize.titleSize,cursor:'pointer'}}
              />
            </Tooltip>
          }
        </div>
        <div className={styles.chart} ref={this.chartDom} />
        {downloadData &&
        <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
          <div><Icon type="download" /></div>
          <div>下载</div>
        </div>
        }
      </div>
    );
  }
}

export default BarLineEchart;
