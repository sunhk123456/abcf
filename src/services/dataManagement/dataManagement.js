/**
 * @Description: 数据管理
 *
 * @author: yuzihao
 *
 * @date: 2020/7/17
 */
import request from '../../utils/request';
import Url from '@/services/urls.json';

// 筛选条件接口
export async function queryCondition(params) {
  // return request(`${Url.urls[53].url}/condition`, {
  //   method: 'POST',
  //   body: params,
  // });

  return new Promise((resolve)=>{
    const resData = {
      data: [
        {
          "name": "CB网别编码",
          "id": "CB网别编码",
          "type": "input",
          "children": [],

        },
        {
          "name": "CB品牌编码",
          "id": "CB品牌编码",
          "type": "input",
          "children": [],
        },
        {
          "name": "备注",
          "id": "备注",
          "type": "input",
          "children": [],

        },
        {
          "name": "总部经分业务类型子类编码",
          "id": "总部经分业务类型子类编码",
          "type": "input",
          "children": [],

        },
        {
          "name": "状态",
          "id": "状态",
          "type": "select",
          "children": [
            {
              "id":"01",
              "name":"状态1"
            },
            {
              "id":"02",
              "name":"状态2"
            },
          ],

        },
      ]
    };
    resolve(resData)
  })

}

export async function queryDownloadTable(params){
  return request(`${Url.urls[7].url}/downloadSubjectTable`, {
    method: 'POST',
    body: params,
  });
}

// 表格接口
export async function queryTable(params) {
  // return request(`${Url.urls[53].url}/table`, {
  //   method: 'POST',
  //   body: params,
  // });

  console.log(params)
  return new Promise((resolve)=>{
    const resData = {
      data: {
        "thData": [
          {
            "title": "CB网别编码",
            "dataIndex": "a"
          },
          {
            "title": "CB网别名称",
            "dataIndex": "b"
          },
          {
            "title": "CB品牌编码",
            "dataIndex": "c"
          },
          {
            "title": "CB品牌名称",
            "dataIndex": "d"
          },
          {
            "title": "备注",
            "dataIndex": "e"
          },
          {
            "title": "总部经分业务类型子类编码",
            "dataIndex": "f"
          },
          {
            "title": "总部经分业务类型子类含义",
            "dataIndex": "g"
          },
          {
            "title": "总部经分业务务统计大类",
            "dataIndex": "h"
          },
          {
            "title": "状态",
            "dataIndex": "i",
            "hasSort":"true"
          },
          {
            "title": "修改日期",
            "dataIndex": "j",
            "hasSort":"true"
          },
          {
            "title": "失效日期",
            "dataIndex": "k",
            "hasSort":"false"
          },
        ],
        "tbodyData": [
          {
            "key":"1",
            "a": "互联网接入",
            "b": "AVPN",
            "c": "ADSL+VPDN",
            "d": "20200630内蒙古申请",
            "e": "0499AAAA",
            "f": "ADSL虚拟拨号",
            "g": "宽带业务",
            "h": "已生效",
            "i": "2020-06-30",
            "j": "40",
            "k": "2020-06-30",
          },
          {
            "key":"2",
            "a": "互联网接入",
            "b": "AVPN",
            "c": "ADSL+VPDN",
            "d": "20200630内蒙古申请",
            "e": "0499AAAA",
            "f": "ADSL虚拟拨号",
            "g": "宽带业务",
            "h": "已生效",
            "i": "2020-06-30",
            "j": "40",
            "k": "2020-06-30",
          },
          {
            "key":"3",
            "a": "互联网接入",
            "b": "AVPN",
            "c": "ADSL+VPDN",
            "d": "20200630内蒙古申请",
            "e": "0499AAAA",
            "f": "ADSL虚拟拨号",
            "g": "宽带业务",
            "h": "已生效",
            "i": "2020-06-30",
            "j": "40",
            "k": "2020-06-30",
          },
          {
            "key":"4",
            "a": "互联网接入",
            "b": "AVPN",
            "c": "ADSL+VPDN",
            "d": "20200630内蒙古申请",
            "e": "0499AAAA",
            "f": "ADSL虚拟拨号",
            "g": "宽带业务",
            "h": "已生效",
            "i": "2020-06-30",
            "j": "40",
            "k": "2020-06-30",
          },
          {
            "key":"5",
            "a": "互联网接入",
            "b": "AVPN",
            "c": "ADSL+VPDN",
            "d": "20200630内蒙古申请",
            "e": "0499AAAA",
            "f": "ADSL虚拟拨号",
            "g": "宽带业务",
            "h": "已生效",
            "i": "2020-06-30",
            "j": "40",
            "k": "2020-06-30",
          },
          {
            "key":"6",
            "a": "互联网接入",
            "b": "AVPN",
            "c": "ADSL+VPDN",
            "d": "20200630内蒙古申请",
            "e": "0499AAAA",
            "f": "ADSL虚拟拨号",
            "g": "宽带业务",
            "h": "已生效",
            "i": "2020-06-30",
            "j": "40",
            "k": "2020-06-30",
          },
          {
            "key":"7",
            "a": "互联网接入",
            "b": "AVPN",
            "c": "ADSL+VPDN",
            "d": "20200630内蒙古申请",
            "e": "0499AAAA",
            "f": "ADSL虚拟拨号",
            "g": "宽带业务",
            "h": "已生效",
            "i": "2020-06-30",
            "j": "40",
            "k": "2020-06-30",
          },
          {
            "key":"8",
            "a": "互联网接入",
            "b": "AVPN",
            "c": "ADSL+VPDN",
            "d": "20200630内蒙古申请",
            "e": "0499AAAA",
            "f": "ADSL虚拟拨号",
            "g": "宽带业务",
            "h": "已生效",
            "i": "2020-06-30",
            "j": "40",
            "k": "2020-06-30",
          },
          {
            "key":"9",
            "a": "互联网接入",
            "b": "AVPN",
            "c": "ADSL+VPDN",
            "d": "20200630内蒙古申请",
            "e": "0499AAAA",
            "f": "ADSL虚拟拨号",
            "g": "宽带业务",
            "h": "已生效",
            "i": "2020-06-30",
            "j": "40",
            "k": "2020-06-30",
          },
          {
            "key":"10",
            "a": "互联网接入",
            "b": "AVPN",
            "c": "ADSL+VPDN",
            "d": "20200630内蒙古申请",
            "e": "0499AAAA",
            "f": "ADSL虚拟拨号",
            "g": "宽带业务",
            "h": "已生效",
            "i": "2020-06-30",
            "j": "40",
            "k": "2020-06-30",
          }
        ],
        "total":"100",
        "currentPage":params.currentPage,
        "title":"标题",
        "totalPage":"50"
      }
    };
    resolve(resData)
  })
}

