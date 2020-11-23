/* eslint-disable prefer-template,react/no-array-index-key,arrow-body-style,no-else-return */
import React,{Component} from 'react';
import {connect} from 'dva';
import {Tooltip,Icon} from 'antd';
import classNames from  'classnames';
import echart from 'echarts';
import EarlyWarning from './earlyWarning';
import styles from './mixEchart.less';
import Cookie from '@/utils/cookie';
import iconFont from '../../icon/Icons/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});
@connect(({dayOverViewHeader,billingRevenue})=>({
  dateType:dayOverViewHeader.dateType,
  date:dayOverViewHeader.selectedDate,
  tabId:dayOverViewHeader.tabId,
  proId:billingRevenue.proId,
  proName:billingRevenue.proName
}))
class MixEchart extends Component{
  constructor(props){
    super(props);
    this.state = {
      mixEchartData:[],// 全部省的数据
    };
    this.lineAndBarRef = React.createRef();
    this.mixEchartsGaugeRef = React.createRef();
  }

  componentDidMount(){
    const {power} = Cookie.getCookie('loginStatus');
    const { date,tabId,dateType,proId } = this.props;
    if(date !== "" && tabId !== "" && dateType !== ""){
      if(power==='city' || power==='specialCity'){
        this.initRequest();
      }else if((power==='all' || power==='prov') && proId !== undefined ){
        this.initRequest();
      }
    }
  }


  componentDidUpdate(prevProps,prevState){
    // 账期、切换标签变化去请求
    const {power} = Cookie.getCookie('loginStatus');
    const { date,tabId,proId} = this.props;
    if(prevProps.date !== date && tabId !== "" && date !== ""){
      if(power==='city' || power==='specialCity'){
        this.initRequest();
      }else if((power==='all' || power==='prov') && proId !== undefined ){
        this.initRequest();
      }
    }
    const { mixEchartData } =  prevState;
    if(proId !== undefined && proId !== prevProps.proId ){
      if(mixEchartData.length>0){
        this.handleData(mixEchartData);
      }
    }
  }


  /**
   * 根据数据绘制折线图和柱状图
   * @param
   */
  setLineAndBar(mixData) {
    const {signPosition,dateType,tabId} = this.props;
    let barColor = "#569DE4";
    if(dateType === "2"){
      barColor= signPosition === "1" || signPosition === "4"?"#569DE4":"#56D5E4";
    }
    if(dateType === "1" && tabId==="TAB_104" && (signPosition === "3" || signPosition === "4")){
      barColor= "#56D5E4";
    }
    const {month,title,rating,monthSum,unit} = mixData;
    const ratingRes = []; // 环比值
    const monthSumRes = []; // 累计值
    rating.forEach((data) => {
      ratingRes.push(this.dataFormat(data));
    });
    monthSum.forEach((data) => {
      monthSumRes.push(this.dataFormat(data));
    });
    const line = echart.init(this.lineAndBarRef.current); // 初始化折线图所需dom
    const lineOption = {
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
          let showTip = "";
          params.forEach((par)=> {
            if (par.axisDim === "x") {
              if(par.componentSubType==="bar"){
                showTip +=
                  par.marker +
                  " " +
                  par.seriesName +
                  ":" +
                  monthSum[par.dataIndex] +
                  unit +
                  "<br/>";
              }else{
                showTip +=
                  par.marker +
                  " " +
                  par.seriesName +
                  ":" +
                  rating[par.dataIndex] +
                  "<br/>";
              }
            }
          });
          return params[0].axisValue + "<br/>" + showTip;
        },
        axisPointer: {
          type: "shadow",
          lineStyle: {
            color: "rgba(86,84,86,0.2)"
          }
        },
        backgroundColor: "rgba(108,109,111,0.7)",
        showDelay: 0 // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
      },
      grid: [
        { left: "0%", top: "10%", right:"0%", height: "30%" },
        { left: "0%", top: "40%", right:"0%", height: "30%" }
      ],
      legend: {
        data: title,
        left:'center',
        bottom: 5,
        selectedMode: false,
        textStyle:{
          color:"#999",
        }
      },
      axisPointer: {
        show: true,
        type: "none",
        link: [{ xAxisIndex: [0, 1] }],
        label: {
          show: false
        }
      },
      xAxis: [
        {
          type: "category",
          show: false,
          gridIndex: 0, // 对应前面grid的索引位置（第一个）
          data: month
        },
        {
          type: "category",
          show: true,
          gridIndex: 1, // 对应前面grid的索引位置（第二个）
          boundaryGap: [0, 0], // 坐标轴两边留白策略
          axisLine: {
            show: true,
            lineStyle: {
              color: "#99a5bd",
              width: 1
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            margin: 2,
            fontFamily: "Microsoft YaHei",
            color: "#999999"
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
          show: false,
          gridIndex: 0 // 对应前面grid的索引位置（第一个）
        },
        {
          type: "value",
          show: false,
          gridIndex: 1 // 对应前面grid的索引位置（第二个）
        }
      ],
      series: [
        {
          name: title[1],
          type: "line",
          xAxisIndex: 0, // 对应前面x的索引位置（第一个）
          yAxisIndex: 0, // 对应前面y的索引位置（第一个）
          smooth: false, // 是否平滑曲线显示。
          symbol: "emptyCircle",
          itemStyle: {
            color: "#cccccc"
          },
          label: {
            show: true,
            formatter: (params)=> {
              return rating[params.dataIndex];
            },
            position: "top"
          },
          data: ratingRes
        },
        {
          name: title[0],
          type: "bar",
          smooth: false, // 是否平滑曲线显示。
          symbol: "emptyCircle",
          xAxisIndex: 1, // 对应前面x的索引位置（第二个）
          yAxisIndex: 1, // 对应前面y的索引位置（第一个）
          itemStyle: {
            color: barColor
          },
          data: monthSumRes
        }
      ]
    };
    line.setOption(lineOption,true);
  }

