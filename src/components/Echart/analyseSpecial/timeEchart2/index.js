import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import styles from './index.less';
import FontSizeEchart from '../../../ProductView/fontSizeEchart';
import warningIcon from '../../../IndexDetails/u91.png';
import TimeEchartTable from '../timeEchart1/table';


class TimeEchart2 extends Component {

  constructor(props) {
    super(props);
    this.chartDom = React.createRef();
    this.state = {
      chartData: null,
      select:true,
      flag:"01",
    };
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const { chartData } = nextProps;
    if (chartData && chartData !== prevState.chartData) {
      return {
        chartData,
        flag:"01",
      };
    }
    return null;
  }

  componentDidMount() {
    const { chartData } = this.state;
    this.createChart(chartData);
  }

  componentDidUpdate(prevProps, prevState) {
    const { chartData } = this.state;
    if (chartData && chartData !== prevState.chartData) {
      this.createChart(chartData);
    }
  }

  // 切换标签
  conditionHandle=(index, item)=>{
    this.setState({
      flag:item.id
    });
  };


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
    if (!data) {
      return null;
    }
    if (!data.chartX) {
      return null;
    }
    console.log('渲染图表');

    // const data = {
    //   'title': '全国合计时间趋势图',
    //   'chartX': ['201803', '201804', '201805', '201806', '201807'],
    //   'chart': ['100', '200', '100', '400', '600'],
    //   'warning': [
    //     { 'warningIndex': '0', 'warningLevel': 'nn', 'desc': 'mm' },
    //     { 'warningIndex': '2', 'warningLevel': 'nnn', 'desc': 'mmm' },
    //     { 'warningIndex': '3', 'warningLevel': 'nnnn', 'desc': 'mmmm' },
    //   ],
    //   'unit': '万元',
    //   'xName': '账期',
    //   'yName': '出账用户数',
    //   'tableData': {
    //     thData: ['日期', '本年累计值'],
    //     tbodyData: [
    //       { 'date': '7月', 'value': '22', 'warningLevel': '1级', 'desc': '预警信息预警信息' },
    //       { 'date': '8月', 'value': '22', 'warningLevel': '', 'desc': '' },
    //       { 'date': '9月', 'value': '22', 'warningLevel': '', 'desc': '' },
    //       { 'date': '10月', 'value': '22', 'warningLevel': '', 'desc': '' },
    //     ],
    //   },
    // };
    const {title,xName,yName,example}=data;
    const dayTrendData = data;
    const dataSetnum = dayTrendData.chart;
    const dataWarning = dayTrendData.warning; // 预警信息
    const numberArr = dataSetnum.map((item)=>(this.formatData(item)));
    const dataKey = dayTrendData.chartX;


