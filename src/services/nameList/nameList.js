// import request from '../../utils/request';
// import Url from '@/services/urls.json';
import { echartsMapJson } from '@/services/webSocketUrl';

export async function queryHeaderData(params) {
  // return request(`${Url.urls[49].url}/moduleTab`, {
  //   method: 'POST',
  //   body: params,
  // });
  console.log('queryHeader',params);
  return new Promise((resolve)=>{
    const resData =  {
      "title":"名单制客户收入分析",
      "header":[
        {
          "list":[
            {"name":"2020年1-3月收入","value":"1,202,301","unit":"万元"},
            {"name":"同比增幅","value":"-8.36","unit":"%"}
          ],
          "desc":""
        },
        {
          "list":[
            {"name":"名单制客户","value":"258","unit":""}
          ],
          "desc":""
        },
        {
          "list":[
            {"name":"归集政企客户","value":"2,188,393","unit":""},
            {"name":"归集政企客户","value":"12,831","unit":""}
          ],
          "desc":"全部/本月"
        },
        {
          "list":[
            {"name":"收入指标","value":"132.03","unit":"%"}
          ],
          "desc":"按月分解完成"
        }
      ]
    };
    resolve(resData)
  })
}
//  最大账期
export async function queryMaxDate(params) {
  console.log(params);
  // return request(`${Url.urls[49].url}/moduleTab`, {
  //   method: 'POST',
  //   body: params,
  // });
  return new Promise((resolve)=>{
    const resData =  { "date":"2020-05-25" };
    resolve(resData)
  })
}

//  筛选条件
export async function queryCondition(params) {
  // return request(`${Url.urls[49].url}/moduleTab`, {
  //   method: 'POST',
  //   body: params,
  // });
  console.log('condition',params);
  return new Promise((resolve)=>{
    const resData =  [
      {
        "type":"industry",
        "selectList":[
          {"id":"01","name":"a行业"},
          {"id":"02","name":"b行业"},
          {"id":"03","name":"c行业"},
          {"id":"04","name":"d行业"}
        ]
      },
      {
        "type":"business",
        "selectList":[
          {
            "id":"01",
            "name":"a行业",
            "selectList":[
              {"id":"11","name":"aa行业"},
              {"id":"12","name":"ab行业"},
              {"id":"13","name":"ac行业"},
            ]
          },
          {
            "id":"02",
            "name":"b行业",
            "selectList":[
              {"id":"21","name":"ba行业"},
              {"id":"22","name":"bb行业"},
              {"id":"23","name":"bc行业"},
            ]
          },
          {
            "id":"03",
            "name":"c行业",
            "selectList":[
              {"id":"31","name":"ca行业"},
              {"id":"32","name":"cb行业"},
              {"id":"33","name":"cc行业"},
            ]
          }
        ]
      }
    ];
    resolve(resData)
  })
}

// 地图数据接口
export async function queryMapValue(params) {
  console.log(params);
  // return request(`${Url.urls[43].url}/buildingMap`, {
  //   method: 'POST',
  //   body: params,
  // });
  return new Promise((resolve) => {
    const resData = {
      'data': [
        {
          'name': '金额',
          'id': 'money',
          'mapData': {"mapData":[{"showName":"山东","name":"山东","id":"017","value":"1,368.03"},{"showName":"河南","name":"河南","id":"076","value":"1,113.02"},{"showName":"河北","name":"河北","id":"018","value":"888.95"},{"showName":"辽宁","name":"辽宁","id":"091","value":"585.29"},{"showName":"山西","name":"山西","id":"019","value":"461.00"},{"showName":"北京","name":"北京","id":"011","value":"388.42"},{"showName":"黑龙江","name":"黑龙江","id":"097","value":"342.76"},{"showName":"广东","name":"广东","id":"051","value":"309.38"},{"showName":"湖南","name":"湖南","id":"074","value":"302.77"},{"showName":"吉林","name":"吉林","id":"090","value":"287.05"},{"showName":"天津","name":"天津","id":"013","value":"285.89"},{"showName":"内蒙古","name":"内蒙古","id":"010","value":"281.08"},{"showName":"湖北","name":"湖北","id":"071","value":"197.30"},{"showName":"福建","name":"福建","id":"038","value":"197.23"},{"showName":"江苏","name":"江苏","id":"034","value":"173.44"},{"showName":"浙江","name":"浙江","id":"036","value":"161.31"},{"showName":"重庆","name":"重庆","id":"083","value":"144.26"},{"showName":"安徽","name":"安徽","id":"030","value":"140.94"},{"showName":"四川","name":"四川","id":"081","value":"133.97"},{"showName":"贵州","name":"贵州","id":"085","value":"120.88"},{"showName":"云南","name":"云南","id":"086","value":"117.82"},{"showName":"陕西","name":"陕西","id":"084","value":"113.07"},{"showName":"广西","name":"广西","id":"059","value":"98.39"},{"showName":"江西","name":"江西","id":"075","value":"74.92"},{"showName":"上海","name":"上海","id":"031","value":"61.13"},{"showName":"新疆","name":"新疆","id":"089","value":"44.68"},{"showName":"海南","name":"海南","id":"050","value":"34.06"},{"showName":"青海","name":"青海","id":"070","value":"28.38"},{"showName":"甘肃","name":"甘肃","id":"087","value":"16.69"},{"showName":"宁夏","name":"宁夏","id":"088","value":"9.32"},{"showName":"西藏","name":"西藏","id":"079","value":"1.71"}],"unit":"万户","provName":"全国","cityName":"全国","allValue":"8,483.13","power":"all","cityId":"-1","title":"宽带整体情况","provId":"111"}
        },
        {
          'name': '同比',
          'id': 'yoy',
          'mapData': {
            'title': '各省转交楼宇数量分布',
            'allValue': '2305',
            'power': 'specialCity',
            'provId': '011',
            'cityId': '012',
            'provName': '全国',
            'cityName': '全国',
            'unit': '',
            'mapData': [{
              'name': '北京',
              'id': '011',
              'showName': '北京',
              'value': '300',
            },
              {
                'name': '天津',
                'showName': '北京',
                'id': '012',
                'value': '289',

              },
              {
                'name': '上海',
                'showName': '北京',
                'id': '013',
                'value': '270',
              },
            ],
          },
        }],
      'code': '200',
      'message': '成功',
    };
    resolve(resData);
  });
}

