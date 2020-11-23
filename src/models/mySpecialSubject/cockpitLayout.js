/**
 * @Description: 驾驶舱 models
 *
 * @author: liuxiuqian
 *
 * @date: 2020/5/6
 */
import {
  queryPieEchart,
  queryTimeEchartArea,
  queryTreeMap,
  queryIndexConfigEchart,
  queryDayAndMonth,
  queryIndexDemension,
  queryChartType,
  queryLayout, // 布局接口
  queryIndexDemensionSave, // echart图专题指标维度配置保存接口
  queryAddLayout,  //  添加布局接口
  queryDeleteEchart
} from '@/services/mySpecialSubject/cockpitLayout';

export default {
  namespace:"cockpitLayoutModels",
  state:{
    criterionPopupData: [],
    dayAndMonth:{},
    dimensionPopupData: {},
    templatePopupData: [],
    layoutData :  [], // 布局数据
  },
  effects:{
    // 柱状图接口 时间趋势图 地域分布 3个
    *fetchTimeEchartArea({ payload, callback }, { call }){
      const response = yield call(queryTimeEchartArea, payload);
      yield callback(response);
    },
    // 饼图接口 3个
    *fetchPieEchart({ payload, callback }, { call }){
      const response = yield call(queryPieEchart, payload);
      yield callback(response);
    },
    // 矩形树图接口 1个
    *fetchTreeMap({ payload, callback }, { call }){
      const response = yield call(queryTreeMap, payload);
      yield callback(response);
    },
    // 指标检索弹窗 搜索接口 1个
    *fetchIndexConfig({ payload }, { call, put }){
      const response = yield call(queryIndexConfigEchart, payload);
      yield put({
        type: 'updateState',
        payload: {
          criterionPopupData: response
        },
      });
    },
    //  指标检索弹窗 日/月账期类型接口 1个
    *fetchDayAndMonth({ payload, callback }, { call, put }) {
      const response = yield call(queryDayAndMonth, payload);
      yield put({
        type: 'updateState',
        payload: {
          dayAndMonth: response
        },
      });
      yield callback(response);
    },
    //  指标维度配置弹窗 数据接口  1个
    *fetchIndexDemension({ payload, callback }, { call, put }) {
      const response = yield call(queryIndexDemension, payload);
      yield put({
        type: 'updateState',
        payload: {
          dimensionPopupData: response
        },
      });
      yield callback(response);
    },
    //  模板选择弹窗 数据接口  1个
    *fetchChartType({ payload, callback }, { call, put }) {
      const response = yield call(queryChartType, payload);
      yield put({
        type: 'updateState',
        payload: {
          templatePopupData: response
        },
      });
      yield callback(response);
    },

    // 布局接口
    *fetchLayout({ payload }, { call, put }) {
      const response = yield call(queryLayout, payload);
      yield put({
        type: 'updateState',
        payload: {
          layoutData: response
        },
      });
    },

    // echart图专题指标维度配置保存接口
    *fetchIndexDemensionSave({ payload,callback }, { call }) {
      const response = yield call(queryIndexDemensionSave, payload);
      callback(response);
    },

    // echart图专题指标维度配置保存接口
    *fetchAddLayout({ payload,callback }, { call }) {
      const response = yield call(queryAddLayout, payload);
      callback(response);
    },

    // 删除单个图接口
    *fetchDeleteEchart({ payload,callback }, { call }) {
      const response = yield call(queryDeleteEchart, payload);
      callback(response);
    },

  },
  reducers:{
    //  更新数据
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 更新布局数据
    updatelayoutData(state,{payload}){
      return {
        ...state,
        layoutData:payload
      }
    }

  }
}
