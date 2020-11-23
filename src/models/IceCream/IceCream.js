import { fakerIceCream,iceTable,queryMaxDate,queryRegionalBarData,queryLineTableData } from '@/services/iceCream/iceCream';

export default {
  namespace: 'IceCream',
  state: {
    iceTableData:[], // 冰激凌表格数据
    indexDate:'',// 日期
    regionalBarData:[],// 地域分布趋势图数据
    trendLineData:[],// 趋势分析折线图数据
    analysisTableData:{},// 分析数据表格数据
    chartsStatus:'none',// 图表组件状态
    currentDate:'',
    comStatus:{
      barStatus:'none',
      lineStatus:'block',
      tableStatus:'none'
    },// 各个图表的显示状态
    barShow:'false',// 柱状图是否显示
    comKind:'',// 展开组件的标题
    comRegional:'',// 展开组件的地域
    title:'', // 当前专题的大标题
  },

  effects: {
    *fetchFakerTableData({ payload, callback }, { call, put }) {
      const response = yield call(fakerIceCream, payload);
      yield put({
        type: 'table',
        payload: response,
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
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
    *fetchIndexDate({payload,callback},{call,put}){ // 请求最大日期
      const res = yield call(queryMaxDate,payload);
      yield put({
        type:'getIndexDate',
        payload:res
      })
      if(callback){
        callback(res)
      }

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
    *fetchChangeCom({payload},{put}){  // 改变各个图表的显示状态
      yield put({
        type:'getChangeCom',
        payload
      })
    },
    *fetchPopStatus({payload},{put}){  // 改变图表组件状态
      yield put({
        type:'getPopStatus',
        payload:payload.chartsStatus
      })
    },
    *fetchChooseDate({payload},{put}){  // 改变当前选择的时间
      yield put({
        type:'getChooseDate',
        payload:payload.currentDate
      })
    },
    *changePopKind({payload},{put}){  // 改变各个图表的显示状态
      yield put({
        type:'getChangePopKind',
        payload
      })
    },
    *title({payload},{put}){  // 改变各个图表的显示状态
      yield put({
        type:'getTitle',
        payload
      })
    },
  },

  reducers: {
    table(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
    iceTable(state,action){
      return {
        ...state,
        iceTableData:action.payload,
      }
    },
    getIndexDate(state,action){
      return {
        ...state,
        indexDate:action.payload.date
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
    getChangeCom(state,action){
      return {
        ...state,
        comStatus:action.payload
      }
    },
    getPopStatus(state,action){
      return {
        ...state,
        chartsStatus:action.payload
      }
    },
    getChooseDate(state,action){
      return {
        ...state,
        currentDate:action.payload
      }
    },
    getChangePopKind(state,action){
      return {
        ...state,
        comKind:action.payload.comKind,
        comRegional:action.payload.comRegional,
      }
    },
    getTitle(state,action){
      return {
        ...state,
        title:action.payload.title,
      }
    },
  },
};
