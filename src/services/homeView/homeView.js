import request from '../../utils/request';
import Url from '@/services/urls.json';
import { echartsMapJson } from '@/services/webSocketUrl';

// 请求最大账期
export async function queryHomeViewArea(params) {
  // console.log(params);
  return request(`${Url.urls[43].url}/area`, {
    method: 'POST',
    body: params,
  });
}

// 请求最大账期
export async function queryMaxDate(params) {
  // console.log(params);
  return request(`${Url.urls[38].url}/maxDate`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //       date:"2019-12"
  //   };
  //   resolve(resData)
  // })
}

// 请求页签数据
export async function queryTitleData(params) {
  // console.log(params);
  return request(`${Url.urls[43].url}/title`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     'titleName': '家庭视图',
  //     'list': [
  //       { 'id': '01', 'name': '全部家庭' },
  //       { 'id': '02', 'name': '8省市拉通' },
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// 请求家庭数量分布时间折线图数据
export async function queryHomeNumTimeLineData(params) {
  return request(`${Url.urls[43].url}/lineAndBar`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     title:"家庭数量分布时间趋势图",
  //     chartX:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  //     xName: '月份',
  //     yName: '(家庭数)',
  //     chart:[
  //       {
  //         name:"(家庭数)",
  //         value:["50","360","115","258","140","50","57","162","329","269","123","48",],
  //         unit:"户",
  //         type:"line"
  //       },
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// 请求24小时上网分布折线图数据
export async function queryOnline24HourData(params) {
  return request(`${Url.urls[43].url}/bar8Echart`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     title:"家庭数量分布时间趋势图",
  //     chartX:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"],
  //     xName: '',
  //     yName: '',
  //     chart:[
  //       {
  //         name:"",
  //         value:["50","55","60","65","70","80","90","100","120","140","160","190","200","180","160","120","100","120","140","170","200","160","120","80"],
  //         unit:"",
  //         type:"line"
  //       },
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// 请求全部家庭的饼图
export async function queryHomePies(params) {
  return request(`${Url.urls[43].url}/allHomePies`, {
    method: 'POST',
    body: params,
  });
}
// 请求8通的饼图
export async function query8Pies(params) {
  return request(`${Url.urls[43].url}/pie8Echart`, {
    method: 'POST',
    body: params,
  });
}

// 分速率家庭数量接口
export async function queryTreeMapData(params) {
  return request(`${Url.urls[43].url}/treeMap`,{
    method:'POST',
    body:params,
  });
}

//  筛选条件
export async function queryUserTypeAndCityType(params) {
  return request(`${Url.urls[43].url}/userTypeAndCityType`,{
    method:'POST',
    body:params,
  });
}

export async function queryLineData(params) {
  return request(`${Url.urls[43].url}/allHomeLines`,{
    method:'POST',
    body:params,
  });
}

// 请求top10echartData
export async function queryTop10EchartData(params) {
  // console.log(params);
  return request(`${Url.urls[43].url}/top10Echart`,{
    method:'POST',
    body:params,
  });

  // return new Promise((resolve)=>{
  //   const resData = {
  //     'title': '楼宇总收入TOP10',
  //     'unit': '万',
  //     'thData': [],
  //     'tbodyData': [
  //       { 'id': '1', 'name': '万霖大厦1', 'value': '230.7' },
  //       { 'id': '2', 'name': '万霖大厦2', 'value': '210.7' },
  //       { 'id': '3', 'name': '万霖大厦3', 'value': '200.7' },
  //       { 'id': '4', 'name': '万霖大厦4', 'value': '180.7' },
  //       { 'id': '5', 'name': '万霖大厦5', 'value': '150.7' },
  //       { 'id': '6', 'name': '万霖大厦', 'value': '140.7' },
  //       { 'id': '7', 'name': '万霖大厦', 'value': '130.7' },
  //       { 'id': '8', 'name': '万霖大厦', 'value': '120.7' },
  //       { 'id': '9', 'name': '万霖大厦', 'value': '110.7' },
  //       { 'id': '11', 'name': '万霖大厦', 'value': '100.7' },
  //     ],
  //   };
  //   resolve(resData)
  // })
}

// 请求上网速率 queryInternetSpeedData
export async function queryInternetSpeedData(params) {
  return request(`${Url.urls[43].url}/bar8Echart`,{
    method:'POST',
    body:params,
  });
}

// 地图数据接口
export async function queryMapValue(params) {
  return request(`${Url.urls[43].url}/buildingMap`, {
    method: 'POST',
    body: params,
  });
}
// 地图接口
export  async function queryMap(params) {
  return fetch(`${echartsMapJson}/${params}.json`)
    .then(response=>response.json())
    .catch(e=>{console.log("error",e)})
}

// 新增离网家庭用户地域分布
export async function queryHomeUserBarData(params) {
  return request(`${Url.urls[43].url}/areaBar`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     title:"家庭数量分布时间趋势图",
  //     chartX:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  //     xName: '月份',
  //     yName: '(家庭数)',
  //     chart:[
  //       {
  //         name:"(家庭数)",
  //         value:["50","360","115","258","140","50","57","162","329","269","123","48",],
  //         unit:"户",
  //         type:"line"
  //       },
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// 趸交非趸交地域分布
export async function queryStackBarData(params) {
  return request(`${Url.urls[43].url}/areaBar`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     title:"家庭数量分布时间趋势图",
  //     chartX:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  //     xName: '月份',
  //     yName: '(家庭数)',
  //     chart:[
  //       {
  //         name:"(家庭数)",
  //         value:["50","360","115","258","140","50","57","162","329","269","123","48",],
  //         unit:"户",
  //         type:"line"
  //       },
  //     ]
  //   };
  //   resolve(resData)
  // })
}



