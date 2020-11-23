/**
 * desctiption 分析专题模拟数据

 * created by mengyajing

 * date 2019/7/25
 */

const specialDesc = (req,res)=>{
  const data =[
    {
      titleName: "移动业务净增计费收入专题分析",
      titleDetail: "计费收入专题分析内点击对应维度均可进行下钻维度操作业务",
      tableType:"1"
    }
  ];
  res.send(data);
};

const drillDownTableData = (req,res)=>{
  let data;
  const {drill,kpiId,drillLevel,proId} = req.body;
  // 全国
  // 一级下钻
  if(drill && drillLevel==='first'){
    data ={
      "thData": [
        "指标名称",
        "单位",
        "当日值",
        "本月累计",
        "日均环比"
      ],
      "tBodyData": [
        {
          "pId": `${kpiId}`,
          "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
          "kpiName": "移动业务计费收入",
          "kpiId": `${kpiId}`,
          "kpiValues": [
            {
              "type": "0",
              "value": "1,316,862.12"
            },
            {
              "type": "1",
              "value": "1,316,862.12"
            },
            {
              "type": "2",
              "value": "1,316,862.12"
            }
          ],
          "unit": "万元",
          "space": "0",
          "proId": "112",// 一级下钻
          "cityId": "-1",// 一级下钻返回-1
          "areaName": "北十省",// 一级下钻返回省份名称
          "downArrowState": "false",
          "parentKpiId": "下钻数据的父级指标",
          "showEarlyWarning": "1",
          "warningLevel": "一级",
          "desc": "预警描述信息"
        },
        {
          "pId": `${kpiId}`,
          "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
          "kpiName": "移动业务计费收入",
          "kpiId": `${kpiId}`,
          "kpiValues": [
            {
              "type": "0",
              "value": "1,316,862.12"
            },
            {
              "type": "1",
              "value": "1,316,862.12"
            },
            {
              "type": "2",
              "value": "1,316,862.12"
            }
          ],
          "unit": "万元",
          "space": "0",
          "proId": "113",
          "cityId": "-1",
          "areaName": "南二十一省",
          "downArrowState": "false",
          "parentKpiId": "下钻数据的父级指标",
          "showEarlyWarning": "1",
          "warningLevel": "一级",
          "desc": "预警描述信息"
        },
        {
          "pId": `${kpiId}`,
          "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
          "kpiName": "移动业务计费收入",
          "kpiId": `${kpiId}`,
          "kpiValues": [
            {
              "type": "0",
              "value": "1,316,862.12"
            },
            {
              "type": "1",
              "value": "1,316,862.12"
            },
            {
              "type": "2",
              "value": "1,316,862.12"
            }
          ],
          "unit": "万元",
          "space": "0",
          "proId": "010",
          "areaName": "内蒙古",
          "cityId": "-1",
          "downArrowState": "true",
          "parentKpiId": "下钻数据的父级指标",
          "showEarlyWarning": "1",
          "warningLevel": "一级",
          "desc": "预警描述信息"
        },
        {
          "pId": `${kpiId}`,
          "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
          "kpiName": "移动业务计费收入",
          "kpiId": `${kpiId}`,
          "kpiValues": [
            {
              "type": "0",
              "value": "1,316,862.12"
            },
            {
              "type": "1",
              "value": "1,316,862.12"
            },
            {
              "type": "2",
              "value": "1,316,862.12"
            }
          ],
          "unit": "万元",
          "space": "0",
          "proId": "011",
          "cityId": "-1",
          "areaName": "北京",
          "downArrowState": "true",
          "parentKpiId": "下钻数据的父级指标",
          "showEarlyWarning": "1",
          "warningLevel": "一级",
          "desc": "预警描述信息"
        }
      ],
      "unitSwitch": {
        "maxUnit": "3",
        "minUnit": "0",
        "useUnit": "2"
      }
    };
  }else if(drill && drillLevel==='second'){
    // 内蒙古下钻
    if(proId==="010"){
      data ={
        "thData": [
          "指标名称",
          "单位",
          "当日值",
          "本月累计",
          "日均环比"
        ],
        "tBodyData": [
          {
            "pId": `${kpiId}`,
            "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
            "kpiName": "移动业务计费收入",
            "kpiId": `${kpiId}`,
            "kpiValues": [
              {
                "type": "0",
                "value": "1,316,862.12"
              },
              {
                "type": "1",
                "value": "1,316,862.12"
              },
              {
                "type": "2",
                "value": "1,316,862.12"
              }
            ],
            "unit": "万元",
            "space": "0",
            "proId": `${proId}`,// 耳机下钻返回前端传入的省份编码
            "cityId": "v010001",// 二级下钻返回具体市的编码
            "areaName": "呼和浩特",
            "downArrowState": "false",
            "parentKpiId": "下钻数据的父级指标",
            "showEarlyWarning": "1",
            "warningLevel": "一级",
            "desc": "预警描述信息"
          },
          {
            "pId": `${kpiId}`,
            "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
            "kpiName": "移动业务计费收入",
            "kpiId": `${kpiId}`,
            "kpiValues": [
              {
                "type": "0",
                "value": "1,316,862.12"
              },
              {
                "type": "1",
                "value": "1,316,862.12"
              },
              {
                "type": "2",
                "value": "1,316,862.12"
              }
            ],
            "unit": "万元",
            "space": "0",
            "proId": `${proId}`,
            "cityId": "v010002",
            "areaName": "呼和浩特1",
            "downArrowState": "false",
            "parentKpiId": "下钻数据的父级指标",
            "showEarlyWarning": "1",
            "warningLevel": "一级",
            "desc": "预警描述信息"
          }
        ],
        "unitSwitch": {
          "maxUnit": "3",
          "minUnit": "0",
          "useUnit": "2"
        }
      };
    }else if(proId==="011"){
      data ={
        "thData": [
          "指标名称",
          "单位",
          "当日值",
          "本月累计",
          "日均环比"
        ],
        "tBodyData": [
          {
            "pId": `${kpiId}`,
            "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
            "kpiName": "移动业务计费收入",
            "kpiId": `${kpiId}`,
            "kpiValues": [
              {
                "type": "0",
                "value": "1,316,862.12"
              },
              {
                "type": "1",
                "value": "1,316,862.12"
              },
              {
                "type": "2",
                "value": "1,316,862.12"
              }
            ],
            "unit": "万元",
            "space": "0",
            "proId": `${proId}`,
            "cityId": "v011001",
            "areaName": "北京市",
            "downArrowState": "false",
            "parentKpiId": "下钻数据的父级指标",
            "showEarlyWarning": "1",
            "warningLevel": "一级",
            "desc": "预警描述信息"
          }
        ],
        "unitSwitch": {
          "maxUnit": "3",
          "minUnit": "0",
          "useUnit": "2"
        }
      };
    }
  }else{
    data ={
      "thData": [
        "指标名称",
        "单位",
        "当日值",
        "本月累计",
        "日均环比"
      ],
      "tBodyData": [
        {
          "pId": "-1",
          "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
          "kpiName": "移动业务计费收入",
          "kpiId": "CKP_6001",
          "kpiValues": [
            {
              "type": "0",
              "value": "1,316,862.12"
            },
            {
              "type": "1",
              "value": "1,316,862.12"
            },
            {
              "type": "2",
              "value": "1,316,862.12"
            }
          ],
          "unit": "万元",
          "space": "0",
          "proId": `${proId}`,// 非下钻表格：proId返回前端传入的参数
          "cityId": "-1",// 非下钻表格，cityId返回-1
          "areaName": "地域名称",
          "downArrowState": "true",
          "parentKpiId": "下钻数据的父级指标",
          "showEarlyWarning": "1",
          "warningLevel": "一级",
          "desc": "预警描述信息"
        },
        {
          "pId": "CKP_6001",
          "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
          "kpiName": "移动业务计费收入",
          "kpiId": "CKP_6002",
          "kpiValues": [
            {
              "type": "0",
              "value": "1,316,862.12"
            },
            {
              "type": "1",
              "value": "1,316,862.12"
            },
            {
              "type": "2",
              "value": "1,316,862.12"
            }
          ],
          "unit": "万元",
          "space": "0",
          "proId": `${proId}`,// 非下钻表格：proId返回前端传入的参数
          "cityId": "-1",// 非下钻表格，cityId返回-1
          "areaName": "地域名称",
          "downArrowState": "true",
          "parentKpiId": "下钻数据的父级指标",
          "showEarlyWarning": "1",
          "warningLevel": "一级",
          "desc": "预警描述信息"
        },
        {
          "pId": "CKP_6001",
          "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
          "kpiName": "移动业务计费收入",
          "kpiId": "CKP_6003",
          "kpiValues": [
            {
              "type": "0",
              "value": "1,316,862.12"
            },
            {
              "type": "1",
              "value": "1,316,862.12"
            },
            {
              "type": "2",
              "value": "1,316,862.12"
            }
          ],
          "unit": "万元",
          "space": "0",
          "proId": `${proId}`,// 非下钻表格：proId返回前端传入的参数
          "cityId": "-1",// 非下钻表格，cityId返回-1
          "areaName": "地域名称",
          "downArrowState": "true",
          "parentKpiId": "下钻数据的父级指标",
          "showEarlyWarning": "1",
          "warningLevel": "一级",
          "desc": "预警描述信息"
        },
        {
          "pId": "-1",
          "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
          "kpiName": "移动业务计费收入",
          "kpiId": "CKP_6004",
          "kpiValues": [
            {
              "type": "0",
              "value": "1,316,862.12"
            },
            {
              "type": "1",
              "value": "1,316,862.12"
            },
            {
              "type": "2",
              "value": "1,316,862.12"
            }
          ],
          "unit": "万元",
          "space": "0",
          "proId": `${proId}`,// 非下钻表格：proId返回前端传入的参数
          "cityId": "-1",// 非下钻表格，cityId返回-1
          "areaName": "地域名称",
          "downArrowState": "true",
          "parentKpiId": "下钻数据的父级指标",
          "showEarlyWarning": "1",
          "warningLevel": "一级",
          "desc": "预警描述信息"
        },
        {
          "pId": "CKP_6004",
          "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
          "kpiName": "移动业务计费收入",
          "kpiId": "CKP_6005",
          "kpiValues": [
            {
              "type": "0",
              "value": "1,316,862.12"
            },
            {
              "type": "1",
              "value": "1,316,862.12"
            },
            {
              "type": "2",
              "value": "1,316,862.12"
            }
          ],
          "unit": "万元",
          "space": "0",
          "proId": `${proId}`,// 非下钻表格：proId返回前端传入的参数
          "cityId": "-1",// 非下钻表格，cityId返回-1
          "areaName": "地域名称",
          "downArrowState": "true",
          "parentKpiId": "下钻数据的父级指标",
          "showEarlyWarning": "1",
          "warningLevel": "一级",
          "desc": "预警描述信息"
        }
      ],
      "unitSwitch": {
        "maxUnit": "3",
        "minUnit": "0",
        "useUnit": "2"
      }
    };
  }

  // // 某省
  // // 一级下钻
  // if(drill && drillLevel==='first'){
  //   data ={
  //     "thData": [
  //       "指标名称",
  //       "单位",
  //       "当日值",
  //       "本月累计",
  //       "日均环比"
  //     ],
  //     "tBodyData": [
  //       {
  //         "pId": `${kpiId}`,
  //         "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
  //         "kpiName": "移动业务计费收入",
  //         "kpiId": `${kpiId}`,
  //         "kpiValues": [
  //           {
  //             "type": "0",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "1",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "2",
  //             "value": "1,316,862.12"
  //           }
  //         ],
  //         "unit": "万元",
  //         "space": "0",
  //         "proId": `${proId}`,
  //         "cityId": "v011001",
  //         "areaName": "呼和浩特1",
  //         "downArrowState": "false",
  //         "parentKpiId": "下钻数据的父级指标",
  //         "showEarlyWarning": "1",
  //         "warningLevel": "一级",
  //         "desc": "预警描述信息"
  //       },
  //       {
  //         "pId": `${kpiId}`,
  //         "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
  //         "kpiName": "移动业务计费收入",
  //         "kpiId": `${kpiId}`,
  //         "kpiValues": [
  //           {
  //             "type": "0",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "1",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "2",
  //             "value": "1,316,862.12"
  //           }
  //         ],
  //         "unit": "万元",
  //         "space": "0",
  //         "proId": `${proId}`,
  //         "cityId": "v011002",
  //         "areaName": "呼和浩特2",
  //         "downArrowState": "false",
  //         "parentKpiId": "下钻数据的父级指标",
  //         "showEarlyWarning": "1",
  //         "warningLevel": "一级",
  //         "desc": "预警描述信息"
  //       },
  //       {
  //         "pId": `${kpiId}`,
  //         "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
  //         "kpiName": "移动业务计费收入",
  //         "kpiId": `${kpiId}`,
  //         "kpiValues": [
  //           {
  //             "type": "0",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "1",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "2",
  //             "value": "1,316,862.12"
  //           }
  //         ],
  //         "unit": "万元",
  //         "space": "0",
  //         "proId": `${proId}`,
  //         "cityId": "v011003",
  //         "areaName": "呼和浩特3",
  //         "downArrowState": "false",
  //         "parentKpiId": "下钻数据的父级指标",
  //         "showEarlyWarning": "1",
  //         "warningLevel": "一级",
  //         "desc": "预警描述信息"
  //       },
  //       {
  //         "pId": `${kpiId}`,
  //         "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
  //         "kpiName": "移动业务计费收入",
  //         "kpiId": `${kpiId}`,
  //         "kpiValues": [
  //           {
  //             "type": "0",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "1",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "2",
  //             "value": "1,316,862.12"
  //           }
  //         ],
  //         "unit": "万元",
  //         "space": "0",
  //         "proId": `${proId}`,
  //         "cityId": "v011004",
  //         "areaName": "呼和浩特4",
  //         "downArrowState": "false",
  //         "parentKpiId": "下钻数据的父级指标",
  //         "showEarlyWarning": "1",
  //         "warningLevel": "一级",
  //         "desc": "预警描述信息"
  //       }
  //     ],
  //     "unitSwitch": {
  //       "maxUnit": "3",
  //       "minUnit": "0",
  //       "useUnit": "2"
  //     }
  //   };
  // } else{
  //   data ={
  //     "thData": [
  //       "指标名称",
  //       "单位",
  //       "当日值",
  //       "本月累计",
  //       "日均环比"
  //     ],
  //     "tBodyData": [
  //       {
  //         "pId": "-1",
  //         "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
  //         "kpiName": "移动业务计费收入",
  //         "kpiId": "CKP_6001",
  //         "kpiValues": [
  //           {
  //             "type": "0",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "1",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "2",
  //             "value": "1,316,862.12"
  //           }
  //         ],
  //         "unit": "万元",
  //         "space": "0",
  //         "proId": `${proId}`,// 非下钻表格：proId返回前端传入的参数
  //         "cityId": "-1",// 非下钻表格，cityId返回-1
  //         "areaName": "地域名称",
  //         "downArrowState": "true",
  //         "parentKpiId": "下钻数据的父级指标",
  //         "showEarlyWarning": "1",
  //         "warningLevel": "一级",
  //         "desc": "预警描述信息"
  //       },
  //       {
  //         "pId": "CKP_6001",
  //         "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
  //         "kpiName": "移动业务计费收入",
  //         "kpiId": "CKP_6002",
  //         "kpiValues": [
  //           {
  //             "type": "0",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "1",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "2",
  //             "value": "1,316,862.12"
  //           }
  //         ],
  //         "unit": "万元",
  //         "space": "0",
  //         "proId": `${proId}`,// 非下钻表格：proId返回前端传入的参数
  //         "cityId": "-1",// 非下钻表格，cityId返回-1
  //         "areaName": "地域名称",
  //         "downArrowState": "true",
  //         "parentKpiId": "下钻数据的父级指标",
  //         "showEarlyWarning": "1",
  //         "warningLevel": "一级",
  //         "desc": "预警描述信息"
  //       },
  //       {
  //         "pId": "CKP_6001",
  //         "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
  //         "kpiName": "移动业务计费收入",
  //         "kpiId": "CKP_6003",
  //         "kpiValues": [
  //           {
  //             "type": "0",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "1",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "2",
  //             "value": "1,316,862.12"
  //           }
  //         ],
  //         "unit": "万元",
  //         "space": "0",
  //         "proId": `${proId}`,// 非下钻表格：proId返回前端传入的参数
  //         "cityId": "-1",// 非下钻表格，cityId返回-1
  //         "areaName": "地域名称",
  //         "downArrowState": "true",
  //         "parentKpiId": "下钻数据的父级指标",
  //         "showEarlyWarning": "1",
  //         "warningLevel": "一级",
  //         "desc": "预警描述信息"
  //       },
  //       {
  //         "pId": "-1",
  //         "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
  //         "kpiName": "移动业务计费收入",
  //         "kpiId": "CKP_6004",
  //         "kpiValues": [
  //           {
  //             "type": "0",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "1",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "2",
  //             "value": "1,316,862.12"
  //           }
  //         ],
  //         "unit": "万元",
  //         "space": "0",
  //         "proId": `${proId}`,// 非下钻表格：proId返回前端传入的参数
  //         "cityId": "-1",// 非下钻表格，cityId返回-1
  //         "areaName": "地域名称",
  //         "downArrowState": "true",
  //         "parentKpiId": "下钻数据的父级指标",
  //         "showEarlyWarning": "1",
  //         "warningLevel": "一级",
  //         "desc": "预警描述信息"
  //       },
  //       {
  //         "pId": "CKP_6004",
  //         "kpiDetail": "指报告期内移动业务用户在详单级优惠后产生的汇总收入，",
  //         "kpiName": "移动业务计费收入",
  //         "kpiId": "CKP_6005",
  //         "kpiValues": [
  //           {
  //             "type": "0",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "1",
  //             "value": "1,316,862.12"
  //           },
  //           {
  //             "type": "2",
  //             "value": "1,316,862.12"
  //           }
  //         ],
  //         "unit": "万元",
  //         "space": "0",
  //         "proId": `${proId}`,// 非下钻表格：proId返回前端传入的参数
  //         "cityId": "-1",// 非下钻表格，cityId返回-1
  //         "areaName": "地域名称",
  //         "downArrowState": "true",
  //         "parentKpiId": "下钻数据的父级指标",
  //         "showEarlyWarning": "1",
  //         "warningLevel": "一级",
  //         "desc": "预警描述信息"
  //       }
  //     ],
  //     "unitSwitch": {
  //       "maxUnit": "3",
  //       "minUnit": "0",
  //       "useUnit": "2"
  //     }
  //   };
  // }
  res.send(data);
};

