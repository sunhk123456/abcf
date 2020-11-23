import {
  updateIndexDate,
  queryIndexTableDate,
  querySpecialTableDate,
  updateSpecialDate,
  querycheckboxList
} from '@/services/RangeRelease';


export default {
  namespace:'RangeRelease',
  state:{
    indexTableData:{
      indexList:[],
      currentNum:"1",
      totalNum:"1",
      totalPageNum:"1"
    }, // 指标表格数据
    specialTableData:{
      specialList:[],
      currentNum:"1",
      totalNum:"1",
      totalPageNum:"1",
      dateType:""
    }, // 专题表格数据
    checkboxList:[],
    plainOptions:[]
  },


  effects:{
    // 修改指标账期
    *fetchIndexDate({payload,callBack},{call}){
      const res = yield call(updateIndexDate,payload);
      callBack(res);
    },
    // 请求指标表格数据
    *fetchIndexTableData({payload,callBack},{call,put}){
      const res = yield call(queryIndexTableDate,payload);
      callBack(res);
      yield put({
        type:'getIndexTableData',
        payload:res
      })
    },
    // 请求专题表格数据
    *fetchSpecialTableData({payload},{call,put}){
      const res = yield call(querySpecialTableDate,payload);
      yield put({
        type:'getSpecialTableData',
        payload:res
      })
    },
    // 修改专题账期
    *fetchSpecialDate({payload,callBack},{call}){
      const res = yield call(updateSpecialDate,payload);
      callBack(res);
    },
    // 请求专题框数据
    *fetchCheckboxList({payload},{call,put}){
      const res = yield call(querycheckboxList,payload);
      yield put({
        type:'getCheckboxList',
        payload:res
      })
    },
  },


  reducers:{
    getIndexTableData(state,{payload={ indexList:[], currentNum:"1", totalNum:"1", totalPageNum:"1",dateType:""}}){
      return {
        ...state,
        indexTableData: payload
      }
    },
    getSpecialTableData(state,{payload={ specialList:[], currentNum:"1", totalNum:"1", totalPageNum:"1", dateType:"" }}){
      return {
        ...state,
        specialTableData: payload
      }
    },


    getCheckboxList(state,action){
      const options=[];
      if(action.payload.length!==undefined){
        action.payload.map((item)=>
          options.push(item.specialId)
        )
      }
      return {
        ...state,
        checkboxList: action.payload,
        plainOptions: options,
      }
    },


  }
}
