import  { queryMaxDate,queryModuleData} from '@/services/dayOverView';

export default {
  namespace :'dayOverViewHeader',

  state:{
    maxDate :"",// 最大账期
    moduleData:[],// 切换标签数据
    selectedDate:"", // 账期
    tabId:"",// 选中的模块id
    dateType:"",
  },

  effects:{
    // 请求
    *fetchModuleData({ payload},{ call, put }){
      const response = yield call(queryModuleData,payload);
      yield put({
        type: 'setModuleData',
        payload: response,
      });
    },
    *fetchMaxDate({ payload},{ call, put }){
      const response = yield call(queryMaxDate,payload);
      yield put({
        type: 'setMaxDate',
        payload: response.date,
      });
    },
  },

  reducers:{
    // 请求数据
    setModuleData(state, action) {
      return {
        ...state,
        moduleData: action.payload,
        tabId:action.payload[0].tabId,
      };
    },
    setMaxDate(state, action) {
      return {
        ...state,
        maxDate: action.payload,
        selectedDate:action.payload,
      };
    },
    // 事件控制
    changeTabId(state,action){
      return {
        ...state,
        tabId:action.payload,
        selectedDate:"", // 每次tab变化清空账期
        maxDate:""
      }
    },
    changeDate(state,action){
      return {
        ...state,
        selectedDate:action.payload
      }
    },
    changeDateType(state,action){
      return {
        ...state,
        dateType:action.payload
      }
    },
  }

}
