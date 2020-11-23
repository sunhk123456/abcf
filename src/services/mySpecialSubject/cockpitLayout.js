/**
 * @Description: 驾驶舱
 *
 * @author: liuxiuqian
 *
 * @date: 2020/5/6
 */
import request from '../../utils/request';
import Url from '@/services/urls.json';

// 饼图接口
export async function queryPieEchart(params) {
  return request(`${Url.urls[49].url}/pieEchart`, {
    method: 'POST',
    body: params,
  });
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData={
  //     "isMinus":"0",
  //     "subtitle":"副标题",
  //     "title":"5G终端NR登网情况",
  //     "chartX":["联通","移动","xx","yy","zz"],
  //     "chart":[
  //       {"value":["5500","5500","145","5468","7895","4525"], "name":"5G终端NR登网情况", "unit":"","type":"bar"},
  //     ]};
  //   resolve(resData)
  // })
}
// 柱状图接口
export async function queryTimeEchartArea(params) {
  return request(`${Url.urls[49].url}/barEchart`, {
    method: 'POST',
    body: params,
  });
  // console.log(params);
  // if(params.chartType==='timeEchartLine'){
  //   return new Promise((resolve)=>{
  //     const resData={
  //       "subtitle":'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  //       "title":"隐隐约约",
  //       "xName":"sddd",
  //       "yName":params.chartType,
  //       "chartX":["北京","天津","河北","山西","内蒙古","辽宁","吉林","黑龙江","山东","河南","上海","江苏","浙江","安徽","福建","江西","湖北","湖南","广东","广西","海南","重庆","四川","贵州","云南","西藏","陕西","甘肃","青海","宁夏","新疆"],
  //       "chart":[{
  //         "unit":"万户",
  //         "name":"当日值",
  //         "type":"line",
  //         "value":["-98.82","-92.00","-45.51","-42.28","-27.42","-84.54","-86.77","-89.29","-58.10","-96.93","-88.12","-73.02","-91.33","-46.22","-91.04","-89.33","-6.89","-62.56","-96.43","-88.23","-42.86","-85.40","-83.79","-84.89","-67.54","-64.20","-50.21","-100.00","-19.48","-24.53","-69.84"]
  //       }]
  //     };
  //     resolve(resData)
  //   })
  // }
  // if(params.chartType==='area'){
  //   return new Promise((resolve)=>{
  //     const resData={
  //       "title":"地域",
  //       "xName":"sddd",
  //       "yName":params.chartType,
  //       "chartX":["北京","天津","河北","山西","内蒙古","辽宁","吉林","黑龙江","山东","河南","上海","江苏","浙江","安徽","福建","江西","湖北","湖南","广东","广西","海南","重庆","四川","贵州","云南","西藏","陕西","甘肃","青海","宁夏","新疆"],
  //       "chart":[{
  //         "unit":"万户",
  //         "name":"当日值",
  //         "type":"bar",
  //         "value":["-98.82","-92.00","-45.51","-42.28","-27.42","-84.54","-86.77","-89.29","-58.10","-96.93","-88.12","-73.02","-91.33","-46.22","-91.04","-89.33","-6.89","-62.56","-96.43","-88.23","-42.86","-85.40","-83.79","-84.89","-67.54","-64.20","-50.21","-100.00","-19.48","-24.53","-69.84"]
  //       }]
  //     };
  //     resolve(resData)
  //   })
  // }
  // return new Promise((resolve)=>{
  //   const resData={
  //     "title":"xx",
  //     "xName":"sddd",
  //     "yName":params.chartType,
  //     "chartX":["20200516","20200517","20200518","20200519","20200520","20200521","20200522","20200523","20200524","20200525","20200526","20200527","20200528","20200529","20200530","20200531","20200601","20200602","20200603","20200604","20200605","20200606","20200607","20200608","20200609","20200610","20200611","20200612","20200613","20200614"],
  //     "chart":[{
  //       "name":"移网",
  //       "value":["-69.92","-70.19","-70.13","-70.51","-70.64","-70.69","-70.77","-70.99","-72.35","-71.02","-70.84","-70.74","-70.78","-70.69","-71.34","-71.56","-63.55","-62.75","-65.32","-65.67","-68.39","-67.86","-68.36","-69.17","-69.53","-69.89","-70.00","-70.71","-71.36","-71.70"],
  //       "unit":"家庭数",
  //       "type":"line"
  //     }]
  //   };
  //   resolve(resData)
  // })
}
// 矩形树图接口
export async function queryTreeMap(params) {
  return request(`${Url.urls[49].url}/treeMap`, {
    method: 'POST',
    body: params,
  });
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData={
  //     "title":"在用终端品牌占比",
  //     "treeChart": [
  //     {
  //       "id": "1",
  //       "name": "华为荣耀20",
  //       "value": "5001"
  //     },
  //     {
  //       "id": "1",
  //       "name": "华为mate30",
  //       "value": "5001"
  //     },
  //     {
  //       "id": "1",
  //       "name": "vivo NEX",
  //       "value": "5001"
  //     }
  //   ],
  //   "unit": "条"
  // };
  //   resolve(resData)
  // })
}
// 指标检索弹窗指标数据接口
export async function queryIndexConfigEchart(params) {
  return request(`${Url.urls[49].url}/indexConfigEchart`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData=[
  //     {
  //       indexId: 'dsad',
  //       indexName: '移动业务计费收入'
  //     },
  //     {
  //       indexId: 'dqww',
  //       indexName: '移动业务网上用户'
  //     },
  //     {
  //       indexId: 'gtev',
  //       indexName: '移动业务净增网上用户'
  //     },
  //     {
  //       indexId: 'vgfdv',
  //       indexName: '移动业务计费收入'
  //     },
  //     {
  //       indexId: 'fr',
  //       indexName: '移动业务网上用户'
  //     },
  //     {
  //       indexId: 'kijh',
  //       indexName: '移动业务净增网上用户'
  //     },
  //     {
  //       indexId: 'nhjg',
  //       indexName: '移动业务计费收入'
  //     },
  //     {
  //       indexId: 'frvtd',
  //       indexName: '移动业务网上用户'
  //     },
  //     {
  //       indexId: 'njgfnh',
  //       indexName: '移动业务净增网上用户'
  //     },
  //     {
  //       indexId: 'gtrdgtdg',
  //       indexName: '移动业务计费收入'
  //     },
  //     {
  //       indexId: 'grgr',
  //       indexName: '移动业务网上用户'
  //     },
  //     {
  //       indexId: 'hyfby',
  //       indexName: '移动业务净增网上用户'
  //     },
  //   ];
  //   resolve(resData)
  // })
}
// 指标检索弹窗  日/月账期类型数据接口
export async function queryDayAndMonth(params) {
  return request(`${Url.urls[49].url}/dayAndMonth`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData={
  //     "switchable":"0",
  //     "list":[
  //       {"name":"日","id":"day"},
  //       {"name":"月","id":"month"},
  //     ],
  //     "selectId":"month"
  //   };
  //   resolve(resData)
  // })
}
// 指标维度配置弹窗  数据接口
export async function queryIndexDemension(params) {
  return request(`${Url.urls[49].url}/indexDemension`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData={
  //     "title":"指标配置",
  //     "indexType":[
  //       {"name":"当期值","id":"01"},
  //       {"name":"累计值","id":"02"}
  //     ],
  //     "demensionType":[
  //       {"name":"时间","id":"time","imgName":"iconTime.png"},
  //       {"name":"地域","id":"area","imgName":"iconArea.png"},
  //       {"name":"渠道类型","id":"channel","imgName":"iconChannel.png"},
  //       {"name":"产品类型","id":"product","imgName":"iconProduct.png"},
  //       {"name":"业务类型","id":"business","imgName":"iconBusiness.png"}
  //     ]
  //   };
  //   resolve(resData)
  // })
}
// 模板选择弹窗  数据接口
export async function queryChartType(params) {
  return request(`${Url.urls[49].url}/chartType`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData=["timeEchartLine.jpg","area.jpg","timeEchartArea.jpg","pieEchart.jpg","pieEchartRose.jpg","pieEchartBorder.jpg","treeMap.jpg"];
  //   resolve(resData)
  // })
}

// 布局接口
export async function queryLayout(params) {
  return request(`${Url.urls[49].url}/layout`, {
    method: 'POST',
    body: params,
  });
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData= [
  //
  //     [
  //       {
  //         "date":"2020-04-03",
  //         "provId":"全国",
  //         "cityId":"全国",
  //         "position":["1","1"],
  //         "span":"3",
  //         "indexId":"CKP001",
  //         "indexType":"01",
  //         "demensionType":"01",
  //         "chartType":"area",
  //         "markType":"xx",
  //         "dateType":"1"
  //       },
  //       {
  //         "date":"2020-04-03",
  //         "provId":"全国",
  //         "cityId":"全国",
  //         "position":["1","2"],
  //         "span":"3",
  //         "indexId":"CKP001",
  //         "indexType":"01",
  //         "demensionType":"01",
  //         "chartType":"timeEchartLine",
  //         "markType":"xx",
  //         "dateType":"1"
  //       }
  //     ],
  //     [{
  //       "date":"2020-04-03",
  //       "provId":"全国",
  //       "cityId":"全国",
  //       "position":["2","1"],
  //       "span":"6",
  //       "indexId":"CKP001",
  //       "indexType":"01",
  //       "demensionType":"01",
  //       "chartType":"timeEchartArea",
  //       "markType":"xx",
  //       "dateType":"1"
  //     }],
  //     [{
  //       "date":"2020-04-03",
  //       "provId":"全国",
  //       "cityId":"全国",
  //       "position":["3","1"],
  //       "span":"2",
  //       "indexId":"CKP001",
  //       "indexType":"01",
  //       "demensionType":"01",
  //       "chartType":"pieEchart",
  //       "markType":"xx",
  //       "dateType":"1"
  //     },{
  //       "date":"2020-04-03",
  //       "provId":"全国",
  //       "cityId":"全国",
  //       "position":["3","2"],
  //       "span":"2",
  //       "indexId":"CKP001",
  //       "indexType":"01",
  //       "demensionType":"01",
  //       "chartType":"pieEchartRose",
  //       "markType":"xx",
  //       "dateType":"1"
  //     },{
  //       "date":"2020-04-03",
  //       "provId":"全国",
  //       "cityId":"全国",
  //       "position":["3","3"],
  //       "span":"2",
  //       "indexId":"CKP001",
  //       "indexType":"01",
  //       "demensionType":"01",
  //       "chartType":"pieEchartBorder",
  //       "markType":"xx",
  //       "dateType":"1"
  //     }],
  //     [{
  //       "date":"2020-04-03",
  //       "provId":"全国",
  //       "cityId":"全国",
  //       "position":["4","1"],
  //       "span":"3",
  //       "indexId":"CKP001",
  //       "indexType":"01",
  //       "demensionType":"01",
  //       "chartType":"treeMap",
  //       "markType":"xx",
  //       "dateType":"1"
  //     },{
  //       "date":"2020-04-03",
  //       "provId":"全国",
  //       "cityId":"全国",
  //       "position":["4","2"],
  //       "span":"3",
  //       "indexId":"CKP001",
  //       "indexType":"01",
  //       "demensionType":"01",
  //       "chartType":"",
  //       "markType":"xx",
  //       "dateType":"1"
  //     }]
  //   ]
  //   resolve(resData)
  // })
}

// echart图专题指标维度配置保存接口
export async function queryIndexDemensionSave(params) {
  return request(`${Url.urls[49].url}/indexDemensionSave`, {
    method: 'POST',
    body: params,
  });
}

// 饼图接口
export async function queryAddLayout(params) {
  return request(`${Url.urls[49].url}/addLayout`, {
    method: 'POST',
    body: params,
  });
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData={
  //     "code":"200",
  //     "message":"添加成功"
  //   };
  //   resolve(resData)
  // })
}

// 删除单个图接口
export async function queryDeleteEchart(params) {
  return request(`${Url.urls[49].url}/deleteEchart`, {
    method: 'POST',
    body: params,
  });
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData={
  //     "code":"200",
  //     "message":"删除成功"
  //   };
  //   resolve(resData)
  // })
}
