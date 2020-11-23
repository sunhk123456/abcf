/**
 * Created by wangxue on 2019/1/21.
 */

import request from '@/utils/request';
import Url from '@/services/urls.json';

// 产品分析弹出层 矩形树状图
export  async function productTreeMap(params = {}) {
  return request( `${Url.urls[20].url}/productTreeMap`,{
    method: 'POST',
    body: params,
  });
}
// 产品分析弹出层 产品排名柱状图
export  async function productRanking(params = {}) {
  return request( `${Url.urls[20].url}/productRanking`,{
    method: 'POST',
    body: params,
  });
}
// 产品分析弹出层 地域分布图
export  async function provinceBar(params = {}) {
  return request( `${Url.urls[20].url}/provinceBar`,{
    method: 'POST',
    body: params,
  });
}
// 产品分析弹出层 时间趋势图
export  async function productTimeLine(params = {}) {
  return request( `${Url.urls[20].url}/productTimeLine`,{
    method: 'POST',
    body: params,
  });
}
// 产品分析弹出层 时间趋势图
export  async function infoTable(params = {}) {
  return request( `${Url.urls[20].url}/infoTable`,{
    method: 'POST',
    body: params,
  });
}
// 产品分析弹出层 图表类型
export  async function chartTypes(params = {}) {
  return request( `${Url.urls[20].url}/chartTypes`,{
    method: 'POST',
    body: params,
  });
}

