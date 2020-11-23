import  {queryMaxDate,queryMonthBar,queryScreenCondition,queryAreaInfo,queryChartTypes,queryDayTrend,queryYearBar,queryCityBar,queryCityRank,queryChannel,queryProduct,queryBusinessPie} from '@/services/indexDetails';

export default{
  namespace:"overviewIndexDetail",
  state:{
    maxDate:"",
    kpiCode:"",
    selectType:[],
    dayTrend:{},
    cityRank:{},
    cityBar:{},
    yearBar:{},
    monthBar:{},
    businessPie:{},
    channel:{},
    product:{},
    popUpShow:false,
  },

  effects:{
    // 请求
    *fetchMaxDate({ payload }, { call }) {
      return yield call(queryMaxDate,payload);
    },

    *fetchScreenCondition({ payload }, { call,put }) {
      const response = yield call(queryScreenCondition,payload);
      yield put({
        type: 'setScreenCondition',
        payload: response,
      });
    },
    *fetchAreaInfo({ payload }, { call,put }) {
      const response = yield call(queryAreaInfo,payload);
      yield put({
        type: 'setAreaInfo',
        payload: response,
      });
    },
    *fetchChartTypes({ payload }, { call }) {
      return yield call(queryChartTypes,payload);
    },
    *fetchDayTrend({ payload }, { call,put }) {
      const response = yield call(queryDayTrend,payload);
      yield put({
        type: 'setDayTrend',
        payload: response,
      });
    },
    *fetchYearBar({ payload }, { call,put }) {
      const response = yield call(queryYearBar,payload);
      yield put({
        type: 'setYearBar',
        payload: response,
      });
    },
    *fetchMonthBar({ payload }, { call,put }) {
      const response = yield call(queryMonthBar,payload);
      yield put({
        type: 'setMonthBar',
        payload: response,
      });
    },
    *fetchCityBar({ payload }, { call,put }) {
      const response = yield call(queryCityBar,payload);
      yield put({
        type: 'setCityBar',
        payload: response,
      });
    },
    *fetchCityRank({ payload }, { call,put }) {
      const response = yield call(queryCityRank,payload);
      yield put({
        type: 'setCityRank',
        payload: response,
      });
    },
    *fetchChannel({ payload }, { call,put }) {
      const response = yield call(queryChannel,payload);
      yield put({
        type: 'setChannel',
        payload: response,
      });
    },
    *fetchProduct({ payload }, { call,put }) {
      const response = yield call(queryProduct,payload);
      yield put({
        type: 'setProduct',
        payload: response,
      });
    },
    *fetchBusinessPie({ payload }, { call,put }) {
      const response = yield call(queryBusinessPie,payload);
      yield put({
        type: 'setBusinessPie',
        payload: response,
      });
    }
  },
  reducers:{
    setScreenCondition(state,action){
      return {
        ...state,
        selectType:action.payload
      }
    },
    setAreaInfo(state,action){
      return {
        ...state,
        areaInfo:action.payload
      }
    },

    setDayTrend(state,action){
      return {
        ...state,
        dayTrend:action.payload
      }
    },
    setYearBar(state,action){
      return {
        ...state,
        yearBar:action.payload
      }
    },
    setMonthBar(state,action){
      return {
        ...state,
        monthBar:action.payload
      }
    },
    setCityBar(state,action){
      return {
        ...state,
        cityBar:action.payload
      }
    },
    setCityRank(state,action){
      return {
        ...state,
        cityRank:action.payload
      }
    },
    setChannel(state,action){
      return {
        ...state,
        channel:action.payload
      }
    },
    setProduct(state,action){
      return {
        ...state,
        product:action.payload
      }
    },
    setBusinessPie(state,action){
      return {
        ...state,
        businessPie:action.payload
      }
    },
    setKpiCode(state,action){
      return {
        ...state,
        kpiCode:action.payload
      }
    },
    setPopUpShow(state,action){
      return {
        ...state,
        popUpShow:action.payload
      }
    },
  }
}
