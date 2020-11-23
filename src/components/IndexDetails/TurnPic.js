/* eslint-disable spaced-comment,jsx-a11y/mouse-events-have-key-events */
/**
 * desctiption 指标页面图表轮播图

 * created by sunrui

 * date 2019/2/20
 */
import React,{PureComponent} from 'react';
import {connect} from 'dva';
import { Carousel,Icon } from 'antd';
import DayTrendEchart from "@/components/Echart/dayTrendEchart"; // 当日趋势图
import MonthTotal from "@/components/Echart/monthTotal"; // 月累计趋势图
import YearTotal from "@/components/Echart/yearTotal2"; // 年累计趋势图
import RegionSituation from "@/components/Echart/regionSituation"; // 分地域情况图
import BusinessStructure from "@/components/Echart/businessStructure"; // 业务结构图
import ProductStructure from "@/components/Echart/productStructure"; // 产品结构图
import NightingalePie from "@/components/Echart/nightingalePie"; // 渠道运营
import CityRank from "@/components/Echart/cityRank"; // 地市排名
import styles from './TurnPic.less';


@connect(({indexDetails})=>({
  ...indexDetails,
}))
class OverviewIndexDetail extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      // provId:'',
      // cityId:'',
      // selectType:[],
      innerClick:false,// 是否点击了内部的滑动窗口
    };
    this.carouselRef = React.createRef();
  }


  componentDidMount(){
    const {clickPicIndex} = this.props;
    this.initClickEchart(clickPicIndex)
  }


  componentDidUpdate(){
    const { clickPicIndex } = this.props;
    const { innerClick } = this.state;
    // 日趋势图切换
    if(!innerClick && this.carouselRef.current.innerSlider.state.currentSlide !== clickPicIndex){
      this.initClickEchart(clickPicIndex)
    }
  }

  initClickEchart=(slideNumber)=>{
    this.carouselRef.current.goTo(slideNumber, true)
  }

  handlePrev=()=> {
    this.carouselRef.current.prev();
    this.setState({
      innerClick:true
    })
  };

  handleNext= ()=> {
    this.carouselRef.current.next();
    this.setState({
      innerClick:true
    })
  };

  clickEchart = (slideNumber)=>{
    this.carouselRef.current.goTo(slideNumber, true)
    this.setState({
      innerClick:true
    })
  };


  render(){
    const {downloadData}=this.props;
    const {dayTrend,cityBar,cityRank,monthBar,yearBar,channel,product,businessPie,chartTypes} = this.props;
    const smallEchart = [];
    const bigEchart = [];
    if(chartTypes !== undefined && chartTypes.length>0){
      chartTypes.forEach((item,slideNumber) => {
        let echartDom = null;
        let echartDomSmall = null;
        switch (item){
          case "line":{
            if(dayTrend.data !== undefined){
              // const {markType,hot,date,provId,cityId,selectType,unitId} = this.props;
              // const {provId,cityId,selectType} = this.state;
              const { lineParams } = this.props;
              echartDom = <DayTrendEchart data={dayTrend} downloadData={downloadData} pattern="big" lineParams={lineParams} />;
              echartDomSmall = <DayTrendEchart data={dayTrend} pattern="small" />;
            }
            break;
          }
          case "monthBar":{
            if(monthBar.data !== undefined) {
              echartDom = <MonthTotal data={monthBar} downloadData={downloadData} btuVisible pattern="big" />;
              echartDomSmall = <MonthTotal data={monthBar} pattern="small" />;
            }
            break;
          }
          case "cityBar":{
            if(cityBar.data !== undefined) {
              echartDom = <RegionSituation data={cityBar} downloadData={downloadData} btuVisible pattern="big" />;
              echartDomSmall = <RegionSituation data={cityBar} pattern="small" />;
            }
            break;
          }
          case "cityRank":{
            if(cityRank.data !== undefined) {
              echartDom = <CityRank pattern="big" btuVisible downloadData={downloadData} data={cityRank} />;
              echartDomSmall = <CityRank data={cityRank} pattern="small" />;
            }
            break;
          }
          case "channel":{
            if(channel.data !== undefined) {
              echartDom = <NightingalePie data={channel} downloadData={downloadData} pattern="big" />;
              echartDomSmall = <NightingalePie data={channel} pattern="small" />;
            }
            break;
          }
          case "product":{
            if(product.data !== undefined) {
              echartDom = <ProductStructure data={product} downloadData={downloadData} pattern="big" />;
              echartDomSmall = <ProductStructure data={product} pattern="small" />;
            }
            break;
          }
          case "businessPie":{
            if(businessPie.data !== undefined) {
              echartDom = <BusinessStructure data={businessPie} downloadData={downloadData} pattern="big" />;
              echartDomSmall = <BusinessStructure data={businessPie} pattern="small" />;
            }
            break;
          }
          case "yearBar":{
            if(yearBar.data !== undefined) {
              echartDom = <YearTotal data={yearBar} downloadData={downloadData} pattern="big" />;
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
            <li key={item} onClick={()=>{this.clickEchart(slideNumber)}}>
              {echartDomSmall}
            </li>
          );
        }
      });
    }
    const screenWidth = window.screen.width;
     let tabWidth=220; //1920
    if(screenWidth > 700 &&  screenWidth < 960 ) { // 800
      tabWidth=90;
    }else if(screenWidth > 961 && screenWidth < 1100){ // 1024
      tabWidth=110;
    }else if(screenWidth > 1101 && screenWidth < 1315){ // 1240
      tabWidth=120;
    }else if(screenWidth > 1316 && screenWidth < 1389){ // 1366
      tabWidth=150;
    }else if(screenWidth > 1390 && screenWidth < 1869) { // 1440
      tabWidth=160;
    }
    return(
      <div className={styles.overviewIndex}>
        <div className={styles.bigContainer}>
          <span onClick={()=>this.handlePrev()} className={styles.upcircle}><Icon type="left-circle" /></span>
          <span onClick={()=>this.handleNext()} className={styles.downcircle}><Icon type="right-circle" /></span>
          <Carousel dots={false} className={styles.carousel} ref={this.carouselRef}>
            {bigEchart}
          </Carousel>
        </div>
        <div className={styles.smallContainer}>
          <ul className={styles.smallUl} style={{width: `${smallEchart.length * tabWidth}px`}}>
            {smallEchart}
          </ul>
        </div>
      </div>
    )
  }
}
export default OverviewIndexDetail;
