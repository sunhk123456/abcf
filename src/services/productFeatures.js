import request from '../utils/request';
import Url from '@/services/urls.json';

// 1.出账收入频次图接口
export async function productFeaturesLineBarEchart(params) {
  return request(`${Url.urls[32].url}/barLineEchart`,{
    method:'POST',
    body:params,
  });
}

// 2. 出账收入变化分布
export async function productFeaturesTwoLineEchart(params) {
  return request(`${Url.urls[32].url}/twoLineEchart`,{
    method:'POST',
    body:params,
  });
}
// 3.流量频次图
export async function productFeaturesFlowFrequency(params) {
  return request(`${Url.urls[32].url}/timeEchart`,{
    method:'POST',
    body:params,
  });
}
// 4.语音频次图
export async function productFeaturesVoiceFrequency(params) {
  return request(`${Url.urls[32].url}/timeEchart`,{
    method:'POST',
    body:params,
  });
}
// 5.合计趋势图
export async function productFeaturesTotalTrend(params) {
  return request(`${Url.urls[32].url}/timeEchart`,{
    method:'POST',
    body:params,
  });
}
// 6.合计地域分布图
export async function productFeaturesTotalArea(params) {
  return request(`${Url.urls[32].url}/areaEchart`,{
    method:'POST',
    body:params,
  });
}
// 7.渠道分布图
export async function productFeaturesChannelEchart(params) {
  return request(`${Url.urls[32].url}/barEchart`,{
    method:'POST',
    body:params,
  });
}
// 8.客户分布图
export async function productFeaturesPeopleEchart(params) {
  return request(`${Url.urls[32].url}/barEchart`,{
    method:'POST',
    body:params,
  });
}

// 9.发展质量表格
export async function productFeaturesDevelopTable(params) {
  return request(`${Url.urls[32].url}/developTable`,{
    method:'POST',
    body:params,
  });
}

// productFeaturesBasicInfoData
export async function productFeaturesBasicInfoData(params) {
  return request(`${Url.urls[32].url}/basicInfo`,{
    method:'POST',
    body:params,
  });
}





