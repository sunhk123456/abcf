/**
 * Created by wangxue on 2019/1/21.
 */
import {productTreeMap,productRanking,provinceBar,productTimeLine,infoTable,chartTypes} from '@/services/productAnalysisPop';

export default {
  namespace: 'productAnalysisPopData',

  state: {
    treeMapData:{},
    productRankingTop:{},
    productRankingLast:{},
    provinceBarData:{},
    productTimeLineData:{},
    infoTableData:{},
    chartTypesData:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(productTreeMap, payload);
      yield put({
        type: 'treemap',
        payload: response,
      });
    },
    *productRankTop({ payload }, { call, put }) {
      const response = yield call(productRanking, payload);
      yield put({
        type: 'productRankingTop',
        payload: response,
      });
    },
    *productRankLast({ payload }, { call, put }) {
      const response = yield call(productRanking, payload);
      yield put({
        type: 'productRankingLast',
        payload: response,
      });
    },
    *provinceBar({ payload }, { call, put }) {
      const response = yield call(provinceBar, payload);
      yield put({
        type: 'provinceBarData',
        payload: response,
      });
    },
    *productTimeline({ payload }, { call, put }) {
      const response = yield call(productTimeLine, payload);
      yield put({
        type: 'productTimeLineData',
        payload: response,
      });
    },
    *infoTable({ payload }, { call, put }) {
      const response = yield call(infoTable, payload);
      yield put({
        type: 'infoTabledata',
        payload: response,
      });
    },
    *charttypes({ payload }, { call, put }) {
      const response = yield call(chartTypes, payload);
      yield put({
        type: 'chartTypesData',
        payload: response,
      });
    },
  },

  reducers: {
    treemap(state, { payload }) {
      return {
        ...state,
        ...{
          treeMapData:payload.data,
        }
      };
    },
    productRankingTop(state, { payload }) {
      return {
        ...state,
        ...{
          productRankingTop:payload.data,
        }
      };
    },
    productRankingLast(state, { payload }) {
      return {
        ...state,
        ...{
          productRankingLast:payload.data,
        }
      };
    },
    provinceBarData(state, { payload }) {
      return {
        ...state,
        ...{
          provinceBarData:payload.data,
        }
      };
    },
    productTimeLineData(state, { payload }) {
      return {
        ...state,
        ...{
          productTimeLineData:payload.data,
        }
      };
    },
    infoTabledata(state, { payload }) {
      return {
        ...state,
        ...{
          infoTableData:payload,
        }
      };
    },
    chartTypesData(state, { payload }) {
      return {
        ...state,
        ...{
          chartTypesData:payload.chartType,
        }
      };
    },
  },
};
