/* eslint-disable prefer-template */
import request from '@/utils/request';
import Url from '@/services/urls.json';
import { echartsMapJson } from '@/services/webSocketUrl';

export  async function queryModuleData(params) {
  return request(Url.urls[5].url+"/moduleTab",{
    method: 'POST',
    body: params,
  });

}
export  async function queryMaxDate(params) {
  return request(Url.urls[5].url+"/maxDate",{
    method: 'POST',
    body: params,
  });
}
export  async function queryMapAndBar(params) {
  return request(Url.urls[5].url+"/billingRevenue",{
    method: 'POST',
    body: params,
  });
}
export  async function queryIndexList(params) {
  return request(Url.urls[5].url+"/indexList",{
    method: 'POST',
    body: params,
  });
}
export  async function queryMixEcharts(params) {
  return request(Url.urls[5].url+"/mixEcharts",{
    method: 'POST',
    body: params,
  });
}
export  async function queryLineChart(params) {
  return request(Url.urls[5].url+"/LineChart",{
    method: 'POST',
    body: params,
  });
}
export  async function queryGaugeCharts(params) {
  return request(Url.urls[5].url+"/gaugeCharts",{
    method: 'POST',
    body: params,
  });
}
export  async function queryMapData(params) {
  return fetch(`${echartsMapJson}/${params.mapName}.json`)
    .then(response=>response.json())
    .catch(e=>{console.log("error",e)})
  // return request(Url.urls[5].url+"/mapData",{
  // // return request("http:dayOverview//10.244.4.185:8065//mapData",{
  //   method: 'POST',
  //   body: params,
  // });
}
export  async function querySpecialAuthentication(params) {
  return request(Url.urls[3].url+"/specialAuthentication",{
    method: 'POST',
    body: params,
  });
}

