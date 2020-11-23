import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import styles from './index.less';
import FontSizeEchart from '../../../ProductView/fontSizeEchart';


class AreaEchart1 extends Component {

  constructor(props) {
    super(props);
    this.chartDom = React.createRef();
    this.state = {
      chartData: null,
    };
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const { chartData } = nextProps;
    if (chartData && chartData !== prevState.chartData) {
      return {
        chartData,
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


  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };


  createChart=(chartData)=>{
    if(!chartData){return null}
    if(!chartData.chartX){return null}
    // console.log("全部产品合计地域分布图");
    // console.log(chartData);
    const color=["#61B6DA"];
    const fontsize=FontSizeEchart();
    const {titleSize,titleWeight, titleFamily,xAxisSize, yAxisSize, tooltipSize,legendSize}=fontsize;
    // const NewChartData={
    //   title:"全部产品合计地域分布图",
    //   unit:"户",
    //   yName:"单位：户",
    //   xName:"省市",
    //   chartX:["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "山东", "河南", "上海", "江苏", "浙江", "安徽",
    //     "福建", "江西", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆"],
    //   chart:["820", "932", "901", "934", "1290", "1330", "1320","1100","1001","1021","820", "932", "901", "934", "1290", "1330",
    //     "820", '932', '901', '934', '1290', '1330', '1320','1100','1001','1021','820', '932', '901', '934', '1290'],
    //   example:['出账用户数',"发展真实录平均值"],
    //   average:"870",
    // };
    const {title,unit,chartX,chart,example,yName,xName}=chartData;
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
        top:10,
        left:5,
        textStyle:{
          color:"#999999",
          fontSize:legendSize
        },
        data:example,
      },
      tooltip: {
        trigger: "axis",
        show: true,
        confine:true, // 限制在图标区域内
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
          params.forEach((par,) => {
            if (par.axisDim === "x") {
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${ par.data.normalData==="-" ? '': par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
      },
      grid: {
        left:  gridLeft,
        top: 80,
        right: 70,
        bottom: 50,
      },
      xAxis:{
        name:xName,
        type: 'category',
        axisLine:{show:false, // x轴坐标轴线不展示
        },
        axisTick:{show:false, // x轴坐标刻度不展示
        },
        axisLabel: {
          fontFamily: "Microsoft YaHei",
          textStyle: {fontSize:xAxisSize},
        },
        data:chartX,
      },
      yAxis: [
        {
          type: 'value',
          splitNumber:3,
          // show:false,
          name:yName || unit,
          textStyle: {fontSize:yAxisSize},
          splitLine:{
            show:false, // x轴分割线展示
          },
          axisLine:{
            show:false, // x轴坐标轴线不展示
          },
          axisTick:{
            show:false, // x轴坐标刻度不展示
          },
          axisLabel:{
            show:true, // x轴坐标标签展示
            fontSize:yAxisSize,
          },

        },
        {
          type: 'value',
          show:false,
          textStyle: {fontSize:yAxisSize},
          splitLine:{
            show:false, // x轴分割线展示
          },
          axisLine:{
            show:false, // x轴坐标轴线不展示
          },
          axisTick:{
            show:false, // x轴坐标刻度不展示
          },
          axisLabel:{
            show:true, // x轴坐标标签展示
            fontSize:yAxisSize,
          },
          // boundaryGap: [0.2, 0.2]
        },
      ],
      series: [{
        name: example[0],
        type: 'bar',
        data:newChart,
        barWidth : 10,// 柱图宽度
        itemStyle:{
          normal:{
            color:'#4ad2ff',
            barBorderRadius:[10, 10, 10, 10],// 柱状图样

            //     formatter: '{b}\n{c}%'
          }
        },
      }]
    };
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.setOption(option);
    return null
  };

  download = (e) => {
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"barEchart");
  };

  jsonHandle=()=>{
    const {downloadData, chartData} = this.props;
    if(!chartData){return null}
    const {title,unit,example}=chartData;
    const thData=["维度",example[0]];
    const tbodyData=chartData.chartX.map((item,index)=>([item,chartData.chart[index]]));
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
    const {downloadData}=this.props;
    return (
      <div id="barEchart" className={styles.page}>
        <div ref={this.chartDom} className={styles.chart} />
        {downloadData?(
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
        ):null}
      </div>
    );
  }

}

export default AreaEchart1;

