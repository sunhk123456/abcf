
import {
  queryTitleData ,
  searchDataFetch,
  queryDeleteAll,
  queryDownData,
  queryRecentUpdate,
  addCollectRequect,
  queryCollectionState,
} from '../../../services/myCollection/myCollection';

export default {
  namespace:"myCollectionModels",
  state:{
    markType:'MY_COLLECT',
    specialName: '我的工作台',
    moduleId:"111", // 模块id 暂时没有 传空
    selectIndex:0,// 页签序号
    tabIndex:0, // 二级页签序号
    tabId:"", // 二级模块Id
    titleData:[
      // {
      //   "moduleName": "总部应用",
      //   "moduleId": "ID_515",
      //   "tabValue": [
      //     {
      //       "tabId": "moduleId_2656",
      //       "tabName": "专题"
      //     },
      //     {
      //       "tabId": "moduleId_2656",
      //       "tabName": "指标"
      //     }
      //   ]
      // }
    ],
    nextFlag: "1", // 下一页的标识
    currentPage:'1', // 当前页
    hasMore: true, // 是否有更多项目要加载。如果删除事件侦听器false
    searchData: [],
    deleteAllVisible:false, // 批量删除弹出框
    downData:[], // 查询下拉框数据
    recentUpdate:[], // 近期更新数据数组
    recentUpdateState:[], // 近期更新数据选中状态
    recentUpdateIdList:[], // 近期更新数据的collectId集合
    collectId:'', // 查询接口传回来的Id
  },
  effects:{
    // 请求页签数据
    *getTitleData({ payload, callback }, { call, put }) {

      const response = yield call(queryTitleData, payload);
      yield put({
        type: 'setTitleData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 更改moduleId
    *getModuleId({ payload ,callback},{ put }){
      yield put({
        type: 'setModuleId',
        payload,
      });
      if (callback) callback(payload);
    },
    // 更改tabId
    *getTabId({ payload ,callback},{ put }){
      yield put({
        type: 'setTabId',
        payload,
      });
      if (callback) callback(payload);
    },

    // 请求列表数据
    *getSearchData({ payload, sign = false }, { call, put }) {
      // console.log('MODELS请求列表参数');
      const response = yield call(searchDataFetch, payload);
      yield put({
        type: 'setSearchData',
        payload: response,
        sign,
      });
    },
    *clearSearchData({ payload,callback}, {put}) {
      yield put({
        type: 'setClearSearchData',
        payload,
      });
      if(callback){callback()}
    },

    // 请求删除全部接口
    *getDeleteAll({ payload,callback}, { call, put }) {
      const response = yield call(queryDeleteAll, payload);
      yield put({
        type: 'setDeleteAll',
        payload: response,
      });
      if(callback){callback(response)}
    },

    // 请求搜索结果
    *getDownData({payload={},callback},{call, put}){
      const response = yield call(queryDownData,payload);
      yield put({
        type:'setQueryDownData',
        payload:response
      });
      if (callback) callback(response);

    },

    // 树形增加请求
    *getAddRequest({payload={},callback},{call}){
      const response = yield call(addCollectRequect,payload);
      if (callback) callback(response);
    },

    // 请求近期更新接口
    *getRecentUpdate({ payload}, { call, put }) {
      const response = yield call(queryRecentUpdate, payload);
      yield put({
        type: 'setRecentUpdate',
        payload: response,
      });
    },

    // 查询收藏状态
    *getCollectionState({ payload,callback}, { call, put }) {
      const response = yield call(queryCollectionState, payload);
      yield put({
        type: 'setCollectId',
        payload: response,
      });
      if (callback) callback(response);
    },
  },
  reducers:{
    // 更改moduleId
    setModuleId(state, { payload }) {
      // console.log('设置moduleId');
      // console.log(payload);
      return {
        ...state,
        moduleId: payload.moduleId,
        selectIndex:payload.selectIndex,
      };
    },
    // 更改moduleId
    setTabId(state, { payload }) {
      // console.log('设置tabId');
      // console.log(payload);
      return {
        ...state,
        tabId: payload.tabId,
        tabIndex:payload.tabIndex
      };
    },
    // 设置页签数据
    setTitleData(state, { payload }) {
      return {
        ...state,
        titleData:payload,
      };
    },
    // 更新列表数据
    setSearchData(state, { payload, sign }) {
      let hasMore = true;
      let searchData = [];
      let list;
      let collectIdList = [];
      if(!sign){
        searchData = state.searchData.concat(Object.keys(payload).length===0?[]:payload.data);
        // 生成按钮选中状态数组
        list = searchData.map((item)=>item.isCollect !== '0');
        // 提取collectId组成集合
        collectIdList = searchData.map((item)=>item.collectId);
      }else {
        searchData = Object.keys(payload).length===0?[]:payload.data;
        // 生成按钮选中状态数组
        list = searchData.map((item)=>item.isCollect !== '0');
        // 提取collectId组成集合
        collectIdList = searchData.map((item)=>item.collectId);
      }
      if(payload.nextFlag === "0"){
        hasMore = false;
      }
      return {
        ...state,
        ...{
          searchData,
          keyword: payload.keyword,
          nextFlag: payload.nextFlag,
          currentPage:payload.currentPage,
          hasMore,
          searchCollect:list,
          searchCollectIdList:collectIdList
        },
      };
    },

    // 清空收藏列表数据
    setClearSearchData(state, { payload }) {
      return {
        ...state,
        searchData:payload,
      };
    },

    // 是否确定取消收藏弹窗弹出
    openDeleteAllPopup(state, { payload }) {
      // console.log('是否确定取消收藏弹窗弹出')
      return {
        ...state,
        ...{
          deleteAllVisible: payload,
        },
      };
    },

    // 请求搜索结果
    setQueryDownData(state,{payload}){
      return {
        ...state,
        downData:payload
      }
    },

    // 设置近期更新数组
    setRecentUpdate(state, { payload }) {
      let list =[];
      const collectId = [];
      if(payload && payload.length>0){
        list = new Array(payload.length);
        list.fill(false);
        // 当isCollect===1，改变recentUpdateState中对应位置为选中状态（即true）
        payload.forEach((item,index)=>{
          collectId.push(item.collectId);
          if(item.isCollect==='1'){
            list[index]=true;
          }
        });
        // console.log("近期更新")
        // console.info(list,collectId)
      }
      return {
        ...state,
        ...{
          recentUpdate: payload,
          recentUpdateState:list,
          recentUpdateIdList:collectId,
        },
      };
    },

    // 更新最近更新数据收藏选中状态
    upDateRecentUpdateState(state, { payload }) {
      return {
        ...state,
        ...{
          recentUpdateState: payload,
        },
      };
    },

    // 更新最近更新数据收藏collectId
    upDateRecentUpdateCollectId(state, { payload }) {
      return {
        ...state,
        ...{
          recentUpdateIdList: payload,
        },
      };
    },

    // 暂时存储要传到收藏接口里面的参数
    setCollectId(state, { payload }) {
      return {
        ...state,
        ...{
          collectId: payload,
        },
      };
    },
  }
}
