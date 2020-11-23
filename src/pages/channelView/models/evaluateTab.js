import { queryChannelViewDate,channelNameHint ,checkChannel,queryOverviewTabProductEchart,evaluationTable,queryOverviewTabTimeEchart,queryOverviewTabBusinessPie } from "../../../services/channelView";

export default {
  namespace:"evaluateTab",
  state:{
    date:"",
    maxDate:"",
    condition:{},
    baseInfo:[],
    channel:{}, // 渠道id 名称信息
    timeEchartData:{
      title:"",
      chartX:[],
      chart:[],
      unit:"",
      xName:"",
      yName:""
    },
    top5:{},
    pieEchartData:{},
  },
  effects:{
    *fetchChannelNameHint({payload,callback},{call}){
      const response = yield call (channelNameHint,payload);
      if(callback)callback(response)
    },
    *fetchMaxDate({payload},{put,call}){
      const response = yield  call(queryChannelViewDate,payload);
      yield put({
        type:"saveMaxDate",
        payload:response.date,
      })
    },
    *fetchDate({payload},{put}){
      yield put({
        type:"saveDate",
        payload
      })
    },
    // 查询验证
    *checkChannel({payload,callback},{put, call}){
      const result = yield call(checkChannel,{...payload, markType: 'channelView'});
      if(result.code==="success"){
        yield put({
          type:"saveCheck",
          payload
        })
      }
      if(callback)callback(result)
    },
    *fetchBaseTable({payload},{put,call}){
      const result = yield call(evaluationTable, {...payload});
      yield put({
        type: "saveBaseTable",
        payload: result
      })
    },
    // 清除筛选条件
    *clearCondition({payload},{put}){
      yield put({
        type: "saveCheck",
        payload
      })
    },
    // 请求时间渠道
    *fetchTimeEchartData({payload}, {put, call}) {
      const result = yield call(queryOverviewTabTimeEchart, {...payload,channelClass:[]});
      yield put({
        type: "saveTemplateTable",
        payload: result
      })
    },
    // 请求产品销量
    *fetchTableEchartData({payload}, {put, call}) {
      const result = yield call(queryOverviewTabProductEchart, {...payload,channelClass:[]});
      yield put({
        type: "saveTableEchartData",
        payload: result
      })
    },
    // 请求渠道构成
    *fetchPieEchartData({payload}, {put, call}) {
      const result = yield call(queryOverviewTabBusinessPie, {...payload,channelClass:[]});
      yield put({
        type: "savePieEchartData",
        payload: result
      })
    },
  },
  reducers:{
    saveMaxDate(state,{payload}){
      return{
        ...state,
        maxDate:payload,
        date:payload
      }
    },
    saveDate(state,{payload}){
      return{
        ...state,
        date:payload
      }
    },
    // 查询验证
    saveCheck(state,{payload}){
      return {
        ...state,
        condition:payload
      }
    },
    // top5
    saveTableEchartData(state,{payload}){
      return{
        ...state,
        top5:payload
      }
    },
    savePieEchartData(state,{payload}){
      return{
        ...state,
        pieEchartData:payload
      }
    },
    saveBaseTable(state,{payload}){
      return{
        ...state,
        baseInfo:payload.data,
        channel:payload.channel || {}
      }
    },
    saveTemplateTable(state,{payload}){
      return{
        ...state,
        timeEchartData:payload
      }
    }
  }
}
