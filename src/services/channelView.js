/**
 * @date: 2019/6/13
 * @author 风信子
 * @Description: 渠道专题的services
 */

import request from "../utils/request";
import Url from '@/services/urls.json'

// 账期接口
export async function queryChannelViewDate(params) {
  return request(`${Url.urls[33].url}/maxDate`,{
    method:'POST',
    body:params,
  });
}

// 指标配置接口
export async function queryOverviewTabTable(params) {
  return request(`${Url.urls[33].url}/informationTable`,{
    method:'POST',
    body:params,
  });
}

// 渠道名称提示接口
export async function channelNameHint(params) {
  return request(`${Url.urls[33].url}/channelNameHint`,{
    method:'POST',
    body:params,
  });
}

// 查询验证接口
export async function checkChannel(params) {
  return request(`${Url.urls[33].url}/checkChannel`,{
    method:'POST',
    body:params,
  });
}

// 渠道评价渠道信息接口
export async function evaluationTable(params) {
  return request(`${Url.urls[33].url}/evaluationTable`,{
    method:'POST',
    body:params,
  });
}

// 业务指标渠道信息接口
export async function businessTableDay(params) {
  return request(`${Url.urls[33].url}/businessTableDay`,{
    method:'POST',
    body:params,
  });
}

// 全国合计时间趋势图
export async function queryOverviewTabTimeEchart(params) {
  return request(`${Url.urls[33].url}/timeEchart`,{
    method:'POST',
    body:params,
  });
}

// 全国合计地域分布图接口
export async function queryOverviewTabAreaEchart(params) {
  return request(`${Url.urls[33].url}/areaEchart`,{
    method:'POST',
    body:params,
  });
}

// 产品销售TOP5接口
export async function queryOverviewTabProductEchart(params) {
  return request(`${Url.urls[33].url}/productEchart`,{
    method:'POST',
    body:params,
  });
}

// 全国合计月出账收入业务构成图接口
export async function queryOverviewTabBusinessPie(params) {
  return request(`${Url.urls[33].url}/businessPie`,{
    method:'POST',
    body:params,
  });
}

// 模块切换组件接口
export async function queryChannelViewTab(params) {
  return request(`${Url.urls[33].url}/tab`,{
    method:'POST',
    body:params,
  });
}

// 渠道分类接口
export async function queryChannelViewChannelType(params) {
  return request(`${Url.urls[33].url}/channelType`,{
    method:'POST',
    body:params,
  });
}
