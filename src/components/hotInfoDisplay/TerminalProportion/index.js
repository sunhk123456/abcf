/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 热门信息呈现--双卡终端卡槽占比组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  ls
 * @date 2019/12/10
 */

import React from 'react';
import {Icon, Tooltip} from 'antd';
import DownloadFile from "@/utils/downloadFile"; // 下载封装方法
import echarts from 'echarts'
import isEqual from "lodash/isEqual";
import styles from './index.less'
import FontSizeEchart from '../../ProductView/fontSizeEchart';
import waSai from "../../BuildingView/pic/ganTan.png";

export default class pieEcharts extends React.Component{

  static defaultProps = {
    'dataList':{
      'title':'双卡终端卡槽占比',
      'describe':'移根据从9月1日开始正式采集预装客户端的上报数据统计',
      "chartX":["电信主卡+移动副卡","移动主卡+空卡槽卡","双电信卡","移动主卡+空卡槽","移动主卡+空卡槽卡","双电信卡","移动主卡+空卡槽","电信主卡+移动副卡","移动主卡+空卡槽卡","双电信卡","电信主卡+移动副卡","移动主卡+空卡槽卡"],
      "chart":[
        {
          "name":"电信",
          "value":["467","754","523","135","154","323","35","23","135","200","223","35"],
          "unit":"%",
        }
      ]
    }
  }

  constructor(props){
    super(props)

    this.state = {
      dataList:null, // 数据
    }

    this.pieEcharts = React.createRef();
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const { dataList } = nextProps;
    if (dataList && !isEqual(dataList, prevState.dataList)) {
      return {
        dataList,
      };
    }
    return null;
  }

  componentDidMount() {
    const { dataList } = this.state;
    this.getOption(dataList);
  }

  componentDidUpdate(prevProps, prevState) {
    const { dataList } = this.state;
    if (dataList && !isEqual(dataList, prevState.dataList)) {
      this.getOption(dataList);
    }
  }

