import {
  queryHomeNumTimeLineData,
  queryHomePies,
  queryLineData,
  queryTreeMapData,
  queryUserTypeAndCityType,
  queryMaxDate,
  queryMapValue,
  queryHomeUserBarData,
  queryStackBarData,
  queryMap,
} from '../../services/homeView/homeView';

export default {
  namespace:"homeViewFirstTabModels",
  state:{
    markType:"HOME_SUB_M",
    dateType:"2",
    tabId:"",
    date:"",
    cityId:"", // 地图的市id
    provId:"",// 地图的省id
    provName:"", //  地图的 省name
    cityName:"", // 地图的 市name
    homeType:[],// 家庭类型
    townType:[], // 城镇类型
    mapData:{
      title:'',
      allValue:'',
      provId:'',
      provName:'',
      cityId:'-1',
      cityName:'',
      mapData:[]
    },// 地图数据
    payloadPrepare:{
      markType:"HOME_SUB_M",
      dateType:"2",
      date:'',
      tabId:"",
      cityId:"",
      provId:"",
      custType:[],// 家庭类型
      townType:[], // 城镇类型
    }, // 准备好政企总览的请求数据
    maxDate:'', // 最大账期数据
    conditions:{
      custType:[
        {
          id:'1',
          name:'全部'
        },
        {
          id:'2',
          name:'政企'
        },
        {
          id:'3',
          name:'公众'
        },
      ],
      townType:[
        {
          id:'1',
          name:'城镇户口'
        },
        {
          id:'2',
          name:'农村户口'
        },
      ],
    }, // 筛选条件内容
    stackBarData:{
      "title": "",
      "yName":"",
      "xName":"",
      "chartX":[],
      "chart":[],
    }, // 趸交非趸交地域分布
    homeUserBarData:{
      "title": "",
      "yName":"",
      "xName":"",
      "chartX":[],
      "chart":[],
    }, // 新增离网家庭用户地域分布
    callNumberComparePieData:{}, // 本网/异网通话次数对比饼图
    payBehaviorPieData:{}, // 消费行为构成饼图
    downloadPayload:[], // 准备好家庭视图的下载数据
    homeNumTimeLineData: {}, // 家庭数量分布时间趋势图数据
    leftChartData:{},  // 移网/固网语音使用量及漫游话务量时间趋势
    rightChartData:{},  // 单宽/融合家庭数量对比
    homeDistributionData:{}, //  单宽/融合家庭数量对比 饼图
    channelHomeDistributionData:{}, // 渠道家庭分布
    treeMapData:{
      title:"分速率家庭数量",
      "treeChart": [
        {
          "id": "1",
          "name":"{4M，10M}",
          "value": "5001"
        },
        {
          "id": "2",
          "name":"{10M，40M}",
          "value": "5001"
        },
        {
          "id": "4",
          "name":"{40M，80M}",
          "value": "5001"
        }
      ],
      "unit": "户"
    }, // 分速率家庭数量
    homeNumBar:{}, // 分档收入对应的家庭数量占比
    GeoJson:{},
  },
  effects:{
// 保存待使用的payLoadData请求参数
    *fetchSavePayLoad({ payload }, { put }) {
      yield put({
        type: 'savePayLoad',
        payload,
      });
    },
    // 保存下载时需要的参数信息
    *fetchSaveDownLoad({ payload }, { put }) {
      yield put({
        type: 'saveDownLoad',
        payload,
      });
    },
    // 请求筛选条件
    *fetchConditions({ payload }, { call,put }) {
      const response = yield call(queryUserTypeAndCityType,payload);
      yield put({
        type: 'saveConditions',
        payload:response,
      });
    },
    // 请求最大账期
    *fetchMaxDate({ payload }, { call,put }) {
      const response = yield call(queryMaxDate,payload);
      yield put({
        type: 'saveMaxDate',
        payload:response.date,
      });
    },
    // 请求智能设备数量家庭分布饼图
    *fetchHomePies({ payload }, { call,put }) {
      let useType = '';
      const response = yield call(queryHomePies,payload);
      switch (payload.chartType) {
        case "callNumberCompare":
          useType='saveCallNumberCompare';
          break;
        case "payBehavior":
          useType='savePayBehavior';
          break;
        case "homeDistribution":
          useType="saveHomeDistribution";
          break;
        default:
          break;
      }
      yield put({
        type: useType,
        payload: response,
      });
    },
    // 请求家庭数量分布时间折线图数据
    *getHomeNumTimeLineData({ payload ,callback},{ call, put }){
      const response = yield call(queryHomeNumTimeLineData,payload);
      yield put({
        type: 'setHomeNumTimeLineData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 新增离网家庭用户地域分布
    *getHomeUserBarData({ payload ,callback},{ call, put }){
      const response = yield call(queryHomeUserBarData,payload);
      yield put({
        type: 'setHomeUserBarData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 趸交非趸交地域分布
    *getStackBarData({ payload ,callback},{ call, put }){
      const response = yield call(queryStackBarData,payload);
      yield put({
        type: 'setStackBarData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 获取左侧折线图数据 移网/固网语音使用量及漫游话务量时间趋势
    *getLeftLineData({ payload },{ call, put }){
      const response = yield call(queryLineData, payload);
      yield put({
        type: 'setLeftData',
        payload: response,
      });
    },
    // 获取右侧折线图数据 单宽/融合家庭数量对比
    *getRightLineData({ payload},{ call, put }){
      const response = yield call(queryLineData, payload);
      yield put({
        type: 'setRightData',
        payload: response,
      });
    },
    // 分档收入对应的家庭数量占比
    *fetchHomeNumBar({ payload},{ call, put }){
      const response = yield call(queryHomeNumTimeLineData, payload);
      yield put({
        type: 'setHomeNumBar',
        payload: response,
      });
    },
    // 分速率家庭数量接口
    *fetchTreeMapData({ payload},{ call, put }){
      const response = yield call(queryTreeMapData, payload);
      yield put({
        type: 'setTreeMapData',
        payload: response,
      });
    },
    // 渠道家庭分布
    *fetchChannelHomeDistribution({ payload},{ call, put }){
      const response = yield call(queryHomeNumTimeLineData, payload);
      yield put({
        type: 'setChannelHomeDistribution',
        payload: response,
      });
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
  reducers:{
// 在点击查询页面后保存待使用的payLoadData请求参数
    savePayLoad(state, action) {
      return {
        ...state,
        payloadPrepare: action.payload,
      };
    },
    // 保存返回的筛选条件，目前是模拟这个过程
    saveConditions(state,{payload}) {
      return {
        ...state,
        conditions:payload
      };
    },
    // 保存返回的最大账期，目前是模拟这个过程
    saveMaxDate(state, { payload }) {
      return {
        ...state,
        maxDate:payload,
        date:payload
      };
    },
    // 修改账期
    saveDate(state, { payload }) {
      return {
        ...state,
        date:payload
      };
    },
    // 新增离网家庭用户地域分布
    setHomeUserBarData(state, {payload}) {
      return {
        ...state,
        homeUserBarData:payload
      };
    },
    // 趸交非趸交地域分布
    setStackBarData(state, {payload}) {
      return {
        ...state,
        stackBarData:payload
      };
    },
    // 保存本网/异网通话次数对比
    saveCallNumberCompare(state, {payload}) {
      return {
        ...state,
        callNumberComparePieData:payload
        // callNumberComparePieData:{
        //   title:"本网，异网通话次数对比",
        //   description:'就tm你叫夏洛啊',
        //   chartX:["大于7个","5-7个","3-4个","1-2个","无"],
        //   chart:[
        //     {
        //       name:"保存本网/异网通话次数对比",
        //       value:['2,536','536','536','536','536',],
        //       unit:"万",
        //       type:"pie"
        //     },
        //   ]
        // }
      };
    },
    // 保存消费行为构成
    savePayBehavior(state, {payload}) {
      return {
        ...state,
        payBehaviorPieData:payload
        // payBehaviorPieData:{
        //   title:"消费行为构成",
        //   chartX:["大于7个","5-7个","3-4个","1-2个","无"],
        //   chart:[
        //     {
        //       name:"消费行为构成",
        //       value:['2,536','536','536','536','536',],
        //       unit:"万",
        //       type:"pie"
        //     },
        //   ]
        // }
      };
    },
    // 单宽/融合家庭数量对比 饼图
    saveHomeDistribution(state,{payload}){
      return {
        ...state,
        homeDistributionData:payload,
      };
    },
    // 设置家庭数量分布时间折线图数据
    setHomeNumTimeLineData(state, {payload}) {
      return {
        ...state,
        homeNumTimeLineData:payload,
      };
    },
    // 在点击查询页面后保存待使用的下载参数
    saveDownLoad(state, action) {
      return {
        ...state,
        downloadPayload: action.payload,
      };
    },
    // 移网/固网语音使用量及漫游话务量时间趋势
    setLeftData(state, { payload }) {
      return {
        ...state,
        leftChartData:payload,
      };
    },
    // 单宽/融合家庭数量对比
    setRightData(state, { payload }) {
      return {
        ...state,
        rightChartData:payload,
      };
    },
    // 分档收入对应的家庭数量占比
    setHomeNumBar(state, { payload }){
      return {
        ...state,
        homeNumBar:payload,
      };
    },
    // 分速率家庭数量
    setTreeMapData(state, { payload }){
      return {
        ...state,
        treeMapData:{
          unit: payload.unit,
          treeChart: payload.tbodyData,
          title: payload.title
        },
      };
    },
    // 渠道家庭分布
    setChannelHomeDistribution(state, { payload }){
      return{
        ...state,
        channelHomeDistributionData:payload
      }
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
    changeCity(state, {payload}){
      return {
        ...state,
        provName:payload.provName,
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
    clearData(state){
      return {
        ...state,
        provName:'',
        provId: "",
        cityName: "",
        cityId: "",
        GeoJson: {},
        mapData:{
          title:'',
          allValue:'',
          provId:'',
          provName:'',
          cityId:'-1',
          cityName:'',
          mapData:[]
        },// 地图数据
        payloadPrepare:{
          markType:"HOME_SUB_M",
          dateType:"2",
          date:'',
          tabId:"",
          cityId:"",
          provId:"",
          custType:[],// 家庭类型
          townType:[], // 城镇类型
        },
      }
    },
  }
}
