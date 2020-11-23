/* eslint-disable arrow-body-style,prefer-template,react/no-array-index-key,no-else-return */
import React,{PureComponent,Fragment} from 'react';
import echarts from 'echarts'
import {Tooltip,Icon} from 'antd';
import {connect} from 'dva'
import classNames from 'classnames';
import styles from  './gaugeCharts.less';
import Cookie from '@/utils/cookie';
import EarlyWarning from './earlyWarning';
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
class GaugeChart extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
          gaugeChartData:{}// 全部省的数据
        };
      this.gaugeChartRef = React.createRef();
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
      const {power} = Cookie.getCookie('loginStatus');
      // 账期、切换标签变化去请求
      const { date,tabId,proId} = this.props;
      if(prevProps.date !== date && tabId !== "" && date !== ""){
        if(power==='city' || power==='specialCity'){
          this.initRequest();
        }else if((power==='all' || power==='prov') && proId !== undefined ){
          this.initRequest();
        }
      }
      const { gaugeChartData } =  prevState;
      if(proId !== undefined && proId !== prevProps.proId ){
        if(gaugeChartData.provinceData !== undefined){
          this.handleData(gaugeChartData.provinceData);
        }
      }
    }

    /**
     * 返回某一个省的数据
     * @param gaugeChartData
     */
    handleDataRender= (provinceData)=>{
      const {power,provOrCityId} = Cookie.getCookie('loginStatus');
      const { proId } = this.props;
      let provData;
      if(power==='city' || power === "specialCity"){
        provData =  provinceData.find((item)=>{return item.proId === provOrCityId});
      }else{
        provData =  provinceData.find((item)=>{return item.proId === proId});
      }
      if(provData === undefined){
        return null;
      }
      return provData.title;
    };

    /**
     * 处理数据、绘制图形
     * @param gaugeChartData
     */
    handleData= (data)=>{
      const {power,provOrCityId} = Cookie.getCookie('loginStatus');
      const { proId } = this.props;
      let provData;
      if(power==='city' || power === "specialCity"){
        provData =  data.find((item)=>{return item.proId === provOrCityId});
      }else{
        provData =  data.find((item)=>{return item.proId === proId});
      }
      if(provData !== undefined){
        this.drawChart(provData.chartData)
      }
    };

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

    /**
     * 数据格式化：去百分号
     * @param value
     * @returns {*}
     */
    dataFormat = value => value.replace(/%/g, "").replace(/,/g,'');

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

    drawChart(chartData){
      const gaugeChart = echarts.init(this.gaugeChartRef.current);
      const data = this.dataFormat(chartData);
      // 仪表盘的中心点位置
      const sw = window.screen.width;
      let radiusBig = 130;
      let rariusSmall = 110;
      if(sw <= 1000){
        radiusBig = 110;
        rariusSmall = 90;
      }
      const option = {
        series : [
          {
            name: '外围刻度',
            type: 'gauge',
            radius: radiusBig,
            center:['50%', '85%'],
            startAngle: 180,
            endAngle: 0,
            axisLine: {
              lineStyle: {
                width:10,
                color:[[1,'#D12500']]
              },
            },
            splitLine: {
              show:false,
            },
            axisLabel: {
              show:false
            },
            axisTick:{
              show:false,
            },
            detail:{
              show:false
            },
            pointer:{
              show:false
            }
          },
          {
            name: '内层',
            type: 'gauge',
            center:['50%', '85%'], // 仪表位置
            radius:rariusSmall,
            startAngle:'180',
            endAngle:'0',
            splitNumber:5,
            axisLine: {
              lineStyle:{
                opacity:0
              }
            },
            axisTick: {            // 坐标轴小标记
              length: '5',        // 属性length控制线长
              lineStyle: {       // 属性lineStyle控制线条样式
                color: '#58554E'
              },
            },
            splitLine: {           // 分隔线
              length: '15',         // 属性length控制线长
              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: '#58554E'
              }
            },
            axisLabel: {
              show:false
            },
            title : {
              show:false,
            },
            itemStyle:{
              normal:{
                color:'#58554E'
              }
            },
            detail:{
              show:false
            },
            data:[{value: data}]
          },
        ]
      };
      gaugeChart.setOption(option);
    };

    /*
  * 请求总入口
  * */
    initRequest() {
      const {dispatch,dateType,tabId,date} = this.props;
      dispatch({type:"gauge/fetchLineChart", payload:{dateType,tabId,date}})
        .then((gaugeChartData)=>{
          console.log("gaugeChartData")
        console.log(gaugeChartData)
          this.setState({
            gaugeChartData
          },()=>{this.handleData(gaugeChartData.provinceData)});
        });
    }

    render(){
      const {gaugeChartData} = this.state;
      if(gaugeChartData !== undefined && JSON.stringify(gaugeChartData) !== '{}' && gaugeChartData.provinceData !== undefined){
        const {titleData,kpiCode,provinceData,showException,excepDiscription,showEarlyWarning,warningLevel,desc} = gaugeChartData;
        const exception = showException === "0"|| showException=== undefined ? null : <Tooltip placement="bottomLeft" title={excepDiscription} overlayClassName={styles.earlyTip} className={styles.early}><Icon type="exclamation-circle" theme="filled" style={{color:"#D44545"}} /></Tooltip>;
        const title = this.handleDataRender(provinceData);
        let titleLayOut = null;
        if(title!== null){
          titleLayOut = title.map((data,index)=> {
            const valueClassName = this.ratioDataColor(data.value);
            let spandom;
            if(index === 0){
              // const showEarlyWarning = "1";
              // const desc = "测试测试测试测试测试测试测试测试测试";
              // const warningLevel = "一级";
              const warning = showEarlyWarning === "0" || showEarlyWarning === undefined ?null:<EarlyWarning warningLevel={warningLevel} desc={desc} />;
              spandom = showEarlyWarning === "0"|| showEarlyWarning === undefined?
                <span>{data.value}</span>:
                <Tooltip placement="bottom" title={warning} overlayClassName={styles.warningTip}>
                  <span>{data.value}</span>
                  <IconFont className={styles.starIcon} type="icon-jiufuqianbaoicon14" />
                </Tooltip>
            }else{
               spandom = <span>{data.value}</span>;
            }
            return(
              <div key={"gaugeChart"+index} className={styles.monthSum}>
                <span className={styles.monthSumText}> {data.name}</span>
                <span className={classNames(styles.monthSumData,styles[valueClassName])}>{spandom} </span>
              </div>)
          });
        }
        return(
          <Fragment>
            <div className={styles.gaugeChartBody}>
              <div className={styles.titleName}>
                <span className={styles.titleSpan} id={kpiCode} onClick={()=>{this.popUpShow(kpiCode)}}>{exception}{titleData}</span>
              </div>
              <div className={styles.chartTop}>
                {titleLayOut}
              </div>
              <div className={styles.gaugeChart} ref={this.gaugeChartRef} />
            </div>
          </Fragment>
        )
      }else{
        return null;
      }
   }
}
export default GaugeChart;
