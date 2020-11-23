/* eslint-disable spaced-comment,jsx-a11y/mouse-events-have-key-events */
/**
 * desctiption 运营总览指标弹出层

 * created by mengyajing

 * date 2019/2/14
 */
import React,{PureComponent,Fragment} from 'react';
import {connect} from 'dva';
import { Carousel,DatePicker,Button,Row,Col,Icon } from 'antd';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import ProCity from "../Until/proCity";
import DayTrendEchart from "@/components/Echart/dayTrendEchart"; // 当日趋势图
import MonthTotal from "@/components/Echart/monthTotal"; // 月累计趋势图
import YearTotal from "@/components/Echart/yearTotal2"; // 年累计趋势图
import RegionSituation from "@/components/Echart/regionSituation"; // 分地域情况图
import BusinessStructure from "@/components/Echart/businessStructure"; // 业务结构图
import ProductStructure from "@/components/Echart/productStructure"; // 产品结构图
import NightingalePie from "@/components/Echart/nightingalePie"; // 渠道运营
import CityRank from "@/components/Echart/cityRank"; // 地市排名
import styles from './overviewIndexDetail.less';

const {MonthPicker} = DatePicker;

@connect(({dayOverViewHeader,overviewIndexDetail,proCityModels,billingRevenue})=>({
  ...overviewIndexDetail,
  selectedDate:dayOverViewHeader.selectedDate,
  dateType:dayOverViewHeader.dateType,
  ...proCityModels,
  ...billingRevenue,
}))
class OverviewIndexDetail extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      maxDate:"", // 弹出层最大账期
      date:"",// 显示账期
      chartTypes:[],
      showArrow:false,
      // provId:props.selectPro.proId,
      // cityId:props.selectCity.cityId,
      selectType:[],
      requestMake: true, // 阻止请求标记
    };
    this.carouselRef = React.createRef();
  }

  componentDidMount(){
    // 请求地市数据、最大账期、筛选条件、请求图表类型、请求图表数据
    const {dispatch,kpiCode,dateType,selectedDate} = this.props;
    if(kpiCode !== "" ){
      dispatch({
        type:"overviewIndexDetail/fetchMaxDate",
        payload:{
          markType:kpiCode,
          dateType
        }
      }).then((res)=>{
        // 账期比较
        let date = selectedDate;
        if(res.maxDate !== undefined){
           date = res.maxDate>selectedDate?selectedDate:res.maxDate;
           this.setState({maxDate:res.maxDate,date});
        }else{
          this.setState({maxDate:date,date});
        }
      });
    }
  }

  // static getDerivedStateFromProps(nextProps,prevState){
  //   if( prevState.kpiCode !== nextProps.kpiCode){
  //     return {
  //       kpiCode:nextProps.kpiCode
  //     }
  //   }
  //   return null;
  // }


  componentDidUpdate(prevProps,prevState){
    const {date, requestMake} = this.state;
    const {selectPro, selectProAndCity} = this.props;
    // 为解决弹出层首次进入为最后一个图的问题（默认渲染图标为-1）
    if(this.carouselRef.current.innerSlider.state.currentSlide===-1){
      this.clickEchart(0)
    }
    if(date !== "" && Object.keys(selectPro).length > 0){
      if(!isEqual(selectPro, prevProps.selectPro) && requestMake){
        this.initRequest();
      }else if(selectProAndCity.proId === selectPro.proId && date !== prevState.date && requestMake){
        this.initRequest();
      }
    }
  }

  /**
   * 选择账期
   * @param date
   */
  handleChangeDate = (date,dateString) =>{
    this.setState({
      date:dateString
    })
  };

  /**
   * 最大账期限制
   * @param currentDate
   * @returns {*|boolean}
   */
  disabledDate = currentDate => {
    const { maxDate } = this.state;
    return currentDate && currentDate > moment(maxDate);
  };

  initRequest = ()=>{
    const {dispatch,kpiCode,dateType,hot, selectPro, selectCity} = this.props;
    const {date,selectType} = this.state;
    this.setState({requestMake: false});
    const params = {
      markType:kpiCode,
      dateType,
      date,
      provId: selectPro.proId,
      cityId: selectCity.cityId,
      selectType,
      hot,
      unitId: "",
    };
    const lineParams = {
      ...params,
      time:"7"
    };
    dispatch({
      type:"overviewIndexDetail/fetchChartTypes",
      payload:{
        markType:kpiCode,
        dateType,
        provId: selectPro.proId,
        cityId: selectCity.cityId,
        date,
        selectType,
        hot,
      }
    }).then((response)=>{
      this.setState({chartTypes:response.chartType});
      response.chartType.forEach((item)=>{
        switch (item) {
          case "line":dispatch({type:"overviewIndexDetail/fetchDayTrend", payload:lineParams}); break;
          case "monthBar":dispatch({type:"overviewIndexDetail/fetchMonthBar", payload:params}); break;
          case "cityBar":dispatch({type:"overviewIndexDetail/fetchCityBar", payload:params}); break;
          case "cityRank":dispatch({type:"overviewIndexDetail/fetchCityRank", payload:params}); break;
          case "channel":dispatch({type:"overviewIndexDetail/fetchChannel", payload:params}); break;
          case "product": dispatch({type:"overviewIndexDetail/fetchProduct", payload:params}); break;
          case "businessPie":dispatch({type:"overviewIndexDetail/fetchBusinessPie", payload:params}); break;
          case "yearBar": dispatch({type:"overviewIndexDetail/fetchYearBar", payload:params}); break;
          default:break;
        }
      })
    });
  };

  closePopUp = ()=>{
    const {dispatch} = this.props;
    dispatch({
      type:"overviewIndexDetail/setPopUpShow",
      payload:false
    });
  };

  handlePrev=()=> {
    this.carouselRef.current.prev();
  }

  handleNext= ()=> {
    this.carouselRef.current.next();
  };

  clickEchart = (slideNumber)=>{
    // console.log(slideNumber)
    this.carouselRef.current.goTo(slideNumber, true)
  };

  isShowArrow=(showArrow)=>{
   this.setState({showArrow})
  }

  clickFun=() =>{
    this.setState({requestMake:true},()=>{
      this.initRequest();
    })
  }

  /**
   * @date: 2019/4/28
   * @author xingxiaodong
   * @Description: 下载参数整理
   * @method downloadParameters
   * @param {参数类型} 参数名 参数说明
   * @return {} 整理后的数据
   */
  downloadParameters(){
    const {selectCity, selectPro,dateType,dayTrend,monthBar} = this.props;
    const {date} = this.state;
    let title='';
    let selectUnit={unitName: "万户", unitId: "2"};
    const selectNameData=[];
    if( dayTrend&&dayTrend.data){
      if(dateType==="1"){ title="日运营总览";selectUnit={unitName: dayTrend.data[0].unit, unitId: "-1"}}
      if(dateType==="2"){ title="月运营总览";selectUnit={unitName: monthBar.data[0].unit, unitId: "-2"}}
    }
    return {selectCity, selectPro, date, selectNameData, title, selectUnit}
  }


  render(){

    const {selectProAndCity,dateType,dayTrend,cityBar,cityRank,monthBar,yearBar,channel,product,businessPie} = this.props;

    const {date,chartTypes,showArrow} = this.state;
    const smallEchart = [];
    const bigEchart = [];
    const {cityId, proId} = selectProAndCity;
    const proCityData = {
      cityId, proId
    }
    console.log(cityId, proId)
    if(chartTypes !== undefined && chartTypes.length>0){
      chartTypes.forEach((item,slideNumber) => {
       let echartDom = null;
       let echartDomSmall = null;
       switch (item){
         case "line":{
           if(dayTrend.data !== undefined){
             const {kpiCode,hot, selectPro, selectCity} = this.props;
             const {selectType} = this.state;
             const lineParams = {
               markType:kpiCode,
               dateType,
               date,
               provId: selectPro.proId,
               cityId: selectCity.cityId,
               selectType,
               hot,
               unitId: "",
             };
             echartDom = <DayTrendEchart data={dayTrend} downloadData={this.downloadParameters()} pattern="big" lineParams={lineParams} />;
             echartDomSmall = <DayTrendEchart data={dayTrend} pattern="small" />;
           }
           break;
         }
         case "monthBar":{
           if(monthBar.data !== undefined) {
             echartDom = <MonthTotal data={monthBar} downloadData={this.downloadParameters()} btuVisible pattern="big" />;
             echartDomSmall = <MonthTotal data={monthBar} pattern="small" />;
           }
           break;
         }
         case "cityBar":{
           if(cityBar.data !== undefined) {
             echartDom = <RegionSituation data={cityBar} downloadData={this.downloadParameters()} btuVisible pattern="big" />;
             echartDomSmall = <RegionSituation data={cityBar} pattern="small" />;
           }
           break;
         }
         case "cityRank":{
           if(cityRank.data !== undefined) {
             echartDom = <CityRank pattern="big" downloadData={this.downloadParameters()} btuVisible data={cityRank} />;
             echartDomSmall = <CityRank data={cityRank} pattern="small" />;
           }
           break;
         }
         case "channel":{
           if(channel.data !== undefined) {
             echartDom = <NightingalePie data={channel} pattern="big" />;
             echartDomSmall = <NightingalePie data={channel} pattern="small" />;
           }
           break;
         }
         case "product":{
           if(product.data !== undefined) {
             echartDom = <ProductStructure data={product} pattern="big" />;
             echartDomSmall = <ProductStructure data={product} pattern="small" />;
           }
           break;
         }
         case "businessPie":{
           if(businessPie.data !== undefined) {
             echartDom = <BusinessStructure data={businessPie} pattern="big" />;
             echartDomSmall = <BusinessStructure data={businessPie} pattern="small" />;
           }
           break;
         }
         case "yearBar":{
           if(yearBar.data !== undefined) {
             echartDom = <YearTotal data={yearBar} downloadData={this.downloadParameters()} pattern="big" />;
             echartDomSmall = <YearTotal data={yearBar} pattern="small" />;
           }
           break;
         }
         default:break;
       }

       if(echartDom !== null){
        bigEchart.push(
          <div key={item} className={styles.bannerList}>
            {echartDom}
          </div>
         );
         smallEchart.push(
           <li key={item} className={styles.smallList} onClick={()=>{this.clickEchart(slideNumber)}}>
             {echartDomSmall}
           </li>
         );
       }
     });
    }
    const triangle = <i className={styles.dateTriangle} />
    const dateComponent = dateType==='1'?<DatePicker allowClear={false} showToday={false} value={moment(date, 'YYYY-MM-DD')} disabledDate={this.disabledDate} onChange={this.handleChangeDate} suffixIcon={triangle} />
      :<MonthPicker value={moment(date, 'YYYY-MM')} allowClear={false} disabledDate={this.disabledDate} onChange={this.handleChangeDate} suffixIcon={triangle} />;
    return(
      <Fragment>
        <div className={styles.overviewIndex}>
          <div className={styles.overviewIndexContent}>
            <div className={styles.overviewScreen}>
              <Row>
                <Col md={13}><ProCity selectData={proCityData} overview /></Col>
                <Col md={7}>
                  <span className={styles.dateName}>日期：</span>
                  {dateComponent}
                </Col>
                <Col md={3}> <Button className={styles.queryBtn} type="primary" onClick={this.clickFun}>查询</Button></Col>
                <Col md={1}>  <Icon className={styles.closeBtn} type="close" style={{ cursor:"pointer" }} onClick={this.closePopUp} /></Col>
              </Row>
            </div>
            <div className={styles.overviewIndexEchart} onMouseOver={()=>{this.isShowArrow(true)}} onMouseLeave={()=>{this.isShowArrow(false)}}>
              <div style={{display:showArrow?"block":"none"}}>
                <span className={styles.bannerBtnPre} onClick={()=>this.handlePrev()}><Icon type="left-circle" /></span>
                <span className={styles.bannerBtnNext} onClick={()=>this.handleNext()}><Icon type="right-circle" /></span>
              </div>
              {/*轮播图走马灯*/}
              <div className={styles.overviewCarousel}>
                <Carousel dots={false} className={styles.test} ref={this.carouselRef}>
                  {bigEchart}
                </Carousel>

              </div>
              {/*缩略图*/}
              <div className={styles.overviewSmallEchart}>
                <ul className={styles.overviewSmallEchartul}>
                  {smallEchart}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}
export default OverviewIndexDetail;
