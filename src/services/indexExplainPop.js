/*
* 指标解释弹窗组件内部请求
 */
import request from '../utils/request';
import Url from '@/services/urls.json';

// 专题的
export function indexDetail(params,moduleApi) {
  return request(`${Url.urls[15].url}/${moduleApi}/indicatorsDetail`, {
    method: 'POST',
    body: params,
  });
}

// 临时调试专用
export function noIndexDetail(params) {
  return request(`${Url.urls[49].url}/indicatorsDetail`, {
    method: 'POST',
    body: params,
  });
}

