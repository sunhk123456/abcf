// import request from '../utils/request';
// import Url from '@/services/urls.json'

export default async function queryTableData(params) {
  // 表格一
  // return request(`${Url.urls[25].url}/userTable`,{
  //   method:'POST',
  //   body:params,
  // });
  console.log(params);
  return new Promise((resolve) => {
    const resData = {
      titleName: '',
      tBodyData: [
        {
          'testMark': true,
          'key': '01',
          'prov': '北京-省份字段',
          'city': '北京-地市字段',
          'queryCheckout': '携出查询情况-携出校验查询数量',
          'queryMatch': '携出查询情况-其中：符合条件数量',
          'queryApply': '携出查询情况-申请携出授权数量',
          'queryApplySuccess': '携出查询情况-其中：授权成功数量',
          'unicomOutNumber': '联通携出情况-携出用户数量',
          'unicomOutMobile': '联通携出情况-其中：携入移动数量',
          'unicomOutTelecom': '联通携出情况-其中：携入电信数量',
          'unicomJoinNumber': '联通携入情况-携入用户数量',
          'unicomJoinMobile': '联通携入情况-其中：移动携出数量',
          'unicomJoinTelecom': '联通携入情况-其中：电信携出数量',
          'mobileOutNumber': '移动携出情况-携出用户数量',
          'mobileOutUnicom': '移动携出情况-其中：携入联通数量',
          'mobileOutTelecom': '移动携出情况-其中：携入电信数量',
          'mobileJoinNumber': '移动携入情况-携入用户数量',
          'mobileJoinUnicom': '移动携入情况-其中：联通携出数量',
          'mobileJoinTelecom': '移动携入情况-其中：电信携出数量',
          'telecomOutNumber': '电信携出情况-携出用户数量',
          'telecomOutUnicom': '电信携出情况-其中：携入联通数量',
          'telecomOutMobile': '电信携出情况-其中：携入移动数量',
          'telecomJoinNumber': '电信携入情况-携入用户数量',
          'telecomJoinUnicom': '电信携入情况-其中：携出联通数量',
          'telecomJoinMobile': '电信携入情况-其中：携出移动数量',
        },
      ],
    };
    resolve(resData);
  });
}



