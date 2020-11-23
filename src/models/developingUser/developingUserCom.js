import {iceTable,queryIndexDetailsData,queryMaxDate,queryIndexType,queryTableData,queryRegionalBarData,queryLineTableData} from '@/services/DevelopingUser';

export default {
  namespace:'developingUserCom',

  state:{
    indexDetailsData:[],// 指标解释组件数据
    indexDetailsShow:'none',// 指标解释组件状态
    indexDate:'',// 日期
    indexType:[],// 指标类型
    tableHData:[],// 表头数据
    tableData:[],// 表格数据
    chartsStatus:'none',// 图表组件状态
    comStatus:{
      barStatus:'block',
      lineStatus:'block',
      tableStatus:'none'
    },// 各个图表的显示状态
    regionalBarData:[],// 地域分布趋势图数据
    barShow:'true',// 柱状图是否显示
    trendLineData:[],// 趋势分析折线图数据
    analysisTableData:{},// 分析数据表格数据
    comKind:'',// 展开组件的标题
    comRegional:'',// 展开组件的地域
    iceTableData:[], // 冰激凌表格数据
  },


  effects:{
    *fetchIndexDetails({payload},{call,put}){ // 请求指标解释组件数据
      const res = yield call(queryIndexDetailsData,payload);
      yield put({
        type:'getIndexDetailsData',
        payload:res
      })
    },


    *fetchIndexDetailsStatus({payload},{put}){  // 改变指标解释组件状态
      yield put({
        type:'getIndexDetailsStatus',
        payload:payload.indexDetailsShow
      })
    },

    *fetchPopStatus({payload},{put}){  // 改变图表组件状态
      yield put({
        type:'getPopStatus',
        payload:payload.chartsStatus
      })
    },

    *fetchChangeCom({payload},{put}){  // 改变各个图表的显示状态
      yield put({
        type:'getChangeCom',
        payload
      })
    },

    *fetchIndexDate({payload},{call,put}){ // 请求最大日期
      const res = yield call(queryMaxDate,payload);
      yield put({
        type:'getIndexDate',
        payload:res
      })
    },

    *fetchIndexType({payload},{call,put}){  // 请求指标类型
      const res = yield call(queryIndexType,payload);
      yield put({
        type:'getIndexType',
        payload:res
      })
    },


    *fetchIndexTableData1({payload},{call,put}){  // 请求主表格数据
      const res = yield call(queryTableData,payload);
      yield put({
        type:'getTableData',
        payload:res
      })
    },

    *fetchRegionalBarData({payload},{call,put}){  // 请求组件地域分布趋势图数据
      const res = yield call(queryRegionalBarData,payload);
      yield put({
        type:'getRegionalBarData',
        payload:res
      })
    },

    *fetchLineTableData({payload},{call,put}){  // 请求组件折线图和表格数据
      const res = yield call(queryLineTableData,payload);
      yield put({
        type:'getLineTableData',
        payload:res
      })
    },

    *changePopKind({payload},{put}){  // 改变各个图表的显示状态
      yield put({
        type:'getChangePopKind',
        payload
      })
    },


    *fetchIceTable({ payload, callback }, { call, put }) {
      const response = yield call(iceTable, payload);
      yield put({
        type: 'iceTable',
        payload: response,
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
    },
    // *fetchSubmitFeedback({payload},{call}){ // 直接返回结果示例
    //   return yield call(querySubmitFeedback,payload);
    // },

  },


  reducers:{
    getIndexDetailsData(state,action){
      return {
        ...state,
        indexDetailsData:action.payload.tbodyData
      }
    },

    getIndexDetailsStatus(state,action){
      return {
        ...state,
        indexDetailsShow:action.payload
      }
    },

    getPopStatus(state,action){
      return {
        ...state,
        chartsStatus:action.payload
      }
    },

    getChangeCom(state,action){
      return {
        ...state,
        comStatus:action.payload
      }
    },

    getIndexDate(state,action){
      return {
        ...state,
        indexDate:action.payload.date
      }
    },

    getIndexType(state,action){
      return {
        ...state,
        indexType:action.payload.indexType
      }
    },

    getTableData(state,action){
      return {
        ...state,
        tableData:action.payload.tbodyData,
        tableHData:action.payload.thData
      }
    },

    getRegionalBarData(state,action){
      return {
        ...state,
        regionalBarData:action.payload.data,
        barShow:action.payload.isShow,
      }
    },

    getLineTableData(state,action){
      return {
        ...state,
        trendLineData:action.payload.data,
        analysisTableData:action.payload.tableData,
      }
    },


    getChangePopKind(state,action){
      return {
        ...state,
        comKind:action.payload.comKind,
        comRegional:action.payload.comRegional,
      }
    },
    iceTable(state,action){
      return {
        ...state,
        iceTableData:action.payload,
      }
    },
  }
}
