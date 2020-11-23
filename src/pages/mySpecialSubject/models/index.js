import {
  queryTitleData,
  requestSpecialMaxDate,
  querySearchData,
  queryIndexConfigSave,
  queryMySpecialData,
  queryMySpecialMarkType,
  queryDayAndMonth,
  queryTableData,
  queryTableTimeEchartData,
  queryTableAreaEchartData,
  querySaveSpecial,
  queryDelete
} from '../../../services/mySpecialSubject/mySpecialSubject';



/**
 *
 * 描述：我的工作台我的专题models
 *
 * */

export default {
  namespace:"mySpecialSubjectModels",
  state:{
    specialName: '我的工作台',
    moduleId:"", // 模块id 暂时没有 传空
    selectIndex:0,// 页签序号
    titleData:[
      // {
      //   "moduleName": "总部应用",
      //   "moduleId": "ID_515"
      // }
    ],
    mySpecialList:[], // 我的专题
    selectSpecial: {"name":"","id":"","dateType":"D","specialType":""}, // 选中的专题列表的名称
    maxDate:"", // 最大账期
    date:"",// 账期,
    indexConfigData:{
      "allIndex":[
        // {
        //   "indexId": "id1",
        //   "indexName": "指标名称1"
        // },
        // {
        //   "indexId": "id2",
        //   "indexName": "指标名称2"
        // },
        // {
        //   "indexId": "id3",
        //   "indexName": "指标名称3"
        // },
        // {
        //   "indexId": "id4",
        //   "indexName": "指标名称4"
        // }
      ],
      "selectIndex":[
        // {
        //   "indexId": "id3",
        //   "indexName": "指标名称3"
        // },
        // {
        //   "indexId": "id4",
        //   "indexName": "指标名称4"
        // }
      ]
    },
    allTableIndexData:[], // 指标配置弹出层左边指标
    selectTableIndexData:[],  // 指标配置弹出层已选中指标
    tableData:{
      "tableName":"",
      "thData":[],
      "tbodyData":[]
    },
    status:"current", // 当前状态(默认状态) edit表示编辑状态
    queryCondition: {
      date: '',
      selectPro: {
        'proId': '111',
        'proName': '全国',
      }, // 选中省数据
      selectCity: {
        'cityId': '-1',
        'cityName': '全国',
      }, // 选中地市数据
    },
    chartCondition:{
      indexName:"", // 选中行的名称
      thName:"" // 选中列的名称
     },
    tableTimeEchart:{}, // 请求回来的表格型时间趋势图数据，里面包括一行的所有数据。
    tableAreaEchart:{}, // 请求回来的表格型地域柱状图图数据，里面包括一行的所有数据。
    tableTimeEchartOne:{}, // 处理后的直接可以渲染组件的时间趋势图数据
    tableAreaEchartOne:{} // 处理后的直接可以渲染组件的地域柱状图数据
  },
  effects:{
    // 请求页签数据
    *getTitleData({ payload, callback }, { call, put }) {

      const response = yield call(queryTitleData, payload);
      yield put({
        type: 'setTitleData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求我的专题名称数据
    *getMySpecialData({ payload, callback }, { call, put }) {

      const response = yield call(queryMySpecialData, payload);
      yield put({
        type: 'setMySpecialData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 更改moduleId
    *getModuleId({ payload ,callback},{ put }){
      yield put({
        type: 'setModuleId',
        payload,
      });
      if (callback) callback(payload);
    },
    // 最大账期
    *fetchMaxDate({ payload,callback}, { call, put }) {
      const response = yield call(requestSpecialMaxDate,payload);
      yield put({
        type: 'saveMaxDate',
        payload: response.date,
      });
      if(callback){
        callback(response)
      }
    },
    // 更改账期
    *fetchDate({ payload}, { put }) {
      yield put({
        type: 'saveDate',
        payload,
      });
    },


    // 1. 打开指标配置弹出层 调用此搜索接口
    // 2. 点击指标配置弹出层搜索按钮 调用此搜索接口
    *getSearchData({payload,callback},{call,put}){
      const response = yield call(querySearchData,payload);
      yield put({
        type: 'setSearchData',
        payload: response,
      });
      if(callback){
        callback(response)
      }
    },
    // 指标配置弹出层请求日月切换
    *getDayAndMonth({payload,callback},{call}){
      const response = yield call(queryDayAndMonth,payload);
      if(callback){callback(response)}
    },
    // 1. 点击指标配置弹出层确定按钮后，调用此保存指标配置接口
    *fetchIndexConfigSave({payload,callback},{call}){
      const response = yield call(queryIndexConfigSave,payload);
      if (callback) callback(response);
    },

    // 点击选择专题类型后保存请求专题id
    *fetchMarkType({payload,callback},{call,put}){
      const response = yield call(queryMySpecialMarkType,payload);
      yield  put({
        type:"setSelectSpecial",
        payload:{
          name:"",
          id:response.markType,
          dateType:"D",
          specialType:payload.specialType
        },
      });
      if(callback) callback(response);
    },

    //  点击删除确认弹窗后请求删除接口
    *fetchDelete({payload,callback},{call}){
      const response = yield call(queryDelete,payload);
      if(callback) callback(response);
    },

    // 点击选择专题名称后，设置选中的专题
    *setSelectSpecialHandle({payload,callback},{put}){

      yield  put({
        type:"setSelectSpecial",
        payload ,
      });
      if(callback) callback(payload);
    },

    // 请求表格型专题我的表格数据
    *getTableData({ payload, callback }, { call, put }) {

      const response = yield call(queryTableData, payload);
      yield put({
        type: 'setTableData',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 请求表格型专题时间趋势图数据
    *getTableTimeEchartData({ payload, callback }, { call, put }) {

      const response = yield call(queryTableTimeEchartData, payload);
      yield put({
        type: 'setTableTimeEchartData',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 请求表格型专题时间趋势图数据
    *getTableAreaEchartData({ payload, callback }, { call, put }) {

      const response = yield call(queryTableAreaEchartData, payload);
      yield put({
        type: 'setTableAreaEchartData',
        payload: response,
      });
      if (callback) callback(response);
    },

    // 请求保存专题名称接口
    *fetchSaveSpecial({ payload, callback }, { call}) {
      const response = yield call(querySaveSpecial, payload);
      if (callback) callback(response);
    },

  },
  reducers:{
    // 设置页签数据
    setTitleData(state, { payload }) {
      return {
        ...state,
        titleData:payload,
      };
    },
    // 获取到我的专题单选框样式
    setMySpecialData(state, { payload }) {
      const {selectSpecial}=state;
      let newSelectSpecial=[...payload];
      let selectSpecialCopy = {...selectSpecial};
      if(selectSpecial.id && payload ){
        newSelectSpecial = payload.filter((item)=>item.id === selectSpecial.id);
      }
      if(newSelectSpecial.length > 0){
        selectSpecialCopy = {...newSelectSpecial[0]}
      }else if(payload[0]) {
        selectSpecialCopy = {...payload[0]}
      }
      
      if(!payload[0]){
        selectSpecialCopy={"name":"","id":"","dateType":"D","specialType":""}
      }
      return {
        ...state,
        mySpecialList:payload,
        selectSpecial: selectSpecialCopy
      };
    },
    // 更新选中的我的专题对象
    setSelectSpecial(state, { payload }) {
      return {
        ...state,
        selectSpecial:payload,
      };
    },

    // 更改moduleId
    setModuleId(state, { payload }) {
      return {
        ...state,
        moduleId: payload.moduleId,
        selectIndex:payload.selectIndex,
      };
    },
    // 最大账期保存
    saveMaxDate(state,{payload}){
      return {
        ...state,
        maxDate:payload, // 最大账期
        date:payload,// 账期:
      }
    },
    // 更改日期
    saveDate(state,{payload}){
      return{
        ...state,
        date:payload
      }
    },

    // 保存指标配置数据
    setSearchData(state,{payload}){
      return{
        ...state,
        indexConfigData:payload
      }
    },
    // 设置左边搜索的指标数组
    saveAllTableIndexData(state,{payload}){
      return{
        ...state,
        allTableIndexData:payload
      }
    },
    // 设置右边选中的指标数组
    saveSelectTableIndexData(state,{payload}){
      return{
        ...state,
        selectTableIndexData:payload
      }
    },
    // 保存标配个数据
    setTableData(state,{payload}){
      return{
        ...state,
        tableData:payload
      }
    },

    // 设置专题当前状态
    setStatus(state,{payload}){
      return{
        ...state,
        status:payload
      }
    },


    // 保存查询筛选条件
    setQueryCondition(state, { payload }) {
      return {
        ...state,
        queryCondition: payload,
      };
    },

    // chartCondition
    setChartCondition(state, { payload }) {
      return {
        ...state,
        chartCondition: payload,
      };
    },

    // 保存请求到的表格型专题时间趋势图数据
    setTableTimeEchartData(state, { payload }) {
      return {
        ...state,
        tableTimeEchart: payload,
      };
    },

    // 保存表格型专题地域柱状图数据

    // 保存请求到的表格型专题地域柱状图数据
    setTableAreaEchartData(state, { payload }) {
      return {
        ...state,
        tableAreaEchart: payload,
      };
    },

    // 保存处理后的表格型专题时间趋势图数据
    setTableTimeEchartOneData(state, { payload }) {
      return {
        ...state,
        tableTimeEchartOne: payload,
      };
    },

    // 保存处理后的表格型专题地域柱状图数据
    setTableAreaEchartOneData(state, { payload }) {
      return {
        ...state,
        tableAreaEchartOne: payload,
      };
    },


}
}
