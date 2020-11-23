import  {queryMixEcharts} from '@/services/dayOverView';

export default {
  namespace :'mixEcharts',

  state:{
    data:{},
  },

  effects:{
    // 请求
    *fetchMixEcharts({ payload }, { call }) {
      return  yield call(queryMixEcharts,payload);
    },
  },

  reducers:{
  }

}
