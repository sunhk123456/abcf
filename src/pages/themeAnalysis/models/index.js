/**
 * Created by xingxiaodong on 2019/2/26.
 */
import  {
  themeAnalysisMaxDate,
  themeAnalysisChart,
  themeAnalysisChartNet,
  themeAnalysisAreaData,
  themeAnalysisAreaDataNet,
  themeAnalysisTimeData,
  themeAnalysisTimeDataNet,
  themeAnalysisTableData,
  themeAnalysisTableDataNet
}  from '../../../services/themeAnalysis';

export default {
  namespace: 'themeAnalysisModels',

  state: {
    xxdProductScreen:{},
    maxDate:null,
    tableData:null,
    areaData:null,
    newAreaData:null,
    timeData:null,
    chartData0:null,
    chartData1:null,
    chartData2:null,
    chartData3:null,
    chartData4:null,


  },

  effects: {
    *fetchMaxData({ payload,callback }, { call, put }) {
      const response = yield call(themeAnalysisMaxDate,payload);
      yield put({
        type: 'getMaxDate',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    *fetchTableData({ payload }, { call, put }) {
      const {indexTypeId, params} = payload;
      let servicesTable = themeAnalysisTableDataNet;
      if(indexTypeId === "001"){
        servicesTable = themeAnalysisTableData;
      }
      const response = yield call(servicesTable,params);
      yield put({
        type: 'getTableDate',
        payload: response,
      });
    },
    *fetchAreaData({ payload }, { call, put }) {
      const response = yield call(themeAnalysisAreaData,payload);
      yield put({
        type: 'getAreaDate',
        payload: response,
      });
    },
    *fetchAreaDataNet({ payload }, { call, put }) {
      const response = yield call(themeAnalysisAreaDataNet,payload);
      yield put({
        type: 'getAreaDate',
        payload: response,
      });
    },
    *fetchTimeData({ payload }, { call, put }) {
      const response = yield call(themeAnalysisTimeData,payload);
      yield put({
        type: 'getTimeDate',
        payload: response,
      });
    },
    *fetchTimeDataNet({ payload }, { call, put }) {
      const response = yield call(themeAnalysisTimeDataNet,payload);
      yield put({
        type: 'getTimeDate',
        payload: response,
      });
    },
    *fetchConditionChart0({ payload }, { call, put }) {
      const response = yield call(themeAnalysisChart,payload);
      yield put({
        type: 'getThemeAnalysisChart0',
        payload: response,
      });
    },
    *fetchConditionChart1({ payload }, { call, put }) {
      const response = yield call(themeAnalysisChart,payload);
      yield put({
        type: 'getThemeAnalysisChart1',
        payload: response,
      });
    },
    *fetchConditionChart2({ payload }, { call, put }) {
      const response = yield call(themeAnalysisChart,payload);
      yield put({
        type: 'getThemeAnalysisChart2',
        payload: response,
      });
    },
    *fetchConditionChart3({ payload }, { call, put }) {
      const response = yield call(themeAnalysisChart,payload);
      yield put({
        type: 'getThemeAnalysisChart3',
        payload: response,
      });
    },
    *fetchConditionChart4({ payload }, { call, put }) {
      const response = yield call(themeAnalysisChart,payload);
      yield put({
        type: 'getThemeAnalysisChart4',
        payload: response,
      });
    },



    *fetchConditionChartNet0({ payload }, { call, put }) {
      const response = yield call(themeAnalysisChartNet,payload);
      yield put({
        type: 'getThemeAnalysisChart0',
        payload: response,
      });
    },
    *fetchConditionChartNet1({ payload }, { call, put }) {
      const response = yield call(themeAnalysisChartNet,payload);
      yield put({
        type: 'getThemeAnalysisChart1',
        payload: response,
      });
    },
    *fetchConditionChartNet2({ payload }, { call, put }) {
      const response = yield call(themeAnalysisChartNet,payload);
      yield put({
        type: 'getThemeAnalysisChart2',
        payload: response,
      });
    },
    *fetchConditionChartNet3({ payload }, { call, put }) {
      const response = yield call(themeAnalysisChartNet,payload);
      yield put({
        type: 'getThemeAnalysisChart3',
        payload: response,
      });
    },
    *fetchConditionChartNet4({ payload }, { call, put }) {
      const response = yield call(themeAnalysisChartNet,payload);
      yield put({
        type: 'getThemeAnalysisChart4',
        payload: response,
      });
    },
  },

  reducers: {
    getMaxDate(state, action) {
      return {
        ...state,
        ...{maxDate:action.payload},
      };
    },
    getTableDate(state, action) {
      return {
        ...state,
        ...{tableData:action.payload},
      };
    },
    getAreaDate(state, action) {
      return {
        ...state,
        ...{
          areaData:action.payload,
          newAreaData:JSON.parse(JSON.stringify(action.payload)),
        },
      };
    },
    getTimeDate(state, action) {
      return {
        ...state,
        ...{timeData:action.payload},
      };
    },
    getThemeAnalysisChart0(state, action) {
      return {
        ...state,
        ...{chartData0:action.payload},
      };
    },
    getThemeAnalysisChart1(state, action) {
      return {
        ...state,
        ...{chartData1:action.payload},
      };
    },
    getThemeAnalysisChart2(state, action) {
      return {
        ...state,
        ...{chartData2:action.payload},
      };
    },
    getThemeAnalysisChart3(state, action) {
      return {
        ...state,
        ...{chartData3:action.payload},
      };
    },
    getThemeAnalysisChart4(state, action) {
      return {
        ...state,
        ...{chartData4:action.payload},
      };
    },
  },
};
