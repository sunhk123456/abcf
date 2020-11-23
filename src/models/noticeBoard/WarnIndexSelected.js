import {queryIndexList} from '@/services/noticeBoard';

export default {
  namespace: 'warnIndexSelected',

  state: {
    indexLists:[],
    indexId:'',
  },

  effects: {
    *fetchIndexLists({payload}, {call, put}) {
      const res = yield call(queryIndexList, payload);
      yield put({
        type: 'getIndexList',
        payload: res,
      })
    },
  },


  reducers: {
    // 异常指标列表
    getIndexList(state, action) {
      return {
        ...state,
        indexLists: action.payload,
      }
    },

    getIndexId(state, action) {
      return {
        ...state,
        indexId: action.payload,
      }
    },
  },

}
