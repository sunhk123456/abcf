/* eslint-disable import/prefer-default-export */
import request from '../../utils/request';
import Url from '@/services/urls.json';

export async function fakerIceCream(params) {
  return request('/api/IceCream/fetchFakerTable', {
    method: 'POST',
    body: params,
  });
}
export async function iceTable(params) {
  return request(`${Url.urls[28].url}/iceCreamRoamTable`,{
    method:'POST',
    body:params,
  });
}
export async function queryMaxDate(params) {
  return request(`${Url.urls[28].url}/maxDate`,{
    method:'POST',
    body:params,
  });
}
export async function queryLineTableData(params) {
  return request(`${Url.urls[28].url}/iceLineData`,{
    method:'POST',
    body:params,
  });
}
export async function queryRegionalBarData(params) {
  return request(`${Url.urls[28].url}/provinceBarData`,{
    method:'POST',
    body:params,
  });
}
