/* eslint-disable no-unused-vars,prefer-destructuring,prefer-const,react/no-string-refs,react/no-unused-state */
/**
 * Created by WangJian on 2019/3/15.
 */
import React, {PureComponent} from "react"
// echarts资源
import echarts from 'echarts';
// import 'echarts/lib/chart/bar'
// 组件样式资源
import isEqual from 'lodash/isEqual';
import styles from './specialTableEmbedHistogram.less';

class EmbedHistogram extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      themeColor:'#C91717'       // 本组建中需要改变的主题颜色
    }
  }

  componentDidMount() {
    const {data}=this.props;
    this.renderHistogram(data,'#C91717');
  }

  componentDidUpdate(prevProps){
    const {data} = this.props;
    // console.log("eeeeeee");
    // console.log(prevProps.data,data)
    if (!isEqual(prevProps.data,data)) {
      this.renderHistogram(data, '#C91717');
    }
  }

  componentWillUnmount(){
    let embedHistogram = echarts.getInstanceByDom(this.refs.embedHistogram);
    embedHistogram.clear();
    embedHistogram.dispose();
  }

  renderHistogram(data,thColor) {
    const {xData, value} = data;
    let themeColor='#C91717';
    let option = {
      animation: false,
      grid: {
        x: 0,
        y: 0,
        width: 35,
        height: 25,
        borderWidth: 0
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          data: xData
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
          type: 'bar',
          data: value,
          clickable: false,
          legendHoverLink: false,
          barWidth: 3,
          barMaxWidth: 3,
          itemStyle: {
            color: themeColor
          }

        }
      ]
    };
    let embedHistogram = echarts.init(this.refs.embedHistogram);
    embedHistogram.clear();
    embedHistogram.setOption(option);
    window.onresize = embedHistogram.resize;
  }

  render() {
    // console.log("99999999999");
    return (
      <div className={styles.embedHistogram} ref="embedHistogram" />
    );
  }
}

export default EmbedHistogram;

