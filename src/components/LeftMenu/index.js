/**
 * @Description: 左侧菜单 外布局容器组件
 *
 * @author: liuxiuqian
 *
 * @date: 2020/2/6
 */

import React, { PureComponent } from 'react';
import classNames from "classnames";
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import RightMenuPop from './rightMenuPop';
import { routerState } from '@/utils/tool';
import Cookie from '@/utils/cookie';
import styles from "./index.less";
// @ts-ignore
import SystemMenu from '@/components/LeftMenu/systemMenu';

@connect(
  ({newMenuModel,searchModels}) => (
    {
      searchModels,
      newMenuModel,
      secondMenuData:newMenuModel.secondMenuData,
      hotContent:newMenuModel.hotContent,
    })
)
class LeftMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showRightMenuPop: false, // 是否显示右边菜单
      rightMenuPopData:{}, // 右边弹窗菜单数据
      secondMenuIndex: '-1', // 二级菜单高亮索引
    };
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'newMenuModel/getSecondMenuData',
      payload: {id:'01'},
    });
    const { hotContent }=this.props;
    console.log('hotContent',hotContent);
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

  /**
   * @date: 2020/2/7
   * @author liuxiuqian
   * @Description: 方法说明 处理右侧菜单显示隐藏
   * @method showRightMenuPop
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  showRightMenuPop(make){
    this.setState({showRightMenuPop:make});
    if(make === false){
      this.setState({secondMenuIndex:"-1"});
    }
  }

  /**
   * @date: 2020/2/7
   * @author liuxiuqian
   * @Description: 方法说明 处理右侧弹窗菜单数据
   * @method childrenMenu
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  childrenMenu(menuId,children,id,isHot,searchBox){
    const {hotContent} =this.props;
    console.log("hotContent");
    console.log(hotContent);

    let hotList = [];
    hotContent.forEach(val => {
      if(val.id === id){
        hotList = val.list;
        console.log('hotList',hotList);
      }
    });
    this.setState({
      secondMenuIndex:menuId,
      rightMenuPopData:{children,id,isHot,searchBox,hotList}
    })
  }

  /**
   * @date: 2020/2/10
   * @author liuxiuqian
   * @Description: 方法说明 点击二级菜单事件
   * @method 方法名 clickSecondMenu
   * @param {参数类型| object} 参数名 item 参数说明 被点击项的详细内容
   * @return {返回值类型} 返回值说明
   */
  clickSecondMenu(itemData){
    const {dispatch,searchModels} = this.props;
    const { jumpType, url, id ,searchType} = itemData;
    // jumpType 跳转类型 1、no表示不可跳转 2、self表示本系统 3、selfSearch表示搜索 4、out表示目前的基站项目 5、other 表示其他项目http的地址
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
        pId: id, // 应该取父亲id，二级菜单这里取的本身id
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
        id
      })
    }else if(jumpType === "selfSearch"){
      // 清空搜索 展示内容标记为 菜单点击
      dispatch({
        type: 'searchModels/setSearchContent',
        payload: {name: "", searchType: 1},
      });

      routerState(url,{
        selectedId: id,
        searchValue: "",
        type:"menu",
        id: "",
      })
      const {typeData}=searchModels;
      let selectedName="全部";
      typeData.forEach((item)=>{
        if (item.id===id){
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
          id,
          name:selectedName
        },
      });

      // 更新搜索框展示内容
      dispatch({
        type: 'searchModels/setSearchContent',
        payload: {name:"", searchType: 1},
      });
      // 更新搜索框实际搜索内容
      dispatch({
        type: 'searchModels/setSelectName',
        payload:"",
      });
      // 重置搜索页面页码为1
      dispatch({
        type: 'searchPageModels/setSearchPage',
        payload: {page:1},
      });
      window.scrollTo(0,0);
      // const  params = {
      //   area:"",
      //   date:"",
      //   dayOrmonth: "-1",
      //   searchType:id,
      //   search:"",
      //   tabId:"-1",
      //   numStart:1,
      //   num:"10",
      // }
      // dispatch({
      //   type: 'searchPageModels/getSearchData',
      //   payload: params,
      //   sign:true, // 若为非滚动时间都需要传这个标志
      // });

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
    const {secondMenuData} = this.props;
    const {showRightMenuPop, rightMenuPopData,secondMenuIndex} = this.state;
    const secondMenuDom = secondMenuData.map((item)=>{
      const {name,children,id,isHot,searchBox,jumpType,menuId} = item;
      return (
        <div key={menuId} className={classNames(styles.secondMenuItem,secondMenuIndex === menuId ? styles.secondMenuItemHighlight : null)} onMouseEnter={()=>this.childrenMenu(menuId,children,id,isHot,searchBox)}>
          <div className={styles.itemName} onClick={()=>jumpType !== "no" ? this.clickSecondMenu(item) : null}>{name}</div>
        </div>
      )
    });

    return (
      <div className={styles.newMenu}>
        <div className={styles.menuFixed}>
          <div className={styles.leftMenu}>
            <div className={styles.leftMenuContent}>
              <SystemMenu />
            </div>
          </div>
          <div className={styles.rightMenu}>
            <div
              className={styles.secondMenu}
              onMouseEnter={()=>this.showRightMenuPop(true)}
              onMouseLeave={()=>this.showRightMenuPop(false)}
            >
              {secondMenuDom}
              {showRightMenuPop && !isEqual(rightMenuPopData,{}) && rightMenuPopData.children.length > 0 && (
                <div className={styles.rightMenuPop}>
                  <RightMenuPop rightMenuPopData={rightMenuPopData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default LeftMenu;
