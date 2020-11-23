
import {
  queryBuildingViewDate,
  queryBuildingViewCondition,
  queryBuildingViewTable,
  queryBuildingViewTimeEchart,
  queryBuildingViewAreaEchart,
  queryRaiseStock,
  queryEchartType,
  queryProductMixOrOthers,
  queryTopTen
} from "@/services/buildingView";

const initState = {
    areaEchartData:{}, // 地域分布图
    rosePieData:{}, // 玫瑰饼图数据
    cutPieData:{}, // 客户分布情况饼图数据
  }
export default {
  namespace:"buildingViewModels",
  state:{
    markType:"ZQ_SUB_OVER_M",
    dateType:"2",
    tabId:"", // 模块id 暂时没有 传空
    date:"", // 当前选择的账期时间
    custType:[],// 客户类型
    industryType:[], // 行业类型
    raiseStockType: [], // 增存量
    tableData: {
      "thData": [
        // {
        //   "kpiId": "",
        //   "name": "省分",
        //   "unit": "",
        //   "levelId": "1",
        //   "levelPId": "-1",
        //   "id": "proName",
        //   "markJump": "false",
        //   "noIndex":"true",
        // },
        // {
        //   "kpiId": "",
        //   "name": "地市",
        //   "unit": "",
        //   "levelId": "12",
        //   "levelPId": "-1",
        //   "id": "cityName",
        //   "markJump": "false",
        //   "noIndex":"true",
        // },
        // {
        //   "kpiId": "",
        //   "name": "客户信息-总客户",
        //   "unit": "",
        //   "levelId": "3",
        //   "levelPId": "-1",
        //   "id": "",
        //   "markJump": "true",
        //   "noIndex":"false",
        // },
        // {
        //   "kpiId": "zw-1001",
        //   "name": "在网客户数",
        //   "unit": "",
        //   "levelId": "31",
        //   "levelPId": "3",
        //   "id": "value0",
        //   "markJump": "ture",
        //   "noIndex":"false",
        // },
        // {
        //   "kpiId": "zw-1002",
        //   "name": "出账收入",
        //   "unit": "",
        //   "levelId": "32",
        //   "levelPId": "3",
        //   "id": "value1",
        //   "markJump": "ture",
        //   "noIndex":"false",
        // },
        // {
        //   "kpiId": "",
        //   "name": "客户信息-名单制客户",
        //   "unit": "",
        //   "levelId": "4",
        //   "levelPId": "-1",
        //   "id": "",
        //   "markJump": "ture",
        //   "noIndex":"false",
        // },
        // {
        //   "kpiId": "md-1001",
        //   "name": "在网客户数2",
        //   "unit": "",
        //   "levelId": "41",
        //   "levelPId": "4",
        //   "id": "value2",
        //   "markJump": "ture",
        //   "noIndex":"false",
        // },
        // {
        //   "kpiId": "md-1002",
        //   "name": "出账收入2",
        //   "unit": "",
        //   "levelId": "42",
        //   "levelPId": "4",
        //   "id": "value3",
        //   "markJump": "ture",
        //   "noIndex":"false",
        // },
      ],
      "tbodyData": [
        // {
        //   "proId": "111",
        //   "proName": "全国",
        //   "cityId": "11",
        //   "cityName": "北京",
        //   "industryType":["01"],
        //   "custType":["1545"],
        //   "raiseStockType":["444"],
        //   "values":["1235","5989","55444","uuuu"]
        // },
        // {
        //   "proId": "111",
        //   "proName": "全国",
        //   "cityId": "93",
        //   "cityName": "河北",
        //   "industryType":["01"],
        //   "custType":["1545"],
        //   "raiseStockType":["444"],
        //   "values":["1235","5989","55444","uuuu"]
        // }
      ],
      "totalNum": "1",
      "currentNum": "1",
      "totalPageNum": "10"
    },
    payloadPrepare:{
      markType:"ZQ_SUB_OVER_M",
      dateType:"2",
      date:'',
      tabId:"",
      industryType:[],
      custType:[],
      raiseStockType:[],
      provId:'',
      cityId:''
    }, // 准备好政企总览的请求数据
    downloadPayload:[], // 准备好政企总览的请求数据
    maxDate:'', // 最大账期数据
    conditions:{}, // 筛选条件内容
    rosePieData:{}, // 玫瑰饼图数据
    cutPieData:{}, // 客户分布情况饼图数据
    industryDistributeData:{}, // 行业分布图
    newContractRankData:{}, // 新增合同排名客户
    outAccountData:{}, // 出账收入排名客户
    raiseStockData:{
      list:[],
      title:""
    }, // 增存量结构数据
    timeEchartData:{}, // 全国合计时间趋势图数据
    areaEchartData:{}, // 地域分布图
  },
  effects:{
    // 请求表格数据
    *getTableData({payload},{call, put}){
      const response = yield call(queryBuildingViewTable,payload);
      yield put({
        type:'setTableData',
        payload:response
      });
    },

// 保存待使用的payLoadData请求参数
    *fetchSavePayLoad({ payload }, { put }) {
      yield put({
        type: 'savePayLoad',
        payload,
      });
    },
    // 保存暂时选择的date信息
    *fetchSaveDate({ payload }, { put }) {
      yield put({
        type: 'saveChooseDate',
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
      const response = yield call(queryBuildingViewCondition,payload);
      yield put({
        type: 'saveConditions',
        payload:response,
      });
    },
    // 请求最大账期
    *fetchMaxDate({ payload }, { call,put }) {
      const response = yield call(queryBuildingViewDate,payload);
      yield put({
        type: 'saveMaxDate',
        payload:response,
      });
    },
    // 请求玫瑰饼图
    *fetchRosePie({ payload }, { put,call }) {
      const response = yield call(queryProductMixOrOthers,payload);
      yield put({
        type: 'saveRosePie',
        payload:response,
      });
    },
    // 请求增存量结构
    *fetchRaiseStock({ payload }, {call, put }) {
      const response = yield call(queryRaiseStock,payload);
      yield put({
        type: 'saveRaiseStock',
        payload:response,
      });
    },
    // 请求全国合计时间趋势图数据
    *fetchTimeEchart({ payload }, { call, put }) {
      const response = yield call(queryBuildingViewTimeEchart,payload);
      yield put({
        type: 'saveTimeEchart',
        payload:response,
      });
    },

    // 请求地域分布图
    *fetchAreaEchart({ payload }, { call, put }) {
      const response = yield call(queryBuildingViewAreaEchart,payload);
      yield put({
        type: 'saveAreaEchart',
        payload:response,
      });
    },
    // 请求客户分布情况饼图
    *fetchCutPie({ payload }, { put,call }) {
      const response = yield call(queryProductMixOrOthers,payload);
      yield put({
        type: 'saveCutPie',
        payload:response,
      });
    },
    // echart 类型接口
    *fetchEchartType({ payload,callback}, { call }){
      const response = yield call(queryEchartType,payload);
      callback(response)
    },
    // 请求行业分布图
    *fetchIndustryDistribute({ payload }, { put,call }) {
      const response = yield call(queryProductMixOrOthers,payload);
      yield put({
        type: 'saveIndustryDistribute',
        payload:response,
      });
    },
    // 请求 新增合同排名客户 接口
    *fetchNewContractRank({ payload }, { put,call }) {
      const response = yield call(queryTopTen,payload);
      yield put({
        type: 'saveNewContractRank',
        payload:response,
      });
    },
    // 请求 新增合同排名客户 接口
    *fetchOutAccount({ payload }, { put,call }) {
      const response = yield call(queryTopTen,payload);
      yield put({
        type: 'saveOutAccount',
        payload:response,
      });
    },
  },
  reducers:{
    setTableData(state, {payload}){
      return {
        ...state,
        tableData:payload
      }
    },
// 在点击查询页面后保存待使用的payLoadData请求参数
    savePayLoad(state, action) {
      return {
        ...state,
        payloadPrepare: action.payload,
      };
    },
    // 在点击查询页面后保存待使用的payLoadData请求参数
    saveChooseDate(state, action) {
      return {
        ...state,
        date: action.payload.date,
      };
    },
    // 在点击查询页面后保存待使用的下载参数
    saveDownLoad(state, action) {
      return {
        ...state,
        downloadPayload: action.payload,
      };
    },
    // 保存返回的筛选条件，目前是模拟这个过程
    saveConditions(state,{payload}) {
      return {
        ...state,
        conditions: payload,
      };
    },
    // 保存返回的最大账期，目前是模拟这个过程
    saveMaxDate(state,{payload}) {
      return {
        ...state,
        maxDate:payload.date,
        date:payload.date
      };
    },
    // 保存玫瑰饼图数据
    saveRosePie(state,{payload}) {
      return {
        ...state,
        rosePieData:payload,
      }
    },
    // 保存返回的增存量结构，目前是模拟这个过程
    saveRaiseStock(state,{payload}) {
      return {
        ...state,
        raiseStockData:payload
      };
    },
    // 时间趋势图
    saveTimeEchart(state,{payload}) {
      return {
        ...state,
        timeEchartData:payload
      };
    },
    // 地域分布图
    saveAreaEchart(state,{payload}) {
      return {
        ...state,
        areaEchartData:payload
      };
    },
    // 保存客户分布情况饼图数据
    saveCutPie(state,{payload}) {
      return {
        ...state,
        cutPieData:payload
      }
    },
    // 行业分布图
    saveIndustryDistribute(state,{payload}){
      return {
        ...state,
        industryDistributeData:payload
      }
    },
    // 新增合同排名客户
    saveNewContractRank(state,{payload}){
      return {
        ...state,
        newContractRankData:payload
      }
    },
    // 出账收入排名客户
    saveOutAccount(state,{payload}){
      return {
        ...state,
        outAccountData:payload
      }
    },

    // 清空数据
    cleanData(state,{payload=initState}){
      return {
        ...state,
        ...payload
      }
    }
  }
}
