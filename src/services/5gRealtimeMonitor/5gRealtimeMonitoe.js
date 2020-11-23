/* eslint-disable import/prefer-default-export */
import request from '../../utils/request';
import Url from '@/services/urls.json';

export async function getRealtimeTitleData(params) {
  console.log(params);
  return request(`${Url.urls[36].url}/webSocket5G/title`, {
    method: 'POST',
    body: params,
  });
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData = {
  //     'titleName': '5G套餐受理用户实时监控',
  //     'list': [
  //       { 'id': '01', 'name': '当日值', 'refresh': '页面实时数据刷新频率:1分钟/次' },
  //       { 'id': '02', 'name': '累计值', 'refresh': '页面实时数据刷新频率:1分钟/次' },
  //     ]
  //   };
  //   resolve(resData)
  // })
}

export async function getRealtimeContentData(params) {
  // return request(`${Url.urls[28].url}/iceCreamRoamTable`,{
  //   method:'POST',
  //   body:params,
  // });
  console.log(params);
  return new Promise((resolve)=>{
    const resData = {
      'peopleData': {
        'name': '5G全国受理用户', 'value': '0002946', 'unit': '户',
      },
      'areaData': {
        'title': '地域分布',
        'chartX': ['北京', '天津', '内蒙古', '吉林', '河北'],
        'chart': ['100', '200', '100', '400', '600'],
        'unit': '万元',
        'xName': '账期',
        'yName': '账用户数',
        'download': {
          'title': [
            ['省份/产品名称', '5G套餐受理用户', '刷新时间'],
          ],
          'value': [
            ['产品A', '1,330.45', '2018-01-10 05:20:23'],
            ['产品B', '1,728.04', '2018-01-10 05:20:23'],
          ],
        },
      
      },
      'productData': {
        'title': '产品分布',
        'chartX': ['5G套餐129元', '5G套餐159元', '5G套餐199元', '5G套餐239元', '5G套餐299元'],
        'chart': ['100', '200', '100', '400', '600'],
        'unit': '万元',
        'xName': '账期',
        'yName': '出账用户数',
        download: {
          'title': [
            ['省份/产品名称', '5G套餐受理用户', '刷新时间'],
          ],
          'value': [
            ['产品A', '1,330.45', '2018-01-10 05:20:23'],
            ['产品B', '1,728.04', '2018-01-10 05:20:23'],
          ],
        },
      
      },
    };
    resolve(resData)
  })
}

