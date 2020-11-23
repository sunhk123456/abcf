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


class ProductRankingTop extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {}
  };

  componentDidMount() {
    const {productRankingTop} = this.props
    this.productBar(productRankingTop)
  }

  componentWillReceiveProps(nextProps) {
    const {productRankingTop} = nextProps
    this.productBar(productRankingTop)
  }

// 处理数据格式
  formatData=(data)=> {
    const dataA = data.replace(/,/g, "");
    return dataA;
  }

  productBar = (data) => {
    let {titleName}=this.props
    if(titleName==="合计"){
      titleName="全部产品"
    }
    const myChart = echarts.init(document.getElementById("productBarTop"));
    const {example} = data;
    const {unit} = data;
    const {chartX} = data;
    let chartXdata=chartX
     chartXdata= chartXdata.map((item)=>{
      if(item.length>3){
      return ` ${item.substring(0, 3)}...`
      }
      return item
    })
    let {chart} = data
    chart=chart.map((item)=>{
      const chartItem= this.formatData(item)
      return chartItem
    })
    myChart.setOption({
      title: {
        text: `${titleName}TOP10`,
        x: 'center',
        textStyle: {
          color: '#333333',
          fontSize: 14,
          fontFamily: 'Microsoft YaHei',
          fontWeight: '400'
        }
      },
      tooltip: {
        textStyle: {
          fontSize: 12
        },
        trigger: 'axis',
        formatter: (param) => {
          const index=param[0].dataIndex
          return `${chartX[index]}<br/>${param[0].marker}${example}:${param[0].value}${unit}`
        },
        axisPointer: {
          type: 'line',
          show: true,
          z: 1,
          lineStyle: {
            color: 'rgba(86,84,86,0.2)'
          },
        },
      },
      grid: {
        left: '2%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#ccc",
            fontSize: 12,
            interval: 0,
            rotate: '30'
          },
          data: chartXdata,

        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value'
        }
      ],
      series: [
        {
          name: data.example,
          type: 'bar',
          data: chart,
          width:"100%",
          height:"100%",
          barWidth: 8,
          barCategoryGap: '50%',
          itemStyle: {
            textOverflow: "ellipsis",
            emphasis: {
              barBorderRadius: 30
            },
            normal: {
              color:"rgb(219,107,104)",
              barBorderRadius: [10, 10, 10, 10],
            },
          },
        },
      ]
    })
    myChart.resize();
  }


  render() {
    const {divWidth,divHeight}=this.props
    return <div id="productBarTop" style={{width:divWidth,height:divHeight}} />
  }
}

export default ProductRankingTop;