  componentWillUnmount(){
    if(this.pieEcharts.current) {
      const myCharts = echarts.init(this.pieEcharts.current);
      myCharts.clear();
      window.removeEventListener('resize', myCharts.resize);
    }
  }

  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1 ?
        parseFloat(data.replace(/-/g, 0)):
        parseFloat(data.replace(/,/g, "").replace(/-/g, 0));
    return dataA;
  };

  // 初始化Echarts
  getOption = (dataList) => {
    if(this.pieEcharts.current && dataList.chart && dataList.chartX) {
      const myCharts = echarts.init(this.pieEcharts.current);
      const {chartX, chart} = dataList;
      let datas = []; // 新的数据格式
      let total = 0 // 数据总量
      let borderIn = ['12%', '15%'] // 内边框样式
      let borderOut = ['32%', '32%'] // 外边框样式
      const screenWidth = window.screen.width;
      if(screenWidth>1870){
         borderIn = ['20%', '25%'] // 内边框样式
         borderOut = ['48%', '48%'] // 外边框样式
      }
      for (let i = 0; i < chartX.length; i += 1) {
        const obj = {
          name: chartX[i],
          value: this.formatData(chart[0].value[i])
        }
        total += this.formatData(chart[0].value[i]);
        datas.push(obj);
      }
      if(total === 0){
        borderIn = ['0%','0%'];
        borderOut = ['0%','0%'];
        datas = [];
      }
      const fontsize = FontSizeEchart();
      const { color30 } = fontsize;
      const option = {
        color: color30,
        grid: {
          top: 100,
          bottom: 100,
        },
        tooltip: {
          formatter: `{a}：<br/>{b}: {c}${chart[0].unit}`
        },
        series: [
          // 主要展示层的
          {
            radius: screenWidth>1870?['20%', '45%']:['12%', '27%'],
            center: ['50%', '50%'],
            type: 'pie',
            label: {
              normal: {
                rich: {
                  b: {
                    align: 'center',
                    fontSize: 12,
                    fontWeight: 'normal',
                  },
                  c: {
                    align: 'center',
                    fontSize: 12,
                    fontStyle: 'normal',
                  },
                },
                show: true,
                formatter(params) {
                  return (
                    '{' +
                    `b|${params.data.name}\n` +
                    '}' +
                    '{' +
                    `c|${((params.data.value / total) * 100).toFixed(0)}%` +
                    '}'
                  );
                },
                position: 'outside'
              },
              emphasis: {
                show: true
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: screenWidth > 1300 ? 15 : 5,
                length2: screenWidth > 1300 ? 15 : 3,
              },
              emphasis: {
                show: true
              }
            },
            name: "信息统计",
            data: datas,

          },
          // 边框的设置
          {
            radius: borderIn,
            center: ['50%', '50%'],
            type: 'pie',
            silent:true,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            animation: false,
            tooltip: {
              show: false
            },
            data: [{
              value: 1,
              itemStyle: {
                color: "#ffffff4d",
              },
            }],
          }, {
            name: '外边框',
            type: 'pie',
            silent:true,
            tooltip: {
              show: false
            },
            clockWise: false, // 顺时加载
            hoverAnimation: false, // 鼠标移入变大
            center: ['50%', '50%'],
            radius: borderOut,
            label: {
              normal: {
                show: false
              }
            },
            data: [{
              value: 9,
              name: '',
              itemStyle: {
                normal: {
                  borderWidth: 2,
                  borderColor: '#DAE8F5'
                }
              }
            }]
          },
        ]
      };
      myCharts.clear();
      myCharts.setOption(option);
      window.addEventListener('resize', myCharts.resize);
    }
  }

  // 下载方法
  download(e) {
    const {echartId, downloadData} = this.props;
    const { dataList } = this.state;
    e.stopPropagation();
    const{specialName, conditionValue}=downloadData;
    const {chartX, chart, title} = dataList;
    // let total = 0;
    // for (let i = 0; i < chart[0].value.length; i += 1) {
    //   total += parseInt(chart[0].value[i],10);
    // }
    // const downloadValue=chartX.map((item,index)=>([item,`${(parseInt(chart[0].value[index],10) / total * 100).toFixed(0)}`]));
    const downloadValue=chartX.map((item,index)=>([item,chart[0].value[index]]));
    const newDownloadData={
      fileName:`${specialName}--${title}`,
      condition:{
        name: `${title}`,
        value: [
          ["专题名称:", specialName, chart[0].unit],
          ...conditionValue
        ],
      },
      table:{
        title: [
          [ '信息统计', '数值'],
        ],
        value: downloadValue
      }
    };
    DownloadFile(newDownloadData, echartId);

  };


  render(){
    const { download, echartId,addRedMark } = this.props;
    const myFontSize=FontSizeEchart();
    const { dataList } = this.state;
    const { title,chart,chartX, describe } = dataList
    return (
      <div className={styles.wrapper} id={echartId}>
        <div className={styles.title}>
          {title !== undefined?title:''}
          {
            addRedMark &&
            <Tooltip
              title='数据取自9月1日开始正式采集的预装客户端上报DM2.0数据'
              trigger='hover'
              placement='bottom'
              overlayClassName={styles.basisBarEchartToolTip}
              // defaultVisible
            >
              <img
                src={waSai}
                alt=''
                style={{height:myFontSize.titleSize,width:myFontSize.titleSize,cursor:'pointer'}}
              />
            </Tooltip>
          }
          {chart && chartX && download &&
          <div className={styles.downLoad} onClick={(e) => this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
          }
        </div>
        <div ref={this.pieEcharts} className={styles.echartsStyle} />
        { describe === '' ? '': <div className={styles.describe}><span className={styles.star}>*</span>{describe}</div>
        }
      </div>
    )
  }
}
