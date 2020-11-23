 import request from '../utils/request';
 import Url from '@/services/urls.json';

// 请求图表类型和指标维度接口 fetchChartTypeData
export async function fetchChartTypeData (params) {
  return request(`${Url.urls[34].url}/chartType`,{
    body:params,
    method:"POST"
  });
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData ={
  //     "data":[
  //       {"type":"area",
  //         "typeId":"typeIdx",
  //         "name":"用户群",
  //         "ord":"1",
  //         "span":"2"
  //       },
  //         {"type":"bar",
  //           "typeId":"typeIda",
  //           "name":"用户群",
  //           "ord":"1",
  //           "span":"2"
  //         },
  //         {
  //           "type":"bar",
  //           "typeId":"typeIdb",
  //           "name":"收入",
  //           "ord":"2",
  //           "span":"2"
  //         },
  //         {"type":"bar",
  //           "typeId":"typeIdc",
  //           "name":"产品",
  //           "ord":"3",
  //           "span":"2"
  //         },
  //         {
  //           "type":"bar",
  //           "typeId":"typeIdd",
  //           "name":"渠道",
  //           "ord":"4",
  //           "span":"3"
  //         }
  //       ],
  //     "code":"200",
  //     "message":"成功"
  //   };
  //   resolve(resData)
  // })
}

// 用户群数据
export async function fetchBarData (params) {
  return request(`${Url.urls[51].url}/conditionChart`,{
    body:params,
    method:"POST"
  });
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData ={
  //     "data":{
  //       "title":"出账分析用户群people",
  //       "chartType": "people",
  //       "chartX":["2G","3G","4G","5G"],
  //       "chart": [
  //         {
  //           "name":"出账分析用户群people",
  //           "type":"bar",
  //           "unit":"万元",
  //           "value":["-10,855.09","4,277.53","1,486.41","72.89"]
  //         },
  //         {
  //           "name":"出账分析用户群people",
  //           "type":"percent",
  //           "unit":"%",
  //           "value":["-10,855.09","4,277.53","1,486.41","72.89"]
  //         },
  //         {
  //           "name":"出账分析用户群people",
  //           "type":"id",
  //           "unit":"",
  //           "value":["01","02","03","04"]
  //         }
  //       ],
  //       "subtitle":"(万元/累计值)",
  //       "desc":"joker方面:主要由于山东河北出账收入下降影响"
  //     },
  //     "code":"200",
  //     "message":"成功"
  //   };
  //   resolve(resData)
  // })
}


// 地域分布图
export async function fetchAreaData (params) {
  return request(`${Url.urls[51].url}/arealDistribution`,{
    body:params,
    method:"POST"
  });
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData = {"data":{
  //       "chartType":"area",
  //       "proId":"jijijm",
  //       "cityId":"dwdwd",
  //       "chart":{
  //         "title":"计费收入业务结构",
  //         "chartX":[
  //           {
  //             id: "beijing",
  //             name: "北京"
  //           },
  //           {
  //             id: "dea",
  //             name: "天津"
  //           },
  //           {
  //             id: "feas",
  //             name: "河北"
  //           },
  //
  //           {
  //             id: "dwaxs",
  //             name: "辽宁"
  //           },
  //         ],
  //         "totalData": ["480", "440", "222", "946", "485", "296", "-1070", "804", "469","480", "440", "222", "946", "485", "296", "-1070", "804", "469","480", "440", "222", "946", "485", "296", "-1070", "804", "469", "296", "-1070", "804", "469"],
  //         "percentData":["12","92","12","1","12","12","12","12", "24","12","92","12","1","12","12","12","12", "24","12","92","12","1","12","12","12","12", "24","12","12","12", "24"],
  //         "totalDataUnit":"万元",
  //         "percentDataUnit":"%",
  //         "totalDataAverage":"500",
  //         "percentDataAverage":"30",
  //         "example": ["累计值","累计环比"]
  //       },
  //       "desc":"地域方面：主要由于山东河北出账收入下降影响"
  //     },
  //     "code":"200",
  //     "message":"成功"
  //   };
  //   resolve(resData)
  // })
}

