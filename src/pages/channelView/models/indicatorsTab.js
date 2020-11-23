import { queryChannelViewDate, businessTableDay,channelNameHint,checkChannel,queryOverviewTabBusinessPie ,queryOverviewTabTimeEchart} from "../../../services/channelView";

export default {
  namespace:"indicatorsTab",
  state:{
    maxDate:"",
    date:"",
    condition:{},
    channel:{}, // 渠道id 名称信息
    baseInfo:[],
    timeEchartData:{
      title:"",
      chartX:[],
      chart:[],
      unit:"",
      xName:"",
      yName:""
    },
    pieEchartData:{
      data:{
        title:"",
        chartX:[],
        chart:[],
        example:[],
        unit:"",
      }
    },
    top5:{},
  },
  effects:{
    *fetchChannelNameHint({payload,callback},{call}){
      const response = yield call (channelNameHint,payload);
      if(callback)callback(response)
    },
    *fetchMaxDate({payload},{put,call}){
      const resultD = yield call(queryChannelViewDate,{dateType:"1",...payload});
      const resultM = yield call(queryChannelViewDate,{dateType:"2",...payload});
      yield put({
        type:"saveMaxDate",
        payload:{
          maxDay:resultD.date,
          maxMonth:resultM.date,
        }
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
      const result = yield call(businessTableDay, payload);
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
        maxDay:payload.maxDay,
        maxMonth:payload.maxMonth,
        date:payload.maxDay
      }
    },
    saveDate(state,{payload}){
      return{
        ...state,
        date:payload
      }
    },
    saveBaseTable(state,{payload}){
      return{
        ...state,
        baseInfo:payload.data,
        channel: payload.channel || {}
      }
    },
    // 查询验证
    saveCheck(state,{payload}){
      return {
        ...state,
        condition:payload
      }
    },
    savePieEchartData(state,{payload}){
      return{
        ...state,
        pieEchartData:{
          data:payload
        }
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
