import React, { Component } from 'react';
import echarts from 'echarts';
import styles from './index.less';
import FontSizeEchart from '../../../ProductView/fontSizeEchart';
const fontsize = FontSizeEchart();
class treeMapAndBar extends Component {

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
    if (chartData && Object.keys(chartData).length > 0) {
      if(chartData.isBar === "false"){
        this.createTreeMap(this.treeMapData(chartData));
      }else {
        this.createBar(chartData);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { chartData } = this.state;
    if (chartData && Object.keys(chartData).length > 0 && chartData !== prevState.chartData) {
      if(chartData.isBar === "false"){
        this.createTreeMap(this.treeMapData(chartData));
      }else {
        this.createBar(chartData);
      }

    }
  }

  // 处理数据格式
  formatData = ((data,type="0") => {
    if(data === "-"){
      if(type === "0"){
        return 0;
      }else {
        return data;
      }

    }
    return parseFloat(data.toString().replace(/,/g, ""));
  });

  // 渲染echart
  createTreeMap = (chartData) => {
    const { title, unit, treeChart } = chartData;
    const color = ['#8DC9EB', '#A5D3BC', '#CFE7D1', '#AFD3F3', '#9DBAE6', '#F08EAB', '#F0AC93', '#E07E7E', '#F4CFD0', '#EEB8B7'];
    const { titleSize, titleWeight, titleFamily, tooltipSize } = fontsize;
    const seriesData = treeChart.map((item) => (
      {
        'name': item.name,
        'value': this.formatData(item.value),
        'normalData': item,
      }
    ));
    const option = {
      'color': color, // 柱状图颜色
      title: {
        text: title,
        top: 5,
        x: 'center',
        textStyle: {
          fontSize: titleSize,
          fontWeight: titleWeight,
          fontFamily: titleFamily,
          textAlign: 'center',
        },
      },
      grid: {
        top: "20%",
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
            const formatterValue = param.data.normalData.dataValue;
            if (param.data.normalData.value !== '-') {
              return `${param.name}: <br/> 维值: ${formatterValue} ${unit}  <br/> 占比: ${param.data.value}%`;
            }
            return `${param.name}:<br/> ${formatterValue}`;
          }
          return null;
        }
      },
      series:{
        type: 'treemap',
        roam: false,
        nodeClick: false,
        breadcrumb: {
          show: false,
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        data:seriesData,
        label: {
          show: true,
          formatter: (param) =>{
            const arrName = [];
            arrName.push(param.name)
            arrName.push(`${param.value}%`)
            return arrName.join('\n');
          }
        },
      },
    };

    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.setOption(option);
    return null;
  };

  /**
   * @date: 2019/9/3
   * @author 风信子
   * @Description: 处理矩形树图
   * @method treeMapData
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  treeMapData(payload){
    const {chart,chartX, isBar, title, unit} = payload;
    const total = chart.reduce((a,b)=> this.formatData(a) + this.formatData(b))
    const treeChart = chart.map((item,index) => ({
      name: chartX[index],
      value:  ((this.formatData(item)/total)*100).toFixed(2),
      dataValue: item
    }));
    return {
      title,
      treeChart,
      isBar,
      unit
    }
  }

  createBar(chartData){
    const {example, chartX, chart, unit, title} = chartData;
    const { legendSize, tooltipSize, titleSize} = fontsize;
    const total = chart.reduce((a,b)=> this.formatData(a) + this.formatData(b));
    const color = ['#8DC9EB', '#A5D3BC', '#CFE7D1', '#AFD3F3', '#9DBAE6', '#F08EAB', '#F0AC93', '#E07E7E', '#F4CFD0', '#EEB8B7'];
    const seriesData = chart.map((item,index) => {
      const value = this.formatData(item);
      return {
        name: example[index],
        itemStyle: {
          color: color[index%10]
        },
        value:this.formatData(item,"-"),
        percent: (((value/total)*100).toFixed(2)).toString().slice(0,5),
      }
    });
    const option = {
      title: {
        text: title,
        left: "center",
        top: 5,
        textStyle: {
          fontSize: titleSize,
          color: "#333333", // 主标题文字颜色
          fontWeight: "normal",
          fontFamily: "Microsoft YaHei"
        }
      },
      legend: {
        show:false,
      },
      color,
      grid: {
        // top: 70,
        // bottom: 10,
        // left: "10%",
        // right: "10%"
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        textStyle:{
          fontSize: tooltipSize
        },
        formatter: (param) => {
          const {data, name} = param[0];
          const formatterValue = data.value;
          if (formatterValue !== '-') {
            return `${name}: <br/> 维值: ${formatterValue} ${unit}  <br/> 占比: ${data.percent}%`;
          }
          return `${name}:<br/> 维值: ${formatterValue} <br/> 占比: -`;

        }
      },
      xAxis: [
        {
          type: "category",
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#CCCCCC"
            }
          },
          data: example
        }
      ],
      yAxis: [
        {
          type: "value",
          show: false
        }
      ],
      series:[{
        name: "维值",
        type: "bar",
        barWidth:20,
        data:seriesData
      }]
    };
    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.setOption(option);
  }

  render() {
    return (
      <div id="treeMap" className={styles.page}>
        <div ref={this.chartDom} className={styles.chart} />
      </div>
    );
  }

}

export default treeMapAndBar;

