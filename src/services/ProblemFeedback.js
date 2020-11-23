import request from '../utils/request';
import Url from '@/services/urls.json'

export async function queryUserTable(params) {
  return request(`${Url.urls[25].url}/userTable`,{
    method:'POST',
    body:params,
  });
}
export async function queryUserTable1(params) {
  return request(`${Url.urls[25].url}/userTable`,{
    method:'POST',
    body:params,
  });
}

