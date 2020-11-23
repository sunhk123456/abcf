import {
  productViewTimeChart,
  productViewAreaChart,
  productViewPieChart,
  productViewFlowBarChart,
  productViewTerminalBarChart,
  productViewTableChart,
  queryProductViewCondition,
  queryProductViewMaxDate,
  queryProductNameHint,
  queryVerification,
  queryProductViewTable, // 表格接口
  queryIndexConfig,
  productViewChannelBarChart,
  productViewPeopleBarChart,
} from '../../services/productView';

export default {
  namespace: 'productViewModels',

  state: {
    tableData:{
      "thData": [],
      "tbodyData": [],
      "totalNum": "100",
      "currentNum": "10",
      "totalPageNum": "10"
    },
    timeEchartData:null,  // 全部产品合计时间趋势图
    areaEchartData:null,  // 全部产品合计地域分布图
    pieEchartData:null,   // 全部产品合计4G网络用户占比
    flowBarData:null,     // 上网流量偏好
    terminalBarData:null, // 全部产品合计终端使用情况
    channelBarData:null, // 全部产品合计终端使用情况
    peopleBarData:null, // 全部产品合计终端使用情况
    tableEchartData:null, // APP使用偏好-top10
   //  twoLineData:null, // 全部产品合计出账收入变化分布
    maxDate:"",// 最大账期
    date:"",// 账期
    conditionList:[
      {screenTypeId:"productClass",screenTypeName:"产品分类",type:"select"},

      {screenTypeId:"clientType",screenTypeName:"客户类型",type:"select"},
      {screenTypeId:"sourceSystem",screenTypeName:"系统来源",type:"select"},
      {screenTypeId:"channelType",screenTypeName:"渠道类型",type:"select"},
      {screenTypeId:"fusion",screenTypeName:"是否融合",type:"select"},
      {screenTypeId:"goodNum",screenTypeName:"是否靓号",type:"select"},
      {screenTypeId:"mainAssociate",screenTypeName:"主副卡",type:"select"},
      // {screenTypeId:"associateNum",screenTypeName:"副卡数量",type:"select"},
      {screenTypeId:"feeLevel",screenTypeName:"费用分档",type:"select"},
      {screenTypeId:"monthFee",screenTypeName:"套餐月费",type:"inputNumber"},
      {screenTypeId:"indexType",screenTypeName:"指标类型",type:"select"},
      {screenTypeId:"productId",screenTypeName:"产品编码",type:"input"},
      {screenTypeId:"productName",screenTypeName:"产品名称",type:"fetch"},
    ], // 所有筛选条件
    selectList:[], // 下拉框内容
    conditionValue:{}, // 用户输入的筛选条件值
    conditionName:{}, // 中文筛选条件
    mockData:[], // 指标配置数据
    saveIndexConfig:[], // 用户选择后保存的指标配置参数
  },

  effects: {
    *fetchTimeEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productViewTimeChart,payload);
      yield put({
        type: 'getTimeEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    *fetchAreaEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productViewAreaChart,payload);
      yield put({
        type: 'getAreaEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    *fetchPieEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productViewPieChart,payload);
      yield put({
        type: 'getPieEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    *fetchTerminalBarEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productViewTerminalBarChart,payload);
      yield put({
        type: 'getTerminalBarEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    *fetchChannelBarEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productViewChannelBarChart,payload);
      yield put({
        type: 'getChannelBarEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    *fetchPeopleBarEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productViewPeopleBarChart,payload);
      yield put({
        type: 'getPeopleBarEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    *fetchFlowBarEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productViewFlowBarChart,payload);
      yield put({
        type: 'getFlowBarEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    *fetchTableEchartData({ payload,callback }, { call, put }) {
      const response = yield call(productViewTableChart,payload);
      yield put({
        type: 'getTableEchartData',
        payload: response,
      },);
      if(callback){
        callback()
      }
    },
    // 最大账期
    *fetchMaxDate({ payload}, { call, put }) {
      const response = yield call(queryProductViewMaxDate,payload);
      yield put({
        type: 'saveMaxDate',
        payload: response.date,
      });
    },
    // 更改账期
    *fetchDate({ payload}, { put }) {
      yield put({
        type: 'saveDate',
        payload,
      });
    },
    // 筛选条件
    *fetchCondition({ payload }, { call, put }) {
      const response = yield call(queryProductViewCondition,payload);
      yield put({
        type: 'saveCondition',
        payload: response,
      });
    },
    // 产品名称
    *fetchProductNameHint({ payload,callback }, { call, put }) {
      const response = yield call(queryProductNameHint,payload);
      yield put({
        type: 'saveProductNameHint',
        payload: response,
      });
      if(callback)callback(response)
    },
    // 查询验证
    *fetchVerification({ payload,callback }, { call, put }) {
      const response = yield call(queryVerification,payload.params);
      if(response.code==="success"){
        yield put({
          type: 'saveVerification',
          payload,
        });
      }
      if(callback)callback(response)
    },
    // 指标配置
    *fetchIndexConfig({ payload }, { call, put }) {
      const response = yield call(queryIndexConfig,payload);
      yield put({
        type: 'saveIndexConfig',
        payload: response,
      });
    },

    // 表格接口
    *fetchProductViewTable({ payload,callback }, { call, put }) {
      const response = yield call(queryProductViewTable,payload);
      yield put({
        type: 'saveProductViewTable',
        payload: response,
      });
      if(callback){
        callback(response)
      }
    },
    // 保存指标配置
    *getIndexConfig({payload},{put}){
      yield  put({
        type:"indexConfig",
        payload,
      })
    },
    // 清除已输入的筛选条件值
    *clearCondition(action,{put}){
      yield  put({
        type:"saveVerification",
        payload:{
          params:{},
          conditionName:{}
        },
      })
    },
  },

  reducers: {

    // 保存表格数据
    saveProductViewTable(state, {payload}){
      return {
        ...state,
        ...{tableData:payload},
      }
    },

    getTimeEchartData(state, {payload=null}){
      return {
        ...state,
        ...{timeEchartData:payload},
      }
    },
    getAreaEchartData(state, {payload=null}){
      return {
        ...state,
        ...{areaEchartData:payload},
      }
    },
    getPieEchartData(state, {payload=null}){
      return {
        ...state,
        ...{pieEchartData:payload},
      }
    },
    getTerminalBarEchartData(state, {payload=null}){
      return {
        ...state,
        ...{terminalBarData:payload},
      }
    },
    getChannelBarEchartData(state, {payload=null}){
      return {
        ...state,
        ...{channelBarData:payload},
      }
    },
    getPeopleBarEchartData(state, {payload=null}){
      return {
        ...state,
        ...{peopleBarData:payload},
      }
    },
    getFlowBarEchartData(state, {payload=null}){
      return {
        ...state,
        ...{flowBarData:payload},
      }
    },
    getTableEchartData(state, {payload=null}){
      return {
        ...state,
        ...{tableEchartData:payload},
      }
    },
    saveVerification(state,{payload}){
      return{
        ...state,
        conditionValue:payload.productNameId!==""?{...payload.params,productId:payload.productNameId}:payload.params,
        conditionName:payload.productNameId!==""?{...payload.conditionName,"产品编码":payload.productNameId}:payload.conditionName
      }
    },
    saveCondition(state,{payload}){
      return{
        ...state,
        selectList:payload
      }
    },
    saveMaxDate(state,{payload}){
      return{
        ...state,
        // date:state.date?state.date:payload,
        date:payload,
        maxDate:payload
      }
    },
    saveDate(state,{payload}){
      return{
        ...state,
        date:payload
      }
    },
    saveIndexConfig(state,{payload}){
      return{
        ...state,
        mockData:payload
      }
    },
    indexConfig(state,{payload}){
      return{
        ...state,
        saveIndexConfig:payload
      }
    }
  }
}
