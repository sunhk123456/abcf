/**
 * @Description: 全量下载组件model
 *
 * @author: liuxiuqian
 *
 * @date: 2019/03/18
 */
// 使用方法
// <DownloadAll
//   visible={visible}  是否显示
//   onCancel={()=>this.hideModal()} 关闭回调
//   downloadParam={downloadParam} 数据
//   indexTypeVisible={false}  是含有指标类型
// />

import { downloadMaxDateFetch, downloadConditionsFetch, downloadAllPathFetch , fetchMyWorkbench } from '@/services/downloadAllList';

export default {
  namespace: 'downloadAllModels',

  state: {
    date:"", // 选中的日期
    maxDate: "", // 最大账期
    downloadConditions: [], // 筛选条件类型数据
    selectData: {id:"",name:""}, // 筛选条件选中数据
    redDot: 0, // 红色圆点标记，数据数据收集好后用于头部展示。
    myWorkbench: [
      // {
      //   "id":"userCenter",
      //   "name":"公告列表",
      //   "iconName":"icon-gonggao",
      //   "url":""
      // },
      // {
      //   "id":"downloadAllList",
      //   "name":"下载列表",
      //   "iconName":"icon-iconset0339",
      //   "url":"downloadAllList"
      // },
      // {
      //   "id":"problemFeedback",
      //   "name":"我的反馈",
      //   "iconName":"icon-fankui",
      //   "url":"myReply"
      // },
      // {
      //   "id":"myCollection",
      //   "name":"我的收藏",
      //   "iconName":"icon-shoucang",
      //   "url":"myCollection"
      // },
      // {
      //   "id":"mySpecialSubject",
      //   "name":"我的专题",
      //   "iconName":"icon-zhuanti",
      //   "url":"mySpecialSubject"
      // }
    ]
  },

  effects: {
    // 获取最大账期
    *getDownloadMaxDate({ payload }, { call, put }) {
      const response = yield call(downloadMaxDateFetch, payload);
      yield put({
        type: 'setDownloadMaxDate',
        payload: response.date,
      });
    },

    // 获取筛选条件类型
    *getDownloadConditions({ payload }, { call, put }) {
      const response = yield call(downloadConditionsFetch, payload);
      yield put({
        type: 'setDownloadConditions',
        payload: response,
      });
    },

    // 下载全部文件路径返回接口
    *getDownloadAllPath({ payload }, { call }) {
      return yield call(downloadAllPathFetch, payload);
    },
  
    // 获取我的工作台列表数据
    *getMyWorkbench({ payload }, { call, put }) {
      const response = yield call(fetchMyWorkbench, payload);
      yield put({
        type: 'setMyWorkbench',
        payload: response.data,
      });
    },

  },

  reducers: {
    // 更新日期
    setDownloadMaxDate(state, {payload} ) {
      return {
        ...state,
        date: payload,
        maxDate: payload
      }
    },

    // 筛选条件类型
    setDownloadConditions(state, {payload}){
      return {
        ...state,
        downloadConditions: payload,
        selectData: payload[0]
      }
    },


    // 日期更新
    setDate(state, {payload}){
      return {
        ...state,
        date: payload
      }
    },

    // 筛选条件更新
    setCondition(state, {payload}){
      return {
        ...state,
        selectData: payload
      }
    },

    // 更新redDot标记
    setRedDot(state, {payload}){
      return {
        ...state,
        redDot: payload
      }
    },
  
    // 设置我的工作台数据
    setMyWorkbench(state, {payload}){
      return {
        ...state,
        myWorkbench: payload
      }
    }

  },
};
