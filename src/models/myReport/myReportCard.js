import downloadUrl from '@/services/downloadUrl.json';
import {fetchAddMyReport, fetchDeleteMyReport, fetchUpdateMyReport, fetchOnlineViewReport } from '@/services/Report/report';

export default {
  namespace: 'myReportCardModel',

  state: {
    updateOpen:"", // 修改是否打开  打开时写入打开的id  否则为空
    addOpen:false, // 新增报告是否打开
  },

  effects: {
    // 新增报告
    *fetchAddMyReport({ payload, callback  }, { call }) {
      const response = yield call(fetchAddMyReport, payload);
      callback(response); // 返回结果
    },

    // 删除报告
    *getFetchDeleteMyReport({ payload, callback  }, { call }) {
      const response = yield call(fetchDeleteMyReport, payload);
      callback(response); // 返回结果
    },

    // 修改报告
    *getFetchUpdateMyReport({ payload, callback  }, { call }) {
      const response = yield call(fetchUpdateMyReport, payload);
      callback(response); // 返回结果
    },
    // 预览报告
    *getFetchOnlineViewReport({ payload, callback  }, { call }) {
      const params = {...payload,path: downloadUrl.urls[0].url}
      const response = yield call(fetchOnlineViewReport, params);
      const response2 = {...response, urlPath: downloadUrl.urls[1].url}
      callback(response2); // 返回结果
    },

  },

  reducers: {
    // 修改新增打开状态
    setAddOpen(state, {payload}){
      return {
        ...state,
        addOpen: payload
      }
    },
    // 改变修改打开状态
    setUpdateOpen(state, {payload}){
      return {
        ...state,
        updateOpen: payload
      }
    }

  }
}
