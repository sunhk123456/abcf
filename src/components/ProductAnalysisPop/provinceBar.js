/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: productRankingTop/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/1/17/017
 */
import React, {PureComponent} from 'react';
import echarts from "echarts"


class ProvinceBar extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {provinceBarData} = this.props
    this.provinceBar(provinceBarData)
  }

  componentWillReceiveProps(nextProps) {
    const {provinceBarData} = nextProps
    this.provinceBar(provinceBarData)
  }

// 处理数据格式
  formatData=(data)=> {
    const dataA = data.replace(/,/g, "");
    return dataA;
  }

  provinceBar=(data)=>{
    const myChart = echarts.init(document.getElementById("provinceBar"));
    console.log(data)
    const {example} = data;
    const {unit} = data;
    const {chartX} = data
    let {chart} = data
    chart=chart.map((item)=>{
      const chartItem= this.formatData(item)
      return chartItem
    })
    myChart.setOption({
      title: {
        text: '地域分布图',
        x: 'center',
        top: '5%',
        textStyle: {
          color: '#333333',
          fontSize: 14,
          fontFamily: 'Microsoft YaHei',
          fontWeight: '400'
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (param) => `${param[0].name}<br/>${param[0].marker}${example}:${data.chart[param[0].dataIndex]}${unit}`,
        textStyle: {
          fontSize: 12
        },
        axisPointer: {
          type: 'line',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        left: '3%',
        bottom: '3%',
        right:'1%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,// 不显示刻度
        },
        axisLabel: {
          interval: 0,// 强制显示x轴所有标签
          color: '#999999',// 设置标签颜色
          formatter: (param) => param.split("").join("\n")
        },
        data: chartX,
      },
      yAxis: {
        axisTick: {
          show: false,// 不显示刻度
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#999999',
        }
      },
      series: [
        {
          name: data.example[0],
          type: 'bar',
          width:"100%",
          height:"100%",
          data: chart,
          barWidth: 5,// 柱图宽度
          barCateGoryGap:"120%",
          itemStyle: {
            normal: {
              color: '#4ad2ff',
              barBorderRadius: [10, 10, 10, 10],// 柱状图样
            }
          },
        }
      ]
    })
    myChart.resize();
  }


  render() {
    const {divWidth,divHeight}=this.props
    return <div id="provinceBar" style={{width:divWidth,height:divHeight}} />
  }
}

export default ProvinceBar;
