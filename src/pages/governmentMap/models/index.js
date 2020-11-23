import {
  queryGovernMapValue,
  queryIndexListData,
  queryMap
} from '../../../services/governmentMap/governmentMap';
import {queryMaxDate } from '../../../services/building/building';

export default {
  namespace:"governMapModels",
  state:{
    title:'政企信息地域分布',
    mapData:{
      title:'',
      allValue:'',
      provId:'',
      provName:'',
      cityId:'',
      cityName:'',
      mapData:[]
    },
    provName: '',
    cityName: '',
    provId:"",
    cityId:"",
    markType:"ZQ_MAP_SUB_M",
    dateType:"2",
    date: '', // 日期
    maxDate:'', // 最大账期
    indexList:[],
    indexId:"",
    searchCheck:false, // 查询按钮是否被点击
    GeoJson:{}
  },
  effects:{
    // 请求最大账期
    *getMaxDate({ payload ,callback},{ call, put }){
      const response = yield call(queryMaxDate,payload);
      yield put({
        type: 'setMaxDate',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 请求列表数据
    *getIndexListData({payload,callback},{call, put}){
      const response = yield call(queryIndexListData,payload);
      yield put({
        type:'setListData',
        payload:response,
      });
      if (callback) callback(response);
    },

    // 请求地图数据
    *getMapData({payload},{call, put}){
      const response = yield call(queryGovernMapValue,payload);
      yield put({
        type:'setMapData',
        payload:response
      });
    },

    // 请求地图Json数据
    *getMap({payload},{call,put}){
      const response = yield call(queryMap,payload);
      yield put({
        type:'changeMap',
        payload:response
      });
    },

  },
  reducers:{
    // 最大账期
    setMaxDate(state, {payload}) {
      return {
        ...state,
        date:payload.date,
        maxDate:payload.date
      };
    },
    // 获取指标选择列表数据
    setListData(state, {payload}) {
      return {
        ...state,
        indexList: payload,
        indexId:payload[0].id
      };
    },
    // 指标选择
    setIndexData(state, {payload}) {
      return {
        ...state,
        indexId: payload,
      };
    },
    // 改变日期
    setDate(state, {payload}) {
      return {
        ...state,
        date: payload.date,
      };
    },
    // 获取地图
    setMapData(state, {payload}) {
      return {
        ...state,
        mapData: payload,
        provName:payload.provName,
        provId: payload.provId,
        cityName: payload.cityName,
        cityId: payload.cityId
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
    // 点击查询按钮，查询状态改变
    changeSearch(state, {payload}){
      return {
        ...state,
        searchCheck: payload
      }
    },
  }
}
