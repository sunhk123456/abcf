import { drillDownTableData } from "../../services/analyseSpecial/analyseSpecial";

export default {
  namespace:"drillDownTableModel",
  state: {
    tableData: {},// 表格原始数据
  },
  effects:{
    // 请求表格数据
    *getDrillDownTableData({payload={},callback},{call, put}){
      const response = yield call(drillDownTableData,payload);
      yield put({
        type:'setDrillDownTableData',
        payload:response
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
    }
  },
  reducers:{
    setDrillDownTableData(state,action){
      return {
        ...state,
        tableData:action.payload
      }
    }
  }
}
