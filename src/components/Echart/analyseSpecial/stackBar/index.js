import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon } from 'antd';
import DownloadFile from "@/utils/downloadFile"
import styles from './index.less';
import FontSizeEchart from '../../../ProductView/fontSizeEchart';


class StackBar extends Component {

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

  // 渲染echart
  createChart = (data) => {
    // const data={
    //   "title":"柱形堆积图",
    //   "chartX": ["2019年1月", "2019年02月",],
    //   "chart": [
    //   {
    //     name:'邮件营销',
    //     data:[ 230, 210],
    //     "unit":"%"
    //   },
    //   {
    //     name:'联盟广告',
    //     data:[ 330, 310],
    //     "unit":"%"
    //   },
    //   {
    //     name:'邮件营销1',
    //     data:[ 230, 210],
    //     "unit":"%"
    //   },
    //   {
    //     name:'联盟广告1',
    //     data:[ 330, 310],
    //     "unit":"%"
    //
    //   },
    //
    // ],
    //   "example": ["邮件营销","联盟广告","邮件营销1","联盟广告1"],
    // };
    if (!data) {
      return null;
    }
    if (!data.chartX) {
      return null;
    }
    const color = ['#FDB984', '#D47279', '#B6A3DC', '#59B0ED'];
    const fontsize = FontSizeEchart();
    const { titleSize, titleWeight, titleFamily, xAxisSize, yAxisSize, tooltipSize, legendSize } = fontsize;
    const newChart = data.chart.map((item) => (
      {
        'name': item.name,
        'value': item.data.map(
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
    const seriesData = newChart.map((item) =>
      ({
        name: item.name,
        data: item.value,
        stack: 'one',
        type: 'bar',
      }),
    );
    const chartXData = data.chartX;
    const legendData = data.example;
    const { title } = data;
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
        top: 60,
        left: '10%',
        right: '10%',
        bottom: 60,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        confine:true, // 限制在图标区域内
        show: true,
        textStyle: {
          fontSize: tooltipSize,
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
              showTip += `${par.marker} ${par.seriesName} : ${par.data.normalData}  ${par.data.normalData === '-' ? '' : par.data.unit}  <br/>`;
            }
          });
          return `${params[0].axisValue} <br/> ${showTip}`;
        },
      },
      legend: {
        data: legendData,
        textStyle: {
          color: '#999999',
          fontSize: legendSize,
        },
        orient: 'horizontal',
        selectedMode: false,// 图例不可点击
        x: 'center',
        y: 'bottom',
        padding: [1, 0, 5, 0],
      },
      xAxis: {
        type: 'category',
        data: chartXData,
        axisLine: {
          show: true, // x轴坐标轴线不展示
          lineStyle: {
            color: '#2F9DD4',
          },
        },
        axisTick: {
          show: false, // x轴坐标刻度不展示
        },
        axisLabel: {
          textStyle: { fontSize: xAxisSize },
          color: '#333',
        },
      },
      yAxis: {
        type: 'value',
        splitNumber:3,
        textStyle: { fontSize: yAxisSize },
        splitLine: {
          show: false, // y轴分割线展示
        },
        axisLine: {
          show: true, // y轴坐标轴线不展示
          lineStyle: {
            color: '#2F9DD4',
          },
        },
        axisTick: {
          show: false, // y轴坐标刻度不展示
        },
        axisLabel: {
          show: true, // y轴坐标标签展示
          fontSize: yAxisSize,
          color: '#333',
        },
      },
      series: seriesData,
    };

    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.setOption(option);

    return null;
  };

  download = (e) => {
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"stackBar");
  };

  jsonHandle=()=>{
    const {downloadData, chartData} = this.props;
    if(!chartData){return null}
    if(!chartData.chart){return null}
    const thData=chartData.chartX;
    const tbodyData=chartData.chart.map((item)=>([item.name,...item.data]));
    const {title}=chartData;
    const {unit}=chartData.chart[0];
    const conditionValue=[];
    downloadData.condition.forEach((item)=>{
      conditionValue.push([item.key,...item.value])
    });
    const {specialName}=downloadData;
    const condition = {
      name: title,
      value: [
        ["专题名称:", specialName, unit],
        ["筛选条件:"],
        ...conditionValue,
      ],
    };
    const table = {
      title: [
        ["维度",...thData]
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
      <div id="stackBar" className={styles.page}>
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

export default StackBar;

