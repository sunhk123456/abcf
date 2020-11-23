import { fetchMyReport } from '@/services/Report/report';

export default {
  namespace: 'myReportModel',

  state: {
    myReportDatas: {
      dataSourcesList:[],
      reportCycleList:[],
      reportTypesList:[],
      data:[]
    },
    mrHasMore: true, // 是否有更多项目要加载。如果删除事件侦听器false
    updateOpen:"", // 修改是否打开  打开时写入打开的id  否则为空
  },

  effects: {
    // 获取报告列表
    *fetchMyReport({ payload }, { call, put }) {
      const response = yield call(fetchMyReport, payload);
      yield put({
        type: 'resMyReportDatas',
        payload: response
      });
    },
  },

  reducers: {

    resMyReportDatas(state, action) {
      let hasMore = true;
      if (action.payload.nextFlag === "0"){
        hasMore = false
      }
      return {
        ...state,
        tabKey: "2",
        myReportDatas: action.payload,
        mrHasMore: hasMore
      };
    },

  }

}
