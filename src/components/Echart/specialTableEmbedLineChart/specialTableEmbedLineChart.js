/* eslint-disable prefer-const,no-plusplus,no-unused-vars,prefer-destructuring,react/no-string-refs */
/**
 * Created by WangJian on 2019/3/15.
 * 迁移专题报告表格中的折线图
 */
import React, {Component} from "react"
// echarts资源
import echarts from 'echarts';
// import 'echarts/lib/chart/line';
// 组件样式资源
import isEqual from 'lodash/isEqual';
import styles from './specialTableEmbedLineChart.less';


export default class EmbedLineChart extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  componentDidMount() {
    const {data}=this.props;
    this.renderChart(data,'#C91717');
  }

  componentDidUpdate(prevProps){
    const {data} = this.props;
    if (!isEqual(prevProps.data,data)) {
      this.renderChart(data, '#C91717');
    }
  }

  componentWillUnmount(){
    let embedLineChart = echarts.getInstanceByDom(this.refs.embedLineChart);
  }


  renderChart(data, thColor){
    const {xData, value} = data;
    // if(value!==undefined&&value.length>0){
    //   for (let i=0;i<value.length;i++){
    //     if(i!==value.length-1){
    //       newValue.push({value: value[i], symbol: 'none'});
    //     }else {
    //       newValue.push({value: value[i], symbol: 'circle', symbolSize: 100});
    //     }
    //   }
    // }
    // console.info("!!!!!!!!!!!"+JSON.stringify(newValue))
    let option = {
      // renderAsImage:true,
      animation: false,
      grid: {
        left:0,
        top: 7,
        width: 30,
        height: 13,
        borderWidth: 0
      },
      xAxis: [
        {
          type: 'category',
          show: false,
          data: xData
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
        }
      ],
      series: [
        {
          type: 'line',
          data: value,
          hoverAnimation:false,
          symbol: "none",
          // data: [{value:0,symbol:'none'},{value:100,symbol:'none'},{value:1000,symbol:'rect',symbolSize:1000},{value:0,symbol:'none'},{value:0,symbol:'none'},{value:0,symbol:'none'},{value:0,symbol:'circle'}],
          itemStyle: {
            normal: {
              color: thColor
            }
          }
        }
      ]
    };
    let embedLineChart = echarts.init(this.refs.embedLineChart);
    embedLineChart.clear();
    embedLineChart.setOption(option);
    window.onresize = embedLineChart.resize;
  }

  render() {
    return (
      <div className={styles.embedLineChart} ref="embedLineChart" style={{cursor:"pointer"}}>1</div>
    );
  }
}

