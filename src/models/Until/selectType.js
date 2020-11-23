/**
 * @Description: 地域组件model
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/16
 */
import { queryScreenCondition } from '@/services/indexDetails';
import { buttonsCondition } from '@/services/KeyProduct/KeyProduct';

export default {
  namespace: 'selectTypeModels',

  state: {
    conditionData: [], // 筛选条件数据
    selectIdData:[], // 默认选中id数据
    selectNameData:[], // 默认选中name数据
    requestSuccess: false, // 请求成功标志
    timeStamp: 0, // 时间戳
  },

  effects: {
    // 正常的请求
    *getSelectTypeFetch({ payload }, { call, put }) {
      const {param} = payload;
      const proCityData = param.typeFetch === "indexDetails" ?  queryScreenCondition : buttonsCondition;
      const response = yield call(proCityData, param);
      yield put({
        type: 'setSelectTypeFetch',
        payload: response,
      });
    },
    // 条转过来的请求
    *getSelectTypeFetch2({ payload }, { call, put }) {
      const {param, selectIdData} = payload;
      const proCityData = param.typeFetch === "indexDetails" ?  queryScreenCondition : buttonsCondition;
      const response = yield call(proCityData, param);
      yield put({
        type: 'outsideSelectData',
        payload: {conditionData: response,selectIdData},
      });
    },


  },

  reducers: {
    setSelectTypeFetch(state, {payload} ) {
      const selectNameData = [];
      const selectIdData = [];
      payload.forEach((item)=>{
        const objItemName = {
          screenTypeId: item.screenTypeId,
          screenTypeName: item.screenTypeName,
          value: [item.values[0]]
        };
        const objItemId = {};
        objItemId[item.screenTypeId] = [item.values[0].sid];
        selectNameData.push(objItemName);
        selectIdData.push(objItemId);
      })
      return {
        ...state,
        conditionData: payload,
        selectNameData,
        selectIdData,
        requestSuccess: true,
        timeStamp: new Date().getTime(),
      };
    },
    // 选中数据更新
    setSelectData(state, {payload} ) {
      return {
        ...state,
        selectIdData: payload.selectIdData,
        selectNameData: payload.selectNameData,
      };
    },
    // 外界传入的选中更新
    outsideSelectData(state, {payload} ){
      const {selectIdData, conditionData} = payload;
      const selectNameData = [];
      conditionData.forEach((item)=>{
        const objItem = {
          screenTypeId: item.screenTypeId,
          screenTypeName: item.screenTypeName
        };
        let selectArr = [];
        selectIdData.forEach((selectIdItem) =>{
          if(selectIdItem[item.screenTypeId]){
            selectArr = selectIdItem[item.screenTypeId]
          }
        })
        const valuesArr = item.values;
        const valueArr = [];
        valuesArr.forEach((item2)=>{
          if(selectArr.includes(item2.sid)){
            valueArr.push(item2);
          }
        })
        objItem.value = valueArr;
        selectNameData.push(objItem);
      })
      return {
        ...state,
        selectIdData,
        selectNameData,
        conditionData,
        timeStamp: new Date().getTime(),
        requestSuccess: true,
      };
    },

    // 关闭标志
    requestfalse(state){
      return {
        ...state,
        requestSuccess: false,
      };
    }

  },
};
