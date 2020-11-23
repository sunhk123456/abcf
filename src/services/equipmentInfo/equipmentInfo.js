/**
 * @Description: 终端产产品信息查询
 *
 * @author: yuzihao
 *
 * @date: 2020/5/13
 */
import request from '../../utils/request';
import Url from '@/services/urls.json';

// 终端查询筛选条件接口
export async function queryCondition(params) {
  return request(`${Url.urls[52].url}/condition`, {
    method: 'POST',
    body: params,
  });
  // if (params.selectType ==='BRAND_ID') {
  //   return new Promise((resolve)=>{
  //     const resData = [
  //       {
  //         "name": "华为",
  //         "id": "huawei"
  //       },
  //       {
  //         "name": "小米",
  //         "id": "xiaomi"
  //       }
  //     ];
  //     resolve(resData)
  //   })
  // } if (params.selectType ==='DEVICE_TYPE') {
  //   return new Promise((resolve)=>{
  //     const resData = [
  //       {
  //         "name": "mate10",
  //         "id": "mate10"
  //       },
  //       {
  //         "name": "11MaxPro",
  //         "id": "11MaxPro"
  //       }
  //     ];
  //     resolve(resData)
  //   })
  // } if (params.selectType ==='RAM_ROM_ID') {
  //   return new Promise((resolve)=>{
  //     const resData = [
  //       {
  //         "name": "256G",
  //         "id": "256G"
  //       },
  //       {
  //         "name": "128g",
  //         "id": "128g"
  //       }
  //     ];
  //     resolve(resData)
  //   })
  // } if (params.selectType ==='COLOR_ID') {
  //   return new Promise((resolve)=>{
  //     const resData = [
  //       {
  //         "name": "螺蛳粉",
  //         "id": "ad"
  //       },
  //       {
  //         "name": "江小白",
  //         "id": "dwe"
  //       },
  //       {
  //         "name": "咸蛋黄",
  //         "id": "khg"
  //       }
  //     ];
  //     resolve(resData)
  //   })
  // }
  // return new Promise((resolve)=>{
  //   const resData = [
  //     {
  //       "name": "3G",
  //       "id": "3G"
  //     },
  //     {
  //       "name": "4G",
  //       "id": "4g"
  //     }
  //   ];
  //   resolve(resData)
  // })

}

