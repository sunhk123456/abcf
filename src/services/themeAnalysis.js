/**
 * Created by xingxiaodong on 2019/2/26.
 */

import request from '@/utils/request';
import Url from '@/services/urls.json';

// 如果请求为单个的话添加default  默认导出
async function themeAnalysisMaxDate(
  params
) {
  return request(`${Url.urls[12].url}/maxDate`, {
    method: 'POST',
    body: params,
  })
}

async function themeAnalysisChart(
  params
) {
  return request(`${Url.urls[12].url}/conditionChart`, {
    method: 'POST',
    body: params,
  })
}

async function themeAnalysisChartNet(
  params
) {
  return request(`${Url.urls[19].url}/conditionChart`, {
    method: 'POST',
    body: params,
  })
}

async function themeAnalysisAreaData(
  params
) {
  return request(`${Url.urls[12].url}/arealDistribution`, {
    method: 'POST',
    body: params,
  })
}

async function themeAnalysisAreaDataNet(
  params
) {
  return request(`${Url.urls[19].url}/arealDistribution`, {
    method: 'POST',
    body: params,
  })
}

async function themeAnalysisTimeData(
  params
) {
  return request(`${Url.urls[12].url}/thematicTimedata`, {
    method: 'POST',
    body: params,
  })
}

async function themeAnalysisTimeDataNet(
  params
) {
  return request(`${Url.urls[19].url}/thematicTimedata`, {
    method: 'POST',
    body: params,
  })
}

async function themeAnalysisTableData(params) {
  return request(`${Url.urls[12].url}/specialReportTable`, {
    method: 'POST',
    body: params,
  })
}

async function themeAnalysisTableDataNet(params) {
  return request(`${Url.urls[19].url}/specialReportTable`, {
    method: 'POST',
    body: params,
  })
}

export {
  themeAnalysisMaxDate,
  themeAnalysisChart,
  themeAnalysisChartNet,
  themeAnalysisAreaData,
  themeAnalysisAreaDataNet,
  themeAnalysisTimeData,
  themeAnalysisTimeDataNet,
  themeAnalysisTableData,
  themeAnalysisTableDataNet
}



