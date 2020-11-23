import request from '../utils/request';
import Url from '@/services/urls.json'

// 1.指标类型筛选条件接口
export async function queryProductViewArea(params) {
  return request(`${Url.urls[32].url}/area`,{
    method:'POST',
    body:params,
  });
}

// 1.指标类型筛选条件接口
export async function queryProductViewCondition(params) {
  return request(`${Url.urls[32].url}/condition`,{
    method:'POST',
    body:params,
  });
}

// 指标配置接口
export async function queryIndexConfig(params) {
  return request(`${Url.urls[32].url}/indexConfig`,{
    method:'POST',
    body:params,
  });
}

// 最大账期接口
export async function queryProductViewMaxDate(params) {
  return request(`${Url.urls[32].url}/maxDate`,{
    method:'POST',
    body:params,
  });
}

// 产品名称提示
export async function queryProductNameHint(params) {
  return request(`${Url.urls[32].url}/productNameHint`,{
    method:'POST',
    body:params,
  });
}

// 查询验证接口
export async function queryVerification(params) {
  return request(`${Url.urls[32].url}/verification`,{
    method:'POST',
    body:params,
  });
}


// 如果请求为单个的话添加default  默认导出
export async function productViewTimeChart(
  params
) {
  return request(`${Url.urls[32].url}/timeEchart`, {
    method: 'POST',
    body: params,
  })
}

export async function productViewAreaChart(
  params
) {
  return request(`${Url.urls[32].url}/areaEchart`, {
    method: 'POST',
    body: params,
  })
}

export async function productViewPieChart(
  params
) {
  return request(`${Url.urls[32].url}/pieEchart`, {
    method: 'POST',
    body: params,
  })
}

export async function productViewFlowBarChart(
  params
) {
  return request(`${Url.urls[32].url}/barEchart`, {
    method: 'POST',
    body: params,
  })
}

export async function productViewTerminalBarChart(
  params
) {
  return request(`${Url.urls[32].url}/barEchart`, {
    method: 'POST',
    body: params,
  })
}

export async function productViewChannelBarChart(
  params
) {
  return request(`${Url.urls[32].url}/barEchart`, {
    method: 'POST',
    body: params,
  })
}

export async function productViewPeopleBarChart(
  params
) {
  return request(`${Url.urls[32].url}/barEchart`, {
    method: 'POST',
    body: params,
  })
}

export async function productViewTableChart(
  params
) {
  return request(`${Url.urls[32].url}/tableEchart`, {
    method: 'POST',
    body: params,
  })
}

// 表格接口
export async function queryProductViewTable(params) {
  return request(`${Url.urls[32].url}/productTable`,{
    method:'POST',
    body:params,
  });
}


