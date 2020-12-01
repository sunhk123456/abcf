/**
 * Created by xingxiaodong on 2019/3/12.
 */

import request from '@/utils/request';
import Url from '@/services/urls.json';

// 如果请求为单个的话添加default  默认导出
async function downloadAllListTableData(

  params = {}
) {
  return request(`${Url.urls[13].url}/downloadTable`, {
    method: 'POST',
    body: params,
  })
}

async function downloadAllListItem(
  params = {}
) {
  return request(`${Url.urls[13].url}/allDataDownload`, {
    method: 'POST',
    body: params,
  })
}

// 全量下载筛选条件接口
async function downloadConditionsFetch(params = {}) {
  return request(`${Url.urls[13].url}/downloadConditions`, {
    method: 'POST',
    body: params,
  })
}

// 全量下载筛选条件接口
async function downloadMaxDateFetch(params = {}) {
  return request(`${Url.urls[13].url}/downloadMaxDate`, {
    method: 'POST',
    body: params,
  })
}

// 下载全部文件路径返回接口
async function downloadAllPathFetch(params = {}) {
  return request(`${Url.urls[14].url}/downloadAllPath`, {
    method: 'POST',
    body: params,
  })
}

// 请求首页我的工作台列表数据
async function fetchMyWorkbench(params = {}) {
  return request(`${Url.urls[0].url}/HomePage/myWorkBench`, {
    method: 'POST',
    body: params,
  })
  // console.log(params);
  // return new Promise((resolve)=>{
  //   const resData={
  //     data:[
  //       {
  //         "id":"userCenter",
  //         "name":"公告列表",
  //         "iconName":"icon-gonggao",
  //         "url":""
  //       },
  //       {
  //         "id":"downloadAllList",
  //         "name":"下载列表",
  //         "iconName":"icon-iconset0339",
  //         "url":"downloadAllList"
  //       },
  //       {
  //         "id":"myReply",
  //         "name":"我的反馈",
  //         "iconName":"icon-fankui",
  //         "url":"myReply"
  //       },
  //       {
  //         "id":"myCollection",
  //         "name":"我的收藏",
  //         "iconName":"icon-shoucang",
  //         "url":"myCollection"
  //       },
  //       {
  //         "id":"mySpecialSubject",
  //         "name":"我的专题",
  //         "iconName":"icon-zhuanti",
  //         "url":"mySpecialSubject"
  //       }
  //     ]
  //   };
  //   resolve(resData)
  // })
}

export  {
  downloadAllListTableData,
  downloadAllListItem,
  downloadMaxDateFetch,
  downloadConditionsFetch,
  downloadAllPathFetch,
  fetchMyWorkbench
}



