import request from '../../utils/request';
import Url from '@/services/urls.json';

export async function queryTitleData(params) {
  return request(`${Url.urls[49].url}/moduleTab`, {
    method: 'POST',
    body: params,
  });

  // return new Promise((resolve)=>{
  //   const resData =  [
  //     {
  //       "moduleName": "总部应用",
  //       "moduleId": "111",
  //     },
  //     {
  //       "moduleName": "省分应用",
  //       "moduleId": "222",
  //     }
  //   ];
  //   resolve(resData)
  // })
}



// 账期
export async function requestSpecialMaxDate (params) {
  return request(`${Url.urls[49].url}/maxDate`,{
    body:params,
    method:"POST"
  });

  // return new Promise((resolve)=>{
  //   let resData = {date:"2020-04-22"};
  //   if(params.dateType==="M"){
  //     resData = {date:"2020-04"};
  //   }
  //   resolve(resData)
  // })
}

// querySearchData
export async function querySearchData (params) {
  return request(`${Url.urls[49].url}/indexConfig`,{
    body:params,
    method:"POST"
  })

  // return new Promise((resolve)=>{
  //   const resData = {
  //     "allIndex":[
  //       {
  //         "indexId": "id1",
  //         "indexName": "指标名称1"
  //       },
  //       {
  //         "indexId": "id2",
  //         "indexName": "指标名称2"
  //       },
  //       {
  //         "indexId": "id3",
  //         "indexName": "指标名称3"
  //       },
  //       {
  //         "indexId": "id4",
  //         "indexName": "指标名称4"
  //       }
  //     ],
  //     "selectIndex":[
  //       {
  //         "indexId": "id3",
  //         "indexName": "指标名称3"
  //       },
  //       {
  //         "indexId": "id4",
  //         "indexName": "指标名称4"
  //       }
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// queryIndexConfigSave
export async function queryIndexConfigSave (params) {
  return request(`${Url.urls[49].url}/saveIndexConfig`,{
    body:params,
    method:"POST"
  })

  // return new Promise((resolve)=>{
  //   const resData = {"code":"200","message":"保存成功"};
  //   resolve(resData)
  // })
}

// 请求我的专题接口
export async function queryMySpecialData(params) {
  return request(`${Url.urls[49].url}/mySpecial`, {
    method: 'POST',
    body: params,
  });

  // return new Promise((resolve)=>{
  //   const resData = [
  //     {"name":"专题18285","id":"ckp003","dateType":"M","specialType":"cockpit"},
  //     {"name":"专题2","id":"ckp004","dateType":"D","specialType":"table"},
  //     {"name":"专题3","id":"ckp005","dateType":"M","specialType":"table"}
  //   ];
  //   resolve(resData)
  // })
}

// 请求我的专题接口
export async function queryMySpecialMarkType(params) {
  return request(`${Url.urls[49].url}/fetchMarkType`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   resolve({markType:"测试_markType"})
  // })
}

// 删除我的专题接口
export async function queryDelete(params) {
  return request(`${Url.urls[49].url}/delete`, {
    method: 'POST',
    body: params,
  });
}

// 请求日月切换
export async function queryDayAndMonth(params) {
  return request(`${Url.urls[49].url}/dayAndMonth`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData={
  //     "switchable":"1",
  //     "list":[
  //       {"name":"日","id":"D"},
  //       {"name":"月","id":"M"},
  //     ],
  //     "selectId":"D"
  //   };
  //   resolve(resData)
  // })
}

// 请求表格数据参数
export async function queryTableData(params) {
  return request(`${Url.urls[49].url}/table`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData={
  //     "tableName":"services专题",
  //     "thData":[
  //       {"title":"指标s名称","id":"aa"},
  //       {"title":"单位","id":"bb"},
  //       {"title":"当日值","id":"cc"},
  //       {"title":"本月累计","id":"dd"},
  //       {"title":"同比","id":"ee"},
  //       {"title":"环比","id":"ff"}
  //     ],
  //     "tbodyData":[
  //       {
  //         "id":"ckp233", // 指标id
  //         "condition":{
  //           "date":"2020-04-01",
  //           "cityId":"012",
  //           "provId":"123"
  //         },
  //         "desc":"xxx",
  //         "aa": {"color":"defaule","isClick":"0","value":"移动业务计费收入"},
  //         "bb": {"color":"defaule","isClick":"0","value":"万元"},
  //         "cc": {"color":"defaule","isClick":"1","value":"1563.12"},
  //         "dd": {"color":"defaule","isClick":"1","value":"1563.12"},
  //         "ee": {"color":"red","isClick":"1","value":"12%"},
  //         "ff": {"color":"green","isClick":"1","value":"-12%"},
  //       },
  //       {
  //         "id":"ckp213", // 指标id
  //         "condition":{
  //           "date":"2020-04-01",
  //           "cityId":"042",
  //           "provId":"123"
  //         },
  //         "desc":"xxx",
  //         "aa": {"color":"defaule","isClick":"0","value":params.provId},
  //         "bb": {"color":"defaule","isClick":"0","value":params.date},
  //         "cc": {"color":"defaule","isClick":"1","value":"1563.12"},
  //         "dd": {"color":"defaule","isClick":"1","value":"1563.12"},
  //         "ee": {"color":"red","isClick":"1","value":"12%"},
  //         "ff": {"color":"green","isClick":"1","value":"-12%"},
  //       },
  //     ]
  //   };
  //   resolve(resData)
  // })
}



// 请求表格型专题时间趋势图数据
export async function queryTableTimeEchartData (params) {
  return request(`${Url.urls[49].url}/tableTimeEchart`,{
    body:params,
    method:"POST"
  })
  // console.log(111,"请求表格型专题时间趋势图数据");
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData = {
  //     'title': '全国合计时间趋势图',
  //     'example': ['本年累计值'],
  //     'chartX': ['201803', '201804', '201805', '201806', '201807'],
  //     'chartList': [
  //       {
  //         'id': 'cc',
  //         'chart': ['201803', '201804', '201805', '201806', '201807'],
  //       },
  //       {
  //         'id': 'dd',
  //         'chart': ['201803', '201804', '201805', '201806', '201807'],
  //       },
  //       {
  //         'id': 'ee',
  //         'chart': ['201803', '201804', '201805', '201806', '201807'],
  //       },
  //       {
  //         'id': 'ff',
  //         'chart': ['201803', '201804', '201805', '201806', '201807'],
  //       },
  //     ],
  //
  //     'unit': '万元',
  //     'xName': '账期',
  //     'yName': '出账用户数',
  //     'tableDataList': [
  //       {
  //         'id': 'cc',
  //         'tableData': {
  //           'thData': ['日期', '本年累计值'],
  //           'tbodyData': [
  //             { 'date': '7月', 'value': '22' },
  //             { 'date': '7月', 'value': '22' },
  //             { 'date': '7月', 'value': 'cc' },
  //           ],
  //         },
  //       },
  //       {
  //         'id': 'dd',
  //         'tableData': {
  //           'thData': ['日期', '本年累计值'],
  //           'tbodyData': [
  //             { 'date': '7月', 'value': '22' },
  //             { 'date': '7月', 'value': '22' },
  //             { 'date': '7月', 'value': 'dd' },
  //           ],
  //         },
  //       },
  //       {
  //         'id': 'ee',
  //         'tableData': {
  //           'thData': ['日期', '本年累计值'],
  //           'tbodyData': [
  //             { 'date': '7月', 'value': '22' },
  //             { 'date': '7月', 'value': '22' },
  //             { 'date': '7月', 'value': 'ee' },
  //           ],
  //         },
  //       },
  //       {
  //         'id': 'ff',
  //         'tableData': {
  //           'thData': ['日期', '本年累计值'],
  //           'tbodyData': [
  //             { 'date': '7月', 'value': '22' },
  //             { 'date': '7月', 'value': '22' },
  //             { 'date': '7月', 'value': 'ff' },
  //           ],
  //         },
  //       },
  //     ],
  //   };
  //   resolve(resData)
  // })
}

// 请求表格型专题地域柱状图数据
export async function queryTableAreaEchartData (params) {
  return request(`${Url.urls[49].url}/tableArea`,{
    body:params,
    method:"POST"
  })
  // console.log(222,"请求表格型专题地域柱状图数据");
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData =  {
  //     "title":"",
  //     "xName":"sddd",
  //     "yName":"sddd",
  //     "chartX":["201803", "201804", "201805", "201806", "201807", "201808"],
  //     "chartList":[
  //       {
  //         "id":"cc",
  //         "chart":[{
  //           "name":"移网",
  //           "value":["11","754","467","754","467","754",],
  //           "unit":"家庭数",
  //           "type":"bar"
  //         }]
  //       },
  //       {
  //         "id":"dd",
  //         "chart":[{
  //           "name":"移网",
  //           "value":["22","754","467","754","467","754",],
  //           "unit":"家庭数",
  //           "type":"bar"
  //         }]
  //       },
  //       {
  //         "id":"ee",
  //         "chart":[{
  //           "name":"移网",
  //           "value":["33","754","467","754","467","754",],
  //           "unit":"家庭数",
  //           "type":"bar"
  //         }]
  //       },
  //       {
  //         "id":"ff",
  //         "chart":[{
  //           "name":"移网",
  //           "value":["44","754","467","754","467","754",],
  //           "unit":"家庭数",
  //           "type":"bar"
  //         }]
  //       }
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// 点击保存专题按钮
export async function querySaveSpecial (params) {
  return request(`${Url.urls[49].url}/saveSpecialName`,{
    body:params,
    method:"POST"
  })
}
