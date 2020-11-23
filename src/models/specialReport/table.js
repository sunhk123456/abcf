/**
 * @Description: 专题表model
 *
 * @author: liuxiuqian
 *
 * @date: 2019/4/30
 */

import {downArrow} from '@/services/KeyProduct/KeyProduct';
import { message } from 'antd';

export default {
  namespace: 'specialReportTableModels',

  state: {
    downArrowData:[], // 下钻数据  一直累加
    downArrowFetchId:[], // 下钻id 记录 请求过后不再请求
    handleTbodyData: [], // 处理后的数据
    checkboxSign: true, // 全选标志
  },

  effects: {
    *downArrowFetch({ payload }, { call, put }) {
      const response = yield call(downArrow, payload.params);
      if("errorCode" in response){
        message.error("下钻失败");
      }else if(JSON.stringify(response) === "{}"){
        message.error("下钻返回数据为空");
      }else {
        yield put({
          type: 'setDownArrow',
          payload: {response, downArrowItemMake:payload.downArrowItemMake},
        });
      }
    }
  },

  reducers: {
    setDownArrow(state, {payload} ){
      const {downArrowData, downArrowFetchId} = state;
      const {response, downArrowItemMake } = payload;
      downArrowFetchId.push(downArrowItemMake);
      const arr = downArrowData.concat(response.tbodyData || [])
      return {
        ...state,
        ...{
          downArrowData:arr,
          downArrowFetchId
        }
      };
    },
    // 生成处理后的数据
    handleTbodyDataUpdate(state,{payload=[]}){
      return {
        ...state,
        ...{
          handleTbodyData: payload

        }
      };
    },
    // 清空下钻数据金和下载id 标记
    emptyDataAndId(state){
      return {
        ...state,
        ...{
          downArrowData:[],
          downArrowFetchId: []
        }
      };
    },
    // 全选标记更新
    checkboxSignUpdtate(state, {payload}){
      return {
        ...state,
        ...{
          checkboxSign: payload
        }
      };
    }
  },
};
