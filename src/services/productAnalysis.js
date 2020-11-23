/**
 * Created by xingxiaodong on 2019/1/18.
 */

import request from '@/utils/request';
import Url from '@/services/urls.json';

// 如果请求为单个的话添加default  默认导出
 async function productAnalysisTableData(
      params = {
        "markType":"PRODUCT_YD",
        "provId":"",
        "cityId":"",
        "date":"2018-12",
        "productCategory":"-1",
        "productSeries":"-1",
        "indexType":"tm"
      }
) {
      return request(`${Url.urls[20].url}/tableData`, {
        method: 'POST',
        body: params,
      })
}
async function productAnalysisProductScreen(
  params = {
    "markType":"PRODUCT_YD"
  }
) {
  return request(`${Url.urls[20].url}/condition`, {
    method: 'POST',
    body: params,
  })
}
async function productAnalysisMaxData(
  params = {
    "markType":"PRODUCT_YD"
  }
) {
  return request(`${Url.urls[20].url}/maxDate`, {
    method: 'POST',
    body: params,
  })
}
export {productAnalysisTableData,productAnalysisProductScreen,productAnalysisMaxData}



