import {
  queryDeleteWarning,
  queryMyWarning,
  queryAddWarningData,
  querySaveWarningData,
  queryWarningNumber
} from '../../services/warningConfig';

const defaultEditArea={
  proId:"",
  cityId:""
}

export default {
  namespace:"warningModels",
  state:{
    visible:false, // 控制添加预警显示或者隐藏。
    warnId:"", // 编辑预警的id
    dateType: '', // 日月标识
    markType: '', // 专题id
    indexId: '', // 指标Id
    provId:"",
    cityId:"",
    IsSubKpi:"", // 指标专题标识，1：指标；2：专题
    addWarning:{
      "isMarkType":"false",
      "title":"",
      "indexList":[],
      "indexData":{
        "title":"",
        "unit":"-",
        "list":[]
      },
      "setting":{
        "title":"预警设置",
        "area":{},
        "list":[ ]
      }
    },// 添加预警接口返回数据
    saveWarning:{
      "status":"" ,
      "message":""
    },// 保存预警接口返回数据
    warningData:{
      title:"我的预警",
      list:[],
      "total": "1",
      "currentPage": "1",
      "totalPage": "1",
    },
    dataCount:"0",
    editArea:{
      proId:"",
      cityId:""
    }
  },
  effects:{
    // 请求我的预警数字
    * getWarningNumber({ payload, callback }, { call,put }) {
      const response = yield call(queryWarningNumber, payload);
      yield put({
        type: 'setWarningNumber',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求删除预警
    * getDeleteWarning({ payload, callback }, { call }) {
      const response = yield call(queryDeleteWarning, payload);
      if (callback) callback(response);
    },
    // 请求我的预警
    * getMyWarning({ payload, callback }, { call, put }) {
      const response = yield call(queryMyWarning, payload);
      yield put({
        type: 'setMyWarning',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求添加预警接口
    *getAddWarning({payload,callback},{call, put}){
      const response = yield call(queryAddWarningData,payload);
      yield put({
        type:'setAddWarning',
        payload:response
      });
      if (callback) callback(response);
    },
    // 请求保存预警接口
    *getSaveWarning({payload,callback},{call, put}){
      const response = yield call(querySaveWarningData,payload);
      yield put({
        type:'setSaveWarning',
        payload:response
      });
      if (callback) callback(response);
    },
  
  },
  reducers:{
    // 设置我的预警数字。
    setWarningNumber(state, {payload}) {
      return {
        ...state,
        dataCount: payload.number,
      };
    },
    // 设置添加预警弹出层是否显示。
    setVisible(state, {payload}) {
      return {
        ...state,
        visible: payload.visible,
      };
    },
    // 设置添加预警筛选条件
    setCondition(state, {payload}){
      return {
        ...state,
        warnId: payload.warnId, // 编辑预警的id
        dateType: payload.dateType, // 日月标识
        markType: payload.markType, // 专题id
        indexId: payload.indexId, // 指标Id
        provId: payload.provId,
        cityId: payload.cityId,
        IsSubKpi: payload.IsSubKpi, // 指标专题标识，1：指标；2：专题
      }
    },
    setMyWarning(state, action) {
      return {
        ...state,
        warningData: action.payload,
      };
    },
    // 获取请求添加预警接口
    setAddWarning(state, {payload}) {
      return {
        ...state,
        addWarning: payload,
      };
    },
    // 获取请求保存预警接口
    setSaveWarning(state, {payload}) {
      return {
        ...state,
        saveWarning: payload,
      };
    },
    // 保存编辑的 省市
    setEditArea(state, {payload=defaultEditArea}){
      return {
        ...state,
        editArea: payload,
      };
    },
    // clear 清空models
    clearModels(state) {
      return {
        ...state,
        addWarning: {
          "isMarkType": "false",
          "title": "添加预警models",
          "indexList": [],
          "indexData": {
            "title": "宽带接入出账用户",
            "unit": "-",
            "list": []
          },
          "setting": {
            "title": "预警设置",
            "area": {},
            "list": []
          }
        }
      }
    },
    
  }
}
