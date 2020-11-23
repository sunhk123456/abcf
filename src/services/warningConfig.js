import request from '../utils/request';
import Url from '@/services/urls.json';

// 请求删除预警
export async function queryDeleteWarning(params={}) {
  return request(`${Url.urls[44].url}/deleteWarning`,{
    method: 'POST',
    body: params,
  });
}

// 请求我的预警数据
export async function queryMyWarning(params={}) {
  return request(`${Url.urls[44].url}/myWarning`,{
    method: 'POST',
    body: params,
  });
}

// 请求添加预警接口
export async function queryAddWarningData(params) {
  // console.log(params);
  return request(`${Url.urls[44].url}/screenCondition`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     "isMarkType": "true",
  //     "title": "添加预警servers数据",
  //     "indexList": [
  //       { "id": "01", "name": "a指标" },
  //       { "id": "02", "name": "b指标" },
  //       { "id": "02", "name": "c指标" }
  //     ],
  //     "indexData": {
  //       "title": "宽带接入出账用户（单位：万户）",
  //       "list": [
  //         { "color": "default", "name": "本月值", "value": "6467.7", "unit": "" },
  //         { "color": "green", "name": "环比", "value": "9.12", "unit": "%" },
  //         { "color": "default", "name": "本年累计", "value": "6467.7", "unit": "" },
  //         { "color": "red", "name": "同比", "value": "-1.59", "unit": "%" }
  //       ]
  //     },
  //     "setting": {
  //       "title": "预警设置",
  //       "area":{"proId": "111","proName": "全国", "cityId": "-1","cityName": "全国"},
  //       "list": [
  //         { "type":"max","indexType":"Month","digit":"0","id": "Month_max", "name": "本月值高于", "value": "10", "unit": "户" },
  //         { "type":"max","indexType":"Year","digit":"1","id": "Year_max", "name": "本年累计高于", "value": "10.5", "unit": "户" },
  //         { "type":"max","indexType":"date","digit":"2","id": "date_max", "name": "日期高于", "value": "10.25", "unit": "%"},
  //         { "type":"min","indexType":"date","digit":"2","id": "date_min", "name": "日期低于", "value": "16.32", "unit": "%"},
  //         { "type":"min","indexType":"Month","digit":"0","id": "Month_min", "name": "本月值低于", "value": "18", "unit": "户" },
  //         { "type":"min","indexType":"Year","digit":"1","id": "Year_min", "name": "本年累计低于", "value": "18.5", "unit": "户" },
  //       ]
  //     }
  //   };
  //   resolve(resData)
  // })
}

// 请求保存预警接口
export async function querySaveWarningData(params) {
 // console.log(params);
  return request(`${Url.urls[44].url}/saveWarning`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     "status":"success" ,
  //     "message":"保存成功,等待调接口:)"
  //   };
  //   resolve(resData)
  // })
}

// 请求添加预警地域接口
export async function queryWarningConfigAreaData(params) {
  return request(`${Url.urls[44].url}/area`, {
    method: 'POST',
    body: params,
  });
}

// 请求我的预警数字接口
export async function queryWarningNumber(params) {
  return request(`${Url.urls[44].url}/warningNumber`, {
    method: 'POST',
    body: params,
  });
}
