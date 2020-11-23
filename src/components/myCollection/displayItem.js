/**
 * @Description: 其他选项展示条目
 *
 * @author: yinlingyun
 *
 * @date: 2020/03/06
 */
import React,{PureComponent} from 'react';
import { connect } from 'dva';
import styles from './displayItem.less';
import Cookie from '@/utils/cookie';
import { routerState } from '@/utils/tool';

@connect(
  ({searchModels}) => ({searchModels})
)

class DisplayItem extends PureComponent{
    constructor(props){
        super(props);
        this.state={};
    };

  /**
   * @date: 2020/2/10
   * @author liuxiuqian
   * @Description: 方法说明 跳转基站项目
   * @method 方法名 JumpBaseStation
   * @return {返回值类型} 返回值说明
   * @param path
   */
  JumpBaseStation = (path) =>{
    const {token, userId, power, provOrCityId, provOrCityName} = Cookie.getCookie("loginStatus");
    const { hostname, protocol} = window.document.location;
    const hostnameIp = hostname === "localhost" ? "10.244.4.185" : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
    const port = hostnameIp.indexOf("10.244.4.185") === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
    window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`,  "_blank");
  };

  // 页面跳转方法
  // jumpType 跳转类型 1、no表示不可跳转 2、self表示本系统 3、selfSearch表示搜索 4、out表示目前的基站项目 5、other 表示其他项目http的地址
  pageJumpFun=(data)=>{
    const {url,jumpType,id,dateType,name} =data;
    const {dispatch,searchModels} = this.props;
    if(jumpType === "self" && url!=='' && url){
      routerState(url,{
        id,
        searchValue: name,
        dateType,
        selectedId: "5",
        type: "menu",
        name,
        title:name,
        hot: 0,
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
      });
      const {typeData}=searchModels;
      let selectedName="全部";
      typeData.forEach((item)=>{
        if (item.id===id){
          selectedName=item.name;
        }
      });
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
  };

  pageJumpFun2(data){
    const {url,id,dateType,name} =data;
    // const {dispatch,searchModels} = this.props;
    const loginStatus = Cookie.getCookie("loginStatus");
    const {token} = loginStatus;
    const re = /^http.+/;
    const pre = /^http.+\?.+/;
    let path = "";
    if (re.test(url)) {
      if (pre.test(url)) {
        path = `${url}&ticket=${token}&source=cloud&token=${token}`;
      } else {
        path = `${url}?ticket=${token}&source=cloud&token=${token}`;
      }
      window.open(path);
    }else if(id === "menuOut" || id === "D11011" || id === "D11009" || path === "/baseStation"){// 基站跳转
      this.JumpBaseStation(path);
    } else{
      routerState(url,{
        id,
        searchValue: name,
        dateType,
        selectedId: "5",
        type: "menu",
        name,
        title:name,
        hot: 0,
      })
    }

  }

  render(){
    const { data } = this.props;
    const{name} = data;
      return (
        <div className={styles.itemCss}>
          <span onClick={()=>this.pageJumpFun2(data)}>{name}</span>
        </div>
      )
  }
}
export default DisplayItem;
