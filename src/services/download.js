/**
 * @Description: 下载services
 *
 * @author: liuxiuqian
 *
 * @date: 2019/3/6
 */

import request from '@/utils/request';
import Url from '@/services/urls.json';

// 下载当前接口
export  async function IEexcel(params = {}) {
  return request(`${Url.urls[7].url}/IEexcel`,{
    method: 'POST',
    body: params,
  });
}
// 政企楼宇弹出层接口
export async function getDownPath(params) {
  return request(`${Url.urls[7].url}/buildingDownload`, {
    method: 'POST',
    body: params,
  });
}

export  async function proCityData(params = {}) {
  return request(`${Url.urls[2].url}/area`,{
    method: 'POST',
    body: params,
  });
}
