
import { queryTitleData } from '../../../services/homeView/homeView';

export default {
  namespace:"homeViewModels",
  state:{
    specialName: '家庭视图',
    markType:"HOME_SUB_M",
    dateType:"2",
    tabId:"", // 模块id 暂时没有 传空
    selectIndex:0,// 页签序号
    titleData:{
      titleName:"",
      list:[]
    },
    leftChartData:{},
    rightChartData:{},
  },
  effects:{
    // 请求页签数据
    * getTitleData({ payload, callback }, { call, put }) {
      const response = yield call(queryTitleData, payload);
      yield put({
        type: 'setTitleData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 更改tabId
    *getTabId({ payload ,callback},{ put }){
      yield put({
        type: 'setTabId',
        payload,
      });
      if (callback) callback(payload);
    },
  },
  reducers:{
    // 更改tabId
    setTabId(state, { payload }) {
      console.log('设置tabId');
      console.log(payload);
      return {
        ...state,
        tabId: payload.tabId,
        selectIndex:payload.selectIndex
      };
    },
    // 设置页签数据
    setTitleData(state, { payload }) {
      return {
        ...state,
        titleData:payload,
      };
    }
  }
}
