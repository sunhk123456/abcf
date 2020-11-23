import {queryUserTable} from '@/services/ProblemFeedback';

export default {
  namespace:'problemFeedback',

  state:{
    tableData:[], // 表格数据
  },


  effects:{
    *fetchUserTable({payload},{call,put}){ // 第一次加载表格数据
      const res = yield call(queryUserTable,payload);
      yield put({
        type:'getUserTable',
        payload:res.tbodyData
      })
    },


  },


  reducers:{
    getUserTable(state,action){
      return {
        ...state,
        tableData:action.payload
      }
    },

  }
}
