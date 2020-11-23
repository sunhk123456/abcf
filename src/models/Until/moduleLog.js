/**
 * @Description: 模块日志model
 *
 * @author: liuxiuqian
 *
 * @date: 2020/4/8
 */
import {queryModuleLog} from "@/services/systemOperator";

export default {
  namespace: 'moduleLogModels',

  state: {
    moduleData:"ddd"
  },

  effects: {
    *moduleLogRequest({ payload }, { call, put  }){
      const response = yield call(queryModuleLog, payload);
      yield put({
        type: 'setModuleLogData',
        payload:response
      });
    },
  },

  reducers: {
    setModuleLogData(state, {payload}){
      return {
        ...state,
        moduleData:payload
      }
    }
  },
};
