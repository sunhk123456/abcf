/**
 * Created by xingxiaodong on 2020/05/22.
 */
import  {
  fetchChartTypeData,
  fetchBarData,
  fetchAreaData,
}  from '../../../services/intelligenceAnalysis';

export default {
  namespace: 'intelligenceAnalysisModels',
  
  state: {
    chartTypeData:null,
    areaData:{},
  },
  
  effects: {
    // getChartTypeData
    *getChartTypeData({ payload ,callback}, { call, put }) {
      const response = yield call(fetchChartTypeData,payload);
      yield put({
        type: 'setChartTypeData',
        payload: response,
      });
      if(callback){
        callback(response)
      }
    },
    // 请求地域分布图数据
    *getAreaData({ payload, callback }, { call, put }) {
      const response = yield call(fetchAreaData,payload);
      yield put({
        type: 'setAreaDate',
        payload: response.data,
      });
      if(callback) {callback(response.data)}
    },
    // 请求用户群数据
    *getBarData({ payload,callback }, { call }) {
      const response = yield call(fetchBarData,payload);
      if(callback){
        callback(response.data)
      }
    },
  },

  reducers: {
    setChartTypeData(state, {payload}) {
      return {
        ...state,
        chartTypeData:payload,
      };
    },
    setAreaDate(state, {payload}) {
      return {
        ...state,
        areaData:payload,
      };
    },
  },
};
