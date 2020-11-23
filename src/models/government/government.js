import { fetchOperationData,fetchStackBarData,fetchProductData,fetchIntegrationData,fetchBusinessData } from '../../services/government';

export default {
  namespace: 'governmentModels',
  state: {
    operation:{},   // 请求运营公司数据
    stackBar:{},    // 请求名单制收入分析接口数据
    product:{},     // 请求产互公司数据
    integration:{},     // 请求集成公司数据
    businessData:{}      // 请求4个表格数据
  },
  
  effects: {
    // 请求运营公司数据
    *getOperationData({ payload}, { call, put }) {
      const response = yield call(fetchOperationData, payload);
      yield put({
        type: 'setOperationData',
        payload: response.data,
      });
    },
    // 请求名单制收入分析接口数据
    *getStackBarData({ payload}, { call, put }) {
      const response = yield call(fetchStackBarData, payload);
      yield put({
        type: 'setStackBarData',
        payload: response.data,
      });
    },
    // 请求产互公司数据
    *getProductData({ payload}, { call, put }) {
      const response = yield call(fetchProductData, payload);
      yield put({
        type: 'setProductData',
        payload: response.data,
      });
    },
    // 请求集成公司数据
    *getIntegrationData({ payload}, { call, put }) {
      const response = yield call(fetchIntegrationData, payload);
      yield put({
        type: 'setIntegrationData',
        payload: response.data,
      });
    },
    // 请求4个表格数据
    *getBusinessData({ payload}, { call, put }) {
      const response = yield call(fetchBusinessData, payload);
      yield put({
        type: 'setBusinessData',
        payload: response.data,
      });
    },

  },
  
  reducers: {
    setOperationData(state, {payload}) {
      return {
        ...state,
        operation: payload,
      };
    },
    setStackBarData(state, {payload}){
      return {
        ...state,
        stackBar:payload,
      }
    },
    setProductData(state, {payload}) {
      return {
        ...state,
        product: payload,
      };
    },
    setIntegrationData(state, {payload}) {
      return {
        ...state,
        integration: payload,
      };
    },
    setBusinessData(state, {payload}) {
      return {
        ...state,
        businessData: payload,
      };
    },
  },
};
