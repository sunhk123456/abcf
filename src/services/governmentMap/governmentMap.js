import request from '../../utils/request';
import Url from '@/services/urls.json';
import { echartsMapJson } from '@/services/webSocketUrl';

export async function queryMaxDate(params) {
  return request(`${Url.urls[42].url}/maxDate`, {
    method: 'POST',
    body: params,
  });
}

export async function queryIndexListData(params) {
  return request(`${Url.urls[42].url}/indexList`,{
    method:'POST',
    body:params,
  });
}

// 地图数据接口
export async function queryGovernMapValue(params) {
  return request(`${Url.urls[42].url}/buildingMap`, {
    method: 'POST',
    body: params,
  });
}

// charts地图轮廓
export async function queryMap(params) {
 return fetch(`${echartsMapJson}/${params}.json`)
    .then(response=>response.json())
    .catch(e=>{console.log("error",e)})
}


