import  { queryLineChart,querySpecialAuthentication } from '@/services/dayOverView';

export default {
  namespace :'cityLine',

  state:{
    cityLineData:{},
  },

  effects:{
    // 请求
    *fetchLineChart({ payload }, { call, put }) {
      const response = yield call(queryLineChart,payload);
      yield put({
        type: 'setLineChart',
        payload: response,
      });
    },

    *fetchSpecialAuthentication({ payload }, { call}) {
      return yield call(querySpecialAuthentication,payload);
    },
  },

  reducers:{
    setLineChart(state, action) {
      return {
        ...state,
        cityLineData: action.payload
      };
    }
  }

}
