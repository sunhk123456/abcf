import {
  productFeaturesLineBarEchart,// 1.出账收入频次图接口
  productFeaturesTwoLineEchart,// 2. 出账收入变化分布
  productFeaturesFlowFrequency,// 3.流量频次图
  productFeaturesVoiceFrequency,// 4.语音频次图
  productFeaturesTotalTrend,// 5.合计趋势图
  productFeaturesTotalArea,// 6.合计地域分布图
  productFeaturesChannelEchart,// 7.渠道分布图
  productFeaturesPeopleEchart,// 8.客户分布图
  productFeaturesDevelopTable, // 发展质量表格
  productFeaturesBasicInfoData, // 产品基本信息
} from '../../../services/productFeatures';

import {
  queryProductViewTable, // 指标配置的表格接口
} from '@/services/productView';

export default {
  namespace: 'productFeaturesModels',

  state: {
    lineBarEchartData:null,
    twoLineEchartData:null,
    flowFrequencyData:null,
    voiceFrequencyData:null,
    totalTrendData:null,
    totalAreaData:null,
    channelEchartData:null,
    peopleEchartData:null,
    productViewTableData:{
      "thData": [],
      "tbodyData": [],
      "totalNum": "100",
      "currentNum": "10",
      "totalPageNum": "10"
    },
    developTableData:{
      "thData": [],
      "tbodyData": [],
      "totalNum": "100",
      "currentNum": "10",
      "totalPageNum": "10"
    },
    basicInfoData:{
      title:"",
      list:[],
    }
  },

  effects: {
    // 1.出账收入频次图接口
    *fetchLineBarEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productFeaturesLineBarEchart,payload);
      yield put({
        type: 'getLineBarEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    // 2. 出账收入变化分布
    *fetchTwoLineEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productFeaturesTwoLineEchart,payload);
      yield put({
        type: 'getTwoLineEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    // 3.流量频次图
    *fetchFlowFrequencyData({ payload,callback }, { call, put }) {
      const response = yield call(productFeaturesFlowFrequency,payload);
      yield put({
        type: 'getFlowFrequencyData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    // 4.语音频次图
    *fetchVoiceFrequencyData({ payload,callback }, { call, put }) {
      const response = yield call(productFeaturesVoiceFrequency,payload);
      yield put({
        type: 'getVoiceFrequencyData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    // 5.合计趋势图
    *fetchTotalTrendData({ payload,callback }, { call, put }) {
      const response = yield call(productFeaturesTotalTrend,payload);
      yield put({
        type: 'getTotalTrendData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    // 6.合计地域分布图
    *fetchTotalAreaData({ payload,callback }, { call, put }) {
      const response = yield call(productFeaturesTotalArea,payload);
      yield put({
        type: 'getTotalAreaData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    // 7.渠道分布图
    *fetchChannelEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productFeaturesChannelEchart,payload);
      yield put({
        type: 'getChannelEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    // 8.客户分布图
    *fetchPeopleEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productFeaturesPeopleEchart,payload);
      yield put({
        type: 'getPeopleEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },

    // 9.产品总览表格（上部带指标配置的表格）
    *fetchProductViewTable({ payload }, { call, put }) {
      const response = yield call(queryProductViewTable,payload);
      yield put({
        type: 'setProductViewTable',
        payload: response,
      });
    },

    // 10.发展质量表格
    *fetchDevelopTable({ payload }, { call, put }) {
      const response = yield call(productFeaturesDevelopTable,payload);
      if(!response.errorCode){
        yield put({
          type: 'setDevelopTable',
          payload: response,
        });
      }
    },
    // 11.产品基本信息 basicInfoData
    *fetchBasicInfoData({ payload }, { call, put }) {
      const response = yield call(productFeaturesBasicInfoData,payload);
      yield put({
        type: 'getBasicInfoData',
        payload: response,
      });
    },

  },

  reducers: {
    // 1.出账收入频次图接口
    getLineBarEchartData(state, { payload }) {
      return {
        ...state,
        ...{ lineBarEchartData: payload },
      }
    },
    // 2. 出账收入变化分布
    getTwoLineEchartData(state, { payload }) {
      return {
        ...state,
        ...{ twoLineEchartData: payload },
      }
    },
    // 3. 流量频次图
    getFlowFrequencyData(state, { payload }) {
      return {
        ...state,
        ...{ flowFrequencyData: payload },
      }
    },
    // 4.语音频次图
    getVoiceFrequencyData(state, { payload }) {
      return {
        ...state,
        ...{ voiceFrequencyData: payload },
      }
    },
    // 5.合计趋势图
    getTotalTrendData(state, { payload }) {
      return {
        ...state,
        ...{ totalTrendData: payload },
      }
    },
    // 6.合计地域分布图
    getTotalAreaData(state, { payload }) {
      return {
        ...state,
        ...{ totalAreaData: payload },
      }
    },
    // 7.渠道分布图
    getChannelEchartData(state, { payload }) {
      return {
        ...state,
        ...{ channelEchartData: payload },
      }
    },
    // 8.客户分布图
    getPeopleEchartData(state, { payload }) {
      return {
        ...state,
        ...{ peopleEchartData: payload },
      }
    },

    // 9.产品总览表格（上部带指标配置的表格）
    setProductViewTable(state, { payload }){
      return {
        ...state,
        ...{ productViewTableData: payload },
      }
    },

    // 发展表格
    setDevelopTable(state, { payload }){
      return {
        ...state,
        ...{ developTableData: payload },
      }
    },
    // 产品那基本信息
    getBasicInfoData(state, { payload }){
      return {
        ...state,
        ...{ basicInfoData: payload },
      }
    }

  }
}
