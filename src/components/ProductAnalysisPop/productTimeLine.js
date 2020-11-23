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


class ProductTimeLine extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {}

  };

componentDidMount() {
  const {productTimeLineData} = this.props
  this.productTimeLine(productTimeLineData)
}

componentWillReceiveProps(nextProps) {
  const {productTimeLineData} = nextProps;
  this.productTimeLine(productTimeLineData)
}

productTimeLine = (data) => {
  let {titleName}=this.props;
  if(titleName==="合计"){
    titleName="全部产品"
  }
  const myChart = echarts.init(document.getElementById("productTimeLine"));
  const color = ['#DB6B68', '#8EC1A9', '#74A274', '#769A9F', '#E87E58', '#F29E4C', '#E59D89', '#EDDC7E', '#75B9BB'];
  const {example} = data;
  const {unit} = data;
  // const {chartX}=data
  // const {chart}=data
  const originData = [];
  const myseries = data.chart.map((item, index) => {
    const temp = {};
    temp.type = 'line';
    temp.name = item.name;
    originData.push(item.data);
    const numberArr = [];
    item.data.map((value) => {
      if (typeof value === 'string' && value.constructor === String) {
        if (value.indexOf(",") !== "-1") {
          numberArr.push(parseFloat(value.replace(/,/g, '')));
        } else if (value === "-") {
          numberArr.push(value);
        } else {
          numberArr.push(value);
        }
      }
      return null
    });
    temp.data = numberArr;
    temp.stack = "总量";
    // temp.smooth = true;
    temp.itemStyle = {
      normal: {
        color: color[index % 9],
      }
    };
    temp.areaStyle = {
      normal: {
        color: color[index % 9],
      }
    };
    return temp;
  });
  // console.log("echart参数")
  // console.log("myseries")
  // console.log(myseries)
  // console.log("----")
  myChart.clear(); // xingxiaodong 2019.5.6 清除上次加载数据
  myChart.setOption({
    title: {
      text: `${titleName}时间趋势图`,
      x: 'center',
      textStyle: {
        color: '#333333',
        fontSize: 14,
        fontFamily: 'Microsoft YaHei',
        fontWeight: '400'
      }
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        fontSize: 12
      },
      formatter: (params) => {
        let showItem = "";
        params.forEach((param) => {
          showItem += `${param.marker + param.seriesName}:${example}${originData[param.seriesIndex][param.dataIndex]}${unit}<br/>`;
        });
        return `${params[0].name}<br/>${showItem}`;
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
      right: '4%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#999999',
            width: 1,
          }
        },
        axisLabel: {
          fontFamily: 'Microsoft YaHei',
          color: '#999999',
          fontSize: '12',
        },
        data: data.chartX,
        barWidth: 10,
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#999999',
            width: 1,
          }
        },
        axisLabel: {
          fontFamily: 'Microsoft YaHei',
          color: '#999999',
          fontSize: '14',
        },
        splitLine: {
          show: false
        },
      }
    ],
    series: myseries
  });
  myChart.resize();
};


render()
{
  const {divWidth,divHeight}=this.props
  return <div id="productTimeLine" style={{width:divWidth,height:divHeight}} />
}
}

export default ProductTimeLine;
