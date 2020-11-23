/**
 * @Description: 搜索框models
 *
 * @author: liuxiuqian
 *
 * @date: 2019/1/19
 */
import { typeDataFetch, recommendListFetch, maxDateFetch } from '@/services/searchPage';

export default {
  namespace: 'searchModels',
  state: {
    selectName: "", // 搜索框实际要搜索的内容（若从菜单搜索分类，该字段为分类id）
    searchContent:"",// 搜索框展示内容
    searchType: 0, // 搜索类型 0 表示手动输入搜素， 1表示点击菜单搜索
    downUp: false, // 是否显示搜索提醒
    // onlyType:0, // 仅手动改变筛选条件
    selectType: {
      id: "999",
      name: "全部"
    }, // 选中的类型 id  name
    typeData: [], // 类型数据
    downUpData: [], // 搜索提醒数据
    maxDate: "", // 最大账期
  },

  effects: {
    // 类型数据请求
    *getTypeData({ payload }, { call, put }) {
      const response = yield call(typeDataFetch, payload);
      yield put({
        type: 'setTypeData',
        payload: response,
      });
    },

    // 指标类型最大账期请求
    *getMaxDate({ payload }, { call, put }) {
      const response = yield call(maxDateFetch, payload);
      yield put({
        type: 'setMaxDate',
        payload: response.date,
      });
    },

    // 提醒数据请求
    *getRecommendList({ payload }, { call, put }) {
      const response = yield call(recommendListFetch, payload);
      yield put({
        type: 'setRecommendList',
        payload: response,
      });
    },

    // 选中类型数据数据更新
    *updataSelectType({ payload }, { put }){
      yield put({
        type: 'setSelectType',
        payload,
      });
    },

    // 鼠标离开时关闭提醒框
    *updataDownUp({ payload }, { put }){
      yield put({
        type: 'setDownUp',
        payload,
      });
    },

    // 更新实际搜索内容
    *upDataSelectName({ payload }, { put }){
      yield put({
        type: 'setSelectNameType',
        payload,
      });
    },

    // 更新展示搜索内容
    *updataSearchContent({ payload }, { put }){
      yield put({
        type: 'setSearchContent',
        payload,
      });
    }

  },

  reducers: {

    // 类型数据请求
    setTypeData(state, {payload} ) {
      return {
        ...state,
        ...{
          selectType: payload.default,
          typeData: payload.selectList
        },
      };
    },

    // 指标类型最大账期
    setMaxDate(state, {payload} ){
      return {
        ...state,
        ...{
          maxDate: payload,
        },
      };
    },

    // 提醒数据
    setRecommendList(state, {payload}){
      return {
        ...state,
        ...{
          downUpData: payload,
          downUp: payload.length > 0,
        }
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

    // 鼠标离开时关闭提醒框
    setDownUp(state, {payload} ){
      return {
        ...state,
        downUp: payload,
      };
    },
    // 更新搜索内容 包含类型
    setSelectNameType(state, {payload} ){
      return {
        ...state,
        selectName: payload.selectName,
        searchType: payload.searchType
      };
    },

    // 更新搜索内容
    setSelectName(state, {payload} ){
      return {
        ...state,
        selectName: payload
      };
    },
    // 更新搜索展示内容
    setSearchContent(state, {payload} ){
      return {
        ...state,
        searchContent: payload.name,
        searchType: payload.searchType
      };
    },
    // 更新搜索内容
    setSearchValue(state, {payload} ){
      return {
        ...state,
        searchContent: payload.searchValue,
        selectName: payload.selectName,

      };
    },
  },
};