  /**
   * 返回某一个省的数据
   * @param mixEchartData
   */
  handleDataRender= (mixEchartData)=>{
    const {power,provOrCityId} = Cookie.getCookie('loginStatus');
    const { proId } = this.props;
    let provData;
    if(power==='city' || power === "specialCity"){
     provData =  mixEchartData.find((item)=>{return item.proId === provOrCityId});
    }else{
      provData =  mixEchartData.find((item)=>{return item.proId === proId});
    }
    if(provData===undefined){
      return null;
    }
    return provData.data[0];
  };

  /**
   * 处理数据、绘制图形
   * @param mixEchartData
   */
  handleData= (mixEchartData)=>{
    const {power,provOrCityId} = Cookie.getCookie('loginStatus');
    const { proId,dateType } = this.props;
    let provData;
    if(power==='city' || power === "specialCity"){
      provData =  mixEchartData.find((item)=>{return item.proId === provOrCityId});
    }else{
      provData =  mixEchartData.find((item)=>{return item.proId === proId});
    }
    if(provData!==undefined){
      this.setLineAndBar(provData.data[0]);
      if(dateType === '1'){
        this.setGauge(provData.data[0]);
      }
    }
  };

  /**
   * 数据格式化：去百分号
   * @param value
   * @returns {*}
   */
  dataFormat = value => {
    return value.replace(/%/g, "").replace(/,/g,'');
  };

  // 根据传入数据改变颜色，无数据时为灰色，负数为红色，非负数为绿色
  ratioDataColor =(data)=>{
    let color;
    if(data === '-' || data === undefined){
      // 正常灰色
      color =  'dataBlank';
    }else{
      const res = data.replace(/%/g, "").replace(/,/g,'').replace(/pp/g,'');
      color = parseFloat(res)>=0?'dateGreen':'dataRed';
    }
    return color;
  };

  /**
   * 根据数据绘制仪表盘
   * @param data
   */
  setGauge =(data)=> {
    let percent = "-";

    // 判断data是否为空，是否有items属性
    if (data && data.items !== undefined && data.items[2] !== undefined && data.items[2] !== "-") {
      percent = parseFloat(data.items[2]);
    }
    let fontSize = 14;
    if(window.screen.width>1870){
      fontSize = 16;
    }
    const gauge = echart.init(this.mixEchartsGaugeRef.current);
    const option = {
      series: [
        {
          name: '占网上用户比',
          type: 'gauge',
          radius: 26,
          splitNumber: 5,
          startAngle: 225,
          endAngle: 270 - percent * 360 / 100,
          data: [{value: percent, name: '占网上用户比'}],
          pointer: {
            show: false
          },
          // 刻度标签
          axisLabel: {
            show: false,
          },
          // 刻度样式
          axisTick: {
            show: true,
            length: 6,
            lineStyle: {
              width: 1,
              color: '#f39ba2',
            }
          },
          // 分隔线样式
          splitLine: {
            show: true,
            length: 6,
            lineStyle: {       // 控制线条样式
              color: '#f39ba2',
              width: 1
            }
          },
          detail: {
            show: true,
            offsetCenter: [0, '10%'],
            formatter: ()=> {
              if(percent === "-"){
                return "-"
              }else {
                return percent+"%"
              }
            },

            fontStyle: 'normal',         //  样式
            fontWeight: 400,            // 粗细
            color: '#666666',           // 颜色
            fontSize,         // 字号
            fontFamily: 'Arial',      // 字体系列
          },
          // 仪表盘轴线
          axisLine: {
            show: false,
            lineStyle: {
              width: 0
            }
          },
          title: {
            show: false
          }
        }
      ]
    };
    gauge.setOption(option,true);
  };

