/**
 * Created by liuxiuqian on 2019/1/7.
 */

import request from '@/utils/request';
import Url from '@/services/urls.json';

export  async function proCityData(params = {}) {
  return request(`${Url.urls[2].url}/indexDetails/area`,{
    method: 'POST',
    body: params,
  });
}

// 搜索框类型数据
export  async function typeDataFetch(params = {}) {
  return request( `${Url.urls[0].url}/HomePage/headerSelect`,{
    method: 'POST',
    body: params,
  });
}

// 搜索框 搜索提醒数据
export  async function recommendListFetch(params = {}) {
  return request( `${Url.urls[0].url}/HomePage/recommendList`,{
    method: 'POST',
    body: params,
  });
}

// 请求搜索数据接口
export  async function searchDataFetch(params = {}) {
  let url = "";
  if(params.searchType === "999"){
    url = "allSearch";
  }else if(params.searchType === "1"){
    url = "indexSearch";
  }else if(params.searchType === "2"){
    url = "specialSearch";
  }else if(params.searchType === "3"){
    url = "reportSearch";
  }else if(params.searchType === "4"){
    url = "statementSearch";
  }
  return request( `${Url.urls[0].url}/HomePage/${url}`,{
    method: 'POST',
    body: {moduleId:"111",...params},
  });
}

// 搜索框 指标最大账期请求
export  async function maxDateFetch(params = {}) {
  return request( `${Url.urls[0].url}/HomePage/maxDate`,{
    method: 'POST',
    body: params,
  });
}

// 推荐类型数据
export  async function recentVisitFetch(params = {}) {
  return request( `${Url.urls[0].url}/HomePage/recentVisit`,{
    method: 'POST',
    body: params,
  });
}

// 推荐内容数据
export  async function recommendVisitFetch(params = {}) {
  return request( `${Url.urls[0].url}/HomePage/recommendVisit`,{
    method: 'POST',
    body:  {moduleId:"111",...params},
  });
}


// 近期访问内容数据
export  async function recentVisitListFetch(params = {}) {
  return request( `${Url.urls[0].url}/HomePage/recentVisitList`,{
    method: 'POST',
    body:  {moduleId:"111",...params},
  });
}

// 收藏接口
export  async function collectionFetch(params = {}) {
  return request( `${Url.urls[46].url}/collect`,{
    method: 'POST',
    body: params,
  });
}
