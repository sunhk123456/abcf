import  {queryIndexList} from '@/services/dayOverView';

export default {
  namespace :'indexList',

  state:{
  },

  effects:{
    // 请求
    *fetchIndexList({ payload }, { call, put }) {
      return yield call(queryIndexList,payload);
    },
  },

  reducers:{
    setIndexList(state, action) {
      return {
        ...state,
        indexTableData: action.payload,
      };
    },
  }

}
