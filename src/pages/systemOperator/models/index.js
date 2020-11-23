import {queryTableData,queryCommitReply,querySearchTableData,queryModuleTab} from '@/services/systemOperator';

export default {
  namespace:'systemOperator',


  state:{
    tableData:[], // 表格数据
    componentStatus:'none', // 回复组件状态
    moduleTab:[],// 标签页
  },


  effects:{
    *fetchModuleTab({payload,callback},{call,put}){ // 第一次加载表格数据
      const response = yield call(queryModuleTab,payload);
      yield put({
        type:'getModuleTab',
        payload:response
      })
      if(response !== undefined){
        if(callback)callback(response);
      }
    },

    *fetchTableData({payload},{call,put}){ // 第一次加载表格数据
      const res = yield call(queryTableData,payload);
      yield put({
        type:'getTableData',
        payload:res.tbodyData
      })
    },

    *fetchSearchTableData({payload},{call,put}){ // 查询后的表格数据
      const res = yield call(querySearchTableData,payload);
      yield put({
        type:'getSearchTableData',
        payload:res.tbodyData
      })
    },

    *fetchComponentStatus({payload},{put}){ // 父组件改变回复组件状态
      yield put({
        type:'getComponentStatus',
        payload
      })
    },

    *fetchComStatus({payload},{put}){ // 子组件改变回复组件状态
      yield put({
        type:'getComStatus',
        payload:payload.status
      })
    },

    *fetchCommitReply({payload},{call}){ // 提交回复
      return yield call(queryCommitReply,payload);
    },

  },


  reducers:{
    getModuleTab(state,action){
      return {
        ...state,
        moduleTab: action.payload
      }
    },

    getTableData(state,action){
      return {
        ...state,
        tableData:action.payload
      }
    },

    getComponentStatus(state,action){
      return {
        ...state,
        componentStatus:action.payload.status
      }
    },

    getComStatus(state,action){
      return {
        ...state,
        componentStatus:action.payload
      }
    },

    getSearchTableData(state,action){
      return {
        ...state,
        tableData: action.payload
      }
    },


  }
}
