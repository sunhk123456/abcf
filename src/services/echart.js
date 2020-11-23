/**
 * @Description: echart图api
 *
 * @author: liuxiuqian
 *
 * @date: 2019/1/29
 */
import request from '@/utils/request';
import Url from '@/services/urls.json';

// 当日趋势图请求
export  async function dayTrendEchartFetch(params = {}) {
  return request( `${Url.urls[2].url}/indexDetails/dayTrend`,{
    method: 'POST',
    body: params,
  });
}

// buzhidao
export  async function aaaa(params = {}) {
  return request( `${Url.urls[0].url}/indexDetails/dayTrend`,{
    method: 'POST',
    body: params,
  });
}
