/**
 * @Description: 终端产品信息查询 models
 *
 * @author: yuzihao
 *
 * @date: 2020/5/15
 */
import { queryCondition, queryListContent, queryMaxDate } from '@/services/equipmentInfo/equipmentInfo';

export default {
  namespace:"equipmentInfoModels",
  state:{
    condition: {
      TYPE_ID: [],     //  手机类型
      BRAND_ID: [],     //  品牌
      DEVICE_TYPE: [],  //  型号
      RAM_ROM_ID: [],   //  内存
      COLOR_ID: []      //  颜色
    },
    listContent: {
      list: [],
      nextFlag: "false"
    },
    maxDate:'' // 最大账期
  },
  effects:{
    //  筛选条件请求接口
    *fetchCondition({ payload }, { call, put }) {
      const response = yield call(queryCondition, payload);
      yield put({
        type: 'updateCondition',
        payload: { [payload.selectType]: response.data }
      });
    },

    //  请求列表数据
    *fetchListContent({ payload, callback }, { call, put }) {
      const response = yield call(queryListContent, payload);
      if(Object.keys(response.data).length !==0) {
        yield put({
          type: 'updateState',
          payload: { listContent: response.data }
        });
        if (callback) callback(response.data);
      }
    },

    //  最大账期请求接口
    *fetchMaxDate({ payload }, { call, put }) {
      const response = yield call(queryMaxDate, payload);
      yield put({
        type: 'maxDateState',
        payload:  response.data
      });
    },
  },
  reducers:{
    //  更新筛选条件数据
    updateCondition(state, { payload }) {
      const condition = {}
      Object.assign(condition,state.condition,payload);
      return {
        ...state,
        condition
      };
    },
    //  更新数据
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    //  最大账期
    maxDateState(state, { payload }) {
      return {
        ...state,
        maxDate:payload
      };
    },
  }
}
