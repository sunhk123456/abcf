/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 5G终端NR登网情况图表 </p>
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
import DownloadFile from "@/utils/downloadFile"; // 下载封装方法
import {Icon} from "antd";
import isEqual from "lodash/isEqual";
import styles from "./terminalNRChart.less"
import FontSizeEchart from '../ProductView/fontSizeEchart';


    /** 组件 * */
class terminalNRChart extends PureComponent {

  // static defaultProps = {
  //   downloadData:{
  //     specialName:"xxx-xx",
  //     conditionValue: [
  //       ["name", "value"],
  //     ],
  //   },
  //   chartData: {
  //     title:"5G终端NR登网情况",
  //     describe:"移根据从9月1日开始正式采集预装客户端的上报数据统计",
  //     chartX:[],
  //     chart:[
  //       {
  //         name:"",
  //         value:[
  //           {value:5500, name:'联通'},
  //           {value:2750, name:'移动'},
  //           {value:2750, name:'电信'},
  //         ],
  //         unit:"次",
  //       },
  //     ]
  //   }
  // };

    constructor(props) {
      super(props);
      this.chartDom=React.createRef();
      this.state = {}
    }

    /** react生命周期 - 组件初始化完毕DOM挂载完毕后 触发1次 * */
    componentDidMount() {
      const { chartData } = this.props;
      this.createChart(chartData)
    }

  componentDidUpdate(prevProps) {
    const { chartData } = this.props;
    if (chartData && !isEqual(chartData, prevProps.chartData)) {
      this.createChart(chartData);
    }
  }

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
          orient: 'horizontal',
          right: '15%',
          top: 5,
          data: data.chartX
        },
        series: [{
          type: 'pie',
          data: this.createPieData(chartData.chartX,chartData.chart[0].value,chartData.chart[0].unit),
          center: ['50%', '50%'],
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          startAngle:270,
          label: {
            show: true,
            formatter(data1){
              return `${data1.percent.toFixed(2)}%`
            },
            color: "#333333",
            fontSize: fontsize.pietextSize,
          },
          labelLine: {
            normal: {
              show: true,
              length:20,
              length2:20
            },
          },
        }],
      };

      const myChart = echarts.init(this.chartDom.current);
      myChart.clear();
      myChart.resize();
      myChart.setOption(option);

      return null;
    };

  // 下载方法
  download(e) {
    const { downloadData } = this.props;
    const { echartId } = this.props;
    e.stopPropagation();
    const { chartData : { chart ,chartX, title } } = this.props;
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
      const { echartId, downloadData }= this.props;
      return (
        <div id={echartId} className={styles.outer}>
          <div className={styles.chart} ref={this.chartDom} />
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

export default terminalNRChart;
