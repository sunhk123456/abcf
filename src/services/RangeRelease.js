import request from '../utils/request';
import Url from '@/services/urls.json'

// 查询指标表格数据
export async function queryIndexTableDate(params) {
  return request(`${Url.urls[24].url}/queryData`,{ // queryData
    method:'POST',
    body:params,
  });
}

// 修改指标账期接口
export async function updateIndexDate(params) {
  return request(`${Url.urls[24].url}/dateChange`,{
    method:'POST',
    body:params,
  });
}

// 更新专题账期接口
export async function updateSpecialDate(params) {
  return request(`${Url.urls[24].url}/subjectDateChange`,{
    method:'POST',
    body:params,
  });
}

// 查询专题账期接口
export async function querySpecialTableDate(params) {
  return request(`${Url.urls[24].url}/subjectQueryData`,{
    method:'POST',
    body:params,
  });
}

export async function querycheckboxList(params) {
  return request(`${Url.urls[24].url}/SpecialSelection`,{
    method:'POST',
    body:params,
  });
}
