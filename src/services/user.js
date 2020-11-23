/* eslint-disable prefer-template */
import request from '@/utils/request';
import Url from '@/services/urls.json';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryMenuData(params) {
  return request(Url.urls[0].url+'/HomePage/nav', {
    method: 'POST',
    body: params,
  });
}

export async function queryTitleData(params) {
  return request(Url.urls[0].url+'/HomePage/titleList', {
    method: 'POST',
    body: params,
  });
}

export async function queryHelpData() {
  return request(Url.urls[24].url+'/documentData', {
    method: 'POST',
  });
}

export async function queryMenuLog() {
  return request(Url.urls[27].url, {
    method: 'POST',
  });
}

export async function queryReportTableLog() {
  return request(Url.urls[27].url+"/reportTable/reportTableLog", {
    method: 'POST',
  });
}

export async function querySpecialReportLog() {
  return request(Url.urls[27].url+"/specialReport/specialReportLog", {
    method: 'POST',
  });
}
