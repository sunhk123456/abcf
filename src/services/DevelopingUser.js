import request from '../utils/request';
import Url from '@/services/urls.json'

export async function queryIndexDetailsData(params) {
  return request(`${Url.urls[15].url}/specialReport/indicatorsDetail`,{
    method:'POST',
    body:params,
  });
}

export async function queryMaxDate(params) {
  return request(`${Url.urls[21].url}/maxDate`,{
    method:'POST',
    body:params,
  });
}

export async function queryIndexType(params) {
  return request(`${Url.urls[21].url}/condition`,{
    method:'POST',
    body:params,
  });
}

export async function queryTableData(params) {
  return request(`${Url.urls[21].url}/tableData`,{
    method:'POST',
    body:params,
  });
}

export async function queryRegionalBarData(params) {
  return request(`${Url.urls[21].url}/provinceBarData`,{
    method:'POST',
    body:params,
  });
}

export async function queryLineTableData(params) {
  return request(`${Url.urls[21].url}/provinceLineData`,{
    method:'POST',
    body:params,
  });
}
export async function iceTable(params) {
  return request(`${Url.urls[27].url}/iceCreamRoamTable`,{
    method:'POST',
    body:params,
  });
}