    const color=["#FEA27E","#FE74A4"];
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight,titleFamily, xAxisSize, yAxisSize, tooltipSize,legendSize}=fontsize;
    /**
     * 判断是否有预警信息 有则加上一个*号
     */
    const dataX = dataKey.map((datakey,index)=>{
      let datadata = datakey;
      if(dataWarning){
        for(let i=0;i<dataWarning.length;i+=1){
          const warningindex = parseInt(dataWarning[i].warningIndex,10);
          if(index === warningindex){
            datadata = `${datakey } *`;
          }
        }
      }
      return datadata;
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
        show:true,
        icon:"bar",
        align: 'left',
        left: 5,
        top:10,
        itemWidth: 20,
        itemHeight: 10,
        itemGap: 10,
        textStyle:{
          legendSize,
          color:'#999',
        },
        data:example,
      },
      tooltip: {
        show: true,
        trigger: "axis",
        textStyle:{
          fontSize: tooltipSize
        },
        position(point){
          return [point[0] - 70, point[1] - 40];
        },
        axisPointer: {
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        backgroundColor: "rgba(108,109,111,0.7)",
        formatter(params) {
          const unit = params[0].value === "-" ? "" : dayTrendData.unit;
          /**
           * 预警tips
           */
          let tip;
          const tips = [];
          if(dataWarning !== undefined && dataWarning.length !== 0){
            dataSetnum.forEach((dataa,index) =>{
              for(let i=0;i<dataWarning.length;i+=1){
                if(index === parseInt(dataWarning[i].warningIndex,10)){
                  if(dataWarning[i].desc !== ''){
                    tip =`${params[0].name }：${dataSetnum[params[0].dataIndex]
                        }${ unit} <div style='background-color: white;width: 100%;height: 1px;text-align: center'></div>` +
                      `<div style='color: #FFCC00'>` +
                      `<img style='width: 18px;height: 18px' src=${warningIcon}>` +
                      `预警等级：${dataWarning[i].warningLevel
                        }</div>` +
                      `<div style='width: 100%;white-space:normal;word-wrap : break-word'>` +
                      `详情：${  dataWarning[i].desc
                        }</div>`;
                  }else {
                    tip =`${params[0].name  }：${dataSetnum[params[0].dataIndex]
                        }${ unit}<div style='background-color: white;width: 100%;height: 1px;text-align: center'></div>` +
                      `<div style='color: #FFCC00'>` +
                      `<img style='width: 18px;height: 18px' src=${warningIcon} alt='picture'>` +
                      `预警等级：${dataWarning[i].warningLevel
                        }</div>`
                  }
                  break;
                }else{
                  tip =`${params[0].name  }:${  dataSetnum[params[0].dataIndex]} ${ unit}`;
                }
              }
              tips.push(tip);
            });
            return tips[params[0].dataIndex];
          }
          return `${params[0].name} <br/> ${params[0].marker}${params[0].seriesName}:${dataSetnum[params[0].dataIndex]} ${ unit}`;
        }
      },
      calculable: false,
      grid: {
        top: 60,
        left: '10%',
        right: '10%',
        bottom: 10,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        name:xName,
        nameTextStyle: {
          fontSize:xAxisSize, // x轴名称样式
          padding:[ 25, 0, 0, 0],
        },
        data:dataX,
        axisLine:{
          show:false, // x轴坐标轴线不展示
        },
        axisTick:{
          show:false, // x轴坐标刻度不展示
        },
        axisLabel:{
         // show:true, // x轴坐标标签展示
         // rotate:45,
          fontSize:xAxisSize,
          color:(value)=>value.indexOf('*') !==-1 ? "#c91717" : "#999999",
        },
      },
      yAxis: {
        type: 'value',
        min:"dataMin",
        splitNumber:3,
        name:yName,
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
      animation: false, // 是否可以有动态效果
      series: [
        {
          symbol: "circle", // 折线上的圆点去掉
          symbolSize: 3,
          type: "line",
          smooth: true,
          itemStyle: {
            color: "#FD9F82",
            lineStyle: {
              // #D7D8DE
              color: "#D7D8DE"
            }
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgb(255, 158, 68)"
              },
              {
                offset: 1,
                color: "rgb(255, 70, 131)"
              }
            ])
          },
          data: numberArr
        }
      ]
    };
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);
    return null;
  };

  download = (e) => {
    const {flag}=this.state;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),flag==="01" ? "timeEchart2":null);
  };

  jsonHandle=()=>{
    const {downloadData, chartData} = this.props;
    if(!chartData){return null}
    const {thData}=chartData.tableData;
    const tbodyData=chartData.chartX.map((item,index)=>([item,chartData.chart[index]]));
    const {title,unit}=chartData;
    const conditionValue=[];
    downloadData.condition.forEach((item)=>{
      conditionValue.push([item.key,...item.value])
    });
    const {specialName}=downloadData;
    const condition = {
      name: `${title}`,
      value: [
        ["专题名称:", specialName, unit],
        ["筛选条件:"],
        ...conditionValue,
      ],
    };
    const table = {
      title: [
        thData
      ],
      value: [
        ...tbodyData
      ]
    };
    return {
      fileName: `${specialName}--${title}`,
      condition,
      table
    };
  };

  render() {
    const {downloadData,chartData}=this.props;
    const {select,flag}=this.state;
    const conditionDom = [{name:'图表',id:"01"},{name:'数据',id:"02"}].map((data, index) =>
      (
        <li
          key={data.id}
          className={flag === data.id ? styles.btnSelected : styles.btn}
          onClick={(e) => {
            this.conditionHandle(index, data, e);
          }}
        >
          {data.name}
        </li>
      )
    );
    return (
      <div id="timeEchart2" className={styles.page}>
        <div ref={this.chartDom} style={{display: flag==="01" ? "block" : "none" }} className={styles.chart} />
        <div style={{display: flag !=="01" ? "block" : "none" }} className={styles.tableWrapper}><TimeEchartTable tableData={chartData} /></div>
        {downloadData?(
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
        ):null}
        {select ? (<ul className={styles.btnUl}>{conditionDom}</ul>) : null}
      </div>
    );
  }

}

export default TimeEchart2;