  /**
   * 弹出层
   * @param kpiCode
   */
  popUpShow = (kpiCode) =>{
    const {dispatch} = this.props;
    dispatch({
      type:"overviewIndexDetail/setKpiCode",
      payload:kpiCode
    });
    dispatch({
      type:"overviewIndexDetail/setPopUpShow",
      payload:true
    });
  };

  /*
 * 请求总入口
 * */
  initRequest() {
    const {dispatch,dateType,tabId,date,signPosition} = this.props;
    const  mixId = tabId +'_mix_'+ signPosition;
    dispatch({type:"mixEcharts/fetchMixEcharts", payload:{dateType,tabId,date,mixId}})
      .then((mixEchartData)=>{
        this.setState({
          mixEchartData
        },()=>{this.handleData(mixEchartData)});
      });
  };

  render(){
    const { mixEchartData } = this.state;
    const { dateType } = this.props;
    if(mixEchartData.length>0){
      const provData = this.handleDataRender(mixEchartData);
      if (provData !== null && JSON.stringify(provData) !== "{}"
      ) {
        let mixChartTop;
        const { items,title,unit,name,kpiCode,showEarlyWarning,desc,warningLevel,showException,excepDiscription} = provData;
        // 智能预警
        const warning = showEarlyWarning === "0"|| showEarlyWarning === undefined?null:<EarlyWarning warningLevel={warningLevel} desc={desc} />;
        // 指标异动
        const exception = showException === "0" || showException=== undefined? null : <Tooltip placement="bottomLeft" title={excepDiscription} overlayClassName={styles.earlyTip} className={styles.early}><Icon type="exclamation-circle" theme="filled" style={{color:"#D44545"}} /></Tooltip>;
        if(dateType === '1'){
          const ringRatingDataColorF = this.ratioDataColor(items[1]);
          const ringRatingDataColorS = this.ratioDataColor(items[3]);
          const monthSumNum = showEarlyWarning === "0"|| showEarlyWarning === undefined?
            <span className={classNames(styles.monthSumNum,styles.monthSumNumRight)}>{items[0]}</span>:
            <Tooltip placement="bottom" title={warning} overlayClassName={styles.warningTip}>
              <span className={styles.monthSumNum}>{items[0]}</span>
              <IconFont className={styles.starIcon} type="icon-jiufuqianbaoicon14" />
            </Tooltip>;
          mixChartTop = (
            <div className={styles.mixChartTop}>
              <div className={styles.monthSum}>
                <div className={styles.monthSumText}>{title[0]}</div>
                <div className={styles.monthSumData}>
                  {monthSumNum}
                  <span className={styles.monthSumUnit}>{unit}</span>
                </div>
              </div>
              <div className={styles.ringRating}>
                <div className={styles.middleText}>{title[1]}</div>
                <div className={classNames(styles.ringRatingData,styles[ringRatingDataColorF])}>{items[1]}</div>
              </div>
              <div className={styles.net}>
                <div className={styles.middleText}>{title[2]}</div>
                <div ref={this.mixEchartsGaugeRef} className={styles.mixEchartsGauge} />
              </div>
              <div className={styles.samerating}>
                <div className={styles.middleText}>{title[3]}</div>
                <div className={classNames(styles.ringRatingData,styles[ringRatingDataColorS])}>{items[3] || "-"}
                </div>
              </div>
            </div>
          );
        }else{
          const monthShow = items.map((data,index)=> {
            let dataShow = data;
            let valueColor = "blank";
            if(index >0){
              valueColor = this.ratioDataColor(data);
            }
            let unitShow;
            let monthData = "monthData";
            if(index === 0){
              monthData = "monthDataFirst";
              unitShow = <span className={styles.monthUnit}>{unit}</span>;
               dataShow = showEarlyWarning === "0"|| showEarlyWarning === undefined?
                 <span>{dataShow}</span>:
                 <Tooltip placement="bottom" title={warning} overlayClassName={styles.warningTip}>
                   <span>{dataShow}</span>
                   <IconFont className={styles.starIcon} type="icon-jiufuqianbaoicon14" />
                 </Tooltip>
            }
            return (
              <div key={"mixEcharts"+index} className={styles[monthData]}>
                <span className={styles.monthName}>{title[index]}</span>
                <span className={classNames(styles.monthValue,styles[valueColor])}>{dataShow}{unitShow}</span>
              </div>)
          });
          mixChartTop =(
            <div className={styles.mixChartTop}>
              {monthShow}
            </div>
            )
        }
        return (
          <div className={styles.mixEchart}>
            <div className={styles.kpiName}><span className={styles.titleSpan} id={kpiCode} onClick={()=>{this.popUpShow(kpiCode)}}>{exception}{name}</span></div>
            {mixChartTop}
            <div ref={this.lineAndBarRef} className={styles.lineAndBarEchart} />
          </div>
        );
      } else{
        return null;
      }
    }else{
      return null;
    }
  }
}
export default MixEchart;
