import request from '../utils/request';
import Url from '@/services/urls.json';

export async function querybenchmarkArea(params={}) {
  return request(`${Url.urls[30].url}/benchmarking/benchmarkArea`,{
    method: 'POST',
    body: params,
  });
}

export async function queryArea(params={}) {
  return request(`${Url.urls[30].url}/benchmarking/area`,{
    method: 'POST',
    body: params,
  });
}

export async function queryCompositeIndex(params={}) {
  return request(`${Url.urls[30].url}/transverseMarking2/compositeIndexList`,{
    method: 'POST',
    body: params,
  });
}

export async function queryMaxDate(params={}) {
  return request(`${Url.urls[30].url}/benchmarking/maxDate`,{
    method: 'POST',
    body: params,
  });
}

export async function queryTableData(params={}) {
  return request(`${Url.urls[30].url}/benchmarking/tableData`,{
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve, reject)=>{
  //   resolve({
  //     "thData": [{
  //       "name": ["省分"],
  //       "unit": ""
  //     }, {
  //       "name": ["移动主营业务收入", "环比", "排名", "同比", "排名", "值", "排名"],
  //       "unit": "万元"
  //     }, {
  //       "name": ["主营业务收入", "环比", "排名", "同比", "排名", "值", "排名"],
  //       "unit": "万元"
  //     }, {
  //       "name": ["固网主营业务收入", "环比", "排名", "同比", "排名", "值", "排名"],
  //       "unit": "万元"
  //     }],
  //     "tbodyData": [{
  //       "proId": "010",
  //       "proName": "内蒙古",
  //       "proSort": "06",
  //       "prov": "-1",
  //       "benchMarkingName": "比北京",
  //       "values": [{
  //         "itemUnit": "%",
  //         "indexId": "M_CKP_02",
  //         "benchMarkingValues": ["-27,817.54"],
  //         "items": ["28,219.87", "9.47", "11","-28,219.87", "9.47", "11","28,219.87", "9.47", "11"]
  //       }, {
  //         "itemUnit": "%",
  //         "indexId": "M_CKP_01",
  //         "benchMarkingValues": ["-149,226.08"],
  //         "items": ["59,696.83", "11.25", "12","28,219.87", "9.47", "-11","28,219.87", "9.47", "11"]
  //       }, {
  //         "itemUnit": "%",
  //         "indexId": "M_CKP_03",
  //         "benchMarkingValues": ["-119,150.39"],
  //         "items": ["31,169.53", "12.43", "17","28,219.87", "9.47", "11","28,219.87", "9.47", "11"]
  //       }]
  //     }, {
  //       "proId": "011",
  //       "proName": "北京",
  //       "proSort": "-10",
  //       "prov": "-1",
  //       "benchMarkingName": "",
  //       "values": [{
  //         "itemUnit": "%",
  //         "indexId": "M_CKP_02",
  //         "benchMarkingValues": ["-"],
  //         "items": ["56,037.41", "16.02", "5","28,219.87", "9.47", "11","28,219.87", "9.47", "11"]
  //       }, {
  //         "itemUnit": "%",
  //         "indexId": "M_CKP_01",
  //         "benchMarkingValues": ["-"],
  //         "items": ["208,922.91", "12.12", "11","28,219.87", "9.47", "11","28,219.87", "9.47", "11"]
  //       }, {
  //         "itemUnit": "%",
  //         "indexId": "M_CKP_03",
  //         "benchMarkingValues": ["-"],
  //         "items": ["150,319.92", "10.86", "20","28,219.87", "9.47", "11","28,219.87", "9.47", "11"]
  //       }]
  //     }, {
  //       "proId": "013",
  //       "proName": "天津",
  //       "proSort": "03",
  //       "prov": "-1",
  //       "benchMarkingName": "比北京",
  //       "values": [{
  //         "itemUnit": "%",
  //         "indexId": "M_CKP_02",
  //         "benchMarkingValues": ["-33,700.64"],
  //         "items": ["22,336.77", "9.30", "12","28,219.87", "9.47", "11","28,219.87", "9.47", "11"]
  //       }, {
  //         "itemUnit": "%",
  //         "indexId": "M_CKP_01",
  //         "benchMarkingValues": ["-148,798.38"],
  //         "items": ["60,124.53", "6.86", "21","28,219.87", "9.47", "11","28,219.87", "9.47", "11"]
  //       }, {
  //         "itemUnit": "%",
  //         "indexId": "M_CKP_03",
  //         "benchMarkingValues": ["-112,598.58"],
  //         "items": ["37,721.34", "5.48", "25","28,219.87", "9.47", "11","28,219.87", "9.47", "11"]
  //       }]
  //     }]
  //   })
  // })
}

export async function queryBenchmarkingTrend(params={}) {
  return request(`${Url.urls[30].url}/benchmarking/benchmarkingTrend`,{
    method: 'POST',
    body: params,
  });
}

export async function queryCompareTrend(params={}) {
  return request(`${Url.urls[30].url}/benchmarking/compareTrend`,{
    method: 'POST',
    body: params,
  });
}

export async function queryNameCheck(params={}) {
  return request(`${Url.urls[30].url}/transverseMarking1/nameCheck`,{
    method: 'POST',
    body: params,
  });
}
export async function querySaveModule(params={}) {
  return request(`${Url.urls[30].url}/transverseMarking1/saveModule`,{
    method: 'POST',
    body: params,
  });
}

export async function queryTemplatesTable(params={}) {
  return request(`${Url.urls[30].url}/transverseMarking1/templatesTable`,{
    method: 'POST',
    body: params,
  });
}

export async function queryTemplatesTableDelete(params={}) {
  return request(`${Url.urls[30].url}/transverseMarking1/templatesTableDelete`,{
    method: 'POST',
    body: params,
  });
}
