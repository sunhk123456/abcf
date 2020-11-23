
import {
  queryCollectionState,
} from '../../services/myCollection/myCollection';

export default {
  namespace:"collectionComponentModels",
  state:{
    collectId:'', // 查询接口传回来的Id
  },
  effects:{
    // 查询收藏状态
    *getCollectionState({ payload,callback}, { call, put }) {
      const response = yield call(queryCollectionState, payload);
      yield put({
        type: 'setCollectId',
        payload: response,
      });
      if (callback) callback(response);
    },
  },
  reducers:{
    // 暂时存储要传到收藏接口里面的参数
    setCollectId(state, { payload }) {
      return {
        ...state,
        ...{
          collectId: payload,
        },
      };
    },
  }
}
