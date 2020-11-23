/**
 * Created by liuxiuqian on 2019/1/7.
 */
import { searchDataFetch,collectionFetch } from '@/services/searchPage';

export default {
  namespace: 'searchPageModels1994',

  state: {
    searchData: [{
      isCollect:'',
      collectId:''
    }],
    keyword: {}, // 搜索关键字
    nextFlag: "1", // 下一页的标识
    hasMore: true, // 是否有更多项目要加载。如果删除事件侦听器false
    searchCollect:[], // 搜索结果的收藏状态
    searchCollectIdList:[], // 搜索结果collectId集合
    callbackCode:'',
    modalVisible:false,
    collectParam:{}, // 发送到收藏接口的参数
  },

  effects: {
    // 请求列表数据
    *getSearchData({ payload, sign = false }, { call, put }) {
      const response = yield call(searchDataFetch, payload);
      yield put({
        type: 'setSearchData',
        payload: response,
        sign,
      });
    },

    // 清空列表数据
    *getCleanData({ payload = []}, { put }){
      yield put({
        type: 'setCleanData',
        payload,
      });
    },

    // 收藏接口数据请求
    *getCollectionData({ payload,callback }, { call, put }) {
      const response = yield call(collectionFetch, payload);
      yield put({
        type: 'upDateCallbackCode',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    // 更新列表数据
    setSearchData(state, { payload, sign }) {
      let hasMore = true;
      let searchData = [];
      let list;
      let collectIdList = [];
      if(!sign){
        searchData = state.searchData.concat(Object.keys(payload).length===0?[]:payload.data);
        // 生成按钮选中状态数组
        list = searchData.map((item)=>item.isCollect !== '0');
        // 提取collectId组成集合
        collectIdList = searchData.map((item)=>item.collectId);
      }else {
        searchData = Object.keys(payload).length===0?[]:payload.data;
        // 生成按钮选中状态数组
        list = searchData.map((item)=>item.isCollect !== '0');
        // 提取collectId组成集合
        collectIdList = searchData.map((item)=>item.collectId);
      }
      if(payload.nextFlag === "0"){
        hasMore = false;
      }
      return {
        ...state,
        ...{
          searchData,
          keyword: payload.keyword,
          nextFlag: payload.nextFlag,
          hasMore,
          searchCollect:list,
          searchCollectIdList:collectIdList
        },
      };
    },

    // 清除数据
    setCleanData(state, { payload }){
      return {
        ...state,
        searchData: payload || [],
      };
    },

    // 收藏选中的数据状态更新
    upDateCollectState(state, {payload} ){
      return {
        ...state,
        ...{
          searchCollect: payload,
        },
      };
    },

    // 收藏选中的返回状态更新
    upDateCallbackCode(state, {payload} ){
      return {
        ...state,
        ...{
          callbackCode: payload.code,
        },
      };
    },

    // 选中的collectId更新
    upDateCollectId(state, {payload} ){
      return {
        ...state,
        ...{
          searchCollectIdList: payload,
        },
      };
    },

    // 是否确定取消收藏弹窗弹出
    popConfirmModal(state, {payload} ){
      return {
        ...state,
        ...{
          modalVisible: payload,
        },
      };
    },

    // 发送到收藏接口的参数的更新
    collectParamChange(state, {payload} ){
      return {
        ...state,
        ...{
          collectParam: payload,
        },
      };
    },
  },
};
