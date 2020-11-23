import { leftTree,versionSelect,tableData,getIndexNav,indexInfo } from '@/services/IndexSystem/IndexSystem';

/**
 * 利用递归格式化每个节点
 */
const formatTree = function(items, parent) {
  const result = [];
  if (!items[parent]) {
    return result;
  }
  for (const t of items[parent]) {
    t.children = formatTree(items, t.id);
    result.push(t);
  }
  return result;
};

/**
 * 树状的算法
 * @params list     代转化数组
 * @params parent 起始节点
 */
const getTrees = function(list, parent) {
  const items = {};
  // 获取每个节点的直属子节点，记住是直属，不是所有子节点
  for (let i = 0; i < list.length; i+=1) {
    const key = list[i].parentId;
    if (items[key]) {
      items[key].push(list[i]);
    } else {
      items[key] = [];
      items[key].push(list[i]);
    }
  }
  return formatTree(items, parent);
};

export default {
  namespace: 'indexSystemData',

  state: {
    markType: "",
    treeData:[],
    indexNavData: [], // 未处理的左边树结构数据
    versionSelectData:[],
    nextFlag: 0,
    tbodyData: [],
    currentNum: "1", // 当前页
    totalNum: "1", // 总个数
    totalPageNum: "1", // 总页数
    thData:[],
    indexNav:[],
    indexInfo:{}
  },

  effects: {
    *fetchLeftTree({ payload, callback }, { call, put }) {
      const response = yield call(leftTree, payload);
      yield put({
        type: 'tree',
        payload: response,
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
      const res = getTrees(response,"-1")
      return res;
    },
    *fetchVersionSelect({ payload, callback }, { call, put }) {
      const response = yield call(versionSelect, payload);
      yield put({
        type: 'version',
        payload: response,
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
      return response;
    },
    *fetchTableData({ payload, callback }, { call, put }) {
      const response = yield call(tableData, payload);
      yield put({
        type: 'table',
        payload: response,
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
      return response;
    },
    // 透明指标导航信息
    *fetchIndexNav({payload,callback},{call,put}){
      const response = yield call(getIndexNav,payload);
      const indexTree=getTrees(response,"-1");
      yield put({
        type:"saveIndexNav",
        payload:indexTree
      });
      if(callback)callback(indexTree)
    },
    // 获取指标详细信息
    *fetchIndexInfo({payload},{call,put}){
      const response = yield call(indexInfo,payload);
      yield put({
        type:"saveIndexInfo",
        payload:response
      })
    }
  },

  reducers: {
    tree(state, action) {
      const treeData = getTrees(action.payload,"-1");
      return {
        ...state,
        treeData,
        indexNavData: action.payload,
      };
    },
    version(state, action) {
      return {
        ...state,
        versionSelectData: action.payload.data,
      };
    },
    table(state, action) {
      const {nextFlag, tbodyData, thData, currentNum, totalNum, totalPageNum} = action.payload;
      return {
        ...state,
        nextFlag,
        tbodyData,
        thData,
        currentNum, // 当前页
        totalNum, // 总个数
        totalPageNum, // 总页数
      };
    },
    saveIndexNav(state,{payload}){
      return{
        ...state,
        indexNav:payload
      }
    },
    saveIndexInfo(state,{payload}){
      return{
        ...state,
        indexInfo:payload
      }
    }
  },
};
