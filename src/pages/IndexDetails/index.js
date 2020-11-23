/* eslint-disable */
/**
 * @Description: 指标页面
 *
 * @author: sunrui
 *
 * @date: 2019/1/30
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import {DatePicker,Icon} from 'antd';
import moment from 'moment';
// import isEqual from 'lodash/isEqual';
import styles from './index.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import ProCity from '../../components/Until/proCity';
import ComponentLayout from "../../components/ProductAnalysisPop/componentLayout";
import DayTrendEchart from "@/components/Echart/dayTrendEchart"; // 当日趋势图
import MonthTotal from "@/components/Echart/monthTotal"; // 月累计趋势图
import YearTotal from "@/components/Echart/yearTotal2"; // 年累计趋势图
import RegionSituation from "@/components/Echart/regionSituation"; // 分地域情况图
import BusinessStructure from "@/components/Echart/businessStructure"; // 业务结构图
import ProductStructure from "@/components/Echart/productStructure"; // 产品结构图
import NightingalePie from "@/components/Echart/nightingalePie"; // 渠道运营
import CityRank from "@/components/Echart/indexDetailsCityRank"; // 地市排名
import IndexDetailsTable from "@/components/IndexDetails/IndexDetailsTable";
import SelectType from "@/components/Until/selectType"; // 筛选条件组件
import TurnPic from "@/components/IndexDetails/TurnPic";
import layout1 from '@/components/IndexDetails/layout1.png';
import layout2 from '@/components/IndexDetails/layout2.png';
import AddWarningImage from '../../components/warningConfig/addWarningImage';
import CollectComponent from '../../components/myCollection/collectComponent';

const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@connect(({indexDetails,selectTypeModels,proCityModels,indexDetailsTableModels}) =>({
  indexDetails,
  selectTypeModels,
  proCityModels,
  indexDetailsTableModels
}))

class IndexDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layoutFlag:1, // 大小图标记 1小 2大
      clickPicIndex:0, // 点击定位的具体大图
      chartType: '', // 跳转过来时对应的图类型
      monthLayout: {
        layout_7: [6, 6, 8, 4, 4, 4, 4],
        layout_6: [6, 6, 8, 4, 6, 6], // 指标页面月报图表6个时
        layout_5: [6, 6, 12, 6, 6], // 缺少地市排名
        layout_5_01: [6,6, 4, 4, 4],
        layout_5_02: [6,6, 12, 6, 6], // 缺少产品结构
        layout_5_03: [6,6, 12,  6, 6],  // 缺少缺少产品和业务结构
        layout_4: [6, 6, 8, 4],  // 缺少产品和业务结构；缺少产品和地市排名
        layout_3: [6,6, 12],   // 缺少产品、业务和渠道结构；缺少产品、业务和地市排名
        layout_2: [6, 6],   // 缺少产品、业务、渠道结构和地市排名
        layout_1: [12]
      },
      dayLayout: {
        // 逐月趋势、年累计趋势、分地域、地市排名、3个渠道类型
        // 当日趋势图、月累计趋势图、分地域、地市排名、3个渠道类型
        // 直辖市：北京 有分地域情况，没有地市排名？
        layout_7: [12,12,16,8,8,8,8], // 指标页面日报图表7个时
        layout_6: [12,12,16,8,12,12], // 缺少一个渠道图
        layout_5: [12, 12, 16, 8, 24], // 当日趋势图、月累计趋势图、分地域、地市排名、（产品、业务、渠道结构其中一个）
        layout_5_01: [12,12,8,8,8], // 当日趋势图、月累计趋势图、产品、业务、渠道结构
        layout_4_01:[12, 12, 16, 8],// 当日趋势图、月累计趋势图、分地域、地市排名
        layout_4: [12, 12, 12, 12], // 当日趋势图、月累计趋势图、（产品、业务、渠道结构其中两个）
        layout_3: [12,12,24], //  当日趋势图、月累计趋势图、（分地域、地市排名、产品、业务、渠道结构其中一个）
        layout_2: [12, 12], // 只有当日趋势图、月累计趋势图
        layout_1: [24] // 只有当日趋势图（一般没有这种情况）
      },
      showScreenCondition:true,
      EchartQuestMake: true, // 等待筛选条件具备后请求标志
      TableQuestMake:true,
    };

  }

  componentWillMount(){
    this.markTypeUpDate();
  }

  componentDidUpdate(prevProps){
    // console.log("指标页面componentDidUpdate")
    const {selectTypeModels,proCityModels,indexDetails,location,indexDetailsTableModels} = this.props;
    const {endDate, startDate} = indexDetailsTableModels;
    const {EchartQuestMake,TableQuestMake} = this.state;
    const {requestSuccess} = selectTypeModels;
    const {selectPro, selectCity} = proCityModels;
    const {date, markType, dateType} = indexDetails;
    if(markType !== location.state.id){
      this.markTypeUpDate();
    }
    if(markType && dateType && markType !== prevProps.indexDetails.markType){
      this.intQequest();
    }

    if(location.state.specialReportMake){ // 此判断用于专题表格跳转过来执行
      // console.log("专题请求111111");
      const {provId, cityId} = location.state.dimension[0];
      if(provId === selectPro.proId && cityId === selectCity.cityId && requestSuccess){
        // console.log("专题请求222222");
        if(EchartQuestMake){
          // console.log("请求图表",selectPro)
          this.fetchEchartsData();
        }
        if(TableQuestMake){
          console.log("请求表格上",endDate,startDate,selectPro);
          this.fetchTableData();
        }
      }
    }else {
      if(requestSuccess && date && Object.keys(selectPro).length > 0  && EchartQuestMake){
        // console.log("请求图表",selectPro)
        this.fetchEchartsData();
      }
      if(requestSuccess && endDate && startDate && Object.keys(selectPro).length > 0  && TableQuestMake){
        console.log("请求表格下",endDate,startDate,selectPro);
        this.fetchTableData();
      }
    }

  }

  // 指标页面销毁，重置内容去请求
  componentWillUnmount(){
    const { dispatch,proCityModels:{areaDate} } = this.props;
    dispatch({
      type:'indexDetails/intData',
      payload:{
        dateType: "",
        markType:"",
        date: "",
      }
    });
    // 切换指标==》重置表格的按钮为省份
    dispatch({
      type:'indexDetailsTableModels/proCityHandle',
      payload:{regionType: 1,selectIndex: 0},
    });
    dispatch({
      type:'indexDetailsTableModels/setDate',
      payload:{
        endDate: "",
        startDate: "",
      }
    });
    // 将选中的省份置为初始
    dispatch({
      type: 'proCityModels/save',
      payload: areaDate
    });
  }

  /**
   * 返回组件名和组件所占列数的布局对象数组
   * @param data 后台返回的所有图表类型的数据
   * @param cols 几条数据对应哪个布局样式，如data为3条数据时，则cols为layout_3
   * @returns {Array} 返回组件名和组件所占列数的布局对象数组
   */
  getLayouts = (data, cols) => {
    const layouts = [];
    for (let i = 0; i < data.length; i+=1) {
      layouts.push({"itemName": data[i], "layoutCols": cols[i]});
    }
    return layouts;
  };

  /**
   *  返回对应多少条数据对应的布局样式数组
   * @param data 后台返回的所有图表的数据
   * @param layoutCols 日布局组或月布局组
   * @param layout_index 出现_01或_02布局样式时名称的前半部分
   * @returns {Array} 对应多少条数据对应的布局样式数组
   */
  getLayout01Or02 = (data, layoutCols, layoutIndex) => {
    let cols = []; let isLayout02 = false;
    for (let i = 0; i < data.length; i+=1) {
      if (data[i] === "cityRank") {
        isLayout02 = true;
      }
    }
    if (isLayout02) {
      cols = layoutCols[`${layoutIndex  }_02`];
    } else {
      cols = layoutCols[`${layoutIndex  }_01`];
    }
    return cols;
  };

  /**
   * 返回组件名称和组件所占列数的布局对象数组，
   * 结构为 layout_7: [
   {"itemName": "div1", "layoutCols": 6},
   {"itemName": "div2", "layoutCols": 6},
   {"itemName": "div3", "layoutCols": 8},
   {"itemName": "div4", "layoutCols": 4},
   {"itemName": "div5", "layoutCols": 4},
   {"itemName": "div6", "layoutCols": 4},
   {"itemName": "div7", "layoutCols": 4}
   ],
   * @param data 后台返回的所有图表类型的数据
   * @param layoutCols 日布局组或月布局组
   * @param dateType 日月标识
   */
  getComponentLayoutArr(data, layoutCols, dateType) {
    let cols = [];
    let layouts = [];
    switch (data.length) {
      case 1:
        cols = layoutCols.layout_1;
        layouts = this.getLayouts(data, cols);
        break;
      case 2:
        cols = layoutCols.layout_2;
        layouts = this.getLayouts(data, cols);
        break;
      case 3:
        cols = layoutCols.layout_3;
        layouts = this.getLayouts(data, cols);
        break;
      case 4:
        if (data[2] === 'cityBar' ) {
          cols = layoutCols.layout_4_01;
        } else {
          cols = layoutCols.layout_4;
        }
        layouts = this.getLayouts(data, cols);
        break;
      case 5:
        if (data[2] !== 'cityBar' ) {
          cols = layoutCols.layout_5_01;
        } else {
          cols = layoutCols.layout_5;
        }
        // if (dateType === "2") {
        //   cols = this.getLayout01Or02(data, layoutCols, "layout_5");
        // }
        layouts = this.getLayouts(data, cols);
        break;
      case 6:
        cols = layoutCols.layout_6;
        // if (dateType === "1") {
        //   cols = this.getLayout01Or02(data, layoutCols, "layout_6");
        // }
        layouts = this.getLayouts(data, cols);
        break;
      default:
        cols = layoutCols.layout_7;
        layouts = this.getLayouts(data, cols);
        break;
    }
    return layouts;
  }

  /**
   *  返回布局器组件里面需要写入的所有组件的数组
   * @param layoutArr 具有组件名称和组价所占列数的布局对象的数组
   * @param colWidth 每一列的宽度
   * @param downloadData 下载参数
   * @returns {Array} 布局器组件里面需要写入的所有组件的数组
   */
  getComponentItems(layoutArr, colWidth, downloadData) {
    const items = [];
    for (let i = 0; i < layoutArr.length; i+=1) {
      const item = this.getLayoutItem(layoutArr[i], colWidth, downloadData, i);
      items.push(item);
    }
    return items;
  }

  /**
   * 功能：初始化图表
   * */
  getLayoutItem = (arr,colWidth, downloadData, index) =>{
    let echartDom = "";
    const {indexDetails} = this.props;
    const { dayTrend, monthBar, yearBar, cityBar, cityRank, channel, product, businessPie } = indexDetails;
    switch (arr.itemName) {
      case 'line':
        if(Object.keys(dayTrend).length === 0){
          echartDom = ""
        }else {
          const { selectTypeModels,proCityModels } = this.props;
          const {selectIdData} = selectTypeModels;
          const {selectCity,selectPro} = proCityModels;
          const {date, hot, dateType, markType,selectUnit } = indexDetails;
          const cityIds = selectCity.cityId;
          const provIds = selectPro.proId;
          const {unitId} = selectUnit;
          const lineParam ={hot,cityId:cityIds, provId:provIds, dateType, markType, selectType:selectIdData, date, unitId };
          echartDom = <div className={styles.chartDiv} ref={arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2, index)}><DayTrendEchart data={dayTrend} lineParams={lineParam} downloadData={downloadData} pattern="big" /></div>
        }
        break;
      case 'monthBar':
        if(Object.keys(monthBar).length === 0){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2, index)}><MonthTotal data={monthBar} downloadData={downloadData} btuVisible pattern="big" /></div>;
        }
        break;
      case 'yearBar':
        if(Object.keys(yearBar).length === 0){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2, index)}><YearTotal data={yearBar} downloadData={downloadData} pattern="big" /></div>;
        }
        break;
      case 'cityBar':
        if(Object.keys(cityBar).length === 0){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2, index)}><RegionSituation data={cityBar} downloadData={downloadData} btuVisible pattern="big" searchPage="0" /></div>;
        }
        break;
      case 'cityRank':
        if(Object.keys(cityRank).length === 0){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2, index)}><CityRank data={cityRank} downloadData={downloadData} btuVisible pattern="big" /></div>;
        }
        break;
      case 'product':
        if(Object.keys(product).length === 0){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2, index)}><ProductStructure data={product} downloadData={downloadData} pattern="big" /></div>;
        }
        break;
      case 'channel':
        if(Object.keys(channel).length === 0){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2, index)}><NightingalePie data={channel} downloadData={downloadData} pattern="big" /></div>;
        }
        break;
      default :
        if(Object.keys(businessPie).length === 0 ){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2, index)}><BusinessStructure data={businessPie} downloadData={downloadData} pattern="big" /></div>;
        }
    }
    return echartDom;
  };

  /**
   * 功能：请求单个图表数据
   * */
  // 日趋势图
  onChangeTime = (time,cityIds, provIds, dateType, markType, selectType, date,  unitId ) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'indexDetails/fetchDayTrend',
      payload:{
        time,
        provId: provIds,
        cityId: cityIds,
        dateType,
        date,
        markType,
        selectType,
        unitId,
        hot:"",
      }
    })
  };

  // 月柱状图
  fetchMonthBar = (provIds, cityIds, dateType, date,markType, selectType , hot, unitId ) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'indexDetails/fetchMonthBar',
      payload:{
        provId: provIds,
        cityId: cityIds,
        dateType,
        date,
        markType,
        selectType,
        unitId,
        hot,
      }
    })
  };

  // 年柱状图
  fetchYearBar = (provIds, cityIds, dateType, date,markType, selectType, hot, unitId ) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'indexDetails/fetchYearBar',
      payload:{
        provId: provIds,
        cityId: cityIds,
        dateType,
        date,
        markType,
        selectType,
        unitId,
        hot,
      }
    })
  };

  // 城市柱状图
  fetchCityBar = (provIds, cityIds, dateType, date,markType, selectType, hot, unitId ) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'indexDetails/fetchCityBar',
      payload:{
        provId: provIds,
        cityId: cityIds,
        dateType,
        date,
        markType,
        selectType,
        unitId,
        hot,
      }
    })
  };

  // 城市排名图
  fetchCityRank = (provIds, cityIds, dateType, date,markType, selectType, hot, unitId) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'indexDetails/fetchCityRank',
      payload:{
        provId: provIds,
        cityId: cityIds,
        dateType,
        date,
        markType,
        selectType,
        unitId,
        hot,
      }
    })
  };

  // 渠道结构 产品结构 业务结构
  fetchConditionChart = (time, provId, cityId, dateType, date, markType, selectType, hot, chartType, unitId) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'indexDetails/fetchConditionChart',
      payload:{
        chartType,
        provId,
        cityId,
        dateType,
        date,
        markType,
        selectType,
        unitId,
        hot,
      }
    })
  };


  /**
   * 功能：显示隐藏筛选条件
   * */
  showScreenCondition = () =>{
    const {showScreenCondition} = this.state;
    this.setState({
      showScreenCondition:!showScreenCondition
    })
  };

  /**
   * 功能：切换echarts大小图按钮
   * */
  changeEchartButton = (layoutFlag,index) =>{
    this.setState({
      layoutFlag,
      clickPicIndex: index
    })
  };

  /**
   * 功能：改变筛选条件时间
   * */
  changeConditionDate = (date, dateString) =>{
    const {dispatch} = this.props;
    dispatch({
      type: 'indexDetails/setDate',
      payload: dateString
    });
  };

  /**
   * 功能：点击查询按钮
   * */
  screenConditionClick = () =>{
    this.fetchEchartsData();
    this.fetchTableData();
  };

  /**
   * @date: 2019/3/14
   * @author liuxiuqian
   * @Description: 更新从其他页面带入指标页的信息：指标id、最大账期、账期类型
   *               重置指标页面的默认条件
   * @method markTypeUpDate
   */
  markTypeUpDate(){
    const {dispatch, location,proCityModels:{areaDate}} = this.props;
    const {state} = location;
    let dateType2 =  "1";
    let markType = "CKP_23323";
    let date2 = "";
    let layoutFlag2 = 1;
    let chartType2 = "";
    if(state){
      const {dimension, dateType, id, layoutFlag, chartType } = state;
      if(dimension){
        date2 = dimension[0].date;
        layoutFlag2 = layoutFlag;
        chartType2 = chartType;
      }
      dateType2 = dateType;
      markType = id;
    }
    // 重置筛选条件
    dispatch({
      type: 'indexDetails/setDate',
      payload: ""
    });
    dispatch({
      type:'indexDetailsTableModels/setDate',
      payload:{
        endDate: "",
        startDate: "",
      },
    });
    dispatch({
      type:'indexDetails/intData',
      payload:{
        dateType: dateType2,
        markType,
        date: date2,
      }
    });
    dispatch({
      type:'indexDetailsTableModels/proCityHandle',
      payload:{regionType: 1,selectIndex: 0},
    });
    if(areaDate.length>0){
      dispatch({
        type: 'proCityModels/save',
        payload: areaDate
      });
    }
    this.setState({
      EchartQuestMake:true,
      TableQuestMake: true,
      layoutFlag: layoutFlag2,
      chartType: chartType2
    })
  }

  /**
   * 切换单位
   * @param unit
   * @param event
   */
  changeUnit(unit){
    const {dispatch} = this.props;
    dispatch({
      type: 'indexDetails/setUnit',
      payload: {
        unitName : unit.unitName,
        unitId : unit.unitId
      }
    });
    this.fetchEchartsData();
    this.fetchTableData(unit.unitId);
  }

  intQequest(){
    const {dispatch,indexDetails} = this.props;
    const {markType,dateType,date} = indexDetails;
    dispatch({
      type: 'indexDetails/fetchIndexDescrip',
      payload: {markType}
    });
    dispatch({
      type: 'indexDetails/fetchMaxDate',
      payload: {markType,dateType}
    });
    // 请求表格的日期
    dispatch({
      type:'indexDetailsTableModels/fetchDateSection',
      payload:{dateType,markType,date},
    });
    this.setState({
      EchartQuestMake:true,
      TableQuestMake: true,
    })
  }

  /**
   * 功能：请求图表数据
   * */
  fetchEchartsData(){
    const {dispatch,selectTypeModels,proCityModels,indexDetails } = this.props;
    const {selectIdData} = selectTypeModels;
    const {selectCity,selectPro} = proCityModels;
    const {date, time, hot, dateType, markType} = indexDetails;
    this.setState({
      EchartQuestMake:false,
    });
    dispatch({
      type:'indexDetails/fetchChartTypes',
      payload:{
        time,
        provId: selectPro.proId,
        hot,
        cityId: selectCity.cityId,
        dateType,
        date,
        markType,
        selectType: selectIdData
      },
      callback:()=>{
        this.chartTypeHandle();
      }
    })
  }

  chartTypeHandle(){
    const {selectTypeModels,proCityModels,indexDetails } = this.props;
    const {chartType, layoutFlag} = this.state;
    const {selectIdData} = selectTypeModels;
    const {selectCity,selectPro} = proCityModels;
    const {date, time, hot, dateType, markType, chartTypes, selectUnit} = indexDetails;
    const cityIds = selectCity.cityId || "";
    const provIds = selectPro.proId || "";
    const selectType = selectIdData;
    const {unitId} = selectUnit;
    chartTypes.forEach((cType, index) => {
      if(layoutFlag === 2 && chartType === cType){
        this.setState({clickPicIndex: index})
      }
      switch (cType) {
        case 'line':
          this.onChangeTime(time,cityIds, provIds, dateType, markType, selectType, date, unitId);
          break;
        case 'monthBar':
          this.fetchMonthBar(provIds, cityIds, dateType, date,markType, selectType, hot, unitId);
          break;
        case 'yearBar':
          this.fetchYearBar(provIds, cityIds,dateType, date, markType, selectType, hot, unitId);
          break;
        case 'cityBar':
          this.fetchCityBar(provIds, cityIds, dateType, date, markType, selectType, hot, unitId);
          break;
        case 'cityRank':
          this.fetchCityRank(provIds, cityIds, dateType, date, markType, selectType, hot, unitId);
          break;
        case 'product':
          this.fetchConditionChart("7", provIds, cityIds, dateType, date, markType, selectType, hot, "product", unitId);
          break;
        case 'channel':
          this.fetchConditionChart("7", provIds, cityIds, dateType, date, markType, selectType, hot, "channel", unitId);
          break;
        default :
          this.fetchConditionChart("7", provIds, cityIds, dateType, date, markType, selectType, hot, "businessPie", unitId);
      }
    });
  }

  // 表格请求
  fetchTableData(unitId){
    const {dispatch,selectTypeModels,proCityModels,indexDetails,indexDetailsTableModels } = this.props;
    const {selectIdData} = selectTypeModels;
    const {selectCity,selectPro} = proCityModels;
    const {startDate, endDate, regionType} = indexDetailsTableModels;
    // 重置表格的账期区间
    const {markType,dateType,selectUnit,date} = indexDetails;
    // let endDateRes = endDate;
    let startDateRes = startDate;
    const endDateRes = date;
    if(date !== ""){
      startDateRes = dateType ==="1" ?moment(endDateRes).subtract(30,"day").format("YYYY-MM-DD"):moment(endDateRes).subtract(12,"month").format("YYYY-MM");
      dispatch({
        type:"indexDetailsTableModels/setDate",
        payload:{
          endDate: endDateRes,
          startDate:startDateRes
        }
      })
    }
    let unitIdRes = unitId;
    if(unitId === undefined){
      unitIdRes = selectUnit.unitId||"";
    }

    console.log("请求表格");
    console.log({
      cityId: selectCity.cityId || "",
      dateType,
      dimension: selectIdData,
      endDate:endDateRes,
      startDate:startDateRes,
      markType,
      provinceId: selectPro.proId||"",
      regionType,
      unitId:unitIdRes
    });
    dispatch({
      type:'indexDetailsTableModels/fetchIDTableData',
      payload:{
        cityId: selectCity.cityId || "",
        dateType,
        dimension: selectIdData,
        endDate:endDateRes,
        startDate:startDateRes,
        markType,
        provinceId: selectPro.proId||"",
        regionType,
        unitId:unitIdRes
      }
    });
    this.setState({
      TableQuestMake: false,
    })
  }

  /**
   * @date: 2019/3/6
   * @author liuxiuqian
   * @Description: 下载参数整理
   * @method downloadParameters
   * @param {参数类型} 参数名 参数说明
   * @return {} 整理后的数据
   */
  downloadParameters(){
    const {selectTypeModels,proCityModels,indexDetails } = this.props;
    const {selectNameData} = selectTypeModels;
    const {selectCity,selectPro} = proCityModels;
    const {selectUnit, indexInfo, date} = indexDetails;
    return {selectCity, selectPro, date, selectNameData, title: indexInfo.indexName, selectUnit}
  }

  render() {
    const {indexDetails, location, selectTypeModels,proCityModels} = this.props;
    const {state} = location;
    const {dateType,indexInfo,maxDate, date, unitGroup, selectUnit, chartTypes,hot} = indexDetails;
    const {dayLayout, monthLayout, layoutFlag, showScreenCondition, clickPicIndex,clickQuery} = this.state;
    const {conditionData} = selectTypeModels;

    const {selectCity,selectPro} = proCityModels;
    const cityIds = selectCity.cityId;
    const provIds = selectPro.proId;
    const {unitId} = selectUnit;
    let proCityData = null;
    let selectTypeData = null;
    let markType = "CKP_23323";
    if(state){
      const {dimension, id} = state;
      if(dimension){
        const {cityId, provId, selectType} = dimension[0];
        selectTypeData = selectType;
        proCityData = {
          cityId, proId:provId
        }
      }
      markType = id;
    }
    // 单位
    const unitDom = unitGroup.map((item)=>{
      let activeStayle = "";
      if(selectUnit.unitId === item.unitId){
        activeStayle = "active";
      }
      return (<li key={item.unitId} className={styles[activeStayle]} onClick={()=>this.changeUnit(item)}>{item.unitName}</li>);
    });

    // 日期
    let disabledDate;
    if(date !== ''){
      disabledDate=(current)=>current && current > moment(maxDate);
    }
    let screenConditionDate;
    const triangle = <i className={styles.dateTriangle} />;
    if(dateType === "1"){
      screenConditionDate = <DatePicker showToday={false} value={moment(date, dateFormat)} disabledDate={disabledDate} allowClear={false} format={dateFormat} onChange={this.changeConditionDate} suffixIcon={triangle} />
    }else {
      screenConditionDate = <MonthPicker showToday={false} value={moment(date, monthFormat)} disabledDate={disabledDate} allowClear={false} format={monthFormat} onChange={this.changeConditionDate} suffixIcon={triangle} />
    }

    // 渲染图
    let items = [];
    const downloadData= this.downloadParameters();
    const chartsLayoutCols = dateType === "1" ? dayLayout : dayLayout; // 根据日月标识判断是选择日布局组还是月布局组
    const contentWidth = window.chrome ? 1566 : 1580;
    // 增加ifFetchSuccess的判断
    if (chartTypes !== undefined) {
      if (chartTypes.length > 0) {
        const componentLayoutArr = this.getComponentLayoutArr(chartTypes, chartsLayoutCols, dateType); // 返回组件名称和组件所占列数的布局对象数组
        const colWidth = contentWidth / 12;
        items = this.getComponentItems(componentLayoutArr, colWidth, downloadData);
      }
    }
    const lineParams ={hot,cityId:cityIds, provId:provIds, dateType, markType, selectType:conditionData, date, unitId };
    const layout = layoutFlag === 1 ?
      <div>
        <ComponentLayout>
          {items}
        </ComponentLayout>
      </div>
      :
      <div>
        <TurnPic chartTypes={chartTypes} clickPicIndex={clickPicIndex} downloadData={downloadData} lineParams={lineParams} />
      </div>;
    const condition={
      warnId:"", // 编辑预警的id
      dateType, // 日月标识
      markType: '', // 专题id
      indexId: markType, // 指标Id
      provId:provIds,
      cityId:cityIds,
      IsSubKpi:"1", // 指标专题标识，1：指标；2：专题
    };
    const collectStyle ={
      marginLeft:'1%'
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.indexDetailBody}>
          <div className={styles.indexDetailDescrip}>
            <div className={styles.indexDetailName}>
              {indexInfo.indexName}
            </div>
            <div className={styles.indexDetailAddWarning}>
              <AddWarningImage condition={condition} />
            </div>
            <div className={styles.indexDetailUnit}>
              <ul className={styles.unitUl}>
                {unitDom}
              </ul>
            </div>
            <CollectComponent key={markType} markType={markType} searchType='1' imgStyle={collectStyle} />
            <div className={styles.indexDetailDesc}>
              {indexInfo.indexDetails}
            </div>
          </div>
          <div className={styles.indexDetailCondition}>
            <div className={styles.topContent}>
              <div className={styles.areaSelector}>
                <ProCity selectData={proCityData} markType={markType} />
              </div>
              <div className={styles.dateSelector}>
                日期：{screenConditionDate}
              </div>
            </div>
            <div className={styles.screenConditionContet}>
              <div className={!showScreenCondition || conditionData.length === 0 ? styles.screenConditionNone : ""}>
                <SelectType type="indexDetails" markType={markType} selectType={selectTypeData} />
              </div>
              <div className={styles.showScreenCondition}>
                {conditionData.length>0 ? <span className={styles.showText} onClick={this.showScreenCondition}>{showScreenCondition ? "收起" : "更多选项"}<Icon className={styles.showTextIcon} type={showScreenCondition ? "up" : "down"} style={{color:'#c91917'}} /></span> : null}
                <span className={styles.screenConditionButton} onClick={this.screenConditionClick}>查询</span>
                <img alt="" className={styles.screenConditionHide} src={layoutFlag === 1 ? layout1 : layout2} onClick={()=>this.changeEchartButton(layoutFlag === 1 ? 2 : 1, 0 )} />
              </div>
            </div>
          </div>
          <div className={styles.indexDetailLayOut}>
            {layout}
          </div>
          <div className={styles.indexDetailTable}>
            <h2>{dateType === "1" ? "逐日分省数据表" : "逐月分省数据表"}</h2>
            <IndexDetailsTable downloadData={downloadData} clickQuery={clickQuery} />
          </div>
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default IndexDetails
