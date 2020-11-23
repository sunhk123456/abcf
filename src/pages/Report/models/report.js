import { fetchReportPreview ,fetchReportModuleData} from '@/services/Report/report';

export default {
  namespace: 'report',

  state: {
    reportModuleData:[],// 报告页签
    tabKey: "",      // tab标签页标记
    reportPreviewData:{
      data:[],
      nextFlag:{},
      keyword:{}
    },
    rpHasMore: true, // 是否有更多项目要加载。如果删除事件侦听器false
  },

  effects: {

    *fetchReportPreview({ payload,sign },{ call, put }){
      const response = yield call(fetchReportPreview,payload);
      yield put({
        type: 'resReportPreview',
        payload: response,
        sign
      });
    },

    // 请求页签数据
    *getReportModuleData({ payload },{ call, put }){
      const response = yield call(fetchReportModuleData,payload);
      yield put({
        type: 'setReportModuleData',
        payload: response,
      });
    },
  },

  reducers: {

    resReportPreview(state, {payload, sign}){
      let hasMore = true;
      const {nextFlag,keyword} = payload;
      const {reportPreviewData:{data}} = state; // 原始数据
      const reportPreviewDataCopy = [];
      if(!sign){
        reportPreviewDataCopy.push(...payload.data)
      }else {
        reportPreviewDataCopy.push(...data,...payload.data)
      }
      if (nextFlag === "0"){
        hasMore = false
      }
      return {
        ...state,
        reportPreviewData:{nextFlag,keyword,data:reportPreviewDataCopy},
        rpHasMore: hasMore
      }
    },

    setTabKey(state, {payload}){
      return {
        ...state,
        tabKey: payload
      }
    },

    setReportModuleData(state, {payload}){
      return {
        ...state,
        reportModuleData: payload,
        tabKey: payload.length > 0 ? payload[0].id : ""
      }
    },

  }
}