// 终端查询内容列表接口
export async function queryListContent(params) {
  return request(`${Url.urls[52].url}/listContent`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData={
  //     data: {
  //       "list": [
  //         {
  //           "title": "华为P40 (8G+128G)\n珠光贝母",
  //           "value": [
  //             {
  //               "name": "手机类型",
  //               "value": "5G手机",
  //               "iconName": "phone"
  //             },
  //             {
  //               "name": "电池",
  //               "value": "4500mAh",
  //               "iconName": "electric"
  //             },
  //             {
  //               "name": "屏幕尺寸",
  //               "value": "6.53英寸",
  //               "iconName": "size"
  //             },
  //             {
  //               "name": "屏幕宽度",
  //               "value": "71.06mm",
  //               "iconName": "width"
  //             },
  //             {
  //               "name": "屏幕高度",
  //               "value": "8.50mm",
  //               "iconName": "height"
  //             },
  //             {
  //               "name": "尺寸",
  //               "value": "148.9mm*71.06mm*8.50mm",
  //               "iconName": "size"
  //             },
  //             {
  //               "name": "内存/机身内存",
  //               "value": "8GB/128G",
  //               "iconName": "memory"
  //             },
  //             {
  //               "name": "CPU型号",
  //               "value": "麒麟 990 5G",
  //               "iconName": "CPU"
  //             },
  //             {
  //               "name": "价格",
  //               "value": "￥2698",
  //               "iconName": "cart"
  //             },
  //             {
  //               "name": "型号",
  //               "value": "ANA-AN00",
  //               "iconName": "model"
  //             },
  //             {
  //               "name": "颜色",
  //               "value": "珠光贝母",
  //               "iconName": "palette"
  //             },
  //             {
  //               "name": "品牌",
  //               "value": "华为 HUAWEI",
  //               "iconName": "brand"
  //             },
  //           ],
  //           "detailedInfo": [
  //             {
  //               "title": "屏幕",
  //               "titleIcon": "phone",
  //               "contentValue": [
  //                 {
  //                   "name": "主屏幕宽度",
  //                   "value": [
  //                     "71.06mm",
  //                     "2G  CDMA : BC0"
  //                   ]
  //                 }
  //               ]
  //             }
  //           ]
  //         },
  //         {
  //           "title": "华为P40 (8G+128G)\n珠光贝母",
  //           "value": [
  //             {
  //               "name": "手机类型",
  //               "value": "5G手机",
  //               "iconName": "phone"
  //             },
  //             {
  //               "name": "电池",
  //               "value": "4500mAh",
  //               "iconName": "electric"
  //             },
  //             {
  //               "name": "屏幕尺寸",
  //               "value": "6.53英寸",
  //               "iconName": "size"
  //             },
  //             {
  //               "name": "屏幕宽度",
  //               "value": "71.06mm",
  //               "iconName": "width"
  //             },
  //             {
  //               "name": "屏幕高度",
  //               "value": "8.50mm",
  //               "iconName": "height"
  //             },
  //             {
  //               "name": "尺寸",
  //               "value": "148.9mm*71.06mm*8.50mm",
  //               "iconName": "size"
  //             },
  //             {
  //               "name": "内存/机身内存",
  //               "value": "8GB/128G",
  //               "iconName": "memory"
  //             },
  //             {
  //               "name": "CPU型号",
  //               "value": "麒麟 990 5G",
  //               "iconName": "CPU"
  //             },
  //             {
  //               "name": "价格",
  //               "value": "￥2698",
  //               "iconName": "cart"
  //             },
  //             {
  //               "name": "型号",
  //               "value": "ANA-AN00",
  //               "iconName": "model"
  //             },
  //             {
  //               "name": "颜色",
  //               "value": "珠光贝母",
  //               "iconName": "palette"
  //             },
  //             {
  //               "name": "品牌",
  //               "value": "华为 HUAWEI",
  //               "iconName": "brand"
  //             },
  //           ],
  //           "detailedInfo": [
  //             {
  //               "title": "屏幕",
  //               "titleIcon": "phone",
  //               "contentValue": [
  //                 {
  //                   "name": "主屏幕宽度",
  //                   "value": ["71.06mm"]
  //                 },
  //                 {
  //                   "name": "主屏幕高度",
  //                   "value": ["8.50mm"]
  //                 },
  //               ]
  //             },
  //             {
  //               "title": "硬件",
  //               "titleIcon": "hardware",
  //               "contentValue": [
  //                 {
  //                   "name": "电池容量",
  //                   "value": ["4500mAh"]
  //                 },
  //                 {
  //                   "name": "内存/机身内存",
  //                   "value": ["8G/128G"]
  //                 },
  //                 {
  //                   "name": "CPU型号",
  //                   "value": ["麒麟 990 5G"]
  //                 },
  //                 {
  //                   "name": "是否支持NFC",
  //                   "value": ["是"]
  //                 },
  //                 {
  //                   "name": "是否支持扩展卡",
  //                   "value": ["是"]
  //                 },
  //                 {
  //                   "name": "电池类型",
  //                   "value": ["不可拆卸电池"]
  //                 },
  //                 {
  //                   "name": "电池厂商",
  //                   "value": ["深圳比亚迪"]
  //                 },
  //                 {
  //                   "name": "扩展卡类型",
  //                   "value": ["内存卡"]
  //                 },
  //                 {
  //                   "name": "基带型号",
  //                   "value": ["快速充电 ( 18W快充 ) , OTG反向充电"]
  //                 },
  //                 {
  //                   "name": "价格",
  //                   "value": ["￥2698"]
  //                 },
  //                 {
  //                   "name": "型号",
  //                   "value": ["ANA-AN00"]
  //                 }
  //               ]
  //             },
  //             {
  //               "title": "网络与连接",
  //               "titleIcon": "connect",
  //               "contentValue": [
  //                 {
  //                   "name": "手机类型",
  //                   "value": ["5G手机"]
  //                 },
  //                 {
  //                   "name": "频段",
  //                   "value": [
  //                     "2G  GSM : 850/900/DCS/PCS",
  //                     "2G  CDMA : BC0",
  //                     "3G  WCDMA :B1/4/5/8",
  //                     "3G  CDMA200 :BC0",
  //                     "3G  TD-SCDMA :B34/39",
  //                     "4G  TDD-LTE :B34/38/39/40/414G",
  //                     "4G  TDD-LTE :B1/3/4/5/8",
  //                     "4G+ :  DL  : CA-1C/3C/38C/39C/40C/41C/1A-3A/1A-3C/40D/41D  UL : 39C/40C/41C",
  //                     "5G :",
  //                     "SA : n1/n3/n41/n77/n78",
  //                     "NSA : B3+n41/B39+n41/B1+n78/B5+n78/B8+n78",
  //                   ]
  //                 },
  //                 {
  //                   "name": "支持联通网络类型",
  //                   "value": ["双模 - GSM模式"]
  //                 },
  //                 {
  //                   "name": "是否支持蓝牙",
  //                   "value": ["是"]
  //                 },
  //                 {
  //                   "name": "SIM卡槽类型",
  //                   "value": ["双卡 ( 双Nano-Sim卡 )"]
  //                 },
  //                 {
  //                   "name": "是否支持WiFi",
  //                   "value": ["是"]
  //                 }
  //               ]
  //             },
  //             {
  //               "title": "摄像头",
  //               "titleIcon": "camera",
  //               "contentValue": [
  //                 {
  //                   "name": "前置摄像头",
  //                   "value": ["4800万像素主镜头+800万像素超广角+200万像素虚拟化镜头+200万像素微距镜头"]
  //                 },
  //                 {
  //                   "name": "后置摄像头",
  //                   "value": ["3200万像素"]
  //                 },
  //               ]
  //             },
  //             {
  //               "title": "外观",
  //               "titleIcon": "appearance",
  //               "contentValue": [
  //                 {
  //                   "name": "尺寸",
  //                   "value": ["148.9mm*71.06mm*8.50mm"]
  //                 },
  //                 {
  //                   "name": "主屏幕尺寸",
  //                   "value": ["6.53英寸"]
  //                 },
  //                 {
  //                   "name": "颜色",
  //                   "value": ["珠光贝母"]
  //                 }
  //               ]
  //             },
  //             {
  //               "title": "功能与服务",
  //               "titleIcon": "function",
  //               "contentValue": [
  //                 {
  //                   "name": "定制类型",
  //                   "value": ["联通"]
  //                 },
  //                 {
  //                   "name": "操作系统",
  //                   "value": ["EMUI 10.1（基于Android 10）"]
  //                 },
  //                 {
  //                   "name": "语音方案",
  //                   "value": ["volte"]
  //                 }
  //               ]
  //             },
  //             {
  //               "title": "保修信息",
  //               "titleIcon": "guarantee",
  //               "contentValue": [
  //                 {
  //                   "name": "创建时间",
  //                   "value": ["2020/05/06"]
  //                 }
  //               ]
  //             },
  //           ]
  //         },
  //         {
  //           "title": "华为P40 (8G+128G)\n珠光贝母",
  //           "value": [
  //             {
  //               "name": "手机类型",
  //               "value": "5G手机",
  //               "iconName": "phone"
  //             },
  //             {
  //               "name": "电池",
  //               "value": "4500mAh",
  //               "iconName": "electric"
  //             },
  //             {
  //               "name": "屏幕尺寸",
  //               "value": "6.53英寸",
  //               "iconName": "size"
  //             },
  //             {
  //               "name": "屏幕宽度",
  //               "value": "71.06mm",
  //               "iconName": "width"
  //             },
  //             {
  //               "name": "屏幕高度",
  //               "value": "8.50mm",
  //               "iconName": "height"
  //             },
  //             {
  //               "name": "尺寸",
  //               "value": "148.9mm*71.06mm*8.50mm",
  //               "iconName": "size"
  //             },
  //             {
  //               "name": "内存/机身内存",
  //               "value": "8GB/128G",
  //               "iconName": "memory"
  //             },
  //             {
  //               "name": "CPU型号",
  //               "value": "麒麟 990 5G",
  //               "iconName": "CPU"
  //             },
  //             {
  //               "name": "价格",
  //               "value": "￥2698",
  //               "iconName": "cart"
  //             },
  //             {
  //               "name": "型号",
  //               "value": "ANA-AN00",
  //               "iconName": "model"
  //             },
  //             {
  //               "name": "颜色",
  //               "value": "珠光贝母",
  //               "iconName": "palette"
  //             },
  //             {
  //               "name": "品牌",
  //               "value": "华为 HUAWEI",
  //               "iconName": "brand"
  //             },
  //           ],
  //           "detailedInfo": [
  //             {
  //               "title": "屏幕",
  //               "titleIcon": "phone",
  //               "contentValue": [
  //                 {
  //                   "name": "主屏幕宽度",
  //                   "value": [
  //                     "71.06mm",
  //                     "2G  CDMA : BC0"
  //                   ]
  //                 }
  //               ]
  //             }
  //           ]
  //         },
  //       ],
  //       "nextFlag": "true"
  //     }
  //   };
  //   resolve(resData)
  // })
}

// 终端查询最大账期接口
export async function queryMaxDate(params) {
  return request(`${Url.urls[52].url}/maxDate`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData={
  //     data: {
  //      date:'2020-06-28'
  //     }
  //   };
  //   resolve(resData)
  // })
}
