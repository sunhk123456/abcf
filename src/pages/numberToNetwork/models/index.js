import queryTitleData from '@/services/numberToNetwork';

export default {
  namespace:'NumberToNetworkModel',
  state:{
    titleData:{}, // 携号转网表头数据
  },
  
  
  effects:{
    *fetchTitleData({payload,callback},{call,put}){ // 第一次加载表格数据
      console.log("123456")
      const res = yield call(queryTitleData,payload);
      yield put({
        type:'getTitleData',
        payload:res
      });
      if(callback){callback(res)}
    },
    
    
  },
  
  
  reducers:{
    getTitleData(state,action){
      return {
        ...state,
        titleData:action.payload
      }
    },
    
  }
}
