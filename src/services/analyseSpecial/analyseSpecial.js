/* eslint-disable import/prefer-default-export */
import request from "../../utils/request";
import Url from "@/services/urls.json";

export async function requestChartTypeData(params) {
  return request(`${Url.urls[34].url}/chartType`, {
          method: "POST",
          body: params,
        });
}
export async function requestStackBarData(params) {
  return request(`${Url.urls[34].url}/stackBar`, {
    method: "POST",
    body: params,
  });
  // console.log("请求堆叠柱状图接口的参数")
  // console.log(params)
  // const promise = new Promise((resolve) => {
  //     let chartData = {
  //       "title":"柱形堆积图",
  //       "chartX": ["2019年1月", "2019年02月",],
  //       "chart": [
  //         {
  //           name:"邮件营销",
  //           data:[ "230", "210"],
  //           "unit":"%"
  //         },
  //         {
  //           name:"联盟广告",
  //           data:[ "330", "1,310"],
  //           "unit":"%"
  //         },
  //         {
  //           name:"邮件营销1",
  //           data:[ "230", "210"],
  //           "unit":"%"
  //         },
  //         {
  //           name:"联盟广告1",
  //           data:[ "330", "310"],
  //           "unit":"%"
  //
  //         },
  //       ],
  //       "example": ["邮件营销","联盟广告","邮件营销1","联盟广告1"],
  //     }; // 堆叠柱状图数据
  //   if(params.typeId==="02"){
  //     chartData = {
  //       "title":"柱形堆积图02",
  //       "chartX": ["2019年1月", "2019年02月",],
  //       "chart": [
  //         {
  //           name:"邮件营销",
  //           data:[ "130", "210"],
  //           "unit":"%"
  //         },
  //         {
  //           name:"联盟广告",
  //           data:[ "130", "1,310"],
  //           "unit":"%"
  //         },
  //         {
  //           name:"邮件营销1",
  //           data:[ "230", "210"],
  //           "unit":"%"
  //         },
  //         {
  //           name:"联盟广告1",
  //           data:[ "330", "310"],
  //           "unit":"%"
  //
  //         },
  //       ],
  //       "example": ["邮件营销","联盟广告","邮件营销1","联盟广告1"],
  //     }; // 堆叠柱状图数据
  //   }
  //     resolve(chartData);
  // });
  // return promise;
}
export async function requestTimeEchart1Data(params) {
   return request(`${Url.urls[34].url}/timeEchart`, {
    // return request(`http://10.244.4.186:8987/analyseSpecial/timeEchart`, {
    // 10.244.4.186:8987
      method: "POST",
      body: params,
    });
}
export async function requestTimeEchart2Data(params) {
 // return request(`http://10.244.4.186:8987/analyseSpecial/timeEchart`, {
   return request(`${Url.urls[34].url}/timeEchart`, {
    method: "POST",
    body: params,
  });
}
export async function requestTimeEchart3Data(params) {
  // return request(`http://10.244.4.186:8987/analyseSpecial/timeEchart`, {
  return request(`${Url.urls[34].url}/timeEchart`, {
    method: "POST",
    body: params,
  });
}
export async function requestAreaEchart1Data(params) {
  return request(`${Url.urls[34].url}/barEchart`, {
    method: "POST",
    body: params,
  });
}
export async function requestAreaEchart2Data(params) {
  return request(`${Url.urls[34].url}/barEchart`, {
    method: "POST",
    body: params,
  });
}
export async function requestPieEchartData(params) {
  return request(`${Url.urls[34].url}/pieEchart`, {
    method: "POST",
    body: params,
  });
}
export async function requestPieEchart2Data(params) {
  return request(`${Url.urls[34].url}/pieEchart`, {
    method: "POST",
    body: params,
  });
}
export async function requestPieEchart3Data(params) {
  return request(`${Url.urls[34].url}/pieEchart`, {
    method: "POST",
    body: params,
  });
}
export async function requestTreeMapData(params) {
  return request(`${Url.urls[34].url}/treeMap`, {
    method: "POST",
    body: params,
  });
  // const promise = new Promise((resolve) => {
  //   const chartData = {
  //     "title":"树形图",
  //     "treeChart": [
  //       {
  //         "id": "1",
  //         "name": "6M≤速率<18M",
  //         "value": "2001",
  //         "example": "[10,20]"
  //       },
  //       {
  //         "id": "2",
  //         "name": "4M≤速率<10M ",
  //         "value": "8,001",
  //         "example": "[30,20]"
  //       },
  //       {
  //         "id": "3",
  //         "name": "1M≤速率<4M ",
  //         "value": "5001",
  //         "example": "[40,20]"
  //       }
  //     ],
  //     "itemName": "当期值",
  //     "unit": "万元"
  //   }; // 树形图
  //   resolve(chartData);
  // });
  // return promise;
}
export async function requestBarEchartData(params) {
  return request(`${Url.urls[34].url}/barEchart`, {
    method: "POST",
    body: params,
  });
}
export async function requestTop5Data(params) {

  return request(`${Url.urls[34].url}/top5`, {
    method: "POST",
    body: params,
  });
}
export async function requestTop10Data(params) {
  return request(`${Url.urls[34].url}/top10`, {
    method: "POST",
    body: params,
  });
}

/**
 * 下钻型表格接口
 * @param params
 * @returns {Promise.<void>}
 */
export async function drillDownTableData (params) {
  // const params={"markType":"TABLE3_TEST","dateType":"1",
  // "condition":[{"ACCT_DATE":[]},{"index_type":[]},{"PROV_ID":[]},{"AREA_NO":[]},{"ISSUE_TYPE":[]},{"KPI_CODE":[]}],
  // "token":"ST-1823-EyifhoZ2gz0RlWrJGnDr-cas.bonc.com.cn","userId":"48","isDrill":false};
  // return request("analyseSpecial/drillDownTableData",{
  return request(`${Url.urls[34].url}/drillDownTableData`,{
  // return request(`http://10.244.4.186:8886/analyseSpecial/drillDownTableData`,{
    body:params,
    method:"POST"
  })
}
export async function specailDesc (params) {
  return request(`${Url.urls[34].url}/title`,{
    body:params,
    method:"POST"
  })
}

// 表格一与表格二接口
export async function requestFoldTableData (params) {
  return request(`${Url.urls[34].url}/foldTableData`,{
    body:params,
    method:"POST"
  })
}

// // 筛选条件
export async function specialConditions (params) {
   return request(`${Url.urls[34].url}/conditions`,{
    // return request(`http://10.244.4.186:8886/analyseSpecial/conditions`,{
    body:params,
    method:"POST"
  })
}

// 筛选条件
// export async function specialConditions (params) {
//   return request(`/analyseSpecial/conditions`,{
//     body:params,
//     method:"POST"
//   })
// }

// 账期
export async function requestSpecialMaxDate (params) {
  return request(`${Url.urls[34].url}/maxDate`,{
    body:params,
    method:"POST"
  })
}

// 地域
export async function requestSpecialArea (params) {
  return request(`${Url.urls[34].url}/area`,{
    body:params,
    method:"POST"
  })
}

// 单个地域
export async function requestSpecialSingleRegion (params) {
  return request(`${Url.urls[34].url}/singleRegion`,{
    body:params,
    method:"POST"
  })
}

// 单个地域  单省份权限接口
export async function requestSpecialSinglesProvince (params) {
  return request(`${Url.urls[34].url}/singleProvince`,{
    body:params,
    method:"POST"
  })
}
