import request from '../../utils/request';
import Url from '@/services/urls.json';

// 请求搜索验证家庭id表格
export async function querySearchData(params) {
  return request(`${Url.urls[45].url}/search`, {
    method: 'POST',
    body: params,
  });
}

// 请求家庭基本信息数据
export async function queryUserInfoData(params) {
  return request(`${Url.urls[45].url}/userInfo`, {
    method: 'POST',
    body: params,
  });
}

// 请求语音特征堆叠柱状图数据
export async function queryStackBarData(params) {
   console.log(params);
  return request(`${Url.urls[45].url}/stackBar`, {
    method: 'POST',
    body: params,
  });
}

// 请求智能终端饼数据
export async function queryTreeMapData(params) {
  return request(`${Url.urls[45].url}/terminalPie`, {
    method: 'POST',
    body: params,
  });
}

// 消费构成饼图
export async function queryPieEchartsData(params) {
  return request(`${Url.urls[45].url}/barAndPie`, {
    method: 'POST',
    body: params,
  });
}

// 请求top10echartData
export async function queryTop10EchartData(params) {
  const p1= request(`${Url.urls[45].url}/top10Echart`,{
    method:'POST',
    body:params,
  });
  const p2= request(`${Url.urls[45].url}/terminalPie`,{
    method:'POST',
    body:params,
  });
  return Promise.all([p1, p2]).then((result) => result).catch(() => "error")
}

// 请求网络质量数据
export async function queryNetworkQualityData(params) {
  return request(`${Url.urls[45].url}/comparison`,{
    method:'POST',
    body:params,
  });
}

// 表格接口
export async function queryTableData(params) {
  return request(`${Url.urls[45].url}/table`, {
    method: 'POST',
    body: params,
  });
}
// b,o域表格
export async function queryRegionData(params) {
  return request(`${Url.urls[45].url}/table`, {
    method: 'POST',
    body: params,
  });
}

// 家庭产品信息表格
export async function queryHomeProductTableData(params) {
  return request(`${Url.urls[45].url}/table`, {
    method: 'POST',
    body: params,
  });
}

