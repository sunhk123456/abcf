import React, { PureComponent } from 'react';
import echarts from 'echarts';
import { connect } from 'dva/index';
import isEqual from 'lodash/isEqual';
import styles from './funnelPlot.less';
import { Icon } from 'antd';
import FontSizeEchart from '../ProductView/fontSizeEchart';
import DownloadFile from '@/utils/downloadFile';

@connect(({ buildingModels }) => ({
  buildingModels
}))
class FunnelEchart extends PureComponent{

  constructor(props){
      super(props);
      this.state={
        // data: {
        //   title:"楼宇转交情况",
        //   legend:["楼宇数量","匹配楼长楼宇数量","可按楼宇统计业务楼宇数量"],
        //   chartNumber:["-","-","-"],
        //   unit:"栋"
        // },
        echartId:'FunnelEchart',
      };
  };

  componentDidMount() {
    const {buildingModels}=this.props;
    const {funEchartData} = buildingModels;
    if(JSON.stringify(funEchartData) !== "{}"){
      this.createChart(funEchartData);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {buildingModels}=this.props;
    const {funEchartData} = buildingModels;
    if (JSON.stringify(funEchartData) !== "{}" && !isEqual(funEchartData, prevState.funEchartData)) {
      if(funEchartData.chartNumber!==undefined && funEchartData.chartNumber.length>0){
        this.createChart(funEchartData);
      }else{
        this.createChart(funEchartData);
      }
    }
  }

  sumValue = (arr) =>arr.reduce((prev, curr)=>prev + curr);

  // 渲染echart
  createChart = (data) => {
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight, titleFamily,tooltipSize,pietextSize}=fontsize;
    const {title,legend,chartNumber,chartPercentage} = data;
    let echartsTop;
    const totleValue = this.sumValue(chartNumber.map((item)=>item==="-"?0:this.formatData(item)));
    const YData = chartNumber.map(
      (item,index)=>(
        {
          normalData:item,
          percent: chartPercentage[index],
          name: legend[index],
          value:item==="-"?0:(((this.formatData(item)/totleValue)*100).toFixed(0))
        }
      )
    );
    const screenWidth = window.screen.width;
    if(screenWidth>700 && screenWidth<900){
      echartsTop = '35%';
    }else if(screenWidth>1200 && screenWidth<1400){
      echartsTop = '30%';
    }else{
      echartsTop = '20%'
    }
    const option = {
      color:['#E86D70','#EC9196','#F1B5B7'],
      title: {
        text:title,
        textStyle:{
          fontSize: titleSize,
          fontWeight:titleWeight,
          fontFamily:titleFamily,
          textAlign:"center",
        },
      },
      tooltip: {
        trigger: 'item',
        textStyle:{
          fontSize: tooltipSize
        },
        formatter(params) {
          const percent = params.data.percent !== "-" ? `${params.data.percent}` : params.data.percent;
          // const percentCopy = params.dataIndex === 0 ? "" : `; ${percent}`
          return `${params.marker}${params.name}:${params.data.normalData}; ${percent}`;
        },// 显示内容
      },
      toolbox: {
        show:false,
      },
      legend: {
        top:'8%',
        data: data.chartX,
        selectedMode:false // 关闭图例点击功能
      },
      series: [
        {
          name:data.title,
          top:echartsTop,
          type: 'funnel',
          gap: 16,
          minSize: '15%',
          label: {
            position: 'inside',
            fontSize: 15,
            formatter(params) {
              const {dataIndex,data:{normalData,percent}} = params;
              // const percentCopy = percent !== "-" ? `${percent}` : percent;
              const percentCopy2 = dataIndex === 0 ? "" : `; ${percent}`
              return `${normalData} ${percentCopy2}`;
            },
            textStyle: {
              color: '#fff',
              fontsize:pietextSize
            }
          },
          itemStyle: {
            normal: {
              // opacity: 0.5,
              borderColor: '#fff',
              borderWidth: 2
            }
          },
          data: YData
        }
      ]
    };
    const myChart = echarts.init(document.getElementById('FunnelEchart'));
    myChart.setOption(option);
  };

  // 对传入数据进行拼装处理
  handleData = (data) =>data.chartNumber.map((item, index) => ({
      value: item==="-"?0:this.formatData(item),
      name: data.legend[index]
    }));

  // 去掉数据中含有的逗号
  formatData = (data) => data.indexOf(",") === -1
    ? parseFloat(data)
    : parseFloat(data.replace(/,/g, ""));

  download = (e) => {
    const {echartId} = this.state;
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),echartId);
  };

  jsonHandle=()=>{
    const {buildingModels}=this.props;
    const {specialName,provName,cityName,date,funEchartData} = buildingModels;
    if(!funEchartData){return null}
    const {title,legend,chartNumber,unit,chartPercentage}=funEchartData;
    const condition = {
      name: `${title}`,
      value: [
        ["专题名称:", specialName,`（单位：${unit}）`],
        ["省份",provName],
        ["地市",cityName],
        ["日期",date]
      ],
    };
    const tableValue = chartNumber.map((item,index)=>[legend[index],item,chartPercentage[index]])
    const table = {
      title: [
        ["维度","数据","占比"],
      ],
      value: tableValue,
    };
    return {
      fileName: `${specialName}--${title}`,
      condition,
      table
    };
  };

  render(){
      const {echartId} = this.state;
      return (
        <div className={styles.main}>
          <div id={echartId} className={styles.echarts} />
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
        </div>
      )
  }
}
export default FunnelEchart;
