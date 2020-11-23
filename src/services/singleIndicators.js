/**
 * Created by xingxiaodong on 2019/2/18.
 */

import request from '@/utils/request';
import Url from '@/services/urls.json';

// 如果请求为单个的话添加default  默认导出
async function trendConditionData(
  params = {
    "markType":"016"
  }
) {
  return request(`${Url.urls[17].url}/trendCondition`, {
    method: 'POST',
    body: params,
  })
}
async function indexListData(
  params = {
    markType: "016",
    search:""
  }
) {
  return request(`${Url.urls[17].url}/indexList`, {
    method: 'POST',
    body: params,
  })
}
async function tableData(
  params = {}
) {
  return request(`${Url.urls[17].url}/indexDataTable`, {
    method: 'POST',
    body: params,
  })
}
async function echartsData(
  params = {}
) {
  return request(`${Url.urls[17].url}/provinceTrend`, {
    method: 'POST',
    body: params,
  })
}
export {trendConditionData,indexListData,echartsData,tableData}



