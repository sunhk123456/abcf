/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 地域省份组件/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/3/5/005
 */

import { proCityData } from '@/services/searchPage';

export default {
  namespace: 'proSelectModels',

  state: {
    areaDate:[],
    selectIndex: 0, // 选中省索引
    selectPro: {
      "proId": "111",
      "proName": "全国"
    }, // 选中省数据
    selectCity: {
      "cityId": "-1",
      "cityName": "全国"
    }, // 选中地市数据
  },

  effects: {
    *proCityFetch({ payload }, { call, put }) {
      const response = yield call(proCityData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    // 选中的数据更新
    *selectProCity({ payload }, { put }){
      yield put({
        type: 'setSelectData',
        payload,
      });
    },

  },

  reducers: {
    save(state, action ) {
      return {
        ...state,
        areaDate: action.payload,
      };
    },

    // 选中的数据更新
    setSelectData(state, {payload} ){
      return {
        ...state,
        ...{
          selectIndex: payload.selectIndex,
          selectPro: payload.selectPro,
          selectCity: payload.selectCity
        }
      };
    }
  },
};
