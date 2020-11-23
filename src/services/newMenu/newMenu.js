/**
 * @date: 2020/2/10
 * @author 喵帕斯
 * @Description: 新版菜单
 */

import request from "../../utils/request";
import Url from '@/services/urls.json'

// 请求一级菜单数据
export async function queryFirstMenuData(params) {
  // console.log(1111)
  // console.log(`${Url.urls[47].url}`)
  // return request(`${Url.urls[47].url}/firstMenu`,{
  //   method:'POST',
  //   body:params,
  // });
  console.log(params);
  return new Promise((resolve)=>{
    const resData = {
      data: [
        {
          menuName: '工作台',
          menuId: '01',
          menuIcon: 'workIcon',
          url: 'www.baidu.com',
          jumpType: 'self',
          fetchSecondMenu: 'true',
          children: [
            {
              menuName: '我的专题',
              menuId: '0101',
              menuIcon: '图标',
              url: 'www.baidu.com',
              jumpType: 'self',
              fetchSecondMenu: 'false',
            },
            {
              menuName: '我的收藏',
              menuId: '0102',
              menuIcon: '图标',
              url: 'www.baidu.com',
              jumpType: 'self',
              fetchSecondMenu: 'false',
            },
            {
              menuName: '我的下载',
              menuId: '0103',
              menuIcon: '图标',
              url: 'www.baidu.com',
              jumpType: 'self',
              fetchSecondMenu: 'false',
            },
          ],
        },
        {
          menuName: '公众业务',
          menuId: '02',
          menuIcon: 'publicBusiness',
          url: 'www.baidu.com',
          jumpType: 'self',
          fetchSecondMenu: 'false',
          children: [],
        },
        {
          menuName: '政企业务',
          menuId: '03',
          menuIcon: 'govermentBusiness',
          url: 'www.baidu.com',
          jumpType: 'self',
          fetchSecondMenu: 'true',
          children: [
            {
              menuName: '我的专题',
              menuId: '0301',
              menuIcon: '图标',
              url: 'www.baidu.com',
              jumpType: 'self',
              fetchSecondMenu: 'false',
            },
            {
              menuName: '我的收藏',
              menuId: '0302',
              menuIcon: '图标',
              url: 'www.baidu.com',
              jumpType: 'self',
              fetchSecondMenu: 'false',
            },
            {
              menuName: '我的下载',
              menuId: '0303',
              menuIcon: '图标',
              url: 'www.baidu.com',
              jumpType: 'self',
              fetchSecondMenu: 'false',
            },
          ],
        },
      ],
    };
    resolve(resData)
  })
}

// 请求二级菜单和热门内容数据
export async function querySecondMenuData(params) {
  console.log(params);

  // // 请求二级菜单数据
  // const p1= request(`${Url.urls[47].url}/nav`,{
  //   method:'POST',
  //   body:params,
  // });
  const p1=new Promise((resolve)=>{
    const resData =  {
      code:'200',
      message:'success',
      data:[
        {
          "id": "01",
          "menuId":"01",
          "name": "运营总览",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "02",
          "menuId":"02",
          "name": "业务专题",
          "jumpType": "selfSearch",
          "url": "/search",
          "searchBox": "true",
          "isHot": "true",
          "children": [
            {
            "id": "021",
            "name": "总体业务",
            "jumpType": "no",
            "url": "",
            "dateType": "",
            "searchType": "",
            "children": [{
              "id": "0210",
              "name": "",
              "jumpType": "no",
              "url": "",
              "dateType": "",
              "searchType": "",
              "children": [{
                "id": "0210001",
                "name": "运营关注(日)",
                "jumpType": "self",
                "url": "/specialReport",
                "dateType": "1",
                "searchType": "special",
                "children": []
              },
                {
                  "id": "0210",
                  "menuId": "021000",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "0210xx0",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "02101",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "02102",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "02103",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "02104",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "02105",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "0210x6",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "0210x16",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "0210x26",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "0210x36",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "0210x46",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "0210x56",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "0210aaa16",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
                {
                  "id": "0210",
                  "menuId": "02106a2",
                  "name": "运营关注(月)",
                  "jumpType": "self",
                  "url": "/specialReport",
                  "dateType": "2",
                  "searchType": "special",
                  "children": []
                },
              ]
            }]
          },
            {
              "id": "023",
              "menuId": "02xsswww1",
              "name": "CBSS套餐",
              "jumpType": "no",
              "url": "",
              "dateType": "",
              "searchType": "",
              "children": []
            },
            {
              "id": "023",
              "menuId": "02xdserwttt1",
              "name": "CBSS套餐",
              "jumpType": "no",
              "url": "",
              "dateType": "",
              "searchType": "",
              "children": []
            },







          ]
        },
        {
          "id": "03",
          "menuId":"03",
          "name": "统计报表",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "04",
          "menuId":"04",
          "name": "自助探索",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "05",
          "menuId":"05",
          "name": "知识库",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "06",
          "menuId":"06",
          "name": "数据管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "07",
          "menuId":"07",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "08",
          "menuId":"08",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "09",
          "menuId":"09",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "10",
          "menuId":"10",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "11",
          "menuId":"11",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "12",
          "menuId":"12",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "13",
          "menuId":"13",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "14",
          "menuId":"14",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },
        {
          "id": "15",
          "menuId":"15",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },     {
          "id": "16",
          "menuId":"16",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        },     {
          "id": "17",
          "menuId":"17",
          "name": "系统管理",
          "jumpType": "self",
          "url": "/dayOverview",
          "searchBox": "false",
          "isHot": "false",
          "children": []
        }
      ]
    };
    resolve(resData)
  });

  // // 请求热门内容数据
  // const p2= request(`http://10.249.216.117:8045/HomePage/hotContent`,{
  //   method:'POST',
  //   body:params,
  // });
  const p2=new Promise((resolve)=>{
    const resData = {
      code:'200',
      message:'success',
      data:[
        {
          id:"02",
          list:[
            {
              "id": "021",
              "name": "总体业务111",
              "jumpType": "self",
              "url": "",
              "dateType": "1",
              "searchType": "index"
            },
            {
              "id": "022",
              "name": "总体",
              "jumpType": "self",
              "url": "",
              "dateType": "1",
              "searchType": "index"
            }
          ]
        },
        {
          id:"03",
          list:[
            {
              "id": "023",
              "name": "总体业务1",
              "jumpType": "self",
              "url": "",
              "dateType": "1",
              "searchType": "index"
            },
            {
              "id": "024",
              "name": "总体2",
              "jumpType": "self",
              "url": "",
              "dateType": "1",
              "searchType": "index"
            }
          ]
        },
      ]
    };
    resolve(resData)
  });
  return Promise.all([p1, p2]).then((result) => result.map(item=>item.data)).catch(() => "error")
}



// 请求搜索下拉
export async function queryDownData(params) {
  // return request(`${Url.urls[47].url}/queryContent`,{
  //   method:'POST',
  //   body:params,
  // });
  // console.log(params);
  return new Promise((resolve)=>{
    const resData ={
      data:[
        {
          "id": "EX0201001",
          "name": "运营概况",
          "jumpType": "self",
          "url": "/specialReport",
          "dateType": "1",
          "searchType": "other"
        },
        {
          "id": "EX0201001",
          "name": "运营",
          "jumpType": "self",
          "url": "/specialReport",
          "dateType": "1",
          "searchType": "other"
        }
      ]
    };
    resolve(resData)
  })
}