const specialConditions = (req,res)=>{
  const data =[
    {
      "type": "date",
      "ord": "1",
      "name": "账期",
      "id": "date",
      "idMold": "",
      "value": {
        "hasNanBei": "0"
      }
    },
    {
      "type": "region",
      "ord": "2",
      "name": "地域",
      "id": "provId",
      "idMold": "",
      "cityId": "cityId",
      "value": {
        "hasNanBei": "0"
      }
    },
    {
      "type": "other",
      "ord": "3",
      "name": "地域",
      "idMold": "",
      "id": "cityId",
      "value": {}
    },
    {
      "type": "indexConfig",
      "ord": "10",
      "idMold": "indexConfig",
      "name": "指标配置",
      "id": "indexConfig",
      "value": {}
    },
    {
      "type": "input",
      "ord": "4",
      "name": "产品编码",
      "idMold": "",
      "id": "productCode",
      "value": {}
    },
    {
      "type": "singleSelect",
      "ord": "5",
      "idMold": "",
      "name": "指标类型",
      "id": "indexType",
      "value": {
        "hasChild": "0",
        "childId": "",
        "childName": "",
        "data": [{
          "id": "001",
          "name": "本月累计",
          "child": []
        },
          {
            "id": "002",
            "name": "累计环比",
            "child": []
          },
          {
            "id": "003",
            "name": "累计同比",
            "child": []
          }
        ]
      }
    },
    {
      "type": "singleSelect",
      "ord": "6",
      "name": "渠道分类",
      "id": "channelClass",
      "idMold": "",
      "value": {
        "hasChild": "1",
        "childId": "channel",
        "childName": "产品名称",
        "data": [{
          "id": "0001",
          "name": "渠道",
          "child": [{
            "id": "1",
            "name": "集团渠道"
          },
            {
              "id": "2",
              "name": "客户渠道"
            }
          ]
        }]
      }
    },
    {
      "type": "singleSelect",
      "ord": "7",
      "idMold": "",
      "name": "手机类型",
      "id": "mobile",
      "value": {
        "hasChild": "0",
        "childId": "",
        "childName": "",
        "data": [{
          "id": "011",
          "name": "华为",
          "child": []
        },
          {
            "id": "012",
            "name": "小米",
            "child": []
          },
          {
            "id": "013",
            "name": "oppo",
            "child": []
          }
        ]
      }
    },
    {
      "type": "other",
      "ord": "8",
      "idMold": "",
      "name": "其他",
      "id": "qita",
      "value": {}
    }
  ];
  res.send(data);
};



export default {
  'POST /analyseSpecial/drillDownTableData':drillDownTableData,
  'POST /analyseSpecial/title':specialDesc,
  'POST /analyseSpecial/conditions':specialConditions,
}
