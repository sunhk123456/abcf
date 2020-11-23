/* eslint-disable spaced-comment,jsx-a11y/mouse-events-have-key-events */
/**
 * desctiption 指标页面图表轮播图

 * created by sunrui

 * date 2019/2/20
 */
import React,{PureComponent,Fragment} from 'react';
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
      provId:'',
      cityId:'',
      selectType:[]
    };
    this.carouselRef = React.createRef();
  }


  componentDidMount(){
    const {clickPicIndex} = this.props;
    this.clickEchart(clickPicIndex-1)
  }


  handlePrev=()=> {
    this.carouselRef.current.prev();
  };

  handleNext= ()=> {
    this.carouselRef.current.next();
  };

  clickEchart = (slideNumber)=>{
    this.carouselRef.current.goTo(slideNumber, true)
  };


  render(){
    const {downloadData}=this.props
    const {dateType,dayTrend,cityBar,cityRank,monthBar,yearBar,channel,product,businessPie,chartTypes} = this.props;
    const smallEchart = [];
    const bigEchart = [];
    if(chartTypes !== undefined && chartTypes.length>0){
      chartTypes.forEach((item,slideNumber) => {
        let echartDom = null;
        let echartDomSmall = null;
        switch (item){
          case "line":{
            if(dayTrend.data !== undefined){
              const {markType,hot,date} = this.props;
              const {provId,cityId,selectType} = this.state;
              const lineParam = {
                markType,
                dateType,
                date,
                provIds:provId,
                cityIds:cityId,
                selectType,
                hot,
                unitId: "",
              };
              echartDom = <DayTrendEchart data={dayTrend} downloadData={downloadData} pattern="big" lineParams={lineParam} />;
              echartDomSmall = <DayTrendEchart data={dayTrend} pattern="small" />;
            }
            break;
          }
          case "monthBar":{
            if(monthBar.data !== undefined) {
              echartDom = <MonthTotal data={monthBar} downloadData={downloadData} pattern="big" />;
              echartDomSmall = <MonthTotal data={monthBar} pattern="small" />;
            }
            break;
          }
          case "cityBar":{
            if(cityBar.data !== undefined) {
              echartDom = <RegionSituation data={cityBar} downloadData={downloadData} pattern="big" />;
              echartDomSmall = <RegionSituation data={cityBar} pattern="small" />;
            }
            break;
          }
          case "cityRank":{
            if(cityRank.data !== undefined) {
              echartDom = <CityRank pattern="big" downloadData={downloadData} data={cityRank} />;
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
            if(monthBar.data !== undefined) {
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
            <li key={item} className={styles.smallList} onClick={()=>{this.clickEchart(slideNumber)}}>
              {echartDomSmall}
            </li>
          );
        }
      });
    }
    return(
      <Fragment>
        <div className={styles.overviewIndex}>
          <div className={styles.overviewIndexContent}>
            <div className={styles.overviewIndexEchart}>
              <div style={{display:"block",float:'left'}}>
                <span className={styles.bannerBtnPre} onClick={()=>this.handlePrev()}><Icon type="left-circle" /></span>
                <span className={styles.bannerBtnNext} onClick={()=>this.handleNext()}><Icon type="right-circle" /></span>
              </div>
              {/*轮播图走马灯*/}
              <div className={styles.overviewCarousel}>
                <Carousel ref={this.carouselRef}>
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
