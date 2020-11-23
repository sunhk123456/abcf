/**
 * Created by xingxiaodong on 2019/3/12.
 */
import  {downloadAllListTableData,downloadAllListItem}  from '../../../services/downloadAllList';

export default {
  namespace: 'downloadAllListModels',

  state: {
    downloadItem:{}
  },

  effects: {
    *fetchDownloadTableData({ payload }, { call  }) {
      const response = yield call(downloadAllListTableData,payload);
      return response
    },
    *fetchDownloadItem({ payload ,callback}, { call,put  }) {
      const response = yield call(downloadAllListItem,payload);
      yield put({
        type: 'xxdTableData',
        payload: response,

      });
      callback(response)
      return response

    },
  },

  reducers: {
    xxdTableData(state, action) {
      return {
        ...state,
        ...{downloadItem:action.payload},
      };
    },
  },
};
