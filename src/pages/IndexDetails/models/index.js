import moment from 'moment';
import {queryIndexDescrip,queryChartTypes,queryDayTrend,queryMonthBar,queryYearBar,queryCityBar,queryCityRank,queryConditionChart,queryMaxDate} from '@/services/indexDetails';

export default {
  namespace: 'indexDetails',

  state: {
    dateType: "",
    markType: "",
    time: "7",
    date:"",
    maxDate:"",
    chartTypes:[],
    unitGroup:[], // 单位数据
    selectUnit:{}, // 选中的单位
    hot:1,
    indexInfo: {},
    dayTrend: {},
    monthBar: {},
    yearBar: {},
    cityBar: {},
    cityRank: {},
    channel:{},
    product:{},
    businessPie:{}
  },

  effects: {

    *fetchIndexDescrip({payload},{call,put}){
      const res = yield call(queryIndexDescrip,payload);
      yield put({
        type:'getIndexDescrip',
        payload:res
      })
    },

    *fetchMaxDate({payload},{call,put}){
      const res = yield call(queryMaxDate,payload);
      yield put({
        type:'getMaxDate',
        payload:res.date
      })
    },

    *fetchChartTypes({payload,callback},{call, put}){
      const res = yield (call(queryChartTypes, payload))
      yield put({
        type:'getChartTypes',
        payload:res.chartType
      })
      callback();
    },


    // echarts图
    *fetchDayTrend({payload},{call,put}){
      const res = yield call(queryDayTrend,payload);
      yield put({
        type:'getDayTrend',
        payload:res
      })
    },

    *fetchMonthBar({payload},{call,put}){
      const res = yield call(queryMonthBar,payload);
      yield put({
        type:'getMonthBar',
        payload:res
      })
    },

    *fetchYearBar({payload},{call,put}){
      const res = yield call(queryYearBar,payload);
      yield put({
        type:'getYearBar',
        payload:res
      })
    },

    *fetchCityBar({payload},{call,put}){
      const res = yield call(queryCityBar,payload);
      yield put({
        type:'getCityBar',
        payload:res
      })
    },

    *fetchCityRank({payload},{call,put}){
      const res = yield call(queryCityRank,payload);
      yield put({
        type:'getCityRank',
        payload:res
      })
    },

    *fetchConditionChart({payload},{call,put}){
      const res = yield call(queryConditionChart,payload);
      yield put({
        type:'getConditionChart',
        payload:res
      })
    },


  },


  reducers: {

    // 指标描述
    getIndexDescrip(state,{payload}){
      const unitData = payload[0].unitGroup;
      const selectUnit = {};
      unitData.forEach((item)=>{
        if(item.flag){
          selectUnit.unitName = item.unitName;
          selectUnit.unitId = item.unitId;
        }
      })
      return{
        ...state,
        indexInfo: payload[0],
        unitGroup: unitData,
        selectUnit
      }
    },
    // 图表类型
    getChartTypes(state,{payload}){
      return{
        ...state,
        chartTypes:payload,
      }
    },

    // 最大账期
    getMaxDate(state,{payload}){
      let date2 = "";
      if(state.date && moment(state.date) < moment(payload)){
        date2 = state.date;
      }else {
        date2 = payload;
      }
      return{
        ...state,
        date:date2,
        maxDate:payload
      }
    },

    getDayTrend(state,action){
      return{
        ...state,
        dayTrend:action.payload,
      }
    },

    getMonthBar(state,action){
      return{
        ...state,
        monthBar:action.payload,
      }
    },

    getYearBar(state,action){
      return{
        ...state,
        yearBar:action.payload,
      }
    },

    getCityBar(state,action){
      return{
        ...state,
        cityBar:action.payload,
      }
    },

    getCityRank(state,action){
      return{
        ...state,
        cityRank:action.payload,
      }
    },

    getConditionChart(state,action){
      if(action.payload.data[0].chartType === "channel"){
        return{
          ...state,
          channel:action.payload,
        }
      }if(action.payload.data[0].chartType === "product"){
        return{
          ...state,
          product:action.payload,
        }
      }if(action.payload.data[0].chartType === "businessPie"){
        return{
          ...state,
          businessPie:action.payload,
        }
      }
      return null
    },

    // 单位切换
    setUnit(state,{payload}){
      return {
        ...state,
        selectUnit: payload
      }
    },

    // 更新日期
    setDate(state,{payload}){
      return {
        ...state,
        date: payload
      }
    },
    // 初始数据更新
    intData(state,{payload}){
      return {
        ...state,
        date: payload.date,
        dateType: payload.dateType,
        markType: payload.markType
      }
    }
  },
}
