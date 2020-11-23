import request from '../../utils/request';
import Url from '@/services/urls.json';
import { echartsMapJson } from '@/services/webSocketUrl';
// 请求最大账期
export async function queryMaxDate(params) {
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
  return request(`${Url.urls[41].url}/title`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     'titleName': '热门信息呈现',
  //     'list': [
  //       { 'id': '01', 'name': '5G和volte终端' },
  //       { 'id': '02', 'name': '联通终端' },
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// 请求联通终端-双卡终端卡槽占比数据
export async function queryTerminalProportion(params) {
  // console.log(params);
  return request(`${Url.urls[41].url}/pieEchart`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     'title':'双卡终端卡槽占比',
  //     'describe':'移根据从9月1日开始正式采集预装客户端的上报数据统计',
  //     "chartX":["电信主卡+移动副卡","移动主卡+空卡槽卡","双电信卡","移动主卡+空卡槽","移动主卡+空卡槽卡","双电信卡","移动主卡+空卡槽","电信主卡+移动副卡","移动主卡+空卡槽卡","双电信卡","电信主卡+移动副卡","移动主卡+空卡槽卡"],
  //     "chart":[
  //       {
  //         "name":"电信",
  //         "value":["-","754","-","-","154","323","35","23","135","-","223","-"],
  //         "unit":"%",
  //       }
  //     ]
  //   }
  //   resolve(resData)
  // })
}

// 热门终端销售top10
export async function queryTerminalSellData(params) {
  return request(`${Url.urls[41].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
  // return new Promise((resolve)=>{
  //   const resData={
  //     "title":"热门终端销售top10",
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

// 在用终端排行top10,
export async function queryTerminalRowData(params) {
  return request(`${Url.urls[41].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
}

// 换机终端流入top10
export async function queryTerminalInData(params) {
  return request(`${Url.urls[41].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
}

// 换机终端流出top10
export async function queryTerminalOutData(params) {
  return request(`${Url.urls[41].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
}

// 请求5G终端NR登网情况饼图数据
export async function queryTerminalNRData(params) {
  console.log(params);
  return request(`${Url.urls[41].url}/pieEchart`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     title:"5G终端NR登网情况",
  //     describe:"移根据从9月1日开始正式采集预装客户端的上报数据统计",
  //     chartX:[],
  //     chart:[
  //       {
  //         name:"",
  //         value:[
  //           {value:5500, name:'联通'},
  //           {value:2750, name:'移动'},
  //           {value:2750, name:'电信'},
  //         ],
  //         unit:"次",
  //       },
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// 请求5G终端类型分布饼图数据
export async function queryTerminalTypeData(params) {
  console.log(params);
  return request(`${Url.urls[41].url}/pieEchart`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     title:"5G终端类型分布",
  //     describe:"移根据从9月1日开始正式采集预装客户端的上报数据统计",
  //     chartX:[],
  //     chart:[
  //       {
  //         name:"",
  //         value:[
  //           {value:50, name:'水货'},
  //           {value:50, name:'行货'}
  //         ],
  //         unit:"%",
  //       },
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// 请求5G终端数量占比数据
export async function queryOnline5GData(params) {
  console.log(params);
  return request(`${Url.urls[41].url}/barEchart`, {
    method: 'POST',
    body: params,
  });
}

// 请求VoLTE终端相关信息图数据
export async function queryVolTETerminalData(params) {
  console.log(params);
  return request(`${Url.urls[41].url}/barEchart`, {
    method: 'POST',
    body: params,
  });
}


// 5G在网机型排名TOP10
export async function queryNetTypeRankData(params) {
  return request(`${Url.urls[41].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
}

// VoLTE终端打开开关机型排名TOP10
export async function queryTerminalOpenTypeRankData(params) {
  return request(`${Url.urls[41].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
}

// VoLTE终端未打开机型排名TOP10
export async function queryTerminalTypeRankData(params) {
  return request(`${Url.urls[41].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
}

// 联通终端（终端采购价格分布）;5G和volte终端（在网5G终端占比、VoLTE终端相关信息）接口
export async function queryBarEchart(params) {
  console.log(params);
  return request(`${Url.urls[41].url}/barEchart`,{
    method:'POST',
    body:params,
  });
}

// 矩形树图接口，包括联通终端：在用终端品牌占比 和 5G和volte终端：5G终端品牌分布
export async function queryTreeMap(params) {
  console.log(params);
  return request(`${Url.urls[41].url}/treeMap`,{
    method:'POST',
    body:params,
  });

}

// 地图数据接口
export async function queryMapValue(params) {
  return request(`${Url.urls[41].url}/buildingMap`, {
    method: 'POST',
    body: params,
  });
}
// 地图接口
// charts地图轮廓
export async function queryMap(params) {
  return fetch(`${echartsMapJson}/${params}.json`)
    .then(response=>response.json())
    .catch(e=>{console.log("error",e)})
}

