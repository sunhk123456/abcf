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
import classnames from 'classnames';
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
import TurnPic from "@/components/IndexDetails/TurnPic";
import layout1 from '@/components/IndexDetails/layout1.png';
import layout2 from '@/components/IndexDetails/layout2.png';

@connect(({indexDetails,proCityModels}) =>({
  ...indexDetails,
  ...proCityModels
}))

class IndexDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // dimension:{"1": ["-1"]},
      layoutFlag:1,
      clickPicIndex:1,
      dateType: "1",
      chartTypes:[],
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
        layout_7: [6, 6, 8, 4, 4, 4, 4], // 指标页面日报图表7个时
        layout_6_01: [6, 6, 12, 4, 4, 4], // 缺少地市排名
        layout_6_02: [6, 6, 8, 4, 6, 6], // 缺少产品结构
        layout_5: [6, 6, 12, 6, 6], // 缺少产品和业务结构；缺少产品和地市排名
        layout_5_02: [6, 6, 4, 4, 4], // 缺少地市排名和省分趋势图
        layout_4: [6, 6, 8, 4], // 缺少产品、业务和渠道结构；缺少产品、业务和地市排名
        layout_3: [6, 6, 12], // 缺少产品、业务、渠道结构和地市排名
        layout_2: [6, 6],
        layout_1: [12]
      },
      provIds:'111',
      cityIds:'',
      maxDate:"",
      date:'',
      selectType: [{1: ["-1"]}, {2: ["-1"]}, {3: ["-1"]}],
      selectUnit:{unitId: "2", unitName: "万元"},
      unitId:'2',
      lineParam:{},
      showScreenCondition:true,
      buttonConditions:[], // 按钮筛选条件
      buttonChoose:[
        [true],[true],[true]
      ], // 按钮的初始选定状态
      testNum:1,
      conditionIdName:[
        {screenTypeName: "渠道类型", value:{sid: "-1", sname: "全部"}},
        {screenTypeName: "产品类型", value:{sid: "-1", sname: "全部"}},
        {screenTypeName: "业务类型", value:{sid: "-1", sname: "全部"}},
      ],
      markType: "CKP_23323",
    };

  }

  componentDidMount() {
    const {location} = this.props;
    const {state} = location;
    if(state){
      const {dateType, dimension, id} = state;
      const {cityId, date, provId, selectType} = dimension[0]
      this.setState({
        markType: id,
        selectType,
        dateType,
        date,
        provIds:provId,
        cityIds:cityId
      },()=>{
        this.intQequest();
      });

    }else {
      this.intQequest();
    }
  };

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
  }

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
  }

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
        cols = layoutCols.layout_4;
        layouts = this.getLayouts(data, cols);
        break;
      case 5:
        if (data[2] !== 'cityBar' ) {
          cols = layoutCols.layout_5_02;
        } else {
          cols = layoutCols.layout_5;
        }
        if (dateType === "2") {
          cols = this.getLayout01Or02(data, layoutCols, "layout_5");
        }
        layouts = this.getLayouts(data, cols);
        break;
      case 6:
        cols = layoutCols.layout_6;
        if (dateType === "1") {
          cols = this.getLayout01Or02(data, layoutCols, "layout_6");
        }
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
      const item = this.getLayoutItem(layoutArr[i], colWidth, downloadData);
      items.push(item);
    }
    return items;
  }

  /**
   * 功能：初始化图表
   * */
  getLayoutItem = (arr,colWidth, downloadData) =>{
    let echartDom = "";
    const {lineParam} = this.state;
    const { dayTrend, monthBar, yearBar, cityBar, cityRank, channel, product, businessPie } = this.props;
    switch (arr.itemName) {
      case 'line':
        if(dayTrend.data === undefined){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={2*arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2)}><DayTrendEchart data={dayTrend} lineParams={lineParam} downloadData={downloadData} pattern="big" /></div>
        }
        break;
      case 'monthBar':
        if(monthBar.data === undefined){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={2*arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2)}><MonthTotal data={monthBar} pattern="big" /></div>;
        }
        break;
      case 'yearBar':
        console.log(yearBar);
        if(yearBar.data === undefined){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={2*arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2)}><YearTotal data={yearBar} pattern="big" /></div>;
        }
        break;
      case 'cityBar':
        if(cityBar.data === undefined){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={2*arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2)}><RegionSituation data={cityBar} pattern="big" /></div>;
        }
        break;
      case 'cityRank':
        if(cityRank.data === undefined){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={2*arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2)}><CityRank data={cityRank} pattern="big" /></div>;
        }
        break;
      case 'product':
        if(product.data === undefined){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={2*arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2)}><ProductStructure data={product} pattern="big" /></div>;
        }
        break;
      case 'channel':
        if(channel.data === undefined){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={2*arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2)}><NightingalePie data={channel} pattern="big" /></div>;
        }
        break;
      default :
        if(businessPie.data === undefined){
          echartDom = ""
        }else {
          echartDom = <div className={styles.chartDiv} ref={2*arr.layoutCols} key={arr.itemName} onClick={()=>this.changeEchartButton(2)}><BusinessStructure data={businessPie} pattern="big" /></div>;
        }
    }
    return echartDom;
  }

  /**
   * 功能：请求图表数据
   * */
  fetchEchartsData = () =>{
    const {dispatch,time,hot} = this.props;
    const {provIds,cityIds,date,selectType,unitId,markType,dateType} = this.state;
    dispatch({
      type:'indexDetails/fetchChartTypes',
      payload:{
        time,
        "provId": provIds,
        hot,
        "cityId": cityIds,
        dateType,
        date,
        markType,
        selectType
      }
    }).then((data) => {
      this.setState({
        chartTypes:data.chartType,
      },() => {
        // 根据接口返回图表类型数据请求接口
        data.chartType.forEach((cType) => {
          switch (cType) {
            case 'line':
              this.setState({
                lineParam:{
                  cityIds, provIds, dateType, markType, selectType, date, unitId
                }
              })
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
      })
    })
  }

  /**
   * 功能：请求单个图表数据
   * */
  // 日趋势图
  onChangeTime = (time,cityIds, provIds, dateType, markType, selectType, date, /* unitId */) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'indexDetails/fetchDayTrend',
      payload:{
        "time": time,
        "provId": provIds,
        "cityId": cityIds,
        "dateType": dateType,
        "date": date,
        "markType": markType,
        "selectType": selectType,
        "unitId": "",
        hot:"",
      }
    })
  };

  // 月柱状图
  fetchMonthBar = (provIds, cityIds, dateType, date,markType, selectType /* hot, unitId */) =>{
    const {dispatch} = this.props;
    const kong = "";
    dispatch({
      type:'indexDetails/fetchMonthBar',
      payload:{
        "provId": provIds,
        "cityId": cityIds,
        "dateType": dateType,
        "date": date,
        "markType": markType,
        "selectType": selectType,
        "unitId": kong,
        hot:kong,
      }
    })
  }

  // 年柱状图
  fetchYearBar = (provIds, cityIds, dateType, date,markType, selectType) =>{
    const {dispatch} = this.props;
    const kong = "";
    dispatch({
      type:'indexDetails/fetchYearBar',
      payload:{
        "provId": provIds,
        "cityId": cityIds,
        "dateType": dateType,
        "date": date,
        "markType": markType,
        "selectType": selectType,
        "unitId": kong,
        hot:kong
      }
    })
  }

  // 城市柱状图
  fetchCityBar = (provIds, cityIds, dateType, date,markType, selectType /* , hot, unitId */) =>{
    const {dispatch} = this.props;
    const kong = "";
    dispatch({
      type:'indexDetails/fetchCityBar',
      payload:{
        "provId": provIds,
        "cityId": cityIds,
        "dateType": dateType,
        "date": date,
        "markType": markType,
        "selectType": selectType,
        "unitId": kong,
        hot:kong,
      }
    })
  }

  // 城市排名图
  fetchCityRank = (provIds, cityIds, dateType, date,markType, selectType) =>{
    const {dispatch} = this.props;
    const kong = "";
    dispatch({
      type:'indexDetails/fetchCityRank',
      payload:{
        "provId": provIds,
        "cityId": cityIds,
        "dateType": dateType,
        "date": date,
        "markType": markType,
        "selectType": selectType,
        "unitId": kong,
        hot:kong,
      }
    })
  }

  // 渠道结构 产品结构 业务结构
  fetchConditionChart = (time, provId, cityId, dateType, date, markType, selectType, hot, chartType) =>{
    const {dispatch} = this.props;
    const kong = "";
    dispatch({
      type:'indexDetails/fetchConditionChart',
      payload:{
        "chartType":chartType,
        "provId": provId,
        "cityId": cityId,
        "dateType": dateType,
        "date": date,
        "markType": markType,
        "selectType": selectType,
        "unitId": kong,
        hot:kong,
      }
    })
  }


  /**
   * 功能：显示隐藏筛选条件
   * */
  showScreenCondition = () =>{
    const {showScreenCondition} = this.state
    this.setState({
      showScreenCondition:!showScreenCondition
    })
  }

  /**
   * 功能：切换echarts大小图按钮
   * */
  changeEchartButton = (index) =>{
    this.setState({
      layoutFlag:index,
      clickPicIndex: 1
    })
  }

  /**
   * 功能：点击小图跳转到相应大图
   * */
  onClickPicReturn = (index) =>{
    this.setState({
      layoutFlag: 2,
      clickPicIndex: index
    });
  }

  /**
   * 功能：改变筛选条件时间
   * */
  changeConditionDate = (date, dateString) =>{
    this.setState({
      date:dateString,
    })
  }




  /**
   * 功能：利用给出的按钮筛选条件数据，创造出若干行按钮的样式
   * */
  createButtonCondition=(buttonsData,choose)=>{
    let i=0;
    let j=0;
    let buttonChild=[];
    const buttonAll=[];
    for(i=0;i<buttonsData.length;i+=1){
      for(j=0;j<buttonsData[i].values.length;j+=1){
        buttonChild.push(
          <span
            key={buttonsData[i].values[j].sname}
            style={{display:'inline-block',cursor:'pointer',textAlign:'center'}}
            title={i.toString()+j.toString()}
            className={choose[i][j]===true?styles.btnStyleChoosed:styles.btnStyle}
            id={buttonsData[i].screenTypeId+buttonsData[i].values[j].sid}
            onClick={this.onClickButtonCon}
          >
            {buttonsData[i].values[j].sname}
          </span>
        );
      }
      buttonAll.push(<div key={buttonsData[i].screenTypeName} className={styles.btnDiv}>{`${buttonsData[i].screenTypeName}:`}{buttonChild}</div>);
      buttonChild=[];
    }
    return buttonAll;
  }

  /**
   * 功能：按钮筛选条件点击
   * */
  onClickButtonCon=(e)=>{
    const {buttonChoose,testNum}=this.state;
    const newButtonChoose=buttonChoose;
    let allNotChooseState=false; // 除了全部按钮外的所有按钮存在着选中状态标志
    let i=0;
    const lineNumber=Number(e.target.title.substr(0,1));
    const SpanNumber=Number(e.target.title.substr(1,1));
    if(SpanNumber===0){
      for(i=0;i<newButtonChoose[lineNumber].length;i+=1){
        if(i===0){
          newButtonChoose[lineNumber][i]=true;
        }
        else {
          newButtonChoose[lineNumber][i]=false;
        }
      }
    }
    else {
      newButtonChoose[lineNumber][SpanNumber] = newButtonChoose[lineNumber][SpanNumber] === true ? "" : true;
      newButtonChoose[lineNumber][0]="";
    }
    for(i=1;i<newButtonChoose[lineNumber].length;i+=1){
      if(newButtonChoose[lineNumber][i]===true){
        allNotChooseState=true;
      }
    }
    if(allNotChooseState===false){
      newButtonChoose[lineNumber][0]=true;
    }
    this.setState({
      buttonChoose:newButtonChoose,
      testNum:testNum+1
    })
  }

  /**
   * 功能：利用当前按钮筛选条件的状态生成当前用于请求接口时的筛选条件格式
   * */
  createButtonConditionForSearch=()=>{
    const {buttonChoose,buttonConditions}=this.state;
    console.log(buttonChoose)
    let i=0;
    let j=0;
    let k=0;
    const condition=[{1:[]},{2:[]},{3:[]}];
    const conditionIdName = [];
    if(buttonConditions.length>0){
      for(i=0;i<buttonChoose.length;i+=1){
        const obj = {
          screenTypeName:buttonConditions[i].screenTypeName,
          screenTypeId:buttonConditions[i].screenTypeId,
        }
        for(j=0;j<buttonChoose[i].length;j+=1){
          if(buttonChoose[i][j]===true){
            obj.value = buttonConditions[i].values[j]
            conditionIdName.push(obj)
            condition[i][i+1][k]=buttonConditions[i].values[j].sid;
            k+=1;
          }
        }
        k=0;
      }
    }

    return {condition, conditionIdName};
  }


  /**
   * 功能：点击查询按钮
   * */
  screenConditionClick = () =>{
    const {selectPro,selectCity} = this.props;
    const {condition, conditionIdName}=this.createButtonConditionForSearch();
    this.setState({
      selectType:condition,
      provIds:selectPro.proId,
      cityIds:selectCity.cityId,
      conditionIdName
    },()=>{
      this.fetchEchartsData()
    })
  }


  /**
   * 切换单位
   * @param unitId
   * @param event
   */
  changeUnit = (unit) =>{
    this.setState({
      unitId:unit.unitId,
      selectUnit: unit
    },()=>{
      this.fetchEchartsData()
    })
  }

  intQequest(){
    const {dispatch} = this.props;
    const {date,markType,dateType} = this.state;
    dispatch({
      type: 'indexDetails/fetchScreenCondition',
      payload: {markType}
    }).then((data) =>{
      this.setState({
        buttonConditions:data
      })
    });
    dispatch({
      type: 'indexDetails/fetchIndexDescrip',
      payload: {markType}
    });
    dispatch({
      type: 'indexDetails/fetchAreaInfo',
      payload: {}
    });
    dispatch({
      type: 'indexDetails/fetchMaxDate',
      payload: {markType,dateType}
    }).then((maxDate) => {
      let date2 = maxDate.date;
      if(date){
        date2 = date;
      }
      this.setState({
        date: date2,
        maxDate: maxDate.date
      })
    });
    this.fetchEchartsData()
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
    const {selectCity, selectPro, indexInfo} = this.props;
    const {date, conditionIdName, selectUnit} = this.state;
    return {selectCity, selectPro, date, conditionIdName, title: indexInfo.indexName, selectUnit}
  }

  render() {
    const {indexInfo,areaInfo} = this.props;
    const {maxDate, date,layoutFlag,chartTypes,dateType,dayLayout,monthLayout,showScreenCondition,clickPicIndex,buttonConditions,buttonChoose,provIds,cityIds,selectType,unitId,} = this.state;
    if (date === "" || indexInfo.indexName === undefined || areaInfo.length === 0 || chartTypes.length === 0){
      return null;
    }

    const downloadData = this.downloadParameters();

    // 切换单位按钮
    const { unitGroup } = indexInfo;
    const unitNum = unitGroup.length;
    let selectorUnitButton;
    const unitIdInt = parseInt(unitId,10);
    const unitDiv = unitGroup.map((item,index) => {
      if(unitNum === 1){
        return (
          <span
            key={item.unitId}
            className={classnames(styles.indexDetailsUnitButton,styles.indexDetailsUnitButtonSingle)}
            // ref={`indexDetails-unit-button-${item.unitId}`}
          >{item.unitName}
          </span>
        )
      }
      if(index === 0){
      if (unitIdInt === index+1){
        selectorUnitButton = styles.indexDetailsUnitButtonTrue
      }else {
        selectorUnitButton = styles.indexDetailsUnitButtonFalse
      }
        return (
          // 头
          <span
            key={item.unitId}
            className={classnames(styles.indexDetailsUnitButton, styles.indexDetailsUnitButtonFirst,selectorUnitButton)}
            ref={`indexDetails-unit-button-${item.unitId}`}
            onClick={this.changeUnit.bind(this,item)}
          >{item.unitName}
          </span>)
      }
      if(index === unitGroup.length-1){
        if (unitIdInt === index+1){
          selectorUnitButton = styles.indexDetailsUnitButtonTrue
        }else {
          selectorUnitButton = styles.indexDetailsUnitButtonFalse
        }
        return (
          // 尾
          <span
            key={item.unitId}
            className={classnames(styles.indexDetailsUnitButton, styles.indexDetailsUnitButtonLast,selectorUnitButton)}
            ref={`indexDetails-unit-button-${item.unitId}`}
            onClick={this.changeUnit.bind(this,item)}
          >{item.unitName}
          </span>)
      }
      if (unitIdInt === index+1){
        selectorUnitButton = styles.indexDetailsUnitButtonTrue
      }else {
        selectorUnitButton = styles.indexDetailsUnitButtonFalse
      }
      return (
        // 中
        <span
          key={item.unitId}
          className={classnames(styles.indexDetailsUnitButton, selectorUnitButton)}
          ref={`indexDetails-unit-button-${item.unitId}`}
          onClick={this.changeUnit.bind(this,item)}
        >{item.unitName}
        </span>)

    })


    // 日期
    const dateFormat = 'YYYY-MM-DD';
    const monthFormat = 'YYYY-MM';
    const { MonthPicker } = DatePicker;
    let disabledDate;
    if(date !== ''){
      disabledDate=(current)=>current && current > moment(maxDate);
    }
    let screenConditionDate;
    if(dateType === "1"){
      screenConditionDate = <DatePicker value={moment(date, dateFormat)} disabledDate={disabledDate} allowClear={false} format={dateFormat} onChange={this.changeConditionDate} />
    }else {
      screenConditionDate = <MonthPicker value={moment(date, monthFormat)} disabledDate={disabledDate} allowClear={false} format={monthFormat} onChange={this.changeConditionDate} />
    }


    let items = [];
    const chartsLayoutCols = dateType === "1" ? dayLayout : monthLayout; // 根据日月标识判断是选择日布局组还是月布局组
    const contentWidth = window.chrome ? 1566 : 1580;
    // 增加ifFetchSuccess的判断
    if (chartTypes !== undefined) {
      if (chartTypes.length > 0) {
        const componentLayoutArr = this.getComponentLayoutArr(chartTypes, chartsLayoutCols, dateType); // 返回组件名称和组件所占列数的布局对象数组
        const colWidth = contentWidth / 12;
        items = this.getComponentItems(componentLayoutArr, colWidth, downloadData);
      }
    }
    const layout = layoutFlag === 1 ?
      <div>
        <ComponentLayout callbackParent={this.onClickPicReturn}>
          {items}
        </ComponentLayout>
      </div>
      :
      <div style={{height:900}}>
        <TurnPic chartTypes={chartTypes} clickPicIndex={clickPicIndex} />
      </div>


    let buttonCondition; // 按钮筛选条件
    if (buttonConditions.length !== 0) {
      buttonCondition=this.createButtonCondition(buttonConditions,buttonChoose);
    }

    const layoutTypeImg =  layoutFlag === 1 ?
      <img alt="" className={styles.screenConditionHide} src={layout1} onClick={()=>this.changeEchartButton(2)} />
      :
      <img alt="" className={styles.screenConditionHide} src={layout2} onClick={()=>this.changeEchartButton(1)} />

    const showCondition = showScreenCondition?
      <div>
        <span onClick={this.showScreenCondition}>
        收起 &nbsp; <Icon type="up" style={{color:'#c91917'}} />
        </span>&nbsp;&nbsp;&nbsp;
        <div className={styles.screenConditionButton} onClick={this.screenConditionClick}>
          查询
        </div>&nbsp;&nbsp;&nbsp;
        {layoutTypeImg}
      </div>
      :
      <div>
        <span onClick={this.showScreenCondition}>
        更多选项 &nbsp; <Icon type="down" style={{color:'#c91917'}} />
        </span>&nbsp;&nbsp;&nbsp;
        <div className={styles.screenConditionButton} onClick={this.screenConditionClick}>
          查询
        </div>&nbsp;&nbsp;&nbsp;
        {layoutTypeImg}
      </div>

    // 表格参数
    const IDTablePara = {
      date,
      provIds,
      cityIds,
      selectType,
      unitId,
    }

    return (
      <PageHeaderWrapper>
        <div className={styles.indexDetailBody}>
          <div className={styles.indexDetailDescrip}>
            <div className={styles.indexDetailName}>
              {indexInfo.indexName}
            </div>
            <div className={styles.indexDetailUnit}>
              {unitDiv}
            </div>
            <div className={styles.indexDetailDesc}>
              {indexInfo.indexDetails}
            </div>
          </div>
          <div className={styles.indexDetailCondition}>
            <div className={styles.areaSelector}>
              <ProCity />
            </div>
            <div className={styles.dateSelector}>
              日期：{screenConditionDate}
            </div>
            <div className={styles.screenCondition} style={{display:showScreenCondition?'block':'none'}}>
              {/* {screenConditionItemTable} */}
              {buttonCondition}
            </div>
            <div className={styles.showScreenCondition}>
              {showCondition}
            </div>
          </div>
          <div className={styles.indexDetailLayOut}>
            {layout}
          </div>
          <div className={styles.indexDetailTable}>
            <h1>逐日分省数据表</h1>
            <IndexDetailsTable IDTablePara={IDTablePara} />
          </div>
        </div>
      </PageHeaderWrapper>
    // 移动业务 净增网上用户 CKP_02206  CKP_04538 23323
    )
  }
}

export default IndexDetails
