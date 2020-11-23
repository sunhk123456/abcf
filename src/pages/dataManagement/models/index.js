/**
 * @Description: 数据管理 models
 *
 * @author: yuzihao
 *
 * @date: 2020/7/17
 */
import { queryCondition, queryTable, queryDownloadTable } from '@/services/dataManagement/dataManagement';

export default {
  namespace:"dataManagementModels",
  state:{
    title:"总部经分业务类型与CB网别+品牌对应关系",
    markType: 'SERVICE_CB_BRAND',
    conditionData: [],
    tableData: {},
    conditionSearchData:[],
  },
  effects:{
    //  筛选条件请求接口
    *fetchCondition({ payload }, { call, put }) {
      const response = yield call(queryCondition, payload);
      const conditionSearchData = response.data.map((item)=>{
        if(item.type === "select"){
          return {
            id: item.id,
            selectId:item.children[0].id,
            selectName:item.children[0].name,
          }
        }
        return {
          id: item.id,
          selectId:"",
          selectName:"",
        }
      })
      yield put({
        type: 'updateState',
        payload: { conditionData: response.data,conditionSearchData }
      });
    },

    //  请求表格数据
    *fetchTable({ payload }, { call, put }) {
      const response = yield call(queryTable, payload);
      yield put({
        type: 'updateState',
        payload: { tableData: response.data }
      });
    },

    *fetchDownloadTable({ payload,callback }, { call }){
      const response = yield call(queryDownloadTable, payload);
      callback(response)
    }

  },
  reducers:{
    //  更新数据
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    // 查询按钮更新数据
    updateSearchState(state, { payload }) {
      return {
        ...state,
        conditionSearchData:payload
      };
    },
  }
}
