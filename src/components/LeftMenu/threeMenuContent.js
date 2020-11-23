/**
 * @Description: 三级及以下菜单组件
 *
 * @author: xingxiaodong
 *
 * @date: 2020/2/6
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerState } from '@/utils/tool';
import Cookie from '@/utils/cookie';
import styles from "./threeMenuContent.less"

@connect(({ searchModels }) => ({
  searchModels
}))

class ThreeMenuContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  /**
   * @date: 2020/2/10
   * @author liuxiuqian
   * @Description: 方法说明 跳转基站项目
   * @method 方法名 JumpBaseStation
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  JumpBaseStation = (path) =>{
    const {token, userId, power, provOrCityId, provOrCityName} = Cookie.getCookie("loginStatus");
    const { hostname, protocol} = window.document.location;
    const hostnameIp = hostname === "localhost" ? "10.244.4.185" : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
    const port = hostnameIp.indexOf("10.244.4.185") === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
    window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`,  "_blank");
  };

  // 处理三级菜单获得dom
  treeMenuHandleData=(list,currentFloor=3)=>{
    let floor =currentFloor;
    const dom=list.map((item)=>{
      if(floor>3&&item.children.length===0){
        floor=5;
      }else {
        floor=currentFloor
      }
      return(
        <div className={styles[`menuFloor${floor}`]} key={item.menuId}>
          {item.name !== "" &&
          <div
            className={styles[`menuFloorName${floor}`]}
            style={{cursor: item.jumpType !== "no" ? "pointer" : "auto"}}
            onClick={() => this.menuOnClick(item)}
          >
            {item.name}
            {(floor === 3 || floor === 4) && ":"}
            {floor === 3 && (
              <span
                className={styles.more}
                onClick={() => this.moreFunction(item)}
              >
                {`更多>>>`}
              </span>
            )}
          </div>}
          {item.children && item.children.length!==0 &&
          <div className={styles[`menuFloorChildren${floor}`]}>
            {this.treeMenuHandleData(item.children, floor + 1)}
          </div>}
        </div>
      )
    });
    return dom
  };
  
  // 点击更多调用方法
  moreFunction = param => {
    console.info(param);
  };

  /**
   * @date: 2020/2/10
   * @author xingxiaodong
   * @Description: 方法说明 点击三级菜单事件
   * @method 方法名 clickSecondMenu
   * @param {参数类型| object} 参数名 item 参数说明 被点击项的详细内容
   * @return {返回值类型} 返回值说明
   */
  menuOnClick(itemData){

    console.log('itemData',itemData);
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
          hot: "0"
        },
      });
    }else if(searchType==="special"){
      dispatch({
        type: 'logModels/specialReportLogFetch',
        payload: {
          markType: id,
          requestUrlPath: url,
          hot: "0"
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
          hot: "0"
        },
      });
    }else if(searchType==="other"){
      dispatch({
        type: 'logModels/otherFetch',
        payload: {
          markType: id,
          requestUrlPath: url,
          hot: "0"
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
        hot: 0,
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
  




  render() {
    const {menuData}=this.props;
    const dom=this.treeMenuHandleData(menuData);
    return (
      <div className={styles.page}>
        {dom}
      </div>
    );
  }
}

export default ThreeMenuContent;
