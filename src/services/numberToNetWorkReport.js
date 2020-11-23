// import request from '../utils/request';
// import Url from '@/services/urls.json'

export default async function queryReportData(params) {
  // return request(`${Url.urls[25].url}/userTable`,{
  //   method:'POST',
  //   body:params,
  // });
  console.log(params);
  return new Promise((resolve)=>{
    const resData = {
      'titleName': '',
      'info': [
        '截止到xx月xx日xx点：',
        '1）对于非试验26省，联通净携入xx人次，电信净携入xx人次，移动净携入xx人次。',
        '2）全国31省，联通净携入xx人次，电信净携入xx人次，移动净携入xx人次。',
        '3）联通全国携出xx人次，携入xx人次；其中，非试验26省携出xx人次，携入xx人次，试验5省携出xx人次，携入xx人次。',
      ],
      'tBodyData': [
        {
          'testMark': true,
          'key': '01',
          'prov': '北京-省份字段',
          'total': '查询资格-总量',
          
          'queryNotMatchNumber': '查询资格-其中，不符合条件数量',
          'queryNotMatchPercent': '查询资格-其中，不符合条件占比',
          'queryMatchNumber': '查询资格-其中：符合条件数量',
          'queryMatchPercent': '查询资格-其中：符合条件占比',
          'queryApplyNumber': '查询资格-其中：符合条件-给予授权数量',
          'queryApplyPercent': '查询资格-其中：符合条件-给予授权占比',
          'queryApplySuccess': '携出查询情况-其中：符合条件-授权成功数量',
          
          'unicomOutNumber': '联通-携出用户数量',
          'unicomOutPercent': '联通-携出用户占比',
          'unicomJoinNumber': '联通-携入用户数量',
          'unicomNetJoinNumber': '联通-净携出用户数量',
          'unicomNetJoinYestodayPercent': '联通-净携出用户-昨日环比',
          'unicomNetJoinTodayPercent': '联通-净携出用户-本日环比',
          
          'telecomOutNumber': '电信-携出用户数量',
          'telecomJoinNumber': '电信-携入用户数量',
          'telecomNetJoinNumber': '电信-净携出用户数量',
          'telecomNetJoinYestodayPercent': '电信-净携出用户-昨日环比',
          'telecomNetJoinTodayPercent': '电信-净携出用户-本日环比',
          
          'mobileOutNumber': '移动-携出用户数量',
          'mobileJoinNumber': '移动-携入用户数量',
          'mobileNetJoinNumber': '移动-净携出用户数量',
          'mobileNetJoinYestodayPercent': '移动-净携出用户-昨日环比',
          'mobileNetJoinTodayPercent': '移动-净携出用户-本日环比',
          
          'totalNumber': '携转总人数-数量',
          'totalYestodayPercent': '携转总人数-昨日环比',
          'totalTodayPercent': '携转总人数-本日环比',
        }],
      
    };
    resolve(resData)
  })
}



