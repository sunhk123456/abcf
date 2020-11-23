/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  xingxiaodong
 * @date 2019/4/29
 */
import {indexDetail,noIndexDetail} from '@/services/indexExplainPop';

export default {
  namespace: "indexExplainModels",
  state:{
    xxd:{},
    indexDetailTableData:{
      "thData":[],
      "tbodyData": []
    },
  },
  effects:{
    *fetchIndexDetail({ moduleApi,payload,callback }, { call, put }) {
      let response = null;
      if(moduleApi === "mySubject"){ // 临时调试
        response = yield call(noIndexDetail, payload);
      }else {
        response = yield call(indexDetail, payload,moduleApi);
      }
      yield put({
        type: 'getData',
        payload: response,
      });
      if (response !== undefined) {
        if (callback) callback(response);
      }
    },
  },
  reducers:{
    getData(state, {payload}) {
      return {
        ...state,
        indexDetailTableData: payload,
      };
    }
  }
}
