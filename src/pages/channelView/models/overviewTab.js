/**
 * @date: 2019/6/13
 * @author 风信子
 * @Description: 渠道总览Tab models
 */

import {
  queryChannelViewDate,   // 账期
  queryOverviewTabTable,  // 表格
  queryOverviewTabTimeEchart, // 时间趋势图
  queryOverviewTabAreaEchart, // 全国合计地域分布图接口
  queryOverviewTabProductEchart, // 产品销售TOP5接口
  queryOverviewTabBusinessPie, // 全国合计月出账收入业务构成图接口
  queryChannelViewTab, // 模块切换组件接口
  queryChannelViewChannelType, // 渠道分类接口
} from "@/services/channelView";


export default {
  namespace:"overviewTabModels",
  state:{
    maxDate:"",// 最大账期
    date:"",  // 账期
    channelTypeData:[],// 渠道分类
    channelTypeSelect:[],// 渠道分类选中数据
    channelTypeId:[],// 渠道分类选中数据id
    channelTypeName:[], // 渠道分类选中数据name
    overviewTableData:{ // 表格数据
      "thData": [],
      "tbodyData": [],
      "totalNum": "",
      "currentNum": "",
      "totalPageNum": ""
    },
    timeEchartData:{
      title:"",
      chartX:[],
      chart:[],
      unit:"",
      xName:"",
      yName:""
    },
    areaEchartData:{
      title:"",
      indexType:"1",
      chartX:[],
      chart:[],
      lineData:[],
      unit:"户",
      example:[]
    },
    pieEchartData:{},
    top5Data:{
      title:"",
      thData:[],
      tbodyData:[]
    },
    tabData:[]
  },
  effects:{
    // 请求渠道总览账期
    *fetchChannelViewDate({payload,callback}, {put, call}) {
      const response = yield call(queryChannelViewDate,payload);
      yield put({
        type: "saveChannelViewDate",
        payload: response.date
      })
      if(callback)(callback())
    },

    // 请求渠道总览表格
    *fetchOverviewTabTable({payload}, {put, call}) {
      const response = yield call(queryOverviewTabTable,payload);
      if(response && !response.errorCode){
        yield put({
          type: "saveOverviewTabTable",
          payload: response
        })
      }
    },

    // 请求渠道总览时间趋势图
    *fetchOverviewTabTimeEchart({payload}, {put, call}) {
      const response = yield call(queryOverviewTabTimeEchart,payload);
      if(response && !response.errorCode && Object.keys(response).length > 0){
        yield put({
          type: "saveOverviewTimeEchart",
          payload: response
        })
      }
    },

    // 请求渠道总览全国合计地域分布图
    *fetchOverviewTabAreaEchart({payload}, {put, call}) {
      const response = yield call(queryOverviewTabAreaEchart,payload);
      if(response && !response.errorCode && Object.keys(response).length > 0){
        yield put({
          type: "saveOverviewAreaEchart",
          payload: response
        })
      }
    },

    // 请求渠道总览产品销售TOP5接口
    *fetchOverviewTabProductEchart({payload}, {put, call}) {
      const response = yield call(queryOverviewTabProductEchart,payload);
      if(response && !response.errorCode && Object.keys(response).length > 0){
        yield put({
          type: "saveOverviewProductEchart",
          payload: response
        })
      }
    },

    // 请求渠道总览全国合计月出账收入业务构成图接口
    *fetchOverviewTabBusinessPie({payload}, {put, call}) {
      const response = yield call(queryOverviewTabBusinessPie,payload);
      if(response && !response.errorCode && Object.keys(response).length > 0){
        yield put({
          type: "saveOverviewBusinessPie",
          payload: response
        })
      }
    },

    // 模块切换组件接口
    *fetchChannelViewTab({payload}, {put, call}) {
      const response = yield call(queryChannelViewTab,payload);
      if(response && !response.errorCode){
        yield put({
          type: "saveChannelViewTab",
          payload: response
        })
      }
    },

    // 获取渠道分类接口
    *fetchChannelType({payload,callback}, {put, call}) {
      const response = yield call(queryChannelViewChannelType,payload);
      if(response && !response.errorCode){
        yield put({
          type: "saveChannelTypeData",
          payload: response
        })
      }
      if(callback){callback(response)}
    },

  },
  reducers:{
    // 保存渠道总览账期
    saveChannelViewDate(state,{payload}){
      return{
        ...state,
        date:payload,
        maxDate:payload
      }
    },

    // 保存渠道总览账期
    saveOverviewTabTable(state,{payload}){
      return{
        ...state,
        overviewTableData:payload
      }
    },

    // 保存渠道总览账期
    saveDate(state,{payload}){
      return{
        ...state,
        date:payload
      }
    },

    // 保存渠道总览时间趋势图
    saveOverviewTimeEchart(state,{payload}){
      return{
        ...state,
        timeEchartData:payload
      }
    },

    // 保存渠道总览全国合计地域分布图
    saveOverviewAreaEchart(state,{payload}){
      return{
        ...state,
        areaEchartData:payload
      }
    },

    // 保存渠道总览产品销售TOP5接口
    saveOverviewProductEchart(state,{payload}){
      return{
        ...state,
        top5Data:payload
      }
    },

    // 保存渠道总览全国合计月出账收入业务构成图接口
    saveOverviewBusinessPie(state,{payload}){
      return{
        ...state,
        pieEchartData:payload
      }
    },

    // 保存模块切换组件
    saveChannelViewTab(state,{payload}){
      return{
        ...state,
        tabData:payload
      }
    },

    // 保存渠道分类数据
    saveChannelTypeData(state,{payload}){
      return{
        ...state,
        channelTypeData:payload,
      }
    },

    // 保存渠道分类选中数据
    saveSelectChannelTypeData(state,{payload}){
      return{
        ...state,
        channelTypeSelect:payload||[],
        channelTypeId: payload?payload.map((item)=>item.channelId):[],
        channelTypeName: payload?payload.map((item)=>item.channelName):[]
      }
    }

  }
}
