import {
  queryUserInfoData, // 家庭基本信息数据
  queryStackBarData, // 语音特征堆叠柱状图数据
  queryTreeMapData, // 智能终端树图数据
  queryTop10EchartData, // 互联网行为
  queryNetworkQualityData, // 网络质量
  querySearchData, // 请求搜索验证家庭id表格
  queryPieEchartsData, // 消费构成互联网饼图数据
  queryTableData,
  queryRegionData, // b域表格o域表格
  queryHomeProductTableData, // 家庭产品信息表格
} from '../../../services/homeQuery/homeQuery';

export default {
  namespace: "homeQueryModels",
  state: {
    isShowTopAndPie:"notShow", // 判断top10与家庭终端是否显示
    specialName: '家庭信息查询', // 专题名称
    markType: "HOME_QUERY_M", // 专题id
    dateType: "2", // 日月标识
    detailData:{
      title:"",
      list:[]
    }, // 家庭基本信息数据
    secondDetail:[
      {
        "title":"",
        "type":"userInfo",
        "list":[]
      }
    ],// 家庭基本信息查看数据
    doubleListData:[],
    queryData:{
      tbodyData:[],
      thData:[],
      type:"",
    }, // 查询按钮查询到家庭id表格对象
    stackBar: {
      'title': '',
      'chartX': ['通话时长',"通话次数"],
      "yName":['', ''],
      'chart': [],
      "chartAnother":[],
    },  // 语音特征堆叠柱状图数据
    treeMap:{
      title: '',
      totalList: {
        name: '',
        value: '',
        unit: '',
      },
      chartX: [],
      chart: [],
    }, // 智能终端饼数据
    top10:{
      "title":"",
      "unit":"",
      "thData":[],
      "tbodyData":[]
    }, // 互联网行为
    networkQuality:	{
      "subtitle":{"name":"成本价占比","value":"125","unit":"%"},
      "title":"",
      "list":[
        {"name":"成本价占比","value":"125","unit":"%"},
        {"name":"成本价占比","value":"125","unit":"%"}
      ]
    }, // 网络质量
    cutPieData:{
      title:"",
      chartX:[],
      chart:[
        {
          name:"",
          value:[],
          unit:"",
          type:""
        },
      ]
    }, // 消费构成
    tableData:{
      title:"",
      tbodyData:[],
      thData: [],
    }, // 用户感知
    RegionTableData:{
      title:"",
      tbodyData:[],
      thData: [],
      "total": "1",
      "currentPage": "1",
      "totalPage": "1",
    }, // B域O域
    homeProductTableData:{
      title:"",
      tbodyData:[],
      thData: [],
      "total": "1",
      "currentPage": "1",
      "totalPage": "1",
    },
  },
  effects: {
    // 请求搜索验证家庭id表格
    * getSearchData({payload,callback}, { call, put }) {
      const response = yield call(querySearchData, payload);
      yield put({
        type: 'setSearchData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 家庭基本信息数据
    * getUserInfoListData({ payload, callback }, { call, put }) {
      const response = yield call(queryUserInfoData, payload);
      yield put({
        type: 'setUserInfoData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 家庭成员数据
    * getUserInfoDetailData({ payload, callback }, { call, put }) {
      const response = yield call(queryUserInfoData, payload);
      yield put({
        type: 'setUserDetailData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 请求语音特征堆叠柱状图数据
    * getStackBarData({ payload, callback }, { call, put }) {
      const response = yield call(queryStackBarData, payload);
      yield put({
        type: 'setStackBarData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 请求智能终端树图数据
    * getTreeMapData({ payload, callback }, { call, put }) {
      const response = yield call(queryTreeMapData, payload);
      yield put({
        type: 'setTreeMapData',
        payload: response
      });
      if (callback) callback(response);
    },
    // getPieEchartsData
    * getPieEchartsData({ payload, callback }, { call, put }) {
      const response = yield call(queryPieEchartsData, payload);
      yield put({
        type: 'setPieEchartsData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 请求互联网行为top10数据
    * getTop10EchartData({ payload, callback }, { call, put }) {
      const response = yield call(queryTop10EchartData, payload);
      yield put({
        type: 'setTop10EchartData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 网络质量
    * getNetworkQualityData({ payload, callback }, { call, put }) {
      const response = yield call(queryNetworkQualityData, payload);
      yield put({
        type: 'setNetworkQualityData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 用户感知
    * getTableListData({ payload, callback }, { call, put }) {
      const response = yield call(queryTableData, payload);
      yield put({
        type: 'setTableData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 请求b域或者o域表格
    * getRegionData({ payload, callback }, { call, put }) {
      const response = yield call(queryRegionData, payload);
      yield put({
        type: 'setRegionData',
        payload: response
      });
      if (callback) callback(response);
    },
    // 请求家庭信息表格
    * getHomeProductTableData({ payload, callback }, { call, put }) {
      const response = yield call(queryHomeProductTableData, payload);
      yield put({
        type: 'setHomeProductTableData',
        payload: response
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    // 请求搜索验证家庭id表格
    setSearchData(state, { payload }){
      return {
        ...state,
        queryData: payload,
      };
    },
    // 家庭基本信息数据
    setUserInfoData(state, { payload }) {
      let detailData = {};
      const doubleListData = [];
      payload.forEach((item)=>{
        if(item.type === "homeStar" || item.type === "marketing"){
          doubleListData.push(item)
        }else {
          detailData = item;
        }
      });
      return {
        ...state,
        detailData,
        doubleListData
      };
    },
    // 家庭基本信息查看数据
    setUserDetailData(state, { payload }) {
      return {
        ...state,
        secondDetail: payload,
      };
    },
    setStackBarData(state, { payload }) {
      return {
        ...state,
        stackBar: payload,
      };
    },
    setTreeMapData(state, { payload }) {
      return {
        ...state,
        treeMap:payload,
      };
    },
    setTop10EchartData(state, { payload }) {
      let flag="notShow";
      if(payload!=="error"){
        if(payload[0].tbodyData.length!==0&&payload[1].chart[0].value.length!==0){
          flag="all"
        }else if(payload[0].tbodyData.length!==0&&payload[1].chart[0].value.length===0){
          flag="top10"
        }else if(payload[0].tbodyData.length===0&&payload[1].chart[0].value.length!==0){
          flag="pie"
        }
        return {
          ...state,
          top10: payload[0],
          treeMap: payload[1],
          isShowTopAndPie:flag
        };
      }
        return{
          ...state,
          isShowTopAndPie:"notShow"
        }

    },
    setNetworkQualityData(state, { payload }) {
      return {
        ...state,
        networkQuality: payload,
      };
    },
    setPieEchartsData(state, { payload }) {
      return {
        ...state,
        cutPieData: payload,
      };
    },
    setTableData(state, { payload }) {
      return {
        ...state,
        tableData: payload,
      };
    },
    setRegionData(state, { payload }) {
      return {
        ...state,
        RegionTableData: payload,
      };
    },
    setHomeProductTableData(state, { payload }) {
      return {
        ...state,
        homeProductTableData: payload,
      };
    },
  }
}
