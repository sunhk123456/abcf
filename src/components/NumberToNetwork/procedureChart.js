/*
* 漏斗图
* */
import React, { Component } from 'react';
import { Icon} from 'antd';
import echarts from "echarts";
import isEqual from 'lodash/isEqual';
import Style from './procedureChart.less'
import FontSizeEchart from '../ProductView/fontSizeEchart';
import DownloadFile from "@/utils/downloadFile";

// // 引入 ECharts 主模块
// const echarts = require('echarts/lib/echarts');
// // 引入柱状图
// require('echarts/lib/chart/bar');
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');

export default  class ProcedureChart extends Component {
  constructor(props){
    super(props);
    this.state={

    };
    this.procedureChartId = React.createRef(); // 产品结构图ref
  }
  // title:'中国联通新增携出流程分布',
  // chartPercentage:[100,36,10,5],
  // Legend:['查询资格数量','符合条件数量及占比','给予授权数量及占比','携出成功数量及占比']
  // "title": "中国联通新增携出流程分布",
  // "Legend": ["查询资格数量","符合条件数量及占比", "给予授权数量及占比","携出成功数量及占比"],
  // "chartNumber": ["12345", "5613", "2312","2312"],
  // "chartPercentage": ["100%", "36%", "26%","13%"],

  componentDidMount(){
    // this.initEchart();
  }
  
  componentDidUpdate(nextProps) {
    const {echartData}=this.props;
    if(JSON.stringify(echartData) !== "{}" && !isEqual(nextProps.echartData,echartData)){
      console.log("重新渲染额chart图");
      this.initEchart();
    }
  }
  
  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.toString().indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };

  sumValue = (arr) =>arr.reduce((prev, curr)=>prev + curr);

  // 主要方法
  initEchart(){
    const {echartData:{title,Legend,chartNumber,chartPercentage}} =this.props;
    const totleValue = this.sumValue(chartNumber.map((item)=>item==="-"?0:this.formatData(item)));
    const YData = chartNumber.map(
      (item,index)=>(
        {
          normalData:item,
          percent: chartPercentage[index],
          name: Legend[index],
          value:item==="-"?0:(((this.formatData(item)/totleValue)*100).toFixed(0))
        }
        )
    );
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight, titleFamily, legendSize,tooltipSize}=fontsize;
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(this.procedureChartId.current);
    // 绘制图表相关配置
    const option={
      title: {
        text: title,
        textStyle:{
          fontSize: titleSize,
          fontWeight:titleWeight,
          fontFamily:titleFamily,
          textAlign:"center",
        },
      },
      grid: {
        left: 70,
        right: '3%',
        top:'30%',
        bottom: '0%',
        containLabel: true
      },
      color: ['#C70D0E', '#A64444', '#E86014','#FF9223'],
      tooltip: {
        trigger: 'item',
        textStyle:{
          fontSize:tooltipSize
        },
        formatter(params) {
          const percent = params.data.percent !== "-" ? `${params.data.percent}%` : params.data.percent;
          const percentCopy = params.dataIndex === 0 ? "" : `; ${percent}`
          return `${params.marker}${params.name}:${params.data.normalData} ${percentCopy}`;
      },// 显示内容
      },
      legend: {
        data: Legend,
        orient:'vertical',
        left:'10px',
        top:'80px',
        itemWidth:14,
        itemGap:50,// 间距
        textStyle:{
          fontSize:legendSize,
        },
      },
      calculable: true,
      series: [
        {
          name:'流程分布情况',
          type:'funnel',// 漏斗
          left: '35%',
          top: '21%',
          bottom: '80%',
          width: '60%',
          height:'75%',
          // height: {totalHeight} - y - y2,
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            fontSize: 15,
            formatter(params) {
              const {dataIndex,data:{normalData,percent}} = params;
              const percentCopy = percent !== "-" ? `${percent}%` : percent;
              const percentCopy2 = dataIndex === 0 ? "" : `; ${percentCopy}`
              return `${normalData} ${percentCopy2}`;
            }
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 20,
              formatter(params) {
                const {dataIndex,data:{normalData,percent}} = params;
                const percentCopy = percent !== "-" ? `${percent}%` : percent;
                const percentCopy2 = dataIndex === 0 ? "" : `; ${percentCopy}`
                return `${normalData} ${percentCopy2}`;
              }
            }
          },
          data: YData
        }
      ]
    };

    // 检测屏幕宽度发生变化时,重新渲染
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);
  }

  // 下载方法
  download(e){
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"procedureId");
  }

  jsonHandle() {
    const  {echartData} = this.props;
    const {echartData: {download: {title, value}},selectName}= this.props;


    // 文件信息
    const condition = {
      name: "中国联通新增携出流程分布",
      value: [
        ["专题名称:", echartData.title, '人数/占比'],
        ["筛选条件"],
        ["地域:",selectName]
      ],
    };

    // 表头数据+数据  运营商///新增携出用户///新增携入用户///净携入用户
    const table = {
      title: [
        ...title
      ],
      value
    };

    // 拼接json数据  文件名/表头/数据
    const newJson = {
      fileName: `${echartData.title}-图表数据`,
      condition,
      table
    };
    // console.log(newJson);
    return newJson;
  }

  render() {
    return (
      <div className={Style.procedureChart}>
        <div ref={this.procedureChartId} id="procedureId" className={Style.procedureChartClass} />
        <div className={Style.downLoad} onClick={(e)=>this.download(e)}>
          <div><Icon type="download" /></div>
          <div>下载</div>
        </div>
      </div>
    );
  }
}

