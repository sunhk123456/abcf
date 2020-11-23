import {
  queryMap,
  queryMapValue,
  queryLineChartData,
  queryPieData,
  queryHeaderData,
  queryMaxDate,
  queryCondition,
  queryNameListTableData
} from '../../../services/nameList/nameList';




/**
 *
 * 描述：名单制客户收入分析models
 *
 * */

export default {
  namespace:"nameListModels",
  state:{
    specialName: '名单制客户收入分析',
    GeoJson:{},
    date:"",
    maxDate:"", // 最大账期
    cityId:"", // 地图的市id
    provId:"", // 地图的省id
    provName:"", //  地图的 省name
    cityName:"", // 地图的 市name
    totalMapData:[], // 金额同比地图数据
    selectIndexMap:"",
    mapData:{
      title:'',
      allValue:'',
      provId:'',
      provName:'',
      cityId:'-1',
      cityName:'',
      mapData:[]
    },// 地图数据
    
    totalLineChartData:[],
    selectIndexLineChart:"",
    lineChartData:{},
    headData: [],  //  头部列表数据
    conditionData: [],  //  筛选条件数据
    pieData:{}, // 饼图
    incomeTableData:{
      "title":"12",
      "thData": [],
      "tbodyData": [],
      "total": "15",
      "currentPage": "1",
      "totalPage": "0",
    },
  },
  effects:{
    // 请求页签数据
    *getHeaderData({ payload, callback }, { call, put }) {
      const response = yield call(queryHeaderData, payload);
      yield put({
        type: 'updateState',
        payload: {
          headData: response.header,
          specialName: response.title
        },
      });
      if (callback) callback(response);
    },
    // 请求最大账期
    *getMaxDate({ payload, callback }, { call, put }) {
      const response = yield call(queryMaxDate, payload);
      yield put({
        type: 'updateState',
        payload: {
          maxDate: response.date,
        },
      });
      if (callback) callback(response);
    },
    // 请求筛选条件
    *getCondition({ payload, callback }, { call, put }) {
      const response = yield call(queryCondition, payload);
      const childBusiness = { type: 'childBusiness', name: '业务二'}
      response.forEach((item, index) => {
        if(item.type === 'business') {
          response[index].name = '业务一'
          childBusiness.selectList = [...item.selectList[0].selectList]
        } else {
          response[index].name = '行业'
        }
      })
      response[2] = childBusiness;
      yield put({
        type: 'updateState',
        payload: {
          conditionData: response,
        },
      });
      if (callback) callback(response);
    },
    // 请求地图数据
    *getMapData({payload},{call, put}){
      const response = yield call(queryMapValue,payload);
      yield put({
        type:'setMapData',
        payload:response.data
      });
    },
    // 请求地图数据
    *getMap({payload},{call,put}){
      const response = yield call(queryMap,payload);
      yield put({
        type:'changeMap',
        payload:response
      });
    },
  
    // 请求地图数据
    *getLineChartData({payload},{call, put}){
      const response = yield call(queryLineChartData,payload);
      yield put({
        type:'setLineChartData',
        payload:response.data
      });
    },
    
    // 请求饼图数据
    *getPieData({payload},{call, put}){
      const response = yield call(queryPieData,payload);
      yield put({
        type:'setPieData',
        payload:response.data
      });
    },
    // getNameListTableData
    // 请求饼图数据
    *getNameListTableData({payload},{call, put}){
      const response = yield call(queryNameListTableData,payload);
      yield put({
        type:'setNameListTableData',
        payload:response.data
      });
    },

  },
  reducers:{
    //  更新数据
    updateState(state, { payload }) {
      console.log(333,payload);
      return {
        ...state,
        ...payload,
      };
    },
    setSelectIndexMap(state, { payload }) {
      return {
        ...state,
        selectIndexMap: payload,
      };
    },
    // 获取地图
    setMapData(state, {payload}) {
      const {mapData,id}=payload[0];
      const {provName,provId,cityName,cityId}=mapData;
      return {
        ...state,
        selectIndexMap:id,
        totalMapData:payload,
        mapData,
        provName,
        provId,
        cityName,
        cityId
      };
    },
    // 切换地图上金额同比按钮
    switchMap(state, { payload }) {
      return {
        ...state,
        mapData:payload
      };
    },
    changeCity(state, {payload}){
      return {
        ...state,
        provName:payload.provName,
        provId: payload.provId,
        cityName: payload.cityName,
        cityId: payload.cityId
      }
    },
    changeMap(state, {payload}){
      return {
        ...state,
        GeoJson: payload
      }
    },
    // 切换lineChart上金额同比按钮
    setSelectIndexLineChart(state, { payload }) {
      return {
        ...state,
        selectIndexLineChart: payload,
      };
    },
    // 获取折线图数据
    setLineChartData(state, {payload}) {
      const {chartData,id}=payload[0];
  
      return {
        ...state,
        selectIndexLineChart:id,
        totalLineChartData:payload,
        lineChartData:chartData
      };
    },
    switchLineChart(state, { payload }) {
      return {
        ...state,
        lineChartData:payload
      };
    },
    setPieData(state, { payload }) {
      return {
        ...state,
        pieData:payload
      };
    },
    setNameListTableData(state, { payload }) {
      return {
        ...state,
        incomeTableData:payload
      };
    },
  }
}
