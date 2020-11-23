import React, {Component} from 'react';
import echarts from 'echarts';
import styles from './tableData.less';

class TrendChart extends Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    this.drawChart();
  }

  // 绘制折线图
  drawChart=()=>{
    const {trendData} = this.props;
    const myChart = echarts.init(document.getElementById("chart"));
    const option={
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        textStyle:{
          fontSize: window.screen.width>1870?14:12,
        },
      },
      legend: {
        formatter: '{name}',
        x: 'right',
        y: 'top',
        textStyle:{
          fontSize: window.screen.width>1870?14:12,
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel:{
          fontSize:window.screen.width>1870?14:12,
        },
        data: trendData.xData
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize:window.screen.width>1870?14:12,
          formatter: `{value}${trendData.unit}`
        }
      },
      series: trendData.seriesData
    }
    myChart.setOption(option, true);
  }

  render() {
    return(
      <div id="chart" className={styles.trendChart} style={{"overflow":"hidden"}} />
    )
  }
}

export default TrendChart;
