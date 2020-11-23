import request from '../../utils/request';
import Url from '@/services/urls.json';


// 请求页签数据
export async function queryTitleData(params) {
  // return request(`${Url.urls[48].url}/moduleTab`, {
  //   method: 'POST',
  //   body: params,
  // });
  return new Promise((resolve)=>{
    const resData =  [
      {
        "moduleName": "总部应用",
        "moduleId": "111",
        "tabValue": [
          {
            "tabId": "2",
            "tabName": "专题"
          },
          {
            "tabId": "1",
            "tabName": "指标"
          },
          {
            "tabId": "3",
            "tabName": "报告"
          },
          {
            "tabId": "4",
            "tabName": "报表"
          },
          {
            "tabId": "5",
            "tabName": "其他"
          }
        ]
      },
      {
        "moduleName": "省分应用",
        "moduleId": "222",
        "tabValue": [
          {
            "tabId": "2",
            "tabName": "专题"
          },
          {
            "tabId": "1",
            "tabName": "指标"
          },
          {
            "tabId": "3",
            "tabName": "报告"
          },
          {
            "tabId": "4",
            "tabName": "报表"
          },
          {
            "tabId": "5",
            "tabName": "其他"
          }
        ]
      }
    ];
    resolve(resData)
  })
}

// 请求搜索数据接口
export  async function searchDataFetch(params = {}) {

  // return request( `${Url.urls[48].url}/collectionList`,{
  //   method: 'POST',
  //   body: params,
  // });





  let promise;
  if(params.searchType==="1"){
    // 指标
    promise= new Promise((resolve)=>{
      const resData =  {
        "currentPage": "1",
        "nextFlag": "0",
        "data": [
          {
            'date': '2019年09月16日'


            ,
            'showException': '0'


            ,
            'dataName': [
              '当日值',
              '本月累计',
              '日均环比',
              '累计同比',
            ]


            ,
            'title': '移动业务净增计费收入'


            ,

            'showEarlyWarning': '0'


            ,
            'markName': '指标'


            ,
            'markType': '1'


            ,
            'id': 'CKP_24456'


            ,
            'isPercentage': '0'


            ,
            'dimension': [
              {
                'date': ''
                ,
                'selectType': [
                  {
                    '1': [
                      '-1',
                    ],
                  },
                  {
                    '2': [
                      '-1',
                    ],
                  },
                  {
                    '3': [
                      '-1',
                    ],
                  },
                ]
                ,
                'cityId': '-1'
                ,
                'provId': '111',

              },
            ]


            ,
            'ord': '2'


            ,
            'area': '全国'


            ,
            'collectId': '002'


            ,
            'deleteDisplay': []


            ,
            'excepDiscription': ''


            ,
            'isCollect': '0'


            ,
            'dataValue': [
              '-859.74',
              '9,215.75',
              '85.95%',
              '278.40%',
            ]


            ,
            'url': '/indexDetails'


            ,
            'selectTypeDisplay': []


            ,
            'unit': '万元'


            ,
            'dayOrMonth': '日报'


            ,
            'chartType': 'product'


            ,


            'screenConditionTags': [
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '实体渠道',
                    'sid': '30AA',
                  },
                  {
                    'sname': '电子渠道',
                    'sid': '10AA',
                  },
                  {
                    'sname': '集团渠道',
                    'sid': '20AA',
                  },
                  {
                    'sname': '其他渠道',
                    'sid': '99AA',
                  },
                ],
                'screenTypeId': '1',
                'screenTypeName': '渠道类型',
              },
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '2I2C产品',
                    'sid': '01',
                  },
                  {
                    'sname': '冰淇淋套餐',
                    'sid': '02',
                  },
                  {
                    'sname': '流量王A套餐',
                    'sid': '03',
                  },
                  {
                    'sname': '日租卡',
                    'sid': '04',
                  },
                  {
                    'sname': '其他套餐',
                    'sid': '99',
                  },
                ],
                'screenTypeId': '2',
                'screenTypeName': '产品类型',
              },
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '5G业务',
                    'sid': '50AAAAAA',
                  },
                  {
                    'sname': '4G业务',
                    'sid': '40AAAAAA',
                  },
                  {
                    'sname': '3G业务',
                    'sid': '30AAAAAA',
                  },
                  {
                    'sname': '2G业务',
                    'sid': '20AAAAAA',
                  },
                  {
                    'sname': '其他业务',
                    'sid': '90AAAAAA',
                  },
                ],
                'screenTypeId': '3',
                'screenTypeName': '业务类型',
              },
            ]
            ,
            'isMinus': '1'


            ,


            'chart': [
              {
                'name': '2I2C产品'
                ,
                'value': '1,977.41'
                ,
                'percent': '11.95',

              },
              {
                'name': '冰淇淋套餐'
                ,
                'value': '8,525.81'
                ,
                'percent': '51.53',

              },
              {
                'name': '流量王A套餐'
                ,
                'value': '2,378.52'
                ,
                'percent': '14.37',

              },
              {
                'name': '日租卡'
                ,
                'value': '-161.78'
                ,
                'percent': '-0.98',

              },
              {
                'name': '其他套餐'
                ,
                'value': '-3,503.22'
                ,
                'percent': '-21.17',

              },

            ],

          },
          {
            'date': '2020年01月'


            ,
            'showException': '0'


            ,
            'dataName': [
              '当月值',
              '环比',
              '本年累计',
              '累计同比',
            ]


            ,
            'title': '5G终端用户DOU'


            ,

            'showEarlyWarning': '0'


            ,
            'markName': '指标'


            ,
            'markType': '1'


            ,
            'id': 'CKP_50526'


            ,
            'isPercentage': '0'


            ,
            'dimension': [
              {
                'date': ''
                ,
                'selectType': [
                  {
                    '1': [
                      '-1',
                    ],
                  },
                ]
                ,
                'cityId': '-1'
                ,
                'provId': '111',

              },
            ]


            ,
            'ord': '3'


            ,
            'area': '全国'


            ,
            'collectId': '003'


            ,
            'deleteDisplay': []


            ,
            'excepDiscription': ''


            ,
            'isCollect': '0'


            ,
            'dataValue': [
              '19,317.22GB/户',
              '-2.32%',
              '-',
              '-',
            ]


            ,
            'url': '/indexDetails'


            ,
            'selectTypeDisplay': []


            ,
            'unit': 'GB/户'


            ,
            'dayOrMonth': '月报'


            ,
            'chartType': 'monthBar'


            ,


            'screenConditionTags': [
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '实体渠道',
                    'sid': '30AA',
                  },
                  {
                    'sname': '电子渠道',
                    'sid': '10AA',
                  },
                  {
                    'sname': '集团渠道',
                    'sid': '20AA',
                  },
                  {
                    'sname': '其他渠道',
                    'sid': '99AA',
                  },
                ],
                'screenTypeId': '1',
                'screenTypeName': '渠道类型',
              },
            ]
            ,
            'isMinus': '0'


            ,


            'chart': [
              {
                'totalData': [
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '16,210.91',
                  '24,607.76',
                  '23,190.42',
                  '19,775.61',
                  '19,317.22',
                ],
                'YoYData': [
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                ],
                'sequentialData': [
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-7,814.06',
                  '-1,417.35',
                  '-3,414.81',
                  '-458.39',
                ],
                'title': '逐月趋势图'
                ,
                'chartX': [
                  '2月',
                  '3月',
                  '4月',
                  '5月',
                  '6月',
                  '7月',
                  '8月',
                  '9月',
                  '10月',
                  '11月',
                  '12月',
                  '1月',
                ],
                'example': [
                  '本月值',
                  '环比',
                  '同比',
                ],
              },

            ],

          },
          {
            'date': '2019年09月16日',
            'showException': '0',
            'dataName': [
              '当日值',
              '本月累计',
              '日均环比',
              '累计同比',
            ],
            'title': '移动业务户均计费收入',
            'showEarlyWarning': '0',
            'markName': '指标',
            'markType': '1',
            'id': 'CKP_24477',
            'isPercentage': '0',
            'dimension': [
              {
                'date': '',
                'selectType': [
                  { '1': ['-1'] },
                  { '2': ['-1'] },
                  { '3': ['-1'] }],
                'cityId': '-1',
                'provId': '111',
              }],
            'ord': '1',
            'area': '全国',
            'collectId': '005',
            'deleteDisplay': [],
            'excepDiscription': '',
            'isCollect': '0',
            'dataValue': ['1.43元/户', '40.84元/户', '0.08PP', '-1.42%'],
            'url': '/indexDetails',
            'selectTypeDisplay': [],
            'unit': '元/户',
            'dayOrMonth': '日报',
            'chartType': 'channel',
            'screenConditionTags': [
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '实体渠道',
                    'sid': '30AA',
                  },
                  {
                    'sname': '电子渠道',
                    'sid': '10AA',
                  },
                  {
                    'sname': '集团渠道',
                    'sid': '20AA',
                  },
                  {
                    'sname': '其他渠道',
                    'sid': '99AA',
                  },
                ],
                'screenTypeId': '1',
                'screenTypeName': '渠道类型',
              },
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '2I2C产品',
                    'sid': '01',
                  },
                  {
                    'sname': '冰淇淋套餐',
                    'sid': '02',
                  },
                  {
                    'sname': '流量王A套餐',
                    'sid': '03',
                  },
                  {
                    'sname': '日租卡',
                    'sid': '04',
                  },
                  {
                    'sname': '其他套餐',
                    'sid': '99',
                  },
                ],
                'screenTypeId': '2',
                'screenTypeName': '产品类型',
              },
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '5G业务',
                    'sid': '50AAAAAA',
                  },
                  {
                    'sname': '4G业务',
                    'sid': '40AAAAAA',
                  },
                  {
                    'sname': '3G业务',
                    'sid': '30AAAAAA',
                  },
                  {
                    'sname': '2G业务',
                    'sid': '20AAAAAA',
                  },
                  {
                    'sname': '其他业务',
                    'sid': '90AAAAAA',
                  },
                ],
                'screenTypeId': '3',
                'screenTypeName': '业务类型',
              },
            ],
            'isMinus': '0',
            'chart': [
              {
                'name': '实体渠道'
                ,
                'value': '42.65',

              },
              {
                'name': '电子渠道'
                ,
                'value': '29.96',

              },
              {
                'name': '集团渠道'
                ,
                'value': '49.30',

              },
              {
                'name': '其他渠道'
                ,
                'value': '26.46',

              },

            ],

          },
          {
            'date': '2019年09月16日'


            ,
            'showException': '0'


            ,
            'dataName': [
              '当日值',
              '本月累计',
              '日均环比',
              '累计同比',
            ]


            ,
            'title': '移动业务净增计费收入'


            ,

            'showEarlyWarning': '0'


            ,
            'markName': '指标'


            ,
            'markType': '1'


            ,
            'id': 'CKP_24457'


            ,
            'isPercentage': '0'


            ,
            'dimension': [
              {
                'date': ''
                ,
                'selectType': [
                  {
                    '1': [
                      '-1',
                    ],
                  },
                  {
                    '2': [
                      '-1',
                    ],
                  },
                  {
                    '3': [
                      '-1',
                    ],
                  },
                ]
                ,
                'cityId': '-1'
                ,
                'provId': '111',

              },
            ]


            ,
            'ord': '2'


            ,
            'area': '全国'


            ,
            'collectId': '006'


            ,
            'deleteDisplay': []


            ,
            'excepDiscription': ''


            ,
            'isCollect': '0'


            ,
            'dataValue': [
              '-859.74',
              '9,215.75',
              '85.95%',
              '278.40%',
            ]


            ,
            'url': '/indexDetails'


            ,
            'selectTypeDisplay': []


            ,
            'unit': '万元'


            ,
            'dayOrMonth': '日报'


            ,
            'chartType': 'product'


            ,


            'screenConditionTags': [
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '实体渠道',
                    'sid': '30AA',
                  },
                  {
                    'sname': '电子渠道',
                    'sid': '10AA',
                  },
                  {
                    'sname': '集团渠道',
                    'sid': '20AA',
                  },
                  {
                    'sname': '其他渠道',
                    'sid': '99AA',
                  },
                ],
                'screenTypeId': '1',
                'screenTypeName': '渠道类型',
              },
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '2I2C产品',
                    'sid': '01',
                  },
                  {
                    'sname': '冰淇淋套餐',
                    'sid': '02',
                  },
                  {
                    'sname': '流量王A套餐',
                    'sid': '03',
                  },
                  {
                    'sname': '日租卡',
                    'sid': '04',
                  },
                  {
                    'sname': '其他套餐',
                    'sid': '99',
                  },
                ],
                'screenTypeId': '2',
                'screenTypeName': '产品类型',
              },
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '5G业务',
                    'sid': '50AAAAAA',
                  },
                  {
                    'sname': '4G业务',
                    'sid': '40AAAAAA',
                  },
                  {
                    'sname': '3G业务',
                    'sid': '30AAAAAA',
                  },
                  {
                    'sname': '2G业务',
                    'sid': '20AAAAAA',
                  },
                  {
                    'sname': '其他业务',
                    'sid': '90AAAAAA',
                  },
                ],
                'screenTypeId': '3',
                'screenTypeName': '业务类型',
              },
            ]
            ,
            'isMinus': '1'


            ,


            'chart': [
              {
                'name': '2I2C产品'
                ,
                'value': '1,977.41'
                ,
                'percent': '11.95',

              },
              {
                'name': '冰淇淋套餐'
                ,
                'value': '8,525.81'
                ,
                'percent': '51.53',

              },
              {
                'name': '流量王A套餐'
                ,
                'value': '2,378.52'
                ,
                'percent': '14.37',

              },
              {
                'name': '日租卡'
                ,
                'value': '-161.78'
                ,
                'percent': '-0.98',

              },
              {
                'name': '其他套餐'
                ,
                'value': '-3,503.22'
                ,
                'percent': '-21.17',

              },

            ],

          },
          {
            'date': '2020年01月'


            ,
            'showException': '0'


            ,
            'dataName': [
              '当月值',
              '环比',
              '本年累计',
              '累计同比',
            ]


            ,
            'title': '5G终端用户DOU'


            ,

            'showEarlyWarning': '0'


            ,
            'markName': '指标'


            ,
            'markType': '1'


            ,
            'id': 'CKP_50527'


            ,
            'isPercentage': '0'


            ,
            'dimension': [
              {
                'date': ''
                ,
                'selectType': [
                  {
                    '1': [
                      '-1',
                    ],
                  },
                ]
                ,
                'cityId': '-1'
                ,
                'provId': '111',

              },
            ]


            ,
            'ord': '3'


            ,
            'area': '全国'


            ,
            'collectId': '007'


            ,
            'deleteDisplay': []


            ,
            'excepDiscription': ''


            ,
            'isCollect': '0'


            ,
            'dataValue': [
              '19,317.22GB/户',
              '-2.32%',
              '-',
              '-',
            ]


            ,
            'url': '/indexDetails'


            ,
            'selectTypeDisplay': []


            ,
            'unit': 'GB/户'


            ,
            'dayOrMonth': '月报'


            ,
            'chartType': 'monthBar'


            ,


            'screenConditionTags': [
              {
                'values': [
                  {
                    'sname': '全部',
                    'sid': '-1',
                  },
                  {
                    'sname': '实体渠道',
                    'sid': '30AA',
                  },
                  {
                    'sname': '电子渠道',
                    'sid': '10AA',
                  },
                  {
                    'sname': '集团渠道',
                    'sid': '20AA',
                  },
                  {
                    'sname': '其他渠道',
                    'sid': '99AA',
                  },
                ],
                'screenTypeId': '1',
                'screenTypeName': '渠道类型',
              },
            ]
            ,
            'isMinus': '0'


            ,


            'chart': [
              {
                'totalData': [
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '16,210.91',
                  '24,607.76',
                  '23,190.42',
                  '19,775.61',
                  '19,317.22',
                ],
                'YoYData': [
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                ],
                'sequentialData': [
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-',
                  '-7,814.06',
                  '-1,417.35',
                  '-3,414.81',
                  '-458.39',
                ],
                'title': '逐月趋势图'
                ,
                'chartX': [
                  '2月',
                  '3月',
                  '4月',
                  '5月',
                  '6月',
                  '7月',
                  '8月',
                  '9月',
                  '10月',
                  '11月',
                  '12月',
                  '1月',
                ],
                'example': [
                  '本月值',
                  '环比',
                  '同比',
                ],
              },

            ],

          },
        ]
      } ;
      resolve(resData)
    })
  }else if(params.searchType==="2" || params.searchType===""){
    // 专题
    promise= new Promise((resolve)=>{
    const resData = {
        "currentPage": "1",
        "nextFlag": "1",
        "data": [
          {
            "ord":"1",
            "tabName":"日报",
            "src":"u977.png",
            "collectId":"100122",
            "isCollect":"1",
            "id":"013",
            "title":"移动业务计费收入分析专题",
            "type":"专题",
            "dimension":[
              {
                "date":"",
                "cityId":"-1",
                "provId":"111"
              }
            ],
            "content":"移动业务计费收入分析专题，主要从增存量的用户群、费用项、产品、渠道、业务类型等维度对计费收入的变化情况进行多维度下钻分析，从而辅助用户定位到不同地域的计费收入变化的原因",
            "url":"/themeAnalysis"
          },
        ]
      } ;


      resolve(resData)
    })
  }else if(params.searchType==="3"){
    // 报告
    promise= new Promise((resolve)=>{
      const resData =  {
        "currentPage": "1",
        "nextFlag": "1",
        "data": []
      };
      resolve(resData)
    })
  }else if(params.searchType==="4"){
    // 报表
    promise= new Promise((resolve)=>{
      const resData = {
        "currentPage": "1",
        "nextFlag": "1",
        "data": []
      };
      resolve(resData)
    })
  }else if(params.searchType==="5"){
    // 其他
    promise= new Promise((resolve)=>{
      const resData =  {
        "currentPage": "1",
        "nextFlag": "1",

        "data": [
          {
            "collectId":"001",
            "id": "021",
            "name": "总体业务",
            "jumpType": "self",
            "url": "",
            "dateType": "1",
          },
          {
            "collectId":"001",
            "id": "022",
            "name": "总体",
            "jumpType": "self",
            "url": "",
            "dateType": "1"
          }

        ]
      };
      resolve(resData)
    })
  }
  return promise
}

