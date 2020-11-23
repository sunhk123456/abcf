import {
  queryMaxDate,
  queryTitleData,
  queryTerminalSellData,// 热门终端销售top10
  queryTerminalRowData,// 在用终端排行top10,
  queryTerminalInData,// 换机终端流入top10
  queryTerminalOutData,// 换机终端流出top10
  queryNetTypeRankData,// 5G在网机型排名TOP10
  queryTerminalOpenTypeRankData,// 5G在网机型排名TOP10
  queryTerminalTypeRankData,// VoLTE终端未打开机型排名TOP10
  queryBarEchart,
  queryTreeMap,
  queryTerminalProportion,
  queryTerminalNRData,
  queryTerminalTypeData,
  queryOnline5GData,
  queryVolTETerminalData,
  queryMapValue,
  queryMap
} from '../../../services/hotInfoDisplay/hotInfoDisplay';


export default {
  namespace: 'hotInfoDisplayModels',
  state: {
    specialName: '终端视图',
    provName: '',
    cityName: '',
    provId: '',
    cityId: '',
    markType: 'ZD_VIEW_SUB_M',
    dateType: '2',
    maxDate: "",// 最大账期
    date: "", // 日期
    selectIndex:0, // 页签index
    tabId:'', // 页签Id
    terminalSell:{}, // 热门终端销售top10
    terminalRow:{}, // 在用终端排行top10
    terminalIn:{}, // 换机终端流入top10
    terminalOut:{}, // 换机终端流出top10
    netTypeRank:{}, // 5G在网机型排名TOP10
    terminalOpenTypeRank:{},// VoLTE终端打开开关机型排名TOP10
    terminalTypeRank:{}, // VoLTE终端未打开机型排名TOP10
    titleData: {}, // 热门信息呈现标题
    terminalProportion:{}, // 联通终端-双卡终端卡槽占比数据
    terminalPriceData: {},// 终端采购价格分布柱状图,
    useTerminalData:{}, // 在用终端品牌占比矩形树图数据
    terminalBrandData:{},// 5G终端品牌分布矩形树图数据
    terminalNRData:{}, // 5G终端NR登网情况饼图数据
    terminalTypeData: {}, // 5G终端NR登网情况饼图数据
    online5GData: {}, // 在网5G终端占比柱线图数据
    volTETerminalData: {}, // VoLTE终端相关信息柱线图数据
    mapData:{
      title:'',
      allValue:'',
      provId:'',
      provName:'',
      cityId:'',
      cityName:'',
      mapData:[]
    },
    GeoJson:{}
  },
  effects: {
    // 请求最大账期
    * getMaxDate({ payload, callback }, { call, put }) {
      const response = yield call(queryMaxDate, payload);
      yield put({
        type: 'setMaxDate',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求页签数据
    * getTitleData({ payload, callback }, { call, put }) {
      const response = yield call(queryTitleData, payload);
      yield put({
        type: 'setTitleData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求联通终端-双卡终端卡槽占比数据
    *getTerminalProportion({ payload ,callback},{ call, put }){
      const response = yield call(queryTerminalProportion,payload);
      yield put({
        type: 'setTerminalProportion',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求5G终端NR登网情况饼图数据
    *getTerminalNRData({ payload ,callback},{ call, put }){
      const response = yield call(queryTerminalNRData,payload);
      yield put({
        type: 'setTerminalNRData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求5G终端类型分布饼图数据
    *getTerminalTypeData({ payload ,callback},{ call, put }){
      const response = yield call(queryTerminalTypeData,payload);
      yield put({
        type: 'setTerminalTypeData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求5G终端数量占比图数据
    *getOnline5GData({ payload ,callback},{ call, put }){
      const response = yield call(queryOnline5GData,payload);
      yield put({
        type: 'setOnline5GData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求VoLTE终端相关信息图数据
    *getVolTETerminalData({ payload ,callback},{ call, put }){
      const response = yield call(queryVolTETerminalData,payload);
      yield put({
        type: 'setVolTETerminalData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 热门终端销售top10
    * getTerminalSellData({ payload, callback }, { call, put }) {
      const response = yield call(queryTerminalSellData, payload);
      yield put({
        type: 'setTerminalSellData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 在用终端排行top10
    * getTerminalRowData({ payload, callback }, { call, put }) {
      const response = yield call(queryTerminalRowData, payload);
      yield put({
        type: 'setTerminalRowData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 换机终端流入top10
    * getTerminalInData({ payload, callback }, { call, put }) {
      const response = yield call(queryTerminalInData, payload);
      yield put({
        type: 'setTerminalInData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 换机终端流出top10
    * getTerminalOutData({ payload, callback }, { call, put }) {
      const response = yield call(queryTerminalOutData, payload);
      yield put({
        type: 'setTerminalOutData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 5G在网机型排名TOP10
    * getNetTypeRankData({ payload, callback }, { call, put }) {
      const response = yield call(queryNetTypeRankData, payload);
      yield put({
        type: 'setNetTypeRankData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // VoLTE终端打开开关机型排名TOP10
    * getTerminalOpenTypeRankData({ payload, callback }, { call, put }) {
      const response = yield call(queryTerminalOpenTypeRankData, payload);
      yield put({
        type: 'setTerminalOpenTypeRankData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // VoLTE终端未打开机型排名TOP10
    * getTerminalTypeRankData({ payload, callback }, { call, put }) {
      const response = yield call(queryTerminalTypeRankData, payload);
      yield put({
        type: 'setTerminalTypeRankData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求终端采购价格柱状图数据
    *getTerminalPriceBar({ payload ,callback},{ call, put }){
      const response = yield call(queryBarEchart,payload);
      yield put({
        type: 'saveTerminalPriceBar',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求在用终端品牌占比矩形树图数据
    *getUseTerminal({ payload ,callback},{ call, put }){
      const response = yield call(queryTreeMap,payload);
      yield put({
        type: 'saveUseTerminal',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求5G终端品牌分布矩形树图数据
    *getTerminalBrand({ payload ,callback},{ call, put }){
      const response = yield call(queryTreeMap,payload);
      yield put({
        type: 'saveTerminalBrand',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求地图数据
    *getMapData({payload},{call, put}){
      const response = yield call(queryMapValue,payload);
      yield put({
        type:'setMapData',
        payload:response
      });
    },
    // 请求地图数据
    *getMap({payload},{call,put}){
      const response = yield call(queryMap,payload);
      yield put({
        type:'changeMap',
        payload:response
      });
    },
  },
  reducers: {
    // 最大账期
    setMaxDate(state, { payload }) {
      return {
        ...state,
        date: payload.date,
        maxDate: payload.date,
      };
    },
    // 更改日期
    setDate(state, { payload }) {
      return {
        ...state,
        date: payload.date,
      };
    },
    // 更改tabId
    setTabIdAndDate(state, { payload }) {
      return {
        ...state,
        tabId: payload.tabId,
        selectIndex:payload.selectIndex,
        date:payload.date,
      };
    },
    // 设置页签数据
    setTitleData(state, { payload }) {
      return {
        ...state,
        titleData:payload,
      };
    },
    // 热门终端销售top10
    setTerminalSellData(state, { payload }) {
      return {
        ...state,
        terminalSell: payload,
      };
    },
    // 在用终端排行top10
    setTerminalRowData(state, { payload }) {
      return {
        ...state,
        terminalRow: payload,
      };
    },
    // 换机终端流入top10
    setTerminalInData(state, { payload }) {
      return {
        ...state,
        terminalIn: payload,
      };
    },
    // 换机终端流出top10
    setTerminalOutData(state, { payload }) {
      return {
        ...state,
        terminalOut: payload,
      };
    },
    // 5G在网机型排名TOP10
    setNetTypeRankData(state, { payload }) {
      return {
        ...state,
        netTypeRank: payload,
      };
    },
    // VoLTE终端打开开关机型排名TOP10
    setTerminalOpenTypeRankData(state, { payload }) {
      return {
        ...state,
        terminalOpenTypeRank: payload,
      };
    },
    // VoLTE终端未打开机型排名TOP10
    setTerminalTypeRankData(state, { payload }) {
      return {
        ...state,
        terminalTypeRank: payload,
      };
    },
    saveTerminalPriceBar(state, {payload}) {
      return {
        ...state,
        terminalPriceData:payload
      };
    },
    // 在用终端品牌占比矩形树图数据
    saveUseTerminal(state, {payload}) {
      return {
        ...state,
        useTerminalData:
          {
            ...payload,
            itemName:payload.title?payload.title:'',
            // treeChart:payload.tbodyData?payload.tbodyData:''
          }
      };
    },
    // 5G终端品牌分布矩形树图数据
    saveTerminalBrand(state, {payload}) {
      return {
        ...state,
        terminalBrandData:{
          ...payload,
          itemName:payload.title?payload.title:'',
          // treeChart:payload.tbodyData?payload.tbodyData:payload.treeChart
        }
      };
    },
    // 设置联通终端-双卡终端卡槽占比数据
    setTerminalProportion(state, {payload}) {
      return {
        ...state,
        terminalProportion:payload,

      };
    },
    // 设置5G终端NR登网情况数据
    setTerminalNRData(state, {payload}) {
      return {
        ...state,
        terminalNRData:payload,

      };
    },
    // 设置5G终端类型分布数据
    setTerminalTypeData(state, {payload}) {
      return {
        ...state,
        terminalTypeData:payload,
      };
    },
    // 设置5G终端数量占比数据
    setOnline5GData(state, {payload}) {
      return {
        ...state,
        online5GData:payload,
      };
    },
    // 设置VoLTE终端相关信息图数据
    setVolTETerminalData(state, {payload}) {
      return {
        ...state,
        volTETerminalData:payload,
      };
    },
    // 获取地图
    setMapData(state, {payload}) {
      return {
        ...state,
        mapData: payload,
        provName:payload.provName,
        provId: payload.provId,
        cityName: payload.cityName,
        cityId: payload.cityId
      };
    },
    changeCity(state, {payload}) {
      return {
        ...state,
        provName: payload.provName,
        provId: payload.provId,
        cityName: payload.cityName,
        cityId: payload.cityId
      }
    },
    changeMap(state, {payload}){
      return {
        ...state,
        GeoJson: payload
      }
    },

  }
}
