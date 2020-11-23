/**
 * @Description: 日志文件接口
 *
 * @author: liuxiuqian
 *
 * @date: 2019/4/2
 */

import request from '../utils/request';
import Url from '@/services/urls.json';

// 菜单日志统计
export async function queryMenuLog(params) {
  return request(`${Url.urls[29].url}/menuLog`,{
    method: 'POST',
    body: params,
  });
};

// 专题日志
export async function querySpecialReportLog(params) {
  return request(`${Url.urls[29].url}/specialReportLog`,{
    method: 'POST',
    body: params,
  });
};

// 报表日志
export async function queryReportTableLog(params) {
  return request(`${Url.urls[29].url}/reportTableLog`,{
    method: 'POST',
    body: params,
  });
};

// 其他日志
export async function queryOther(params) {
  return request(`${Url.urls[29].url}/otherLog`,{
    method: 'POST',
    body: params,
  });
};

// 指标日志接口
export async function queryIndexDetails(params) {
  return request(`${Url.urls[29].url}/indexDetails`,{
    method: 'POST',
    body: params,
  });
};
