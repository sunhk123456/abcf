import request from '@/utils/request';
import Url from '@/services/urls.json';

export async function fetchReportPreview(params={}) {
  return request(`${Url.urls[0].url}/HomePage/reportSearch`,{
    method: 'POST',
    body: params,
  });
}

// 获取我的报告
export async function fetchMyReport(params={}) {
  return request(`${Url.urls[31].url}/pptReport/findMyReport`,{
    method: 'POST',
    body: params,
  });
}

// 新增报告
export async function fetchAddMyReport(params) {
  return request(`${Url.urls[31].url}/pptReport/addMyReport`,{
    method: 'POST',
    body: params,
  });
}

// 删除报告
export async function fetchDeleteMyReport(params) {
  return request(`${Url.urls[31].url}/pptReport/deleteMyReport`,{
    method: 'POST',
    body: params,
  });
}

// 修改报告
export async function fetchUpdateMyReport(params) {
  return request(`${Url.urls[31].url}/pptReport/modifyMyReport`,{
    method: 'POST',
    body: params,
  });
}

// 预览报告
export async function fetchOnlineViewReport(params) {
  return request(`${Url.urls[10].url}/pptReport/onlineView`,{
    method: 'POST',
    body: params,
  });
}

// 请求我的报告页签数据
export async function fetchReportModuleData(params) {
  return request(`${Url.urls[8].url}/pptReport/reportModule`,{
    method: 'POST',
    body: params,
  });
}
