/**
 * Created by xingxiaodong on 2019/2/13.
 */
import  {trendConditionData,indexListData,tableData,echartsData}  from '../../../services/singleIndicators';

export default {
  namespace: 'singleIndicatorsDataModels',
  state: {
    indexData:[],
    isFirst:true,
    currentPaperId:"1",
    currentPaperName:"渠道类型"
  },
  effects: {
    *fetchTrendConditionData({ payload }, { call, put }) {
      const response = yield call(trendConditionData,payload);
      yield put({
        type: 'xxdTrendConditionData',
        payload: response,
      });

    },
    // 改变当前选中的类型
    *fetchChangePaperType({ payload }, { put }){
      yield put({
        type: 'changePaperType',
        payload,
      });
    },
    *fetchIndexListData({ payload }, { call, put }) {
      const response = yield call(indexListData,payload);
      yield put({
        type: 'xxdIndexListData',
        payload: {response,isFirst:payload.isFirst},
      });
    },
    *fetchSingleTableData({ payload }, { call, put }) {
      const response = yield call(tableData,payload);
      yield put({
        type: 'xxdTableData',
        payload: response,
      });
    },
    *fetchSingleEchartsData({ payload }, { call, put }) {
      const response = yield call(echartsData,payload);
      yield put({
        type: 'xxdEchartsData',
        payload: response,
      });
    },
  },

  reducers: {
    xxdTrendConditionData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    xxdIndexListData(state, { payload }) {

      return {
        ...state,
        ...{
          indexData:payload.response.data,
          isFirst: payload.isFirst
        },
      };
    },
    changePaperType(state, { payload }) {
      return {
        ...state,
        ...{
          currentPaperId: payload.currentPaperId,
          currentPaperName: payload.currentPaperName
        },
      };
    },
    xxdTableData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    xxdEchartsData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
