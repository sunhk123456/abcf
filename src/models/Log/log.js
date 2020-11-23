/**
 * @Description: 日志model
 *
 * @author: liuxiuqian
 *
 * @date: 2019/04/02
 */
import {
  queryMenuLog,
  querySpecialReportLog,
  queryReportTableLog,
  queryOther,
  queryIndexDetails
} from '@/services/log';
import Cookie from '@/utils/cookie';

export default {
  namespace: 'logModels',

  state: {

  },

  effects: {

    // 菜单日志接口
    *menuLogFetch({ payload }, { call }){
      const {provOrCityId} = Cookie.getCookie("loginStatus");
      // pId 为了判断所属模块
      const {pId, params} = payload;
      const markName = pId;
      // console.log(pId);
      // if(pId === "1"){
      //   markName = "indexDetails";
      // }else if(pId === "2"){
      //   markName = "specialReport";
      // }else if(pId === "3"){
      //   markName = "pptReport";
      // }else if(pId === "4"){
      //   markName = "reportTable";
      // }
      yield call(queryMenuLog, {...params,provOrCityId,markName});
    },

    // 专题日志接口
    *specialReportLogFetch({ payload }, { call }){
      yield call(querySpecialReportLog, payload);
    },

    // 报表日志接口
    *reportTableLogFetch({ payload }, { call }){
      yield call(queryReportTableLog, payload);
    },

    // 其他日志接口
    *otherFetch({ payload }, { call }){
      yield call(queryOther,payload );
    },

    // 外链指标日志接口
    *indexDetailsFetch({ payload }, { call }){
      yield call(queryIndexDetails,payload );
    },

  },

  reducers: {

  },
};
