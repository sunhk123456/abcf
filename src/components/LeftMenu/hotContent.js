/**
 * @Description: 二级菜单浮出层组件-热门内容
 *
 * @author: gao-xin
 *
 * @date: 2020/2/6
 */

import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from "./hotContent.less"

import { connect } from 'dva';
import { routerState } from '@/utils/tool';
import Cookie from '@/utils/cookie';

@connect(({ searchModels }) => ({
  searchModels
}))

class HotContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nameList:[],
      // contentData : [
      //   {
      //     id:"二级菜单id",
      //     list:[
      //       {
      //         "id": "021",
      //         "name": "总体业务",
      //         "jumpType": "self",
      //         "url": "",
      //         "dateType": "1",
      //         "searchType": "index"
      //       },
      //       {
      //         "id": "022",
      //         "name": "总体",
      //         "jumpType": "self",
      //         "url": "",
      //         "dateType": "1",
      //         "searchType": "index"
      //       }
      //     ]
      //   },
      //   {
      //     id:"二级菜单id",
      //     list:[
      //       {
      //         "id": "023",
      //         "name": "总体业务1",
      //         "jumpType": "self",
      //         "url": "",
      //         "dateType": "1",
      //         "searchType": "index"
      //       },
      //       {
      //         "id": "024",
      //         "name": "总体2",
      //         "jumpType": "self",
      //         "url": "",
      //         "dateType": "1",
      //         "searchType": "index"
      //       }
      //     ]
      //   },
      // ]
    };
  }

  componentWillMount() {
    const {hotList}=this.props;
    console.log('hotList',hotList);
    // const {contentData} = this.state;
    const nameData = [];
    hotList.forEach(value => {
      nameData.push(value.name);
    });
    console.log('nameData',nameData);
    this.setState({
      nameList : nameData,
    })
  }

  componentDidMount() {

  }

  onSelect = value => {
    const {hotList}=this.props;

    let one = [];
    // console.log('hotList',hotList);

    hotList.forEach(val=>{
      if(val.name === value){
        one = val;
        console.log('hotList',one);
      }
    })

    const itemData = one;
    const {dispatch,searchModels,twoMenuId} = this.props;
    const { jumpType, url, id, dateType,name,searchType } = itemData;

    // jumpType 跳转类型
    // 1、no表示不可跳转
    // 2、self表示本系统
    // 3、selfSearch表示搜索
    // 4、out表示目前的基站项目
    // 5、other 表示其他项目http的地址
    // searchType类型
    // 1.index指标
    // 2.special专题
    // 3.report报告
    // 4.statement报表
    // 5．other 其他
    console.log('searchType')
    console.log(searchType)

    // 日志记录开始
    dispatch({
      type: 'logModels/menuLogFetch',
      payload: {
        params:{
          menuId: id,
          isHot: "0",
        },
        pId: twoMenuId,
      },
    });

    if(searchType==="index"){
      dispatch({
        type: 'logModels/indexDetailsFetch',
        payload: {
          markType: id,
          requestUrlPath: url,
          hot: "1"
        },
      });
    }else if(searchType==="special"){
      dispatch({
        type: 'logModels/specialReportLogFetch',
        payload: {
          markType: id,
          requestUrlPath: url,
          hot: "1"
        },
      });
    }else if(searchType==="report"){
      // 后台有，不发请求
      console.log('点击了报告')
    }else if(searchType==="statement"){
      dispatch({
        type: 'logModels/reportTableLogFetch',
        payload: {
          markType: id,
          requestUrlPath: url,
          hot: "1"
        },
      });
    }else if(searchType==="other"){
      dispatch({
        type: 'logModels/otherFetch',
        payload: {
          markType: id,
          requestUrlPath: url,
          hot: "1"
        },
      });
    }
    // 日志记录结束

    if(jumpType === "self"){
      routerState(url,{
        id,
        searchValue: name,
        dateType,
        selectedId: twoMenuId,
        type: "menu",
        name,
        title:name,
        hot: 1,
      })
    }else if(jumpType === "selfSearch"){
      console.log("跳转搜索页")
      console.log(itemData,twoMenuId)
      // 清空搜索 展示内容标记为 菜单点击
      dispatch({
        type: 'searchModels/setSearchContent',
        payload: {name: "", searchType: 1},
      });
      const {typeData}=searchModels;
      let selectedName="全部";
      console.log(typeData)
      typeData.forEach((item)=>{
        if (item.id===twoMenuId){
          selectedName=item.name;
        }
      })

      // 清理数据
      dispatch({
        type: 'searchPageModels/getCleanData',
      });
      // 更新搜索类型
      dispatch({
        type: 'searchModels/setSelectType',
        payload: {
          twoMenuId,
          name:selectedName
        },
      });

      // 更新搜索框展示内容
      dispatch({
        type: 'searchModels/setSearchContent',
        payload: {name, searchType: 1},
      });
      // // 更新搜索框实际搜索内容
      // dispatch({
      //   type: 'searchModels/setSelectName',
      //   payload:"",
      // });
      // 重置搜索页面页码为1
      dispatch({
        type: 'searchPageModels/setSearchPage',
        payload: {page:1},
      });
      window.scrollTo(0,0);
      let  params = {}
      if(twoMenuId !== "1"){
        params = {
          searchType: twoMenuId,
          search: id,
          tabId:"-1",
          numStart:1,
          num:"10"
        }
      }else {
        params = {
          area:"",
          date:"",
          dayOrmonth: "-1",
          searchType:twoMenuId,
          search:id,
          tabId:"-1",
          numStart:1,
          num:"10",
        }
      }

      console.log(params)
      // dispatch({
      //   type: 'searchPageModels/getSearchData',
      //   payload: params,
      //   sign:true, // 若为非滚动时间都需要传这个标志
      // });

      // routerState(url,{
      //   selectedId: twoMenuId,
      //   searchValue: "",
      //   type:"menu",
      //   id: "",
      // })
      routerState(url,{
        id,
        searchValue: name,
        dateType,
        selectedId: twoMenuId,
        type: "menu",
        name,
        title:name,
        hot: 1,
      })

    }else if(jumpType === "out"){
      this.JumpBaseStation(url);
    }else if(jumpType === "other"){
      const {token} = Cookie.getCookie("loginStatus");
      const pre = /^http.+\?.+/;
      let path = "";
      if (pre.test(url)) {
        path = `${url}&ticket=${token}&source=cloud&token=${token}`;
      } else {
        path = `${url}?ticket=${token}&source=cloud&token=${token}`;
      }
      window.open(path);
    }

  }

  JumpBaseStation = (path) =>{
    const {token, userId, power, provOrCityId, provOrCityName} = Cookie.getCookie("loginStatus");
    const { hostname, protocol} = window.document.location;
    const hostnameIp = hostname === "localhost" ? "10.244.4.185" : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
    const port = hostnameIp.indexOf("10.244.4.185") === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
    window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`,  "_blank");
  }

  render() {
    // const arr = ['运营总览','重点产品攻坚行动','2I2C业务专题','冰激凌业务专题'];
    const {nameList} = this.state;
    console.log('nameList',nameList);
    return (
      <div className={styles.pageTop}>
        <div className={styles.title}>热门内容:</div>
        {nameList.map((name) => (
          <Button className={styles.butMary} key={name} onClick={() => this.onSelect(name)}>{name}</Button>
          ))}
      </div>
    );
  }
}

export default HotContent;
