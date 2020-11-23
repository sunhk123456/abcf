import  {querybenchmarkArea} from '@/services/benchmarking';

export default{
  namespace:"benchmarkArea",
  state:{
    // 全国用户数据
    benchmarkSelectorInfo: [
    ],
    benchmarkProId: '', // 已选中的省份id
    benchmarkCityId: "", // 已选中的城市id
    benchmarkName: '' // 已选中的省份或城市名称
  },

  effects:{
    // 请求
    * fetchArea({ payload }, { call,put }) {
      const result = yield call(querybenchmarkArea,payload);
      yield put({
        type: 'setAreaData',
        payload: result,
      });
      return  result;
    },
  },
  reducers:{
    setAreaData(state,action){
      const { payload} =action;
      const {benchmarkSelectorInfo, benchmarkProId, benchmarkCityId, benchmarkName} =payload;
      const name = benchmarkName === "" ? "请选择" :benchmarkName;
      const benchmarkSelectorInfo1 =[];
      benchmarkSelectorInfo1.push(benchmarkSelectorInfo[0])
      benchmarkSelectorInfo1.push(benchmarkSelectorInfo[1])
      return {
        ...state,
        benchmarkSelectorInfo,
        benchmarkProId,
        benchmarkCityId,
        benchmarkName: name
      }
    },
    // 改变省份触发的方法
    changeArea(state,{payload}){
      return{
        ...state,
        benchmarkName:payload.name,
        benchmarkProId: payload.id,
        benchmarkCityId: "-1"
      }
    },

    // 改变地市触发的方法
    changeCityArea(state,{payload}){
      return{
        ...state,
        benchmarkName:payload.name,
        benchmarkCityId: payload.id,
        benchmarkProId: payload.pid,
      }
    }
  }
}

