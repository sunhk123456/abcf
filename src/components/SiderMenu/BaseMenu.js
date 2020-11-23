/* eslint-disable prefer-const,consistent-return,arrow-body-style,no-undef,global-require,import/no-dynamic-require,jsx-a11y/mouse-events-have-key-events,react/no-string-refs,no-unused-vars,array-callback-return,react/no-array-index-key,no-else-return,no-plusplus,react/no-did-update-set-state,prefer-destructuring,prefer-template,no-lonely-if,object-shorthand,object-shorthand */
import React, { PureComponent } from 'react';
import {connect} from 'dva';
import classNames from "classnames";
import router from 'umi/router';
import { Divider } from 'antd';
import { urlToList } from '../_utils/pathTools';
import {  getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import { routerState } from '@/utils/tool';
import styles from './index.less';
import Cookie from '@/utils/cookie';


@connect(({ searchModels }) => ({
  searchModels
}))

class BaseMenu extends PureComponent {
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  constructor(props) {
    super(props);
    this.state = {
      twoHeight:0
    };
  }

  componentDidUpdate(){
    let setHeight=document.getElementById("menuHeight").offsetHeight;
    this.setState({
      twoHeight:setHeight
    })
  }

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  // 切换图标
  checkImg=(item,imgName)=>{
    let iconImg = "";
    try {
      iconImg = require(`./red/${imgName}.png`);
    }catch(err) {
      iconImg = require(`./red/u1817.png`);
    }
    this.refs[`${item}img`].src=iconImg;
  };

  //  显示二级菜单
  showMenuTwo=(item,list,all,imgName,twoHeight)=>{

    let iconImg = "";
    try {
      iconImg = require(`./red/${imgName}-w.png`);
    }catch(err) {
      iconImg = require(`./red/u1817.png`);
    }
    this.refs[`${item}img`].src=iconImg;
    for(let i=0; i<all.length; i++){
      if(all[i].treeList.length!==0){
        if(all[i].id===item){
          if(item === "1"){
            this.refs[item].className=styles.menuTwoshow
          }else if(item === "4"){
            if(twoHeight<400){
              this.refs[item].style.minHeight = 400+"px";
            }else {
              this.refs[item].style.minHeight = twoHeight+"px";
            }
            this.refs[item].className=styles.menuTwoshow
          }else {
            if(twoHeight<400){
              this.refs[item].style.minHeight = 400+"px";
              this.refs[item].style.maxHeight = 400+"px";
            }else {
              this.refs[item].style.minHeight = twoHeight+"px";
              this.refs[item].style.maxHeight = twoHeight+"px";
            }
            this.refs[item].className=styles.menuTwoshow
          }
        }else{
          this.refs[all[i].id].className=styles.menuTwo
        }
      }
    }
  };

  //  隐藏二级菜单
  hideMenuTwo=item=>{
    if(this.refs[item]){
       this.refs[item].className=styles.menuTwo
    }
  };

  //  显示三级菜单
  showthreeTitle=(item,name,all,twoHeight)=>{
    if(name!=="经营指标"){
      for(let i=0; i<all.length; i++){
        if(all[i].classId===item){
          if(name==="统计报表"){
            if(this.refs[item]!==undefined){
              // this.refs[item].style.height=twoHeight*0.9+"px";
              this.refs[item].style.height="100%"; // xongxiaodong 20200413 优化菜单
              if(all[i].nodes[0].leafs.length!==0){
                this.refs[`${item}border`].style.borderRight="2px solid #e5e5e5"
              }else{
                this.refs[`${item}border`].style.borderRight="0px solid #e5e5e5"
              }
            }
          }else if(name==="业务专题"){
            // 若为业务专题有热门内容最大高度需减小
            this.refs[item].style.maxHeight=twoHeight*0.9+"px"
          }else {
            this.refs[item].style.maxHeight=twoHeight+"px"
          }
          if(this.refs[item]!==undefined){
            this.refs[item].className=styles.showthreeTitle
            // 统计报表三级和四级菜单间隔
          }
        }else if(this.refs[all[i].classId]){
          this.refs[all[i].classId].className=styles.hidethreeTitle
        }
      }

    }
  };

  // 隐藏三级菜单
  hidethreeTitle=item=>{
     this.refs[item].className=styles.hidethreeTitle
  };

  //  显示四级菜单
  showFourMenu=(item,all)=>{
    for(let i=0; i<all.length; i++){
      if(all[i].nodeId===item){
        this.refs[item].className=styles.fourMenu
      }else{
        this.refs[all[i].nodeId].className=styles.hidefourMenu
      }
    }
  };

  //  隐藏四级菜单
  hideFourMenu=(item,all)=>{
    this.refs[item].className=styles.hidefourMenu
  };

  // 一级菜单跳转
  checkUrl=(path,id,name)=>{
    const { dispatch } = this.props;
    // 日志记录开始
    dispatch({
      type: 'logModels/menuLogFetch',
      payload: {
        params:{
          menuId: id,
          isHot: "0",
        },
        pId: id,
      },
    });
    // 日志记录结束


    if (id !== 'C04' && id !== '5' && id !== "system_manage_new") {
      dispatch({
        type: 'searchModels/setSearchContent',
        payload: {name: "", searchType: 1},
      });
      let loginStatus = Cookie.getCookie("loginStatus");
      let token;
      if (loginStatus) {
        token = loginStatus.token;
      }
      let re = /^http.+/;
      let pre = /^http.+\?.+/;
      if (re.test(path)) {
        // 一级菜单跳转出去日志获取
        dispatch({
          type: 'logModels/otherFetch',
          payload: {
            markType: id,
            requestUrlPath: path,
            hot: "0"
          },
        });
        if (pre.test(path)) {
          window.open(path + "&ticket=" + token+"&source=cloud&token="+token)
        } else {
          window.open(path + "?ticket=" + token+"&source=cloud&token="+token)
        }
      }else{
        if(id==='M01'){
          // router.push({
          //   pathname:'/search',
          //   state:{
          //     selectedId: '4',
          //     searchValue: "",
          //     type:"menu",
          //     id: "M01",
          //   }});
          routerState('/search',{
            selectedId: '4',
            searchValue: "",
            name,
            type:"menu",
            id: "M01",
          });
          // 清理数据
          dispatch({
            type: 'searchPageModels/getCleanData',
          });
          dispatch({
            type: 'searchModels/setSelectType',
            payload: {
              id:"4",
              name:"报表"
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
         const params = {
            searchType: '4',
            search:"M01",
            tabId:"-1",
            numStart:1,
            num:"10",
          };
          dispatch({
            type: 'searchPageModels/getSearchData',
            payload: params,
            sign:true,
          });
        }else {
          let pathUrl = path;
          if(path === "/" && id !== "3"){
            pathUrl = "/search";
            // router.push({
            //   pathname:pathUrl,
            //   state:{
            //     selectedId: id,
            //     searchValue: "",
            //     type:"menu",
            //     id: "",
            //   }});
            routerState(pathUrl,{
              selectedId: id,
              searchValue: "",
              type:"menu",
              name,
              id: "",
            });
            const {searchModels}=this.props;
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
                id: id,
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
          const  params = {
              area:"",
              date:"",
              dayOrmonth: "-1",
              searchType:id,
              search:"",
              tabId:"-1",
              numStart:1,
              num:"10",
            };
            dispatch({
              type: 'searchPageModels/getSearchData',
              payload: params,
              sign:true, // 若为非滚动时间都需要传这个标志
            });
          }else if(path === "/" && id === "3"){
            dispatch({
              type: 'searchModels/setSelectType',
              payload: {id: "3", name: "报告"},
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
            pathUrl = "/report";
            // router.push({
            //   pathname:pathUrl,
            //   state:{
            //     selectedId: id,
            //     searchValue: "",
            //     type:"menu",
            //     id: "",
            //   }});
            routerState(pathUrl,{
              selectedId: id,
              searchValue: "",
              type:"menu",
              name,
              id: "",
            })
          }else {
            // router.push({
            //   pathname: pathUrl,
            // })
            routerState(pathUrl,{
              name,
              id: id,
            })
          }

        }
        this.hideMenuTwo(id);
      }
    }
  };

  /*
   * 功能：点击菜单热门内容根据数据跳转
   * @param：path为要跳转的路由路径，
   *         id为要跳转到的唯一标识id，
   *         flag为跳转到页面的日月标识
   *         name为名称，pid为父节点的标志，
   *         markType为类型标志
   *
   * */
  handleHotClick=(path, id, flag, name, pid, markType) =>{
    const { dispatch, searchModels } = this.props;
    // 日志记录开始
    dispatch({
      type: 'logModels/menuLogFetch',
      payload: {
        params:{
          menuId: id,
          isHot: "1",
        },
        pId: pid,
      },
    });
    // 日志记录结束

    let loginStatus = Cookie.getCookie("loginStatus");
    let token;
    if (loginStatus) {
      token = loginStatus.token;
    }
    let re = /^http.+/;
    let pre = /^http.+\?.+/;
    if (re.test(path)) {
      let url;
      if (pre.test(path)) {
        url = path + "&ticket=" + token +"&source=cloud&token="+token;
      } else {
        url = path + "?ticket=" + token+"&source=cloud&token="+token;
      }
      // 判断专题日志请求
      if(pid === "2"){
        dispatch({
          type: 'logModels/specialReportLogFetch',
          payload: {
            markType: id,
            requestUrlPath: path,
            hot: "1"
          },
        });
      }else if(pid === "4"){  // 判断报表日志请求
        dispatch({
          type: 'logModels/reportTableLogFetch',
          payload: {
            markType: id,
            requestUrlPath: path,
            hot: "1"
          },
        });
      }else { // 其他日志请求
        dispatch({
          type: 'logModels/otherFetch',
          payload: {
            markType: id,
            requestUrlPath: path,
            hot: "1"
          },
        });
      }
      window.open(url)
    } else {
      const {typeData} = searchModels;
      const selectData = {};
      typeData.forEach((item)=>{
        if(pid === item.id){
          selectData.id = item.id;
          selectData.name = item.name;
        }
      });
      dispatch({
        type: 'searchModels/setSelectType',
        payload: selectData,
      });
      dispatch({
        type: 'searchModels/setSearchContent',
        payload: {name, searchType: 1},
      });

      // router.push({
      //   pathname: path,
      //   state: {
      //     id: id,
      //     searchValue: name,
      //     dateType: flag,
      //     selectedId: pid,
      //     type: "menu",
      //     name: name,
      //     title:name,
      //     hot: 1,
      //   }
      // });
      routerState(path,{
        id: id,
        searchValue: name,
        dateType: flag,
        selectedId: pid,
        type: "menu",
        name: name,
        title:name,
        hot: 1,
      })
    }

  };

  /*
   * 功能：点击右侧菜单栏根据数据跳转
   * @param：path为要跳转的路由路径，
   *         id为要跳转到的唯一标识id，
   *         flag为跳转到页面的日月标识
   *
   * */
  handleNodeClick=(path, id, flag, name, pid,classId, markType)=> {
    let loginStatus = Cookie.getCookie("loginStatus");
    const { dispatch, searchModels } = this.props;
    let token;
    if (loginStatus) {
      token = loginStatus.token;
    }
    let re = /^http.+/;
    let pre = /^http.+\?.+/;

    // 日志记录开始
    dispatch({
      type: 'logModels/menuLogFetch',
      payload: {
        params:{
          menuId: id,
          isHot: "0",
        },
        pId: pid,
      },
    });

    // 日志记录结束
    if (re.test(path)) {
      let url;
      if (pre.test(path)) {
        url = path + "&ticket=" + token+"&source=cloud&token="+token;
      } else {
        url = path + "?ticket=" + token+"&source=cloud&token="+token;
      }

      // 判断专题日志请求
      if(pid === "2"){
        dispatch({
          type: 'logModels/specialReportLogFetch',
          payload: {
            markType: id,
            requestUrlPath: path,
            hot: "0"
          },
        });
      }else if(pid === "4"){  // 判断报表日志请求
        dispatch({
          type: 'logModels/reportTableLogFetch',
          payload: {
            markType: id,
            requestUrlPath: path,
            hot: "0"
          },
        });
      }else { // 其他日志请求
        dispatch({
          type: 'logModels/otherFetch',
          payload: {
            markType: id,
            requestUrlPath: path,
            hot: "0"
          },
        });
      }

      window.open(url);
    }else if(id === "menuOut" || id === "D11011" || id === "D11009" || path === "/baseStation"){// 基站跳转
      this.JumpBaseStation(path);
    } else {
      let pathUrl;
      if(path === "/") {
        pathUrl = "/search";
      }else {
        pathUrl = path
      }
      let selectedId;
      if (pid === "M01"){
        selectedId = "4"
      }else {
        selectedId = pid
      }
      const {typeData} = searchModels;
      const selectData = {};
      typeData.forEach((item)=>{
        if(selectedId === item.id){
          selectData.id = item.id;
          selectData.name = item.name;
        }
      });
      if (selectData.id!== undefined){
        // 清理数据
        dispatch({
          type: 'searchPageModels/getCleanData',
        });
        dispatch({
          type: 'searchModels/setSelectType',
          payload: selectData,
        });
        dispatch({
          type: 'searchModels/setSearchContent',
          payload: {name, searchType: 1},
        });
        dispatch({
          type: 'searchModels/setSelectName',
          payload:id,
        });
      }
      if(pathUrl==="/search"){
        // 重置搜索页面页码为1
        dispatch({
          type: 'searchPageModels/setSearchPage',
          payload: {page:1},
        });
        window.scrollTo(0,0);
        const  params = {
          area:"",
          date:"",
          dayOrmonth: "-1",
          searchType:selectData.id,
          search:id,
          tabId:"-1",
          numStart:1,
          num:"10",
        };
        dispatch({
          type: 'searchPageModels/getSearchData',
          payload: params,
          sign:true, // 若为非滚动时间都需要传这个标志
        });
      }

      // router.push({
      //   pathname: pathUrl,
      //   state: {
      //     id: id,
      //     searchValue: name,
      //     dateType: flag,
      //     selectedId: selectedId,
      //     type: "menu",
      //     name: name,
      //     title:name,
      //     hot: 1,
      //   }
      // });

      // 20191120 风信子添加
      dispatch({
        type: 'searchPageModels/getCleanData',
      });
      routerState(pathUrl,{
        id: id,
        searchValue: name,
        dateType: flag,
        selectedId: selectedId,
        type: "menu",
        name: name,
        title:name,
        hot: 1,
      })
    }
    this.refs[pid].className=styles.menuTwo; // 隐藏二级菜单
    //  当是指标时不用隐藏三级菜单
    if(pid!=="1"){
      this.refs[classId].className=styles.hidethreeTitle // 隐藏三级菜单
    }
  };

  threeMore=(data,pid,classId)=>{
    const {flag, nodeId, nodeName, nodeUrl} = data;
    this.handleNodeClick(nodeUrl, nodeId, flag, nodeName, pid,classId);
  };

  // 生成菜单
  getNavMenu = (data,titleData,twoHeight)=> {
    if(data && data.svgList!==undefined){
      let menuItem=data.svgList.map( item => {
        // 渲染二级菜单
        let menuTwoitems;
        if(item.treeList.length!==0){
          menuTwoitems=item.treeList.map((items,index)=>{
            return (
              <div key={items.classId} onMouseOver={()=>{this.showthreeTitle(items.classId,item.name,item.treeList,twoHeight)}} className={styles.twoTitle}>
                <span>{`${items.className}>`}</span>
              </div>
            )
          })
        }
        // 三级菜单
        let threeTitle;
        if(item.treeList.length!==0){
          threeTitle=item.treeList.map((items,index)=> {
            let threeItems;
            if(items.nodes!==undefined) {
              if (items.nodes.length !== 0) {
                // id=1为经营指标样式
                if (item.id === "1") {
                  threeItems = items.nodes.map(threeItem => {
                    return (
                      <span key={threeItem.nodeId}>
                        <Divider type="vertical" className={styles.threeDivider} />
                        <span className={styles.threeSpan} onClick={()=>this.handleNodeClick(threeItem.nodeUrl, threeItem.nodeId, threeItem.flag, threeItem.nodeName,  item.id,items.classId, threeItem.markType)}>{threeItem.nodeName}</span>
                      </span>
                    )
                  });
                  return (
                    <div key={`items${items.classId}`} ref={items.classId} className={styles.threeIdoTitle}>
                      {threeItems}
                    </div>
                  )
                }
                // id=4为统计报表样式
                else if(item.id === "4"){
                  let fourItemtitle;
                  let threeItemClass = styles.threeItemsNoleaf;
                  threeItems = items.nodes.map(threeItem => {
                    if(threeItem.leafs.length!==0){
                      threeItemClass = styles.threeItems;
                      fourItemtitle=threeItem.leafs.map(itemLeaf=>{
                        return (
                          <span key={itemLeaf.leafId}>
                            <Divider type="vertical" className={styles.threeDivider} />
                            <span className={styles.threeSpan} onClick={()=>this.handleNodeClick(itemLeaf.leafUrl, itemLeaf.leafId, itemLeaf.leafFlag, itemLeaf.leafName, item.id,items.classId, itemLeaf.leafMarkType)}>{itemLeaf.leafName}</span>
                          </span>
                        )
                      });
                      return (
                        <div key={threeItem.nodeId} onMouseLeave={()=>this.hideFourMenu(threeItem.nodeId,items.nodes)} className={styles.fourTitle}>
                          <div className={styles.threepaperSpan} onMouseOver={()=>this.showFourMenu(threeItem.nodeId,items.nodes)}><span>{`${threeItem.nodeName}>`}</span></div>
                          <div className={styles.hidefourMenu} ref={threeItem.nodeId}>
                            <div className={styles.fiveMenu}>{fourItemtitle}</div>
                          </div>
                        </div>
                      )
                    }else{
                      return (
                        <div key={threeItem.nodeId} className={styles.fourTypeTwo}>
                          <div className={styles.threeSpan} onClick={()=>this.handleNodeClick(threeItem.nodeUrl, threeItem.nodeId, threeItem.flag, threeItem.nodeName, item.id,items.classId, threeItem.markType)}>{threeItem.nodeName}</div>
                          <div className={styles.hidefourMenu} ref={threeItem.nodeId} />
                        </div>
                      )
                    }
                  });
                  return (
                    <div key={`items${items.classId}`} onMouseLeave={()=>{this.hidethreeTitle(items.classId)}} ref={items.classId} className={styles.hidethreeTitle}>
                      <div ref={`${items.classId}border`} className={threeItemClass}>{threeItems}</div>
                    </div>
                  )
                }
                else {
                  threeItems = items.nodes.map(threeItem => {
                    let threeItemtitle;
                    if(threeItem.leafs.length!==0){
                      threeItemtitle=threeItem.leafs.map(itemLeaf=>{
                        return (
                          <div key={itemLeaf.leafId} onClick={()=>this.handleNodeClick(itemLeaf.leafUrl, itemLeaf.leafId, itemLeaf.leafFlag, itemLeaf.leafName, item.id,items.classId, itemLeaf.leafMarkType)}>
                            <Divider type="vertical" className={styles.threeDivider} />
                            <span className={styles.threeSpan}>{itemLeaf.leafName}</span>
                          </div>
                        )
                      });
                      return (
                        <div key={threeItem.nodeId} className={styles.threeOuter}>
                          {/* eslint-disable-next-line react/no-unescaped-entities */}
                          <Divider type="vertical" className={styles.threetitleDivider} /><span className={styles.titleSpan}>{threeItem.nodeName}{items.classId === "D10" && <span onClick={()=>this.threeMore(threeItem,item.id,items.classId)} className={styles.threeMore}>更多>></span>}</span>
                          <div className={classNames(styles.threeColSpan,items.classId === "D10" ? styles.threeColSpan2 : "")}>{threeItemtitle}</div>
                        </div>
                      )
                    }else{
                      return (
                        <span key={threeItem.nodeId}>
                          <Divider type="vertical" className={styles.threeDivider} />
                          <span className={styles.threeSpan} onClick={()=>this.handleNodeClick( threeItem.nodeUrl, threeItem.nodeId, threeItem.flag, threeItem.nodeName, item.id,items.classId, threeItem.markType)}>{threeItem.nodeName}</span>
                        </span>
                      )
                    }
                  });
                  return (
                    <div key={`items${items.classId}`} style={{maxHeight:twoHeight}} onMouseLeave={()=>{this.hidethreeTitle(items.classId)}} ref={items.classId} className={styles.hidethreeTitle}>
                      <div className={styles.colSpan}>
                        {threeItems}
                      </div>
                    </div>
                  )
                }
              }
            }
          })
        }
        // 热门内容标题
        let hotmenuTitle;
        let itemTitle;
        let hotTitles;
        if (titleData.svgList === undefined){
          hotTitles = []
        }else {
          hotTitles=titleData.svgList.filter(f=>f.id===item.id);
        }
        if(hotTitles.length!==0){
          itemTitle=hotTitles[0].titleList.list.map((items,index)=>{
            return (
              <div key={items.titleId} onClick={this.handleHotClick.bind(this, items.titleUrl, items.titleId, items.flag, items.titleName, item.id, items.markType)} className={styles.hotitemTitle}>
                <span>{items.titleName}</span>
              </div>
            )
          });
          hotmenuTitle=item.titleList!==undefined?
            <div className={styles.OneTitle}>
              <span className={styles.hotTitle}>{item.titleList.titleClassName}：</span>
              {itemTitle}
            </div>:null
        }

        let iconImg = "";
        try {
          iconImg = require(`./red/${item.imgName}.png`);
        }catch(err) {
          iconImg = require(`./red/u1817.png`);
        }

        return (
          <div key={item.id} className={styles.MenuItem}>
            <div>
              <div className={styles.MenuOver} onMouseLeave={()=>{this.checkImg(item.id,item.imgName)}} onMouseOver={()=>{this.showMenuTwo(item.id,item.treeList,data.svgList,item.imgName,twoHeight)}} onClick={()=>this.checkUrl(item.url,item.id,item.name)}>
                <div>
                  <img className={styles.MenuItemImg} alt="" ref={`${item.id}img`} src={iconImg} />
                  <span className={styles.MenuItemText}>{item.name}</span>
                </div>
              </div>
              {item.treeList.length!==0?
                <div ref={item.id} className={styles.menuTwo} onMouseLeave={()=>{this.hideMenuTwo(item.id)}}>
                  {hotmenuTitle}
                  <div className={item.titleList===undefined?styles.menuNohot:styles.menuThree}>
                    <div className={styles.itemThree}>
                      {menuTwoitems}
                    </div>
                    <div className={item.id ==='1'?styles.menuNoLineThree:styles.otherThree}>
                      {threeTitle}
                    </div>
                  </div>
                </div>
                :null
              }
            </div>
          </div>
        )
      });
      return menuItem
    }
  };

  JumpBaseStation = (path) =>{
    const {token, userId, power, provOrCityId, provOrCityName} = Cookie.getCookie("loginStatus");
    const { hostname, protocol} = window.document.location;
    const hostnameIp = hostname === "localhost" ? "10.244.4.185" : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
    const port = hostnameIp.indexOf("10.244.4.185") === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
    window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`,  "_blank");
  };

  render() {
    const {
      menu:{allMenuData,allTitleData}
    } = this.props;
    const {twoHeight}= this.state;
    return (
      <div
        className={styles.menuStyle}
        id="menuHeight"
      >
        {this.getNavMenu(allMenuData,allTitleData,twoHeight)}
      </div>
    );
  }
}

export default BaseMenu;
