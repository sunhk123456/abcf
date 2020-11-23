import {
  queryMaxDate,
  queryOnline24HourData,
  query8Pies,
  queryInternetSpeedData, // 请求上网速率
  // queryHomeNumTimeLineData,
  queryTop10EchartData,
} from '../../services/homeView/homeView';
// import { queryHouseIncomeData } from '../../services/building/building';

export default {
  namespace:"homeViewSecondTabModels",
  state:{
    date:"",
    maxDate:'', // 最大账期数据
    // 下载筛选条件
    downloadCondition:{
      date:"",
      proName:"",
      cityName:"",
    },
    areaName:"",
    contrastPie:'', // 三家运营商对比饼图
    homeNumberPie:'',// 智能设备数量家庭分布饼图
    homeTypePie:'', // 智能设备类型家庭分布饼图
    online24HourData: {}, // 24小时上网分布
    top10Echart:{},
    internetSpeed:{
      title:"终端采购价格分布",
      xName:"元",
      yName:"人次",
      describe:"",
      chartX:["<10","[1000,2000]","[2000,3000]","[3000,4000]","[4000,5000]"],
      chart:[
        {
          name:"价格分布",
          value:["1500","4000","3000","2000","1500"],
          unit:"元",
        }
      ]
    }, // 上网速率
  },
  effects:{
    // 请求最大账期
    * getMaxDate({ payload, callback }, { call, put }) {
      const response = yield call(queryMaxDate, payload);
      yield put({
        type: 'setMaxDate',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 更改日期
    *getDate({ payload ,callback},{ put }){
      yield put({
        type: 'setDate',
        payload,
      });
      if (callback) callback(payload);
    },
    // 请求24小时上网分布折线图数据
    *getOnline24HourData({ payload ,callback},{ call, put }){
      const response = yield call(queryOnline24HourData,payload);
      yield put({
        type: 'setOnline24HourData',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 请求八省市拉通饼图接口
    *fetchPie8({ payload }, { call,put }) {
      const response = yield call(query8Pies,payload);
      let useType = '';
      switch (payload.chartType) {
        case "contrast":
          useType='saveContrast';
          break;
        case "homeNumber":
          useType='saveHomeNumber';
          break;
        case "homeType":
          useType='saveHomeType';
          break;
        default:
          break;
      }
      yield put({
        type: useType,
        payload: response,
      });
    },
    // 请求top10数据
    *getTop10EchartData({payload,callback},{call, put}){
      const response = yield call(queryTop10EchartData,payload);
      yield put({
        type:'setTop10EchartData',
        payload:response
      });
      if (callback) callback(response);
    },
    // 请求上网速率接口
    *getInternetSpeedData({payload,callback},{call, put}){
      const response = yield call(queryInternetSpeedData,payload);
      yield put({
        type:'setInternetSpeedData',
        payload:response
      });
      if (callback) callback(response);
    },
    
  },
  reducers:{
    // 最大账期
    setMaxDate(state, { payload }) {
      const{downloadCondition}=state;
      return {
        ...state,
        downloadCondition:{
          ...downloadCondition,
          date:payload.date,
        },
        date: payload.date,
        maxDate: payload.date,
      };
    },
    // 查询后更改下载日期
    setDownloadCondition(state, { payload }) {
      console.log('设置查询后更改下载日期为');
      console.log(payload);
      return {
        ...state,
        downloadCondition: payload,
      };
    },
    // 查询后更改下载日期
    setAreaNameData(state, { payload }) {
      console.log('设置查询后更改下载日期为');
      console.log(payload);
      return {
        ...state,
        downloadAreaName: payload.areaName,
      };
    },
    // 更改日期
    setDate(state, { payload,callback }) {
      if (callback) callback(payload);
      console.log('设置账期为');
      console.log(payload);
      return {
        ...state,
        date: payload.date,
      };
    },
    // 设置24小时上网分布折线图数据
    setOnline24HourData(state, {payload}) {
      return {
        ...state,
        online24HourData:payload,
      };
    },
    // 保存三家运营商成员对比
    saveContrast(state, {payload}) {
      return {
        ...state,
        contrastPie:payload
        // contrastPie:{
        //   title:"三家运营商成员对比",
        //   description:'就tm你叫夏洛啊',
        //   chartX:["大于7个","5-7个","3-4个","1-2个","无"],
        //   chart:[
        //     {
        //       name:"三家运营商成员对比",
        //       value:['2,536','536','536','536','536',],
        //       unit:"万",
        //       type:"pie"
        //     },
        //   ]
        // }
      };
    },
    // 保存智能设备数量家庭分布
    saveHomeNumber(state, {payload}) {
      return {
        ...state,
        homeNumberPie:payload
        // homeNumberPie:{
        //   title:"单宽-融合家庭数量对比",
        //   chartX:["大于7个","5-7个","3-4个","1-2个","无"],
        //   chart:[
        //     {
        //       name:"单宽-融合家庭数量对比",
        //       value:['2,536','536','536','536','536',],
        //       unit:"万",
        //       type:"pie"
        //     },
        //   ]
        // }
      };
    },
    // 保存智能设备类型家庭分布
    saveHomeType(state, {payload}) {
      return {
        ...state,
        homeTypePie:payload
        // homeTypePie:{
        //   title:"智能设备数量家庭分布",
        //   chartX:["大于7个","5-7个","3-4个","1-2个","无"],
        //   chart:[
        //     {
        //       name:"智能设备数量家庭分布",
        //       value:['2,536','536','536','536','536',],
        //       unit:"万",
        //       type:"pie"
        //     },
        //   ]
        // }
      };
    },
    // 设置App top10数据
    setTop10EchartData(state, {payload}) {
      return {
        ...state,
        top10Echart:payload,
      };
    },
    // 请求上网速率
    setInternetSpeedData(state, {payload}) {
      return {
        ...state,
        internetSpeed:payload,
      };
    },
  }
}
