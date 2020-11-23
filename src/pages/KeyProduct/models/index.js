/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  liutong
 * @date 2019/4/24
 */
import { maxDate,moduleTab,specialReportTable} from '@/services/KeyProduct/KeyProduct';

export default {
  namespace: "specialReport",
  state:{
    markId:"",
    maxDate:"",
    date:"",
    dateType:"",
    moduleData:[],
    moduleId:"",
    tableData:{
      "thData":[],
      "tbodyData": []
    },
    downloadParames:{

    }, // 下载参数
  },
  effects:{
    *fetchMaxDate({ payload }, { call, put }) {
      const response = yield call(maxDate, payload);
      yield put({
        type: 'date',
        payload: response,
    });
    },
    *fetchModule({ payload, callback }, { call, put }) {
      const response = yield call(moduleTab, payload);
      yield put({
        type: 'module',
        payload: response,
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
    },
    *fetchTable({ payload }, { call, put }) {
      const response = yield call(specialReportTable, payload);
      yield put({
        type: 'setSpecialReportTable',
        payload: response,
      });
    },
  },
  reducers:{
    date(state, {payload}) {
      return {
        ...state,
        maxDate: payload.date,
        date: state.date?state.date:payload.date,
      };
    },
    module(state, {payload}) {
      return {
        ...state,
        moduleData: payload,
        moduleId:payload.length!==0?payload[0].tabId:"",
      };
    },
    setSpecialReportTable(state, {payload}) {
      return {
        ...state,
        tableData: payload,
      };
    },
    // 跟新日期
    setDate(state,{payload}){
      return {
        ...state,
        date: payload
      }
    },
    // 跟新日期
    setModule(state,{payload}){
      return {
        ...state,
        moduleId: payload
      }
    },
    initSpecial(state,{payload}){
      let dataMake = state.date;
      if(payload.date){
        dataMake = "";
      }
      // 初始数据更新
        return {
        ...state,
        dateType: payload.dateType,
        markId: payload.markId,
        date:dataMake
      }
    },
    // 下载参数跟新
    setDownloadParames(state,{payload}){
      return {
        ...state,
        downloadParames:payload
      }
    }
  },

}
