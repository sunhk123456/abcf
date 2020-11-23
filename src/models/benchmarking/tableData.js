import { queryTableData, queryBenchmarkingTrend, queryCompareTrend, queryNameCheck, querySaveModule } from '../../services/benchmarking';

export default {
  namespace: 'tableData',
  state: {
    markType: '',
    thData: [], // 表头数据
    tbodyData: [], // 表格内数据
    benchMarkData: [], // 趋势对标数据
    benchMarkContrastData: [], // 趋势对比数据
  },
  effects: {
    // 异步请求table数据
    * fetchTableData({ payload }, { put, call }) {
      const res = yield  call(queryTableData, payload);
      yield put({
        type: 'setTableData',
        payload: res,
      });
    },
    // 异步请求趋势对标数据
    *fetchBenchmarkingTrend({payload}, {put, call}) {
      const res = yield call(queryBenchmarkingTrend, payload);
      yield put({
        type: 'setBenchmarkingTrend',
        payload: res
      })
    },
    // 异步请求趋势对比数据
    *fetchCompareTrend({payload}, {put, call}) {
      const res = yield call(queryCompareTrend, payload);
      yield put({
        type: 'setCompareTrend',
        payload: res
      })
    },
    // 异步校验模板名称
    *fetchNameCheck({payload}, {put, call}) {
      const res = yield call(queryNameCheck, payload);
      return res;
    },
    // 保存模板内容
    *fetchSaveModule({payload}, {put, call}) {
      const res = yield call(querySaveModule, payload);
      return res;
    }
  },
  reducers: {
    // 设置table数据
    setTableData(state, action) {
      const { payload } = action;
      return {
        ...state,
        thData: payload.thData,
        tbodyData: payload.tbodyData,
      };
    },
    // 设置趋势对标数据
    setBenchmarkingTrend(state, action) {
      return {
        ...state,
        benchMarkData: action.payload.data
      }
    },
    // 设置趋势对比数据
    setCompareTrend(state, action){
      return {
        ...state,
        benchMarkContrastData: action.payload.data
      }
    },
  },
};
