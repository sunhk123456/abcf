/**
 * Created by xingxiaodong on 2019/1/23.
 */
import  {productAnalysisTableData,productAnalysisProductScreen,productAnalysisMaxData}  from '../../../services/productAnalysis';

export default {
  namespace: 'productAnalysisTableDataModels',

  state: {
    xxdProductScreen:{}
  },

  effects: {
    *fetchTableData({ payload ,callback}, { call, put }) {
      const response = yield call(productAnalysisTableData,payload);
      yield put({
        type: 'xxdTableData',
        payload: response,
      });
      if(callback){
        callback(response)
      }
    },
    *fetchProductScreen({ payload }, { call, put }) {
      const response = yield call(productAnalysisProductScreen,payload);
      yield put({
        type: 'xxdProductScreen',
        payload: response,
      });
    },
    *fetchMaxData({ payload }, { call, put }) {
      const response = yield call(productAnalysisMaxData,payload);
      yield put({
        type: 'xxdMaxData',
        payload: response,
      });
    },
  },

  reducers: {
    xxdTableData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    xxdProductScreen(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    xxdMaxData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
