import request from '../../utils/request';
import Url from '@/services/urls.json';

export async function queryUserInfoData(params) {
  // console.log(params);
  return request(`${Url.urls[40].url}/userInfo`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     "title":"秒懂产品",
  //     "list":[
  //       {"name":"终端名称","value":["文本文本文本"]},
  //       {"name":"品牌","value":["文本文本文本"]},
  //       {"name":"CPU","value":["文本文本文本文本"]},
  //       {"name":"操作系统","value":["文本文本OS"]},
  //       {"name":"后置摄像头","value":["1600W主拍","200W副拍"]}
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// 终端用户轨迹
export async function queryUserPathwayData(params) {
  // console.log(params);
  return request(`${Url.urls[40].url}/userPathway`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     "title":"终端换机轨迹",
  //     "list":[
  //       {"name":"型号名称","time":"2017-6-10"},
  //       {"name":"型号名称","time":"2017-6-10"},
  //       {"name":"型号名称","time":"2017-6-10"},
  //       {"name":"型号名称","time":"2017-6-10"},
  //       {"name":"型号名称","time":"2017-6-10"}
  //     ]};
  //   resolve(resData)
  // })
}

// 当前用户月度贡献
export async function queryUserContributionsData(params) {
  // console.log(params);
  return request(`${Url.urls[40].url}/lineEchart`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     "title":"556",
  //     "chartX":["1月","2月","3月","4月","5月","6月"],
  //     "chart":[
  //       {
  //         "name":"新增用户数",
  //         "value":["467","754","523","135","489","858"],
  //         "unit":"GB",
  //         "type":"line"
  //       }
  //     ]
  //   };
  //   resolve(resData)
  // })
}

// 当前用户业务使用情况
export async function queryUserServerData(params) {
  // console.log(params);
  return request(`${Url.urls[40].url}/lineEchart`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     "title":"112",
  //     "chartX":["1月","2月","3月","4月","5月","6月"],
  //     "chart":[
  //       {
  //         "name":"新增用户数",
  //         "value":["467","754","523","135","489","858"],
  //         "unit":"GB",
  //         "type":"line"
  //       },
  //       {
  //         "name":"新增用户数",
  //         "value":["456","254","423","235","789","258"],
  //         "unit":"分钟",
  //         "type":"line"
  //       }
  //     ]
  //   };
  //   resolve(resData)
  // })
}

export async function queryMarkPriceData(params) {
  // console.log(params);
  return request(`${Url.urls[40].url}/comparison`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData = {
  //     "title":"xx",
  //     "list":[
  //       {"name":"成本价占比","value":"15","unit":"%"},
  //       {"name":"成本价占比","value":"85","unit":"%"}
  //     ]};
  //   resolve(resData)
  // })
}

export async function querySellNumberData(params) {
  return request(`${Url.urls[40].url}/comparison`, {
    method: 'POST',
    body: params,
  });
  // return new Promise((resolve)=>{
  //   const resData ={
  //     "title":"xx",
  //     "list":[
  //       {"name":"成本价占比","value":"25","unit":"%"},
  //       {"name":"成本价占比","value":"75","unit":"%"}
  //     ]};
  //   resolve(resData)
  // })
}
