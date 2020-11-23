import request from '../utils/request';
import Url from '@/services/urls.json'

export async function queryModuleTab(params) {
  return request(`${Url.urls[25].url}/moduleTab`,{
    method:'POST',
    body:params,
  });
}

export async function queryTableData(params) {
  return request(`${Url.urls[25].url}/tableData`,{
    method:'POST',
    body:params,
  });
}

export async function queryReplyData(params) {
  return request(`${Url.urls[25].url}/replyInfo`,{
    method:'POST',
    body:params,
  });
}

export async function queryCommitReply(params) {
  return request(`${Url.urls[25].url}/submitReply`,{
    method:'POST',
    body:params,
  });
}

export async function queryDateRange(params) {
  return request(`${Url.urls[25].url}/dateRange`,{
    method:'POST',
    body:params,
  });
}

export async function queryProblemType(params) {
  return request(`${Url.urls[25].url}/problemType`,{
    method:'POST',
    body:params,
  });
}

export async function querySearchTableData(params) {
  return request(`${Url.urls[25].url}/tableData`,{
    method:'POST',
    body:params,
  });
}

export async function queryPageNavData(params) {
  return request(`${Url.urls[25].url}/pageNavData`,{
    method:'POST',
    body:params,
  });
}

export async function querySubmitFeedback(params) {
  return request(`${Url.urls[25].url}/problemSubmit`,{
    method:'POST',
    body:params,
  });
}

export async function querySearchMenu(params) {
  return request(`${Url.urls[25].url}/searchMenu`,{
    method:'POST',
    body:params,
  });
}

// 模块日志接口
export async function queryModuleLog(params) {
  // return request(`${Url.urls[25].url}/queryModuleLog`,{
  //   method:'POST',
  //   body:params,
  // });
  console.log(params);
  return new Promise((resolve)=>{
    const resData = {
      code:"200",
      message:"成功"
    };
    resolve(resData)
  })
}
