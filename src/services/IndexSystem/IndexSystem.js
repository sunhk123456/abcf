/* eslint-disable import/prefer-default-export,import/newline-after-import,prefer-template,no-unused-vars */
// import { stringify } from 'qs';
import request from '../../utils/request';
import Url from '@/services/urls.json';
export async function leftTree(params) {
  return request(`${Url.urls[23].url}/indexNavData`, {
    method: 'POST',
    body: params,
  });
}

export async function versionSelect(params) {
  return request(`${Url.urls[23].url}/version`, {
    method: 'POST',
    body: params,
  });
}

export async function tableData(params) {
  return request(`${Url.urls[23].url}/tableData`, {
    method: 'POST',
    body: params,
  });
}

export async function getIndexNav(params) {
  return request(`${Url.urls[23].url}/getIndexNav`, {
    method: 'POST',
    body: params,
  });
}

export async function indexInfo(params) {
  return request(`${Url.urls[23].url}/indexInfo`, {
    method: 'POST',
    body: params,
  });
}
