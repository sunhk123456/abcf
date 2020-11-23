/* eslint-disable import/prefer-default-export,import/newline-after-import,prefer-template,no-unused-vars */
// import { stringify } from 'qs';
import request from '../../utils/request';
import Url from '@/services/urls.json';
export async function province(params) {
  return request(`${Url.urls[1].url}/specialReport/area`,{
    method: 'POST',
    body: params,
  });
}
export async function maxDate(params) {
  return request(`${Url.urls[1].url}/specialReport/maxDate`, {
    method: 'POST',
    body: params,
  });
}
export async function buttonsCondition(params) {
  return request(`${Url.urls[1].url}/specialReport/screenCondition`, {
    method: 'POST',
    body: params,
  });
}
export async function specialReportTable(params) {
  return request(`${Url.urls[1].url}/specialReport/specialReportTable`, {
    method: 'POST',
    body: params,
  });
}
export async function moduleTab(params) {
  return request(`${Url.urls[1].url}/specialReport/moduleTab`, {
    method: 'POST',
    body: params,
  });
}
export async function indexDetail(params) {
  return request(`${Url.urls[15].url}/specialReport/indicatorsDetail`, {
    method: 'POST',
    body: params,
  });
}
export async function fakerDownArrow(params) {
  return request('api/downArrow/fetchFakerDownArrowData', {
    method: 'POST',
    body: params,
  });
}
export async function fakerDownArrow1(params) {
  return request('api/downArrow/fetchFakerDownArrowData1', {
    method: 'POST',
    body: params,
  });
}
export async function downArrow(params) {
  return request(`${Url.urls[1].url}/specialReport/downArrowTableData`, {
    method: 'POST',
    body: params,
  });
}
