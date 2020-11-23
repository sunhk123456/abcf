import {queryReplyData,queryDateRange,queryProblemType,queryPageNavData,querySubmitFeedback,querySearchMenu} from '@/services/systemOperator';


export default {
  namespace:'systemOperatorCom',

  state:{
    replyInfo:{},// 反馈信息数据
    dateRange:'',// 页面账期
    problemType:[],// 问题类型
    replyContent: '', // 回复信息内容
    problemId:'002', // 暂存问题编号
    pageNavData:[],// 可选页面数据
  },


  effects:{
    *fetchDateRange({payload},{call,put}){ // 加载页面账期数据
      const res = yield call(queryDateRange,payload);
      yield put({
        type:'getDateRange',
        payload:res
      })
    },

    *fetchProblemType({payload},{call,put}){ // 加载问题类型
      const res = yield call(queryProblemType,payload);
      yield put({
        type:'getProblemType',
        payload:res
      })
    },

    *fetchReplyInfo({payload},{call,put}){ // 最新回复数据
      const res = yield call(queryReplyData,payload);
      yield put({
        type:'getReplyInfo',
        payload:res
      })
    },

    *fetchReplyContent({payload},{put}){ // 改变回复内容
      yield put({
        type:'getReplyContent',
        payload
      })
    },

    *fetchSubmitFeedback({payload},{call}){ // 提交反馈
      return yield call(querySubmitFeedback,payload);
    },

    *fetchPageNavData({payload},{call,put}){ // 加载反馈提交页面选择列表
      const res = yield call(queryPageNavData,payload);
      /**
       * 功能：处理数据格式
       * */
      function dataHandleFun (list,parentId){
        /**
         * 利用递归格式化每个节点
         */
        function formatTree(items, parentId2) {
          const result = [];
          if (!items[parentId2]) {
            return result;
          }
          items[parentId2].forEach((item) =>{
            const r1 = {
              children : formatTree(items, item.id)
            };
            const  r2 =  Object.assign(item, r1)
            result.push(r2);
          });
          return result;
        }

        /**
         * 树状的算法
         * @params list     代转化数组
         * @params parentId 起始节点
         */
        function getTrees(list1, parentId1) {
          const items= {};
          // 获取每个节点的直属子节点，记住是直属，不是所有子节点
          for (let i = 0; i < list1.length; i+=1) {
            const r1 = {title : list1[i].name};
            Object.assign(list1[i],r1);
            const indexId = `${list1[i].id},${list1[i].name}?${list1[i].RtypeName}*${i}`;
            const r2 = {value : indexId};
            Object.assign(list1[i],r2);
            const r3 = {key : list1[i].id};
            Object.assign(list1[i],r3);
            const key = list1[i].parentId;
            if (items[key]) {
              items[key].push(list1[i]);
            } else {
              items[key] = [];
              items[key].push(list1[i]);
            }
          }

          return  formatTree(items, parentId1);
        }

        return getTrees(list,parentId);
      }
      const result = dataHandleFun(res,"newquery");
      yield put({
        type:'getPageNavData',
        payload:result
      })
    },

    *fetchSearchMenu({payload},{call}){ // 提交反馈
      return yield call(querySearchMenu,payload);
    },
  },


  reducers:{
    getReplyInfo(state,action){
      return {
        ...state,
        replyInfo:action.payload,
        replyContent:action.payload.replyContent,
        problemId: action.payload.problemId
      }
    },

    getDateRange(state,action){
      return {
        ...state,
        dateRange: action.payload
      }
    },

    getProblemType(state,action){
      return {
        ...state,
        problemType: action.payload
      }
    },

    getReplyContent(state,action){
      return {
        ...state,
        replyContent:action.payload.replyContent1
      }
    },

    getPageNavData(state,action){
      return {
        ...state,
        pageNavData:action.payload
      }
    },
  }
}
