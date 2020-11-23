import  { queryMapAndBar } from '@/services/dayOverView';

export default {
  namespace :'billingRevenue',

  state:{
    mapAndBar:{},
    nationalData:[],
    // 地图传出的数据
    proId:"",
    proName:"",
    selectProAndCity:{
      proId:"",
      proName:"",
      cityId:"",
      cityName:""
    }
  },
  effects:{
    // 请求
    *fetchMapAndBar({ payload }, { call, put }) {
      const response = yield call(queryMapAndBar,payload);
      yield put({
        type: 'setMapAndBar',
        payload: response,
      });
    },
  },

  reducers:{
    setMapAndBar(state, action) {
      return {
        ...state,
        mapAndBar: action.payload,
        nationalData:action.payload.nationalData
      };
    },
    changeProv(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
  }

}
