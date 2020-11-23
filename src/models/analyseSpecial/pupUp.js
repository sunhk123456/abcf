import  {
  requestChartTypeData,
  requestStackBarData,
  requestTimeEchart1Data,
  requestTimeEchart2Data,
  requestTimeEchart3Data,
  requestAreaEchart1Data,
  requestAreaEchart2Data,
  requestPieEchartData,
  requestPieEchart2Data,
  requestPieEchart3Data,
  requestTreeMapData,
  requestBarEchartData,
  requestTop5Data,
  requestTop10Data
} from '@/services/analyseSpecial/analyseSpecial';


export default{
  namespace:"analyseSpecialPopModels",
  state:{
    chartTypeData:[],
    stackBarData: null, // 堆叠柱状图数据
    timeEchart1Data:null,
    timeEchart2Data:null,
    timeEchart3Data:null,
    areaEchart1Data:null,
    areaEchart2Data:null,
    pieEchartData:null,
    pieEchart2Data:null,
    pieEchart3Data:null,
    treeMapData:null,
    barEchartData:null,
    top5Data:null,
    top10Data:null,

  },

  effects:{
    // 请求图表类型数据
    *fetchChartTypeData({ payload,callback }, { call, put }) {
      const response = yield call(requestChartTypeData,payload);
      yield put({
        type: 'getChartTypeData',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求堆叠柱状图数据
    *fetchStackBarData({ payload,callback }, { call, put }) {
      const response = yield call(requestStackBarData,payload);
      yield put({
        type: 'getStackBarData',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求时间趋势图1数据
    *fetchTimeEchart1Data({ payload,callback }, { call, put }) {
      const response = yield call(requestTimeEchart1Data,payload);
      yield put({
        type: 'getTimeEchart1Data',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求时间趋势图2数据
    *fetchTimeEchart2Data({ payload,callback }, { call, put }) {
      const response = yield call(requestTimeEchart2Data,payload);
      yield put({
        type: 'getTimeEchart2Data',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求时间趋势图3数据
    *fetchTimeEchart3Data({ payload,callback }, { call, put }) {
      const response = yield call(requestTimeEchart3Data,payload);
      yield put({
        type: 'getTimeEchart3Data',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求地域趋势图1数据
    *fetchAreaEchart1Data({ payload,callback }, { call, put }) {
      const response = yield call(requestAreaEchart1Data,payload);
      yield put({
        type: 'getAreaEchart1Data',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求地域趋势图2数据
    *fetchAreaEchart2Data({ payload,callback }, { call, put }) {
      const response = yield call(requestAreaEchart2Data,payload);
      yield put({
        type: 'getAreaEchart2Data',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求pie图数据
    *fetchPieEchartData({ payload,callback }, { call, put }) {
      const response = yield call(requestPieEchartData,payload);
      yield put({
        type: 'getPieEchartData',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求pie图数据
    *fetchPieEchart2Data({ payload,callback }, { call, put }) {
      const response = yield call(requestPieEchart2Data,payload);
      yield put({
        type: 'getPieEchart2Data',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求pie图数据
    *fetchPieEchart3Data({ payload,callback }, { call, put }) {
      const response = yield call(requestPieEchart3Data,payload);
      yield put({
        type: 'getPieEchart3Data',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求树图数据
    *fetchTreeMapData({ payload,callback }, { call, put }) {
      const response = yield call(requestTreeMapData,payload);
      yield put({
        type: 'getTreeMapData',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求bar图数据
    *fetchBarEchartData({ payload,callback }, { call, put }) {
      const response = yield call(requestBarEchartData,payload);
      yield put({
        type: 'getBarEchartData',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求top5图数据
    *fetchTop5Data({ payload,callback }, { call, put }) {
      const response = yield call(requestTop5Data,payload);
      yield put({
        type: 'getTop5Data',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },
    // 请求top10图数据
    *fetchTop10Data({ payload,callback }, { call, put }) {
      const response = yield call(requestTop10Data,payload);
      yield put({
        type: 'getTop10Data',
        payload: response,
      },);
      if(callback){
        callback(response)
      }
    },

  },
  reducers:{
    // 保存图表类型数据
    getChartTypeData(state, {payload}){
      return {
        ...state,
        ...{chartTypeData:payload},
      }
    },
    // 保存堆叠柱状图数据
    getStackBarData(state, {payload}){
      return {
        ...state,
        ...{stackBarData:payload},
      }
    },
    // 保存时间趋势图1数据
    getTimeEchart1Data(state, {payload}){
      return {
        ...state,
        ...{timeEchart1Data:payload},
      }
    },
    // 保存时间趋势图2数据
    getTimeEchart2Data(state, {payload}){
      return {
        ...state,
        ...{timeEchart2Data:payload},
      }
    },
    // 保存时间趋势图3数据
    getTimeEchart3Data(state, {payload}){
      return {
        ...state,
        ...{timeEchart3Data:payload},
      }
    },
    // 保存地域趋势图1数据
    getAreaEchart1Data(state, {payload}){
      return {
        ...state,
        ...{areaEchart1Data:payload},
      }
    },
    // 保存地域趋势图2数据
    getAreaEchart2Data(state, {payload}){
      return {
        ...state,
        ...{areaEchart2Data:payload},
      }
    },
    // 保存pie图数据
    getPieEchartData(state, {payload}){
      return {
        ...state,
        ...{pieEchartData:payload},
      }
    },
    // 保存pie图数据
    getPieEchart2Data(state, {payload}){
      return {
        ...state,
        ...{pieEchart2Data:payload},
      }
    },
    // 保存pie图数据
    getPieEchart3Data(state, {payload}){
      return {
        ...state,
        ...{pieEchart3Data:payload},
      }
    },
    // 保存树图数据
    getTreeMapData(state, {payload}){
      return {
        ...state,
        ...{treeMapData:payload},
      }
    },
    // 保存bar图数据
    getBarEchartData(state, {payload}){
      return {
        ...state,
        ...{barEchartData:payload},
      }
    },
    // 保存top5图数据
    getTop5Data(state, {payload}){
      return {
        ...state,
        ...{top5Data:payload},
      }
    },
    // 保存top10图数据
    getTop10Data(state, {payload}){
      return {
        ...state,
        ...{top10Data:payload},
      }
    },


  }
}

