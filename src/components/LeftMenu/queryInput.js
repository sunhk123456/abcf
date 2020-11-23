/**
 * @Description: 二级菜单浮出层组件-搜索框
 *
 * @author: gaoxin
 *
 * @date: 2020/2/6
 */

import React, { PureComponent } from 'react';
import { AutoComplete } from 'antd';
import { connect } from 'dva';
import { routerState } from '@/utils/tool';
import Cookie from '@/utils/cookie';

import styles from "./queryInput.less"

import img from "../../assets/image/leftMenu/u1635.png"

@connect(
  ({newMenuModel}) => (
    {
      newMenuModel,
      downData:newMenuModel.downData,
    })
)

@connect(({ searchModels }) => ({
  searchModels
}))


class QueryInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      oneList : []
    };
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  JumpBaseStation = (path) =>{
    const {token, userId, power, provOrCityId, provOrCityName} = Cookie.getCookie("loginStatus");
    const { hostname, protocol} = window.document.location;
    const hostnameIp = hostname === "localhost" ? "10.244.4.185" : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
    const port = hostnameIp.indexOf("10.244.4.185") === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
    window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`,  "_blank");
  }

  onSearch = searchText => {
    const {dispatch,twoMenuId} = this.props;
    dispatch({
      type: 'newMenuModel/getDownData',
      payload: {menuId:twoMenuId,query:searchText},
    });

    const nameList = [];
    const {downData}=this.props;

    if(downData){
      downData.forEach(val=>{
        nameList.push(val.name)
      })
      console.log('downData',downData);
      // console.log('dataSource',dataSource);
      // const {dataSource = this.state;
    }

    console.log(11111);
    this.setState({
      // dataSource: !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)],
      dataSource : nameList,
      oneList : downData
    });
  };

  onSelect = value => {
    // console.log('onSelect', value);
    let one = [];
    const { oneList } = this.state;
    // console.log('oneList',oneList);

    oneList.forEach(val=>{
      if(val.name === value){
        one = val;
        console.log('oneList',one);
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

  // menuOnClick(itemData){
  //
  // }

  render() {
    const { dataSource} = this.state;
    return (
      <div className={styles.pageQuery}>
        <AutoComplete
          className={styles.queryInput}
          dataSource={dataSource}
          onSelect={this.onSelect}
          onSearch={this.onSearch}
          placeholder="请输入搜索内容"
          defaultActiveFirstOption="false"
        />
        <div>
          <img className={styles.img} src={img} alt="" />
        </div>
      </div>
    );
  }
}

export default QueryInput;
