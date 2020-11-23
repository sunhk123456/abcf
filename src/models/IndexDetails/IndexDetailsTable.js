import {queryDateSection,queryIDTableData} from '@/services/indexDetails';

export default {
  namespace: 'indexDetailsTableModels',

  state: {
    IDTableData:{}, // 表格数据
    startDate: '', // 开始日期
    endDate: '', // 结束日期
    selectIndex:0, // 省市按钮切换
    regionType:1, // 省市类型切换
  },

  effects: {
    *fetchDateSection({payload}, {call, put}){
      const res = yield call(queryDateSection, payload);
      yield put({
        type:'setDate',
        payload:res
      })
    },

    *fetchIDTableData({payload},{call,put}){
      const res = yield call(queryIDTableData,payload);
      yield put({
        type:'getIDTableData',
        payload:res
      })
    },



  },


  reducers: {

    getIDTableData(state, action) {
      return {
        ...state,
        IDTableData: action.payload
      }
    },
    setDate(state, {payload}){
      return {
        ...state,
        endDate: payload.endDate,
        startDate: payload.startDate,
      }
    },

    // 省市类型切换
    proCityHandle(state, {payload}){
      return {
        ...state,
        selectIndex: payload.selectIndex,
        regionType: payload.regionType,
      }
    },


  },

}
