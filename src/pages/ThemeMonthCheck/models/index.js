/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: index/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/3/2/002
 */

import  {markData,targetDetail,currentDate,provTotalRanking,provItemRanking}  from '../../../services/ThemeMonthCheck';

export default {
  namespace: 'ThemeMonthCheckModels',

  state: {
    markData:{},
    targetDetail:{},
    currentDate:{},
    provTotalRanking:{},
    provItemRanking:{}
  },

  effects:{
    *fetchMarkData({ payload }, { call, put }) {
      const response = yield call(markData,payload);
      yield put({
        type: 'indexName',
        payload: response,
      });
    },
    *fetchTargetDetail({ payload }, { call, put }) {
      const response = yield call(targetDetail,payload);
      yield put({
        type: 'targetDetail',
        payload: response,
      });
    },
    *fetchCurrentDate({ payload }, { call, put }) {
      const response = yield call(currentDate,payload);
      yield put({
        type: 'currentDate',
        payload: response,
      });
    },
    *fetchProvTotalRanking({ payload }, { call, put }) {
      const response = yield call(provTotalRanking,payload);
      yield put({
        type: 'provTotalRanking',
        payload: response,
      });
    },
    *fetchProvItemRanking({ payload }, { call, put }) {
      const response = yield call(provItemRanking,payload);
      yield put({
        type: 'provItemRanking',
        payload: response,
      });
    },
  },
  reducers: {
    indexName(state,action ) {
      return {
        ...state,
        ...{markData:action.payload},
      };
    },
    targetDetail(state, action) {
      return {
        ...state,
        ...{targetDetail:action.payload},
      };
    },
    currentDate(state, action) {
      return {
        ...state,
        ...{currentDate:action.payload},
      };
    },
    provTotalRanking(state, action) {
      return {
        ...state,
        ...{provTotalRanking:action.payload},
      };
    },
    provItemRanking(state, action) {
      return {
        ...state,
        ...{provItemRanking:action.payload},
      };
    },
  },
}
