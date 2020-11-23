import request from '../utils/request';
import Url from '@/services/urls.json';


export async function queryModuleTab(params) {
  return request(`${Url.urls[9].url}/moduleTab`,{
    method: 'POST',
    body: params,
  });
};


export async function queryIndexName(params) {
  return request(`${Url.urls[9].url}/indexName`,{
    method: 'POST',
    body: params,
  });
};

export async function queryProInfo(params) {
  return request(`${Url.urls[9].url}/area`,{
    method: 'POST',
    body: params,
  });
};

export async function queryMaxDate(params) {
  return request(`${Url.urls[9].url}/maxDate`,{
    method: 'POST',
    body: params,
  });

};

export async function queryAuditTable(params) {
  return request(`${Url.urls[9].url}/auditTable`,{
    method: 'POST',
    body: params,
  });
};

export async function queryConformityTable(params) {
  return request(`${Url.urls[9].url}/conformityTable`,{
    method: 'POST',
    body: params,
  });
};