// 地图接口
export async function queryMap(params) {
  return fetch(`${echartsMapJson}/${params}.json`)
  .then(response => response.json())
  .catch(e => {console.log('error', e);});
}

// 折线图数据接口
export async function queryLineChartData(params) {
  console.log(params);
  // return request(`${Url.urls[43].url}/buildingMap`, {
  //   method: 'POST',
  //   body: params,
  // });
  return new Promise((resolve) => {
    const resData = {
      'data': [{
        "name": "金额",
        "id": "money",
        "chartData": {
          "title": "单宽,融合家庭数量对比",
          "xName":"账期",
          "yName":"单位：万元",
          "chartX": ["1月", "2月","3月","4月","5月", "6月","7月","8月","9月", "10月","11月","12月"],
          "chart": [{
            "name": "2019年",
            "value": ["267", "554","334","888","267", "554","334","888","267", "554","334","888"],
            "unit": "万元",
            "type": "line"
          },{
            "name": "2020年",
            "value": ["","","","467", "754","444","821"],
            "unit": "万元",
            "type": "line"
          }]
        }
      },
        {
          "name": "同比",
          "id": "yoy",
          "chartData": {
            "title": "单宽,融合家庭数量对比yoy",
            "xName":"账期",
            "yName":"单位：万元",
            "chartX": ["1月", "2月","3月","4月","5月", "6月","7月","8月","9月", "10月","11月","12月"],
            "chart": [{
              "name": "yoy2019年",
              "value": ["267", "554","334","888","267", "554","334","888","267", "554","334","888"],
              "unit": "万元",
              "type": "line"
            },{
              "name": "yoy2020年",
              "value": ["","","","467", "754","444","821"],
              "unit": "万元",
              "type": "line"
            }]
          }
        }
      ],
      'code': '200',
      'message': '成功',
    };
    resolve(resData);
  });
}

// queryPieData 请求饼图数据
export async function queryPieData(params) {
  console.log(params);
  // return request(`${Url.urls[43].url}/buildingMap`, {
  //   method: 'POST',
  //   body: params,
  // });
  return new Promise((resolve) => {
    const resData = {
      'data':{

        "title": "5G终端NR登网情况",
        "chartX": ["联通", "移动", "电信"],
        "chart": [{
          "unit": "台",
          "name": "5G终端NR登网情况",
          "type": "pie",
          "value": [{
            "data": "456,45",
            "id": "012",
            "percent": "45.23",
            "percentUnit": "%"
          },
            {
              "data": "456,45",
              "id": "013",
              "percent": "45.23",
              "percentUnit": "%"
            },
            {
              "data": "456,45",
              "id": "014",
              "percent": "45.23",
              "percentUnit": "%"
            }
          ]
        }]
      },
      'code': '200',
      'message': '成功',
    };
    resolve(resData);
  });
}

// queryNameListTableData
// queryPieData 请求饼图数据
export async function queryNameListTableData(params) {
  console.log(params);
  // return request(`http://192.168.31.114:9010/mock/5ecf5c40369c103623430f78/dw3/table`, {
  //   method: 'POST',
  //   body: params,
  // });
  return new Promise((resolve) => {
    const resData = {
      'data':{

        "title":"12",
        "thData": [],
        "tbodyData": [],
        "total": "15",
        "currentPage": "1",
        "totalPage": "0",
      },
      'code': '200',
      'message': '成功',
    };
    resolve(resData);
  });
}
