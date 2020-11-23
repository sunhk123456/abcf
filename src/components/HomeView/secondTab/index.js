import React, {PureComponent} from 'react';
import {connect} from "dva";
import { DatePicker } from 'antd';
import CutPie from '@/components/BuildingView/cutPie';
import moment from 'moment';
// import Online24Hours from '../online24Hours'

import BuildingTop10 from '../../building/buildingTop10';
import HomeCompareBar from '../homeCompareBar';

import styles from './index.less';
import ProCity from '../../Until/proCity';

const {MonthPicker} = DatePicker;

@connect(({ homeViewModels,homeViewSecondTabModels,proCityModels }) => ({
  homeViewModels,homeViewSecondTabModels,proCityModels,
  specialName:homeViewModels.specialName,
  tabId:homeViewModels.tabId,
  markType:homeViewModels.markType,
  dateType:homeViewModels.dateType,

  selectPro:proCityModels.selectPro,
  selectCity:proCityModels.selectCity,

  date:homeViewSecondTabModels.date,
  maxDate:homeViewSecondTabModels.maxDate,
  downloadCondition:homeViewSecondTabModels.downloadCondition,

  contrastPie:homeViewSecondTabModels.contrastPie, // 三家运营商对比饼图
  homeNumberPie:homeViewSecondTabModels.homeNumberPie,// 智能设备数量家庭分布饼图
  homeTypePie:homeViewSecondTabModels.homeTypePie, // 智能设备类型家庭分布饼图
  internetSpeed:homeViewSecondTabModels.internetSpeed, // 上网速率

  online24HourData:homeViewSecondTabModels.online24HourData,
  top10Echart:homeViewSecondTabModels.top10Echart, // top10
}))
class HomeViewSecondTab extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    this.getMaxDate();
    this.initEchart();
  }

  /**
   * 最大账期限制
   * @param currentDate
   * @returns {*|boolean}
   */
  disabledDate = currentDate => {
    const { maxDate } = this.props;
    return currentDate && currentDate > moment(maxDate);
  };

  // 日期控件日期改变触发函数
  onChangeDate=(date, dateString)=>{
    const { dispatch} = this.props;
    dispatch({
      type: `homeViewSecondTabModels/setDate`,
      payload: {date:dateString},
    });
  };

  // 获取最大账期数据
  getMaxDate=()=>{
    const { dispatch,markType,dateType,tabId  } = this.props;
    const params = {
      tabId,
      markType,
      dateType
    };
    dispatch({
      type: `homeViewSecondTabModels/getMaxDate`,
      payload: params,
    });
  };

  // 查询按钮被点击
  query=()=>{
    console.log("查询按钮被点击");
    const { dispatch,date,selectPro,selectCity} = this.props;
    dispatch({
      type: `homeViewSecondTabModels/setDownloadCondition`,
      payload: {
        date,
        proName:selectPro.proName,
        cityName:selectCity.cityName,
      },
    });
    this.initEchart();

  };

  // 获取24小时上网分布趋势图数据
  getOnline24HourData=(data)=>{
    const { dispatch } = this.props;
    const params = {
      chartType: "time",
      ...data
    };
    dispatch({
      type: `homeViewSecondTabModels/getOnline24HourData`,
      payload: params,
    });
  };

  /**
   * @date: 2019/12/13
   * @author 王健
   * @Description: 三家运营商成员对比饼图
   * @method getContrast
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getContrast=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewSecondTabModels/fetchPie8`,
      payload: {...params,chartType:"contrast"},
    });
  };

  /**
   * @date: 2019/12/13
   * @author 王健
   * @Description:单宽/融合家庭数量对比饼图
   * @method getHomeNumber
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getHomeNumber=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewSecondTabModels/fetchPie8`,
      payload: {...params,chartType:"homeNumber"},
    });
  };

  /**
   * @date: 2019/12/13
   * @author 王健
   * @Description: 智能设备数量家庭分布饼图
   * @method getHomeType
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  getHomeType=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewSecondTabModels/fetchPie8`,
      payload: {...params,chartType:"homeType"},
    });
  };

  /**
   * @date: 2019/12/10
   * @author 喵帕斯
   * @Description:  请求top10数据
   * @method getTop10EchartData
   * @param {object} params - 请求参数.
   * @return {null} 返回值说明
   */
  getTop10EchartData=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewSecondTabModels/getTop10EchartData`,
      payload: {...params},
    });
  };

  /**
   * @date: 2019/12/10
   * @author 喵帕斯
   * @Description:  请求top10数据
   * @method getTop10EchartData
   * @param {params}  参数描述
   * @return {null} 返回值说明
   */
  getInternetSpeedData=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `homeViewSecondTabModels/getInternetSpeedData`,
      payload: {
        ...params,
        chartType:"bar"
      },
    });
  };

  /**
   * @date: 2019/12/10
   * @author 风信子
   * @Description:  下方图边总请求入口
   * @method initEchart
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  initEchart(){
    const { markType,dateType,tabId,date,selectPro,selectCity  } = this.props;
    const params = {
      markType,
      dateType,
      date,
      tabId,
      provId:selectPro.proId||"017",
      cityId:selectCity.cityId||"-1",
    };
    this.getOnline24HourData(params); // 获取24小时上网分布趋势图数据
    // this.getComparePie(params);
    // this.getPayBehaviorPie(params);
    this.getContrast(params);// 三家运营商对比饼图
    this.getHomeNumber(params);// 智能设备数量家庭分布饼图
    this.getHomeType(params);// 智能设备类型家庭分布饼图
    this.getTop10EchartData(params);// 获取top10数据
    this.getInternetSpeedData(params); // 请求上网速率柱状图
  }


  render(){

    const{
      specialName,
      downloadCondition,
      markType,
      dateType,
      date,
      contrastPie, // 三家运营商对比饼图
      homeNumberPie,// 智能设备数量家庭分布饼图
      homeTypePie, // 智能设备类型家庭分布饼图
      internetSpeed, // 上网速率
      online24HourData,
      top10Echart,// top10
      maxDate,
      selectPro,
      selectCity
    }=this.props;

    // 八省拉通下载数据
    const downloadData={
      specialName,
      conditionValue: [
        ["筛选条件："],
        ["省份",downloadCondition.proName||selectPro.proName],
        ["地市",downloadCondition.cityName||selectCity.cityName],
        ["日期",downloadCondition.date||maxDate]
      ]};
    const triangle = <i className={styles.dateTriangle} />;
    const dateComponent = dateType==='1'?<DatePicker allowClear={false} showToday={false} value={moment(date, 'YYYY-MM-DD')} disabledDate={this.disabledDate} onChange={this.onChangeDate} suffixIcon={triangle} />
      :<MonthPicker dropdownClassName={styles.dateDropdown} value={moment(date, 'YYYY-MM')} allowClear={false} disabledDate={this.disabledDate} onChange={this.onChangeDate} suffixIcon={triangle} />;
    return(
      <div className={styles.eightProvinces}>
        <div className={styles.header}>
          <div className={styles.date}>
            <span className={styles.dateTitle}>账期:</span>&nbsp;&nbsp;
            {dateComponent}
          </div>
          <div className={styles.area}>
            <ProCity markType={markType} dateType={dateType} />
          </div>
          <div className={styles.query} onClick={this.query}>查询</div>
        </div>
        <div className={styles.twoEchart}>
          <div className={styles.twoEchartItem}>
            {contrastPie&&
            <CutPie
              markType="HOME_SUB_M"
              cutPieData={contrastPie}
              downloadData={downloadData}
              hasBorder={false}
              hasLegend
              titlePosition="left"
              echartId="membersContract"
            />
            }
          </div>
          <div className={styles.twoEchartItem}>
            <HomeCompareBar
              downloadData={downloadData}
              colors={['#F67373']}
              chartData={internetSpeed}
              echartId="internetSpeed"
            />
          </div>
        </div>
        <div className={styles.twoEchart}>
          <div className={styles.twoEchartItem}>
            {homeNumberPie&&
            <CutPie
              markType="HOME_SUB_M"
              cutPieData={homeNumberPie}
              downloadData={downloadData}
              // hasBorder
              hasLegend
              titlePosition="left"
              echartId="equipmentDistribution"
            />
            }
          </div>
          <div className={styles.twoEchartItem}>
            {homeTypePie&&
            <CutPie
              markType="HOME_SUB_M"
              cutPieData={homeTypePie}
              downloadData={downloadData}
              // hasBorder
              hasLegend
              titlePosition="left"
              echartId="familyNumContract"
            />
            }
          </div>
        </div>
        <div className={styles.twoEchart}>
          <div className={styles.twoEchartItem}>
            <BuildingTop10
              download
              echartId="homeViewTop10"
              chartData={top10Echart}
              downloadData={downloadData}
            />
          </div>
          <div className={styles.twoEchartItem}>
            <HomeCompareBar
              downloadData={downloadData}
              colors={['#4372C5']}
              chartData={online24HourData}
              echartId="online24Hours"
            />
            {/* <Online24Hours */}
            {/* echartId="online24Hours" */}
            {/* chartData={online24HourData} */}
            {/* color={['#FF739F']} */}
            {/* downloadData={downloadData} */}
            {/* /> */}
          </div>
        </div>
      </div>
    )
  }

}
export default HomeViewSecondTab
