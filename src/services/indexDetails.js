/* eslint-disable prefer-template */
import request from '../utils/request';
import Url from '@/services/urls.json';


export async function queryScreenCondition(params) {
  return request(Url.urls[2].url+"/indexDetails/screenCondition",{
    method: 'POST',
    body: params,
  });
};

export async function queryIndexDescrip(params) {
  return request(Url.urls[2].url+"/indexDetails/indexDescrip",{
    method: 'POST',
    body: params,
  });
};

export async function queryAreaInfo(params) {
  return request(Url.urls[2].url+"/indexDetails/area",{
    method:'POST',
    body:params,
  })
};

export async function queryChartTypes(params) {
  return request(Url.urls[2].url+"/indexDetails/chartTypes",{
    method:"POST",
    body:params,
  })
};

export async function queryDayTrend(params) {
  return request(Url.urls[2].url+"/indexDetails/dayTrend",{
    method:"POST",
    body:params,
  })
};

export async function queryMonthBar(params) {
  return request(Url.urls[2].url+"/indexDetails/monthBar",{
    method:"POST",
    body:params,
  })
};

export async function queryYearBar(params) {
  return request(Url.urls[2].url+"/indexDetails/yearBar",{
    method:"POST",
    body:params,
  })
};

export async function queryCityBar(params) {
  return request(Url.urls[2].url+"/indexDetails/cityBar",{
    method:"POST",
    body:params,
  })
};

export async function queryCityRank(params) {
  return request(Url.urls[2].url+"/indexDetails/cityRank",{
    method:"POST",
    body:params,
  })
};
export async function queryChannel(params) {
  return request(Url.urls[2].url+"/indexDetails/conditionChart",{
    method:"POST",
    body:params,
  })
};

export async function queryProduct(params) {
  return request(Url.urls[2].url+"/indexDetails/conditionChart",{
    method:"POST",
    body:params,
  })
};

export async function queryBusinessPie(params) {
  return request(Url.urls[2].url+"/indexDetails/conditionChart",{
    method:"POST",
    body:params,
  })
}
export async function queryConditionChart(params) {
  return request(Url.urls[2].url+"/indexDetails/conditionChart",{
    method:"POST",
    body:params,
  })
};

export async function queryMaxDate(params) {
  return request(Url.urls[2].url+"/indexDetails/maxDate",{
    method:"POST",
    body:params,
  })
};

export async function queryDateSection(params) {
  return request(Url.urls[2].url+"/indexDetails/dateSection",{
    method:"POST",
    body:params,
  })
};

export async function queryIDTableData(params) {
  return request(Url.urls[2].url+"/indexDetails/kpiRegionRankTable",{
    method:"POST",
    body:params,
  })
};
