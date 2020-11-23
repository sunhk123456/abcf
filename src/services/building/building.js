import request from '../../utils/request';
import Url from '@/services/urls.json';
import { echartsMapJson } from '@/services/webSocketUrl';

export async function queryMaxDate(params) {
  return request(`${Url.urls[38].url}/maxDate`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //       date:"2019-05"
  //   };
  //   resolve(resData)
  // })
}

export async function queryTableData(params) {
  return request(`${Url.urls[38].url}/table`,{
    method:'POST',
    body:params,
  });
}

// 漏斗图接口
export async function queryFunnelPlot(params) {
  return request(`${Url.urls[38].url}/funnelEchart`,{
    method: 'POST',
    body: params,
  });
}

// 总数据接口
export async function queryTotalData(params) {
  return request(`${Url.urls[38].url}/total`,{
    method: 'POST',
    body: params,
  });
}

export async function queryBarEchartData(params) {
  return request(`${Url.urls[38].url}/barEchart`,{
    method:'POST',
    body:params,
  });
}

export async function queryHouseIncomeData(params) {
  return request(`${Url.urls[38].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
}

export async function queryNewUserData(params) {
  return request(`${Url.urls[38].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
}

export async function queryNewIncomeData(params) {
  return request(`${Url.urls[38].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
}

export async function queryHouseIncomePopData(params) {
  return request(`${Url.urls[38].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
}

export async function queryNewUserPopData(params) {
  return request(`${Url.urls[38].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
  // return new Promise((resolve)=>{
  //   const resData={
  //     "title":"楼宇总收入TOP10",
  //     "unit":"万",
  //     "thData": [],
  //     "tbodyData":[
  //       {"id":"1","name":"万霖大厦","value":"1,230.7"},
  //       {"id":"2","name":"万霖大厦","value":"210.7"},
  //       {"id":"3","name":"万霖大厦","value":"200.7"},
  //       {"id":"4","name":"万霖大厦","value":"180.7"},
  //       {"id":"5","name":"万霖大厦","value":"150.7"},
  //       {"id":"6","name":"万霖大厦","value":"140.7"},
  //       {"id":"7","name":"万霖大厦","value":"130.7"},
  //       {"id":"8","name":"万霖大厦","value":"120.7"},
  //       {"id":"9","name":"万霖大厦","value":"110.7"},
  //       {"id":"10","name":"万霖大厦","value":"100.7"},
  //     ],
  //   };
  //   resolve(resData)
  // })
}

export async function queryNewIncomePopData(params) {
  return request(`${Url.urls[38].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
  // return new Promise((resolve)=>{
  //   const resData={
  //     "title":"楼宇总收入TOP10",
  //     "unit":"万",
  //     "thData": [],
  //     "tbodyData":[
  //       {"id":"1","name":"万霖大厦","value":"1,230.7"},
  //       {"id":"2","name":"万霖大厦","value":"210.7"},
  //       {"id":"3","name":"万霖大厦","value":"200.7"},
  //       {"id":"4","name":"万霖大厦","value":"180.7"},
  //       {"id":"5","name":"万霖大厦","value":"150.7"},
  //       {"id":"6","name":"万霖大厦","value":"140.7"},
  //       {"id":"7","name":"万霖大厦","value":"130.7"},
  //       {"id":"8","name":"万霖大厦","value":"120.7"},
  //       {"id":"9","name":"万霖大厦","value":"110.7"},
  //       {"id":"10","name":"万霖大厦","value":"100.7"},
  //     ],
  //   };
  //   resolve(resData)
  // })
}

// 弹出层表格接口
export async function queryPopupTable(params) {
  return request(`${Url.urls[38].url}/popupTable`,{
    method:'POST',
    body:params,
  });
}

// 地图数据接口
export async function queryMapValue(params) {
  return request(`${Url.urls[38].url}/buildingMap`, {
    method: 'POST',
    body: params,
  });
}
// arcgis地图接口
export async function queryArcgisData(params) {
  return request(`${Url.urls[38].url}/buildingMessage`,{
    method:'POST',
    body:params,
  });
}

// charts地图轮廓
// charts地图轮廓
export async function queryMap(params) {
  return fetch(`${echartsMapJson}/${params}.json`)
    .then(response=>response.json())
    .catch(e=>{console.log("error",e)})
}


