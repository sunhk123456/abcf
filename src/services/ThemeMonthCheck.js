/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: ThemeMonthCheck/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author wangxue
 * @date 2019/3/2/002
 */
import request from '@/utils/request';
import Url from '@/services/urls.json';

// 月报考核 分项对标 指标
export  async function markData(params = {}) {
  return request( `${Url.urls[26].url}/indexName`,{
    method: 'POST',
    body: params,
  });
}
// 月报考核 分项对标
export  async function targetDetail(params = {}) {
  return request(`${Url.urls[26].url}/targetDetail`, {
    method: 'POST',
    body: params,
  });
}
  // 月报考核 最大账期
  export  async function currentDate(params = {}) {
    return request( `${Url.urls[26].url}/currentDate`,{
      method: 'POST',
      body: params,
    });
}
// 月报考核 省份总分数排名
export  async function provTotalRanking(params = {}) {
  return request( `${Url.urls[26].url}/provTotalRanking`,{
    method: 'POST',
    body: params,
  });
}
// 月报考核 省份分项排名分数
export  async function provItemRanking(params = {}) {
  return request( `${Url.urls[26].url}/provItemRanking`,{
    method: 'POST',
    body: params,
  });
}
