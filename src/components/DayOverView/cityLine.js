/* eslint-disable operator-assignment,prefer-template,no-else-return,react/no-array-index-key */
import React,{ PureComponent,Fragment} from "react";
import { connect } from "dva";
import {Icon,Tooltip} from 'antd';
import classNames from "classnames";
import echarts from "echarts";
import router from 'umi/router';
import EarlyWarning from './earlyWarning';
import iconFont from '../../icon/Icons/iconfont';
import styles from "./cityLine.less";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});
@connect(
  ({dayOverViewHeader,cityLine}) => ({
    date:dayOverViewHeader.selectedDate,
    tabId:dayOverViewHeader.tabId,
    dateType:dayOverViewHeader.dateType,
    cityLineData: cityLine.cityLineData
  })
)
 class CityLine extends PureComponent {
  constructor(props) {
    super(props);
    this.lineRef = React.createRef(); // 创建地图ref
  }

  componentDidMount(){
    const { date,tabId,dateType } = this.props;
    if(date !== "" && tabId !== ""&& dateType !== "" ){
      this.initRequest();
    }
  }

  componentDidUpdate(prevProps){
    // 账期、切换标签变化去请求
    const { date,tabId,cityLineData } = this.props;
    if(prevProps.date !== date && tabId !== "" && date !== ""){
      this.initRequest();
    }
    if(cityLineData.nationalData !== undefined && prevProps.cityLineData !== cityLineData){
      this.initLineChart();
    }
  }

  ratioDataColor =(data)=>{
    let color;
    if(data === '-'){
      // 正常灰色
      color =  'dataBlank';
    }else{
      const res = data.replace(/%/g, "").replace(/,/g,'');
      color = parseFloat(res)>=0?'dateGreen':'dataRed';
    }
    return color;
  };

  /*
  * 绘制折线图
  * */
  initLineChart=()=> {
   const {cityLineData } = this.props;
   const {echartData:{ringRatio,ringRatioUnit,ringCommon,ringCommonUnit,month}} = cityLineData;
   const line = echarts.init(this.lineRef.current); // 初始化折线图所需dom
   const lineOption = {
      color: ["#70D4D2", "A69DAE"], // 设置legend的颜色
      tooltip: {
        trigger: "axis",
        show: true,
        position: (point, params, dom, rect, size)=> {
          // 固定在顶部
          if (point[0] > size.viewSize[0] * 0.6) {
            // 防止提示框溢出外层
            return [
              point[0] - ((point[0] - size.viewSize[0] * 0.6) * 2) / 3,
              40
            ];
          }
          return [point[0], 40];
        },
        formatter: (params)=> {
          let str = "";
          params.forEach((data) => {
            let lineNum = data.value;
            if (lineNum !== "-") {
              lineNum = lineNum + (data.seriesIndex === 0 ? ringCommonUnit : ringRatioUnit);
            }
            str += data.seriesName + `：` + lineNum + `<br/>`;
          });
          return str;
        },
        axisPointer: {
          type: "shadow",
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        textStyle: {
          // fontSize: lineFontSize,
        },
        backgroundColor: "rgba(108,109,111,0.7)",
        showDelay: 0 // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
      },
      legend: {
        data: ["日均环比", "累计同比"],
        orient: "vertical",
        right: 0,
        top: 10
      },
      grid: {
        x: 5,
        y: 75,
        x2: 5,
        y2: 40,
        borderWidth: 0
      },
      xAxis: [
        {
          type: "category",
          show: true,
          boundaryGap: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#D3D4D8",
              width: 1
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          data: month
        }
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "日均环比",
          type: "line",
          smooth: false,
          symbol: "emptyCircle",
          itemStyle: {
            color: "#70D4D2",
            normal: {
              lineStyle: {
                color: "#70D4D2",
                width: 2
              },
              label: {
                show: true,
                margin: 0,
                formatter: "{c}%",
                position: "top",
                textStyle: {
                  // red:'#857657',
                  color: "#70D4D2",
                  fontFamily: "Microsoft YaHei",
                  fontWeight: 400
                  // fontSize: lineFontSize
                }
              },
              emphasis: {
                color: "#70D4D2"
              }
            }
          },
          data: ringRatio
        },
        {
          name: "累计同比",
          type: "line",
          smooth: false,
          symbol: "emptyCircle",
          itemStyle: {
            normal: {
              color: "#A69DAE",
              lineStyle: {
                color: "#A69DAE",
                width: 2
              },
              label: {
                show: true,
                margin: 0,
                formatter: "{c}%",
                position: "top",
                textStyle: {
                  // red:'#857657',
                  color: "#A69DAE",
                  fontFamily: "Microsoft YaHei",
                  fontWeight: 400
                  // fontSize: lineFontSize
                }
              }
            },
            emphasis: {
              color: "#A69DAE"
            }
          },
          data: ringCommon
        }
      ]
    };

    line.setOption(lineOption);
  };

  /*
 * 请求总入口
 * */
  initRequest=()=> {
    const { dispatch,date,tabId,dateType} = this.props;
    dispatch({
      type:"cityLine/fetchLineChart",
      payload:{
        date,
        tabId,
        dateType
      }
    });
  };


  /**
   * 跳转到新专题页面
   */
  goToThemePage =()=>{
    const {dispatch,date} = this.props;
    dispatch({
      type:'cityLine/fetchSpecialAuthentication',
      payload:{
        specialId: "subject_basic_total"
      }
    }).then((res)=>{
      if (res.haveAuthority === "true"){
        router.push({
          pathname: '/themeAnalysis',
          date,
        })
      } else {
        alert("本用户没有访问该专题权限！")
      }
    });
  };


  render() {
    const {cityLineData,tabId} = this.props;
    let widthDiv;
    let isShow;
    if (tabId !== "TAB_101"){
      widthDiv = "100%";
      isShow = "none";
    }
    if (JSON.stringify(cityLineData) !== "{}") {
      const {nationalData,showEarlyWarning,warningLevel,desc,showException,excepDiscription} = cityLineData;
      const textValueDom = nationalData.map((data, index) => {
        let spanDom = "";
        let nameValueContent = "";
        if (index === 0) {
          // const showEarlyWarning = "1";
          // const desc = "测试测试测试测试测试测试测试测试测试";
          // const warningLevel = "一级";
          const warning = showEarlyWarning === "0" || showEarlyWarning === undefined ?null:<EarlyWarning warningLevel={warningLevel} desc={desc} />;
          const totalValue = showEarlyWarning === "0"|| showEarlyWarning === undefined?
            <span className={classNames(styles.totalValueRight)}>{data.value}</span>:
            <Tooltip placement="bottom" title={warning} overlayClassName={styles.warningTip}>
              <span>{data.value}</span>
              <IconFont className={styles.starIcon} type="icon-jiufuqianbaoicon14" />
            </Tooltip>
          nameValueContent = "nameValueContent0";
          spanDom = (
            <span className={styles.value}>
              {totalValue}
              <i className={styles.valueUnit}>{data.unit}</i>
            </span>
          );
        } else {
          nameValueContent = "nameValueContent1";
          const colorStyle = this.ratioDataColor(data.value);
          spanDom = (
            <span className={classNames(styles.value, styles[colorStyle])}>
              {data.value + data.unit}
            </span>
          );
        }
        return (
          <div key={index} className={styles[nameValueContent]}>
            <span className={styles.name}>{data.name}</span>
            {spanDom}
          </div>
        );
      });
      // const showException = "1";
      // const excepDiscription = "测试测试测试测试测试测试测试测试测试";
      const exception = showException === "0" || showException=== undefined? null : <Tooltip placement="bottomLeft" title={excepDiscription} overlayClassName={styles.earlyTip} className={styles.early}><Icon type="exclamation-circle" theme="filled" style={{color:"#D44545"}} /></Tooltip>;
      return (
        <Fragment>
          <div className={styles.cityLine} style={{width:widthDiv}}>
            <div className={styles.cityLineCon}>
              <div className={styles.titleContent}>
                <span className={styles.titleName}>
                  {exception}
                  {cityLineData.titleData}
                </span>
              </div>
              <div className={styles.textValue}>{textValueDom}</div>
              <div ref={this.lineRef} className={styles.lineChart} />
            </div>
          </div>
          <div className={styles.fenxi} style={{display:isShow}}>
            <div className={styles.fenxiSpann} onClick={()=>this.goToThemePage()}>计费收入分析专题&gt;&gt;</div>
          </div>
        </Fragment>
      )
    } else {
      return null;
    }
  }
}
export default CityLine;
