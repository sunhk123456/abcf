/**
 * @Description: 推荐内容models
 *
 * @author: liuxiuqian
 *
 * @date: 2019/1/19
 */
import { recentVisitFetch, recommendVisitFetch } from '@/services/searchPage';

export default {
  namespace: 'recommendedModels',

  state: {
    selectType: {
      id: "999",
      name: "全部"
    }, // 选中的类型 id  name
    recentVisitData: [], // 类型数据
    recommendVisitData: [], // 推荐内容数据
    recommendCollect:[], // 推荐内容被收藏的状态
    recommendCollectIdList:[], // 推荐内容collectId集合
  },

  effects: {
    // 类型数据请求
    *getTypeData({ payload }, { call, put }) {
      const response = yield call(recentVisitFetch, payload);
      yield put({
        type: 'setTypeData',
        payload: response,
      });
    },

    // 内容数据请求
    *getRecentVisitData({ payload }, { call, put }) {
      const response = yield call(recommendVisitFetch, payload);
      yield put({
        type: 'setRecentVisitData',
        payload: response,
      });
    },
  },

  reducers: {

    // 类型数据请求
    setTypeData(state, {payload} ) {
      return {
        ...state,
        ...{
          selectType: payload.default,
          recentVisitData: [...payload.selectList]
        },
      };
    },

    // 选中的数据更新
    setSelectType(state, {payload} ){
      return {
        ...state,
        ...{
          selectType: payload,
        },
      };
    },

    setRecentVisitData(state, {payload}){
      let collectIdList = [];
      const dataList = payload.data !== undefined ? payload.data : [];
      // 按钮收藏与否状态数组
      const list = dataList.map((item)=>item.isCollect !== '0');
      // 提取数组的collectId组成集合
      collectIdList = dataList.map((item)=>item.collectId);
      return {
        ...state,
        ...{
          recommendVisitData: dataList,
          recommendCollect:list,
          recommendCollectIdList:collectIdList
        },
      };
    },

    // 收藏选中的数据状态更新
    upDateCollectState(state, {payload} ){
      return {
        ...state,
        ...{
          recommendCollect: payload,
        },
      };
    },

    // 收藏选中的collectId列表更新
    upDateCollectId(state, {payload} ){
      return {
        ...state,
        ...{
          recommendCollectIdList: payload,
        },
      };
    },
  },
};
