/**
 * @date: 2019/6/13
 * @author 风信子
 * @Description: 渠道专题的services
 */

import request from "../utils/request";
import Url from '@/services/urls.json'

// 账期接口
export async function queryBuildingViewDate(params) {
  return request(`${Url.urls[39].url}/maxDate`,{
    method:'POST',
    body:params,
  });
}

// 筛选条件接口
export async function queryBuildingViewCondition(params) {
  return request(`${Url.urls[39].url}/userTypeAndNumber`,{
    method:'POST',
    body:params,
  });
}
// 表格接口
export async function queryBuildingViewTable(params) {
  return request(`${Url.urls[39].url}/dataTable`,{
    method:'POST',
    body:params,
  });
}

// 时间趋势图接口
export async function queryBuildingViewTimeEchart(params) {
  return request(`${Url.urls[39].url}/timeEchart`,{
    method:'POST',
    body:params,
  });
}

// 地域分布图接口
export async function queryBuildingViewAreaEchart(params) {
  return request(`${Url.urls[39].url}/areaEchart`,{
    method:'POST',
    body:params,
  });
}

// 增存量图接口
export async function queryRaiseStock(params) {
  return request(`${Url.urls[39].url}/raiseStock`,{
    method:'POST',
    body:params,
  });
}

// echart类型判断接口
export async function queryEchartType(params) {
  return request(`${Url.urls[39].url}/chartTypes`,{
    method:'POST',
    body:params,
  });
}

// 产品结构/客户分布情况/行业分布接口
export async function queryProductMixOrOthers(params) {
  return request(`${Url.urls[39].url}/productMixOrOthers`,{
    method:'POST',
    body:params,
  });
}

// top10
export async function queryTopTen(params) {
  return request(`${Url.urls[39].url}/topTen`,{
    method:'POST',
    body:params,
  });
}
