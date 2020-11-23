/**
 * @date: 2019/9/12
 * @author 风信子
 * @Description:  小智接口Api
 */

import request from '@/utils/request';
import Url from '@/services/urls.json';

// 常见问题
export async function queryFaqs(params) {
  return request(`${Url.urls[35].url}/faqs`, {
    method: 'POST',
    body: params,
  });
}

// 小智请求接口
export async function queryQuestion(params) {
  return request(`${Url.urls[35].url}/question`, {
    method: 'POST',
    body: params,
  });
}

// 问题分类
export async function queryQuestionType(params) {
  return request(`${Url.urls[35].url}/questionType`, {
    method: 'POST',
    body: params,
  });
}

// 获取问题分类及各分类下的数据列表
export async function queryTypeList(params) {
  return request(`${Url.urls[35].url}/typeList`, {
    method: 'POST',
    body: params,
  });
}
// 开启新一轮会话
export async function queryConversation(params) {
  return request(`${Url.urls[35].url}/conversation`, {
    method: 'POST',
    body: params,
  });
}