// 请求删除全部接口 queryDeleteAll
export  async function queryDeleteAll(params = {}) {

  // return request( `${Url.urls[48].url}/deleteAll`,{
  //   method: 'POST',
  //   body: params,
  // });







  return new Promise((resolve)=>{
    const resData = {
      "code":"200",
      "message":"删除成功"
    };
    resolve(resData)
  })
}

// 请求搜索结果
export async function queryDownData(params) {

  // return request(`${Url.urls[48].url}/searchCollect`,{
  //   method:'POST',
  //   body:params,
  // });


  return new Promise((resolve)=>{
    const resData =[
      {
        "id": "15",
        "pId": "-1",
        "title": "移",
        "searchType":"1",
      },
      {
        "id": "1",
        "pId": "-1",
        "title": "移动业务收",
        "searchType":"2",

      },
      {
        "id": "11",
        "pId": "1",
        "title": "移动业",
        "searchType":"1",
      },
      {
        "id": "12",
        "pId": "1",
        "title": "移动入",
        "searchType":"1",
      },
      {
        "id": "1234",
        "pId": "-1",
        "title": "移动",
        "searchType":"3",
      }
    ];
    resolve(resData)
  })
}

// {
//   "id": "11",
//   "pId": "1",
//   "title": "移动业",
//   "searchType":"1",
// },
// {
//   "id": "12",
//   "pId": "1",
//   "title": "移动入",
//   "searchType":"1",
// },
// {
//   "id": "121",
//   "pId": "11",
//   "title": "移动业务",
//   "searchType":"1",
// },


