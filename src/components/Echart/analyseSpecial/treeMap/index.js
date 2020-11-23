import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import styles from './index.less';
import FontSizeEchart from '../../../ProductView/fontSizeEchart';


class TreeMap extends Component {

  static defaultProps = {
    // colors:['#DB6B68', '#8EC1A9', '#74A274', '#769A9F', '#E87E58', '#F29E4C', '#E59D89', '#EDDC7E', '#75B9BB']
    colors:['#8DC9EB', '#A5D3BC', '#CFE7D1', '#AFD3F3', '#9DBAE6', '#F08EAB', '#F0AC93', '#E07E7E', '#F4CFD0', '#EEB8B7'],
    titlePosition:'left'
  };

  constructor(props) {
    super(props);
    this.chartDom = React.createRef();
    this.state = {
      chartData: null,
     // legendData:[],
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

  componentWillUnmount() {
    // const{resize}=this.props;
    // if(resize){
    //   console.log(222)
    //   document.getElementById("homeViewTreeMap").removeEventListener('onresize', () => {});
    // }
  }

  // 处理数据格式
  formatData = ((data) => parseFloat(data.toString().replace(/,/g, "")));

  sumValue = (arr) =>arr.reduce((prev, curr)=>prev + curr);

  // 渲染echart
  createChart = (chartData) => {
    const {markType,fromHotInfo,colors,resize,titlePosition} = this.props;
    if (!chartData) {
      return null;
    }
    if (!chartData.treeChart) {
      return null;
    }

    // const chartData1={
    //   "title":"树形图",
    //   "treeChart": [
    //   {
    //     "id": "1",
    //     "name": "6M≤速率<18M",
    //     "value": "2001",
    //     'example': "[10,20]"
    // },
    //   {
    //     "id": "2",
    //     "name": "4M≤速率<10M ",
    //     "value": "8,001",
    //     'example': "[30,20]"
    //   },
    //   {
    //     "id": "3",
    //     "name": "1M≤速率<4M ",
    //     "value": "5001",
    //     'example': "[40,20]"
    //   }
    // ],
    //   "itemName": "当期值",
    //   "unit": "万元"
    // };

    // this.setState({
    //   legendData:chartData.treeChart
    // });

    let color = colors;
    let seriesPosition = {
      top: 50,
      left: '10%',
      right: '10%',
      bottom: 50,
    }
    if(markType === "channelView"){
      color = ['#DB6B68', '#8EC1A9', '#74A274', '#769A9F', '#E87E58', '#F29E4C', '#E59D89', '#EDDC7E', '#75B9BB'];
      seriesPosition = {
        top: "middle",
        left: 'center',
        right: 'auto',
        bottom: "auto",
      }
    }
    const fontsize = FontSizeEchart();
    const { titleSize, titleWeight, titleFamily, tooltipSize } = fontsize;
    const totleValue = chartData.treeChart.length>0?this.sumValue(chartData.treeChart.map((item)=>item.value==="-"?0:this.formatData(item.value))):0;
    const seriesData = chartData.treeChart.map((item) => (
      {
        'name': item.name,
        'value': this.formatData(item.value),
        'normalData': item,
        'proportionData': item.value==="-"?0:(((this.formatData(item.value)/totleValue)*100).toFixed(2)),
      }
    ));
    const { title } = chartData;
    const option = {
      'color': color, // 柱状图颜色
      title: fromHotInfo?
        {
          text: chartData.title,
          x: titlePosition,
          top: 10,
          textStyle: {
            fontSize: titleSize,
            // color: "#000000a6", // 主标题文字颜色
            fontWeight: titleWeight,
            fontFamily: titleFamily
          }
        }
        :
        {
        text: title,
        top: 5,
        x: titlePosition,
        textStyle: {
          fontSize: titleSize,
          fontWeight: titleWeight,
          fontFamily: titleFamily,
          textAlign: 'center',
        },
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      tooltip: {
        show: true,
        textStyle: {
          fontSize: tooltipSize,
        },
        axisPointer: {
          lineStyle: {
            color: 'rgba(86,84,86,0.2)',
          },
        },
        formatter: (param) => {
          if(param.name){
            let formatterValue = param.data.normalData.value;
            if(markType === "channelView"){
              formatterValue = param.data.normalData.dataValue;
            }
            if (param.data.normalData.value !== '-') {
              return `${param.name}  : ${formatterValue}  ${chartData.unit}<br/> 占比：${param.data.proportionData}%`;
            }
            return `${param.name}  :  ${formatterValue}`;
          }
          return null;
        }
      },

      series:{
        top: seriesPosition.top,
        left: seriesPosition.left,
        right: seriesPosition.right,
        bottom: seriesPosition.bottom,
        type: 'treemap',
        roam: false,
        nodeClick: false,
        breadcrumb: {
          show: false,
        },
        data:seriesData,
        label: {
          show: true,
          // position: 'insideTopLeft',
          // offset: [5, 5],
          formatter: (param) =>{
            const arrName = [];
            arrName.push(param.name)
            if(markType === "channelView"){
              arrName.push(`${param.value}%`)
            }
            return arrName.join('\n');
          }
        },
        itemStyle: {
          normal: {
            show: true,
            gapWidth:6,
          },
        },
      },
    };

    const myChart = echarts.init(this.chartDom.current);
    // 检测屏幕宽度发生变化时,重新渲染
    myChart.clear();
    myChart.resize();
    // document.getElementById('homeViewResize').removeAttribute('_echarts_instance_');
    myChart.setOption(option);
    window.onresize=myChart.resize;
    if(resize){
      // document.getElementById("homeViewTreeMap").addEventListener('onresize', () => {
      //   console.log(111)
      //   myChart.resize();
      // });
    }

    return null;
  };

  download = (e) => {
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"treeMap");
  };


  jsonHandle=()=>{
    const {downloadData, chartData ,newCondition} = this.props;
    if(!chartData){return null}
    if(!chartData.treeChart){return null}
    const totleValue = chartData.treeChart.length>0?this.sumValue(chartData.treeChart.map((item)=>item.value==="-"?0:this.formatData(item.value))):0;
    const seriesData = chartData.treeChart.map((item) => (
      {
        'name': item.name,
        'value': this.formatData(item.value),
        'normalData': item,
        'proportionData': item.value==="-"?"0%":`${(((this.formatData(item.value)/totleValue)*100).toFixed(2))}%`,
      }
    ));
    const {title,unit,itemName="数据"}=chartData;
    const thData=["维度",itemName,"占比"];
    const tbodyData=seriesData.map((item)=>([item.name,item.value,item.proportionData]));
    let  {conditionValue}=downloadData;
    if(!newCondition){
      conditionValue=[];
      downloadData.condition.forEach((item)=>{
        conditionValue.push([item.key,...item.value])
      });
    }

    const {specialName}=downloadData;
    const condition = {
      name: `${title}`,
      value: [
        ["专题名称:", specialName, `单位：${unit}`],
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
    const {downloadData,backGroundColor}=this.props;
    // const {legendData}=this.state;
    // const fontsize = FontSizeEchart();
    // const { legendSize } = fontsize;
    // const legendColor = ['#DB6B68', '#8EC1A9', '#74A274', '#769A9F', '#E87E58', '#F29E4C', '#E59D89', '#EDDC7E', '#75B9BB'];
    // const legendLayOut=legendData.map((item,index)=>{
    //   const itemColor = legendColor[index % 9];
    //   return(
    //     <div key={item.example} className={styles.item}>
    //       <span className={styles.img} style={{ backgroundColor: itemColor }} />
    //       <span className={styles.name} style={{ fontSize: legendSize }}>{item.example}</span>
    //     </div>)
    // })
    return (
      <div id="treeMap" className={styles.page} style={{background:backGroundColor||'#fff'}}>
        <div id="homeViewResize" ref={this.chartDom} className={styles.chart} />
        {/* <div className={styles.legend}> */}
        {/* {legendLayOut} */}
        {/* </div> */}
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

export default TreeMap;

