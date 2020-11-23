import {
  queryUserInfoData,
  queryUserPathwayData,
  queryUserContributionsData,
  queryUserServerData,
  queryMarkPriceData,
  querySellNumberData
} from '../../../services/terminalQuery/terminalQuery';

export default {
  namespace: "terminalQueryModels",
  state: {
    specialName: '终端信息查询', // 专题名称
    markType: "ZD_SUB_M", // 专题id
    dateType: "2", // 日月标识
    userInfo: {
      "title":"秒懂产品",
      "list":[
        {"name":"终端名称","value":[""]},
        {"name":"后置摄像头","value":[""]},
        {"name":"前置摄像头","value":[""]},
        {"name":"是否支持AGPS","value":[""]},
        {"name":"品牌","value":[""]},
        {"name":"内存","value":[""]},
        {"name":"支持联通网络制式","value":[""]},
        {"name":"是否双卡","value":[""]},
        {"name":"CPU","value":[""]},
        {"name":"电池","value":[""]},
        {"name":"语音支持类型","value":[""]},
        {"name":"是否支持扩展卡","value":[""]},
        {"name":"操作系统","value":[""]},
        {"name":"屏幕尺寸","value":[""]},
        {"name":"是否支持GPS","value":[""]},
        {"name":"是否支持NFC","value":[""]}
      ]
    },  // 秒懂产品
    userPathway: {
      "title":"终端换机轨迹",
      "list":[
        {"name":"","time":"2017-06-01"},
        {"name":"","time":"2018-07-22"},
        {"name":"","time":"2019-01-12"},
        {"name":"","time":"2019-07-10"},
        {"name":"","time":"2019-08-10"}
      ]
    }, // 终端换机轨迹
    userContributions: {
      "title":"当前用户月度贡献",
      "subtitle":"近12个月该用户出账收入时间趋势",
      "chartX":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
      "chart":[
        {
          "name":"月度贡献",
          "value":["350","420","340","110","130","200","330","400","440","480","500","520"],
          "unit":"元",
          "type":"line"
        }
      ]
    }, // 当前用户月度贡献
    userServer: {
      "title":"当前用户业务使用情况",
      "subtitle":"近12个月该用户流量时间趋势",
      "chartX":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
      "chart":[
        {
          "name":"流量业务使用",
          "value":["220","180","100","70","100","180","180","140","100","250","300","250"],
          "unit":"GB",
          "type":"line"
        }
      ]
    }, // 当前用户业务使用情况
    markPrice:{
      "title":"该型号成本价及市场价格对比",
      "list":[
        {"name":"成本价占比","value":"50","unit":"%"},
        {"name":"市场价占比","value":"50","unit":"%"}
      ]
    },// 该型号成本价及市场价格对比
    sellNumber:{
      "title":"该型号库存量及销售量对比",
      "list":[
        {"name":"库存量占比","value":"50","unit":"%"},
        {"name":"销售量占比","value":"50","unit":"%"}
      ]
    },// 该型号库存量及销售量对比
  },
  effects: {
    // 请求秒懂产品数据
    * getUserInfoData({ payload, callback }, { call, put }) {
      const response = yield call(queryUserInfoData, payload);
      yield put({
        type: 'setUserInfoData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 请求终端换机轨迹数据
    * getUserPathwayData({ payload, callback }, { call, put }) {
      const response = yield call(queryUserPathwayData, payload);
      yield put({
        type: 'setUserPathwayData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 请求当前用户月度贡献数据
    * getUserContributionsData({ payload, callback }, { call, put }) {
      const response = yield call(queryUserContributionsData, payload);
      yield put({
        type: 'setUserContributionsData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 请求当前用户业务使用情况数据
    * getUserServerData({ payload, callback }, { call, put }) {
      const response = yield call(queryUserServerData, payload);
      yield put({
        type: 'setUserServerData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 请求该型号成本价及市场价格对比数据
    * getMarkPriceData({ payload, callback }, { call, put }) {
      const response = yield call(queryMarkPriceData, payload);
      yield put({
        type: 'setMarkPriceData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 请求该型号库存量及销售量对比数据
    * getSellNumberData({ payload, callback }, { call, put }) {
      const response = yield call(querySellNumberData, payload);
      yield put({
        type: 'setSellNumberData',
        payload: response
      });
      if (callback) callback(response);
    },
  },

  reducers: {

    setUserInfoData(state, { payload }) {
      return {
        ...state,
        userInfo: payload,
      };
    },

    setUserPathwayData(state, { payload }) {
      return {
        ...state,
        userPathway: payload,
      };
    },

    setUserContributionsData(state, { payload }) {
      return {
        ...state,
        userContributions: payload,
      };
    },

    setUserServerData(state, { payload }) {
      return {
        ...state,
        userServer: payload,
      };
    },

    setMarkPriceData(state, { payload }) {
      return {
        ...state,
        markPrice: payload,
      };
    },

    setSellNumberData(state, { payload }) {
      return {
        ...state,
        sellNumber: payload,
      };
    },

  }
}
