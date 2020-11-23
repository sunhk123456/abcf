/**
 * @date: 2019/8/22
 * @author 风信子
 * @Description:  地域组件model
 */

import { requestSpecialSingleRegion } from '@/services/analyseSpecial/analyseSpecial';

export default {
  namespace: 'singleRegionModel',

  state: {
    singleRegionData:[],
    selectData: {
      "id": "111",
      "name": "全国"
    },

  },

  effects: {
    *singleRegionFetch({ payload }, { call, put }) {
      const response = yield call(requestSpecialSingleRegion, {markType:payload.markType});
      yield put({
        type: 'saveSingleRegion',
        payload: response,
      });
    },

    // 选中的数据更新
    *selectData({ payload }, { put }){
      yield put({
        type: 'setSelectData',
        payload,
      });
    },
  },

  reducers: {
    saveSingleRegion(state, {payload} ) {

      return {
        ...state,
        singleRegionData:payload,
        selectData: payload[0],
      };
    },

    // 选中的数据更新
    setSelectData(state, {payload} ){
      return {
        ...state,
        selectData:payload
      };
    }
  },
};
