import {} from '@/services/DevelopingUser';

export default {
  namespace:'developingUser',

  state:{
  },


  effects:{
    // *fetchUserTable({payload},{call,put}){ // 第一次加载表格数据
    //   const res = yield call(queryUserTable,payload);
    //   yield put({
    //     type:'getUserTable',
    //     payload:res.tbodyData
    //   })
    // },
    //
    //
    // *fetchSubmitFeedback({payload},{call}){ // 提交反馈
    //   return yield call(querySubmitFeedback,payload);
    // },

  },


  reducers:{
    // getUserTable(state,action){
    //   return {
    //     ...state,
    //     tableData:action.payload
    //   }
    // },

  }
}
