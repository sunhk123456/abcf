import  { queryGaugeCharts } from '@/services/dayOverView';

export default {
  namespace :'gauge',

  state:{
  },

  effects:{
    // 请求
    *fetchLineChart({ payload }, { call}) {
      return yield call(queryGaugeCharts,payload);
    },
  },

  reducers:{

  }

}
