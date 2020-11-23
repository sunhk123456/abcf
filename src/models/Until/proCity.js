/**
 * @Description: 地域组件model
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/16
 */
import { proCityData } from '@/services/searchPage';
import {queryProductViewArea} from "@/services/productView";
import {requestSpecialArea,requestSpecialSinglesProvince} from "@/services/analyseSpecial/analyseSpecial";
import {queryHomeViewArea} from '../../services/homeView/homeView';
import {queryWarningConfigAreaData} from '../../services/warningConfig';
import Cookie from '@/utils/cookie';

export default {
  namespace: 'proCityModels',

  state: {
    areaDate:[],
    // selectIndex: 0, // 选中省索引
    selectPro: {
      // "proId": "111",
      // "proName": "全国"
    }, // 选中省数据
    selectCity: {
      // "cityId": "-1",
      // "cityName": "全国"
    }, // 选中地市数据
  },

  effects: {
    *proCityFetch({ payload,moreProCity,customInterface }, { call, put }) {
      let response;
      if(payload.markType && (payload.markType==="productView" || payload.markType==="channelView")){
        response = yield call(queryProductViewArea, {markType:payload.markType});
      }if(payload.markType && payload.markType==="warningConfig"){
        // 预警配置 地域接口
        response = yield call(queryWarningConfigAreaData, {markType:""});
      }else if(payload.markType && payload.markType==="HOME_SUB_M"){
        // 家庭视图 地域接口
        response = yield call(queryHomeViewArea, {markType:payload.markType,dateType:payload.dateType});
      }else if(customInterface === "region"){
        // 判断是否为模板专题 由于模板专题的markType 不定 只能通过customInterface判断
        response = yield call(requestSpecialArea, {markType:payload.markType,hasNanBei:payload.hasNanBei});
      }else if(customInterface === "singleProvince"){
        // 判断是否为模板专题单省份权限接口 由于模板专题的markType 不定 只能通过customInterface判断
        response = yield call(requestSpecialSinglesProvince, {markType:payload.markType});
      }else {
        response = yield call(proCityData, {markType:payload.markType});
      }
      yield put({
        type: 'save',
        payload: response,
        moreProCity
      });
    },
    // 外部传入获取数据
    *proCityFetch2({ payload,moreProCity,customInterface }, { call, put }) {
      let response;
      if(payload.markType && (payload.markType==="productView" || payload.markType==="channelView")){
        response = yield call(queryProductViewArea, {markType:payload.markType});
      }if(payload.markType && payload.markType==="warningConfig"){
        // 预警配置 地域接口
        response = yield call(queryWarningConfigAreaData, {markType:""});
      }else if(payload.markType && payload.markType==="HOME_SUB_M"){
        // 家庭视图 地域接口
        response = yield call(queryHomeViewArea, {markType:payload.markType,dateType:payload.dateType});
      }else if(customInterface === "region"){
        // 判断是否为模板专题 由于模板专题的markType 不定 只能通过customInterface判断
        response = yield call(requestSpecialArea, {markType:payload.markType,hasNanBei:payload.hasNanBei});
      }else if(customInterface === "singleProvince"){
        // 判断是否为模板专题单省份权限接口 由于模板专题的markType 不定 只能通过customInterface判断
        response = yield call(requestSpecialSinglesProvince, {markType:payload.markType});
      }else {
        response = yield call(proCityData, {markType:payload.markType});
      }
      // const response = yield call(proCityData,payload.markType);
      yield put({
        type: 'save2',
        payload: {areaDate:response,selectData:payload.selectData},
        moreProCity
      });
    },
    // 选中的数据更新
    *selectProCity({ payload,moreProCity }, { put }){
      yield put({
        type: 'setSelectData',
        payload,
        moreProCity
      });
    },
  },

  reducers: {
    save2(state, {payload,moreProCity} ) {
      const {areaDate, selectData} = payload;
      let selectPro = {};
      let selectCity = {};
      if(selectData.proId !== "-1"){
        areaDate.forEach((item) =>{
          if(item.proId === selectData.proId){
            selectPro = {
              proId: item.proId,
              proName: item.proName
            };
            if(selectData.cityId === "-1"){
              selectCity = {
                cityId: "-1",
                cityName: item.proName
              }
            }else {
              item.city.forEach((cityItem)=>{
                if(cityItem.cityId === selectData.cityId){
                  selectCity = {
                    cityId: cityItem.cityId,
                    cityName: cityItem.cityName
                  }
                }
              })
            }
          }
        })
      }else {
        const {power} = Cookie.getCookie('loginStatus');
        selectPro = {
          proId: areaDate[0].proId,
          proName: areaDate[0].proName
        };
        if(power === "city"){
          selectCity = {
            cityId: areaDate[0].city[0].cityId,
            cityName: areaDate[0].city[0].cityName
          }
        }else {
          selectCity = {
            cityId: "-1",
            cityName: areaDate[0].proName
          }
        }
      }
      if(moreProCity){
        return {
          ...state,
          areaDate,
          [moreProCity.selectProName]: selectPro,
          [moreProCity.selectCityName]: selectCity
        };
      }
      return {
        ...state,
        areaDate,
        selectPro,
        selectCity
      };
    },

    save(state, {payload,moreProCity} ) {
      const {power} = Cookie.getCookie('loginStatus');
      const selectPro = {
        proId: payload[0].proId,
        proName: payload[0].proName
      };
      let selectCity = {};
      if(power === "city"){
        selectCity = {
          cityId: payload[0].city[0].cityId,
          cityName: payload[0].city[0].cityName
        }
      }else {
        selectCity = {
          cityId: "-1",
          cityName: payload[0].proName
        }
      }
      if(moreProCity){
        return {
          ...state,
          areaDate: payload,
          [moreProCity.selectProName]: selectPro,
          [moreProCity.selectCityName]: selectCity
        };
      }
      return {
        ...state,
        areaDate: payload,
        selectPro,
        selectCity
      };
    },

    // 选中的数据更新
    setSelectData(state, {payload,moreProCity} ){
      if(moreProCity){
        return {
          ...state,
          [moreProCity.selectProName]: payload.selectPro,
          [moreProCity.selectCityName]: payload.selectCity
        };
      }
      return {
        ...state,
        selectPro: payload.selectPro,
        selectCity: payload.selectCity
      };
    }
  },
};
