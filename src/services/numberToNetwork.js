import request from '../utils/request';
import Url from '@/services/urls.json'

export default async function queryTitleData(params) {
  return request(`${Url.urls[37].url}/title`,{
    method:'POST',
    body:params,
  });
}



