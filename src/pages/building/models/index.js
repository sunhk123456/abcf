import {
  queryMaxDate,
  queryTableData,
  queryBarEchartData,
  queryHouseIncomeData,
  queryNewUserData,
  queryNewIncomeData,
  queryHouseIncomePopData,
  queryNewUserPopData,
  queryNewIncomePopData,
  queryPopupTable,
  queryTotalData,
  queryFunnelPlot,
  queryMapValue,
  queryArcgisData,
  queryMap
} from '../../../services/building/building';

export default {
  namespace:"buildingModels",
  state:{
    mapData:{
      title:'',
      allValue:'',
      provId:'',
      provName:'',
      cityId:'-1',
      cityName:'',
      mapData:[]
    },
    GeoJson:{},
    specialName: '政企楼宇转交情况',
    provName: '',
    cityName: '',
    provId:"",
    cityId:"",
    markType:"GM_SUB_M",
    dateType:"2",
    funEchartData: {},
    totalData:[],
    tableData:{
      'thData':[],
      'tbodyData': [],
    }, // 表格数据
    barEchartData:{},  // 新增用户与收入时间趋势数据
    houseIncome:{}, // 楼宇总收入top10
    newUser:{}, // 新增用户 top10
    newIncome:{}, // 新增收入 top10
    houseIncomePop:{}, // 弹出层楼宇总收入top10
    newUserPop:{}, // 弹出层新增用户 top10
    newIncomePop:{}, // 弹出层新增收入 top10
    maxDate:'' ,// 最大账期
    date: '', // 日期
    popupTable:{  // 弹出层表格数据
      "thData": [],
      "tBodyData": [],
      "total": "1",
      "currentPage": "1",
      "totalPage": "1",
      "title": "已匹配楼宇对应业务规模情况概览"
    },
    pointData:[
      {x:120.03354,y:36.26445,number:'222',buildingId:'QD00001'},
      {x:120.39629,y:36.30744,number:'555',buildingId:'QD00002'}
    ],
    inform:{
      buildingName: "",
      buildingUser: "",
      address: "",
      data:[
        {name:'客户总量',unit:'',value:''},
        {name:'本年楼宇收入',unit:'',value:''},
        {name:'本网客户',unit:'',value:''},
        {name:'上月楼宇收入',unit:'',value:''},
        {name:'楼宇专线-开通时限',unit:'',value:''},
        {name:'语音业务-开通时限',unit:'',value:''},
        {name:'可开带宽',unit:'',value:''},
        {name:'光纤空闲数',unit:'',value:''},
        {name:'专线可开带宽',unit:'',value:''},
        {name:'光缆空闲数',unit:'',value:''},
        {name:'分光器端口空闲数',unit:'',value:''},
        {name:'交换机端口空闲数',unit:'',value:''},
    ]},
},
  effects:{
    // 请求最大账期
    *getMaxDate({ payload ,callback},{ call, put }){
      const response = yield call(queryMaxDate,payload);
      yield put({
        type: 'setMaxDate',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求表格数据
    *getTableData({payload,callback},{call, put}){
      const response = yield call(queryTableData,payload);
      yield put({
        type:'setTableData',
        payload:response
      });
      if (callback) callback(response);
    },

    // 请求漏斗图数据
    *getFunnelEcharts({payload,callback},{call, put}){
      const response = yield call(queryFunnelPlot,payload);
      yield put({
        type:'setFunnelData',
        payload:response
      });
      if (callback) callback(response);
    },

    // 请求楼宇统计数据
    *getTotalData({payload,callback},{call, put}){
      const response = yield call(queryTotalData,payload);
      yield put({
        type:'setTotalData',
        payload:response
      });
      if (callback) callback(response);
    },

    // 请求top10数据
    *getHouseIncomeData({payload,callback},{call, put}){
      const response = yield call(queryHouseIncomeData,payload);
      yield put({
        type:'setHouseIncomeData',
        payload:response
      });
      if (callback) callback(response);
    },
    // 请求top10数据
    *getNewUserData({payload,callback},{call, put}){
      const response = yield call(queryNewUserData,payload);
      yield put({
        type:'setNewUserData',
        payload:response
      });
      if (callback) callback(response);
    },
    // 请求top10数据
    *getNewIncomeData({payload,callback},{call, put}){
      const response = yield call(queryNewIncomeData,payload);
      yield put({
        type:'setNewIncomeData',
        payload:response
      });
      if (callback) callback(response);
    },
    // 请求top10数据
    *getHouseIncomePopData({payload,callback},{call, put}){
      const response = yield call(queryHouseIncomePopData,payload);
      yield put({
        type:'setHouseIncomePopData',
        payload:response
      });
      if (callback) callback(response);
    },
    // 请求top10数据
    *getNewUserPopData({payload,callback},{call, put}){
      const response = yield call(queryNewUserPopData,payload);
      yield put({
        type:'setNewUserPopData',
        payload:response
      });
      if (callback) callback(response);
    },
    // 请求top10数据
    *getNewIncomePopData({payload,callback},{call, put}){
      const response = yield call(queryNewIncomePopData,payload);
      yield put({
        type:'setNewIncomePopData',
        payload:response
      });
      if (callback) callback(response);
    },
    // 请求新增用户和收入时间趋势bar数据
    *getBarEchartData({payload,callback},{call, put}){
      const response = yield call(queryBarEchartData,payload);
      yield put({
        type:'setBarEchartData',
        payload:response
      });
      if (callback) callback(response);
    },
    // 请求弹出层表格
    *getPopupTable({payload},{call, put}){
      const response = yield call(queryPopupTable,payload);
      yield put({
        type:'setPopupTable',
        payload:response
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
    // 请求arcgis地图数据
    *getArcgisData({payload,callback},{call, put}){
      const response = yield call(queryArcgisData,payload);
      yield put({
        type:'setArcgisData',
        payload:response
      });
      if (callback) callback(response);
    },
  },
  reducers:{
    // 最大账期
    setMaxDate(state, {payload}) {
      return {
        ...state,
        date:payload.date,
        maxDate:payload.date
      };
    },
    // 更改日期
    setDate(state, {payload}) {
      console.log("设置账期为");
      console.log(payload);
      return {
        ...state,
        date:payload.date,
      };
    },
    // 获取表格数据
    setTableData(state, {payload}) {
      return {
        ...state,
        tableData: payload,
      };
    },
    // 获取漏斗图
    setFunnelData(state, {payload}) {
      return {
        ...state,
        funEchartData: payload,
      };
    },
    // 获取累计值数据
    setTotalData(state, {payload}) {
      console.info('pay',payload)
      return {
        ...state,
        totalData: payload,
      };
    },
    // 获取top10
    setHouseIncomeData(state, {payload}) {
      return {
        ...state,
        houseIncome: payload,
      };
    },
    // 获取top10
    setNewUserData(state, {payload}) {
      return {
        ...state,
        newUser: payload,
      };
    },
    // 获取top10
    setNewIncomeData(state, {payload}) {
      return {
        ...state,
        newIncome: payload,
      };
    },
    // 获取top10
    setHouseIncomePopData(state, {payload}) {
      return {
        ...state,
        houseIncomePop: payload,
      };
    },
    // 获取top10
    setNewUserPopData(state, {payload}) {
      return {
        ...state,
        newUserPop: payload,
      };
    },
    // 获取top10
    setNewIncomePopData(state, {payload}) {
      return {
        ...state,
        newIncomePop: payload,
      };
    },
    // 获取柱状图
    setBarEchartData(state, {payload}) {
      return {
        ...state,
        barEchartData: payload,
      };
    },
    // 获取popup表格数据
    setPopupTable(state, {payload}) {
      return {
        ...state,
        popupTable: payload,
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
    changeCity(state, {payload}){
      return {
        ...state,
        provName:payload.provName,
        provId: payload.provId,
        cityName: payload.cityName,
        cityId: payload.cityId
      }
    },
    setArcgisData(state, {payload}){
      return {
        ...state,
        inform:payload
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