// 请求近期更新所有数据
export  async function queryRecentUpdate(params = {}) {

  // return request( `${Url.urls[48].url}/recentUpdate`,{
  //   method: 'POST',
  //   body: params,
  // });

  return new Promise((resolve)=>{
    const resData = [
        {
          "isCollect":"1",
          "collectId":" CKP_23793",
          "typeName": "专题",
          "typeId": "2",
          "url": "跳转地址",
          "title": "产品画像（标题名称）",
          "dateType": "1表示日 2表示月",
          "markType": 2
        },
      ];
    resolve(resData)
  })
}
        // {
        //   "isCollect":"1",
        //   "collectId":" CKP_23793",
        //   "typeName": "专题",
        //   "typeId": "s_2",
        //   "url": "跳转地址",
        //   "title": "产品画像（标题名称）",
        //   "dateType": "1表示日 2表示月",
        //   "markType": 2
        // }

// 树形图新增收藏
export async function addCollectRequect(params) {

  // return request(`${Url.urls[48].url}/addCollect`,{
  //   method:'POST',
  //   body:params,
  // });

  return new Promise((resolve)=>{
    const resData ={
      "code":"200",
      "message":"收藏成功"
    };
    resolve(resData)
  })
}
// 查询收藏状态
export  async function queryCollectionState(params = {}) {

  // return request( `${Url.urls[48].url}/pageCollect`,{
  //   method: 'POST',
  //   body: params,
  // });

  return new Promise((resolve)=>{
    const resData = {
         collectId:""
      };
    resolve(resData)
  })
}

