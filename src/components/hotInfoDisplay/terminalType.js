/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 5G终端类型分布图表 </p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  caoruining
 * @date 2019/12/11
 */

/** 所需的各种资源 * */
import React, {PureComponent} from 'react';
// import {connect} from "dva";
import echarts from 'echarts';
// import cs from 'classnames'
import {Icon} from "antd"; // 下载封装方法
import isEqual from "lodash/isEqual";
import styles from './terminalType.less'
import DownloadFile from "@/utils/downloadFile";
import FontSizeEchart from '../ProductView/fontSizeEchart';

  /** 组件 * */
class TerminalType extends PureComponent {

  // static defaultProps = {
  //   downloadData:{
  //     specialName:"xxx-xx",
  //     conditionValue: [
  //       ["name", "value"],
  //     ],
  //   },
  //   chartData: {
  //     title:"5G终端类型分布",
  //     describe:"移根据从9月1日开始正式采集预装客户端的上报数据统计",
  //     chartX:[],
  //     chart:[
  //       {
  //         name:"",
  //         value:[
  //           {value:50, name:'水货'},
  //           {value:50, name:'行货'}
  //         ],
  //         unit:"%",
  //       },
  //     ]
  //   },
  // };

  constructor(props) {
    super(props);
    this.chartDom=React.createRef();
    this.state = {
      changeTitle:{
        text: '',
        subtext: ''
      },
      i: 0,
      colorI : 0,
    }
  }

  /** react生命周期 - 组件初始化完毕DOM挂载完毕后 触发1次 * */
  componentDidMount() {
    const { chartData } = this.props;
    if(chartData){
      this.createChart(chartData);
      this.timer = setInterval(() => {
        this.changeTitle()
      }, 3000);
    }
  }

  componentDidUpdate(prevProps) {
    const { chartData } = this.props;
    if (chartData && !isEqual(chartData, prevProps.chartData)) {
      this.createChart(chartData);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }


  changeTitle = ()=>{
    const { i } = this.state;
    const { chartData } = this.props;
    if(!chartData||!chartData.chart){return false}
    if (chartData.chart[0].value.indexOf("-") > -1){
      this.setState({
        changeTitle : {
          text: '',
          subtext: ''
        },
        i: 0,
        colorI : 0,
      })
    } else {
      const data = chartData.chart[0].value;
      const xData = chartData.chartX;
      // 计算出数据总数sum求百分比用
      const numArray = data.map(item => parseInt(item.replace(/,/g,""), 10));
// eslint-disable-next-line no-eval
      const sum = eval(numArray.join("+"));
      // 处理要循环展示的数据
      const cycleArray = [];
      xData.forEach((item,index) =>{
        cycleArray.push({
          name: item,
          value: numArray[index]
        })
      });
      // 定时器循环展示
      // console.log(i);
      cycleArray.forEach((item,index) =>{
        if(i === index && i < cycleArray.length-1){
          this.setState({
            changeTitle : {
              text: `${Math.round(item.value / sum * 10000) / 100.00}%`,
              subtext: item.name
            },
            i: i+1,
            colorI : i,
          })
        } else if(i === index && i === cycleArray.length-1){
          this.setState({
            changeTitle : {
              text: `${Math.round(item.value / sum * 10000) / 100.00}%`,
              subtext: item.name
            },
            i: 0,
            colorI : i,
          })
        }
      })
    }
    return null
  };

    /**
     * 刻画饼图所需的数据格式类型
     * @param nameArray,名称数组
     * @param valueArray,值数组
     * @returns {XML},返回需要的数组格式
     */
    createPieData=(nameArray,valueArray,unit)=>{
      const pieData =[];
      nameArray.forEach((item)=>{
        pieData.push({
          name:item,
          unit
        })
      })
      valueArray.forEach((item,index)=>{
        pieData[index].value=this.formatData(item);
        pieData[index].originalValue=item;
      })
      return pieData;
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
    const { color, chartData } = this.props;
    const fontsize = FontSizeEchart();
    if (!data) {
      return null;
    }
    if (!data.chartX) {
      return null;
    }
    const option = {
      title : {
        text: data.title,
        left: 3,
        top: 10,
        textStyle: {
          fontSize: fontsize.titleSize,
          // color: "#000000a6", // 主标题文字颜色
          fontWeight: fontsize.titleWeight,
          fontFamily: fontsize.titleFamily
        }
      },
      grid: {
        top: "22%",
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      color,
      animation: false,
      tooltip: {
        trigger: 'item',
        formatter(params) {
          return `${params.marker}${params.name}:${params.data.originalValue}${params.data.unit}`;
        },
        textStyle:{
          fontSize:fontsize.tooltipSize
        }
      },
      legend: {
        selectedMode: false,
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        data: data.chartX
      },
      series: [{
        type: 'pie',
        data: this.createPieData(chartData.chartX,chartData.chart[0].value,chartData.chart[0].unit),
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          }
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
      }],
    };

    const myChart = echarts.init(this.chartDom.current);
    myChart.clear();
    myChart.resize();
    myChart.setOption(option);

    this.changeTitle();

    return null;
  };

  // 下载方法
  download(e) {
    const { downloadData } = this.props;
    const { echartId } = this.props;
    e.stopPropagation();
    const { chartData : { chart ,chartX , title } } = this.props;
    const { unit } = chart[0];
    const{specialName, conditionValue}=downloadData;
    const downloadValue = chart[0].value.map((item,index)=>([chartX[index],item]));
    const newDownloadData={
      fileName:`${specialName}--${title}`,
      condition:{
        name: `${title}`,
        value: [
          ["专题名称:", specialName, unit],
          ...conditionValue
        ],
      },
      table:{
        title: [
          ['名称', '数值'],
        ],
        value: downloadValue
      }
    };
    DownloadFile(newDownloadData, echartId);

  };




  render() {
    const { changeTitle, colorI } = this.state;
    const { echartId, downloadData }= this.props;
    return (
      <div className={styles.outer} id={echartId}>
        <div ref={this.chartDom} className={styles.chart} />
        <div className={styles.middleTitle}>
          {colorI === 0 &&
          <div className={`${styles.percent0} ${styles.percent}`}>{changeTitle.text}</div>
          }
          {colorI === 1 &&
          <div className={`${styles.percent1} ${styles.percent}`}>{changeTitle.text}</div>
          }
          {colorI === 2 &&
          <div className={`${styles.percent2} ${styles.percent}`}>{changeTitle.text}</div>
          }
          {colorI === 3 &&
          <div className={`${styles.percent3} ${styles.percent}`}>{changeTitle.text}</div>
          }
          {colorI === 4 &&
          <div className={`${styles.percent4} ${styles.percent}`}>{changeTitle.text}</div>
          }
          {colorI === 5 &&
          <div className={`${styles.percent5} ${styles.percent}`}>{changeTitle.text}</div>
          }
          {colorI === 6 &&
          <div className={`${styles.percent6} ${styles.percent}`}>{changeTitle.text}</div>
          }
          {colorI === 7 &&
          <div className={`${styles.percent7} ${styles.percent}`}>{changeTitle.text}</div>
          }
          {colorI === 8 &&
          <div className={`${styles.percent8} ${styles.percent}`}>{changeTitle.text}</div>
          }
          {colorI === 9 &&
          <div className={`${styles.percent9} ${styles.percent}`}>{changeTitle.text}</div>
          }
          <div className={styles.name}>{changeTitle.subtext}</div>
        </div>
        {downloadData &&
        <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
          <div><Icon type="download" /></div>
          <div>下载</div>
        </div>
        }
      </div>
    );
  }
}

export default TerminalType;
