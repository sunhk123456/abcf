/**
 * @Description: 一级菜单组件
 *
 * @author: xingxiaodong
 *
 * @date: 2020/2/7
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerState } from '@/utils/tool';
import Cookie from '@/utils/cookie';
import { Icon } from 'antd';
import workIcon from '../../assets/image/newFirstMenu/workIcon.png'; // 工作台
import managementIcon from '../../assets/image/newFirstMenu/managementIcon.png';// 经营分析
import provinceIcon from '../../assets/image/newFirstMenu/provinceIcon.png';// 省份专区
import modelIcon from '../../assets/image/newFirstMenu/modelIcon.png';// 模型
import propertyIcon from '../../assets/image/newFirstMenu/propertyIcon.png';// 资产盘点
import systemIcon from '../../assets/image/newFirstMenu/systemIcon .png';// 系统入口
import styles from './firstMenu.less';

@connect(
  ({ newMenuModel, searchModels }) => (
    {
      newMenuModel,
      searchModels,
      firstMenuData: newMenuModel.firstMenuData,
    }),
)
class FirstMenuContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tixing: false, // 展开梯形是否展示
      longOrShort: 'short',
    };
  }

  componentDidMount() {

    const { dispatch } = this.props;
    dispatch({
      type: 'newMenuModel/getFirstMenuData',
      payload: {},
    });

  }

  showButton = (flag) => {
    this.setState({
      tixing: flag,
    });
  };

  // 处理一级菜单获得dom
  treeMenuHandleData = (list, flag) => {
    let dom = null;
    if (flag === 'short') {
      dom = list.map((item) => (
        <div className={styles.firstMenuContent} key={item.menuId} onClick={() => this.menuOnClick(item)}>
          <div className={styles.firstMenuImg}>
            {item.memuIcon === 'workIcon' && <img src={workIcon} alt="一级菜单图标" />}
            {item.memuIcon === 'managementIcon' && <img src={managementIcon} alt="一级菜单图标" />}
            {item.memuIcon === 'provinceIcon' && <img src={provinceIcon} alt="一级菜单图标" />}
            {item.memuIcon === 'modelIcon' && <img src={modelIcon} alt="一级菜单图标" />}
            {item.memuIcon === 'propertyIcon' && <img src={propertyIcon} alt="一级菜单图标" />}
            {item.memuIcon === 'systemIcon' && <img src={systemIcon} alt="一级菜单图标" />}
          </div>
        </div>
      ));
    } else if (flag === 'long') {
      dom = list.map((item) => (
        <div className={styles.firstMenuContent} key={item.menuId} onClick={() => this.menuOnClick(item)}>
          <div className={styles.firstMenuImg}>
            {item.memuIcon === 'workIcon' && <img src={workIcon} alt="一级菜单图标" />}
            {item.memuIcon === 'managementIcon' && <img src={managementIcon} alt="一级菜单图标" />}
            {item.memuIcon === 'provinceIcon' && <img src={provinceIcon} alt="一级菜单图标" />}
            {item.memuIcon === 'modelIcon' && <img src={modelIcon} alt="一级菜单图标" />}
            {item.memuIcon === 'propertyIcon' && <img src={propertyIcon} alt="一级菜单图标" />}
            {item.memuIcon === 'systemIcon' && <img src={systemIcon} alt="一级菜单图标" />}
          </div>
          <div
            className={styles.firstMenuName}
            style={{ cursor: item.jumpType !== 'no' ? 'pointer' : 'auto' }}
          >
            {item.nemuName}
          </div>
        </div>
      ));
    }

    return dom;
  };

  // 展开一级长菜单
  openLongMenu = (flag) => {
    this.setState({
      longOrShort: flag,
    });
    this.showButton(false);
  };

  /**
   * @date: 2020/2/10
   * @author liuxiuqian
   * @Description: 方法说明 跳转基站项目
   * @method 方法名 JumpBaseStation
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  JumpBaseStation = (path) => {
    const { token, userId, power, provOrCityId, provOrCityName } = Cookie.getCookie('loginStatus');
    const { hostname, protocol } = window.document.location;
    const hostnameIp = hostname === 'localhost' ? '10.244.4.185' : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
    const port = hostnameIp.indexOf('10.244.4.185') === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
    window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`, '_blank');
  };

  /**
   * @date: 2020/2/17
   * @author liuxiuqian
   * @Description: 方法说明 点击二级菜单事件
   * @method 方法名 clickSecondMenu
   * @param {参数类型| object} 参数名 item 参数说明 被点击项的详细内容
   * @return {返回值类型} 返回值说明
   */
  menuOnClick(itemData) {
    // console.log('一级菜单被点击');
    // console.log(itemData);


    // memuIcon: "managementIcon"
    // jumpType: "selfSecondMenu"
    // nemuId: "newquery"
    // nemuName: "经营分析"
    // url: "/"
    const { dispatch, searchModels } = this.props;
    const { jumpType, url, nemuId } = itemData;
    const id = nemuId;
    // jumpType 跳转类型 1、no表示不可跳转 2、self表示本系统 3、selfSearch表示搜索 4、out表示目前的基站项目 5、other 表示其他项目http的地址

    // 日志记录开始
    dispatch({
      type: 'logModels/menuLogFetch',
      payload: {
        params: {
          menuId: id,
          isHot: '0',
        },
        pId: id,
      },
    });
    // 日志记录开始

    if (jumpType === 'self') {
      routerState(url, {
        id,
      });
    } else if (jumpType === 'selfSearch') {
      // 清空搜索 展示内容标记为 菜单点击
      dispatch({
        type: 'searchModels/setSearchContent',
        payload: { name: '', searchType: 1 },
      });

      routerState(url, {
        selectedId: id,
        searchValue: '',
        type: 'menu',
        id: '',
      });
      const { typeData } = searchModels;
      let selectedName = '全部';
      typeData.forEach((item) => {
        if (item.id === id) {
          selectedName = item.name;
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
          name: selectedName,
        },
      });

      // 更新搜索框展示内容
      dispatch({
        type: 'searchModels/setSearchContent',
        payload: { name: '', searchType: 1 },
      });
      // 更新搜索框实际搜索内容
      dispatch({
        type: 'searchModels/setSelectName',
        payload: '',
      });
      // 重置搜索页面页码为1
      dispatch({
        type: 'searchPageModels/setSearchPage',
        payload: { page: 1 },
      });
      window.scrollTo(0, 0);
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

    } else if (jumpType === 'out') {
      this.JumpBaseStation(url);
    } else if (jumpType === 'other') {
      const { token } = Cookie.getCookie('loginStatus');
      const pre = /^http.+\?.+/;
      let path = '';
      if (pre.test(url)) {
        path = `${url}&ticket=${token}&source=cloud&token=${token}`;
      } else {
        path = `${url}?ticket=${token}&source=cloud&token=${token}`;
      }
      window.open(path);
    } else if (jumpType === 'selfSecondMenu') {
      // 请求二级菜单数据
      dispatch({
        type: 'newMenuModel/getSecondMenuData',
        payload: {
          id,
        },
      });
    }
  }

  render() {
    const { longOrShort, tixing } = this.state;
    // const list=[
    //     {
    //       "nemuName": "工作台",
    //       "nemuId": "1",
    //       "memuIcon": "workIcon",
    //       "url" : "跳转地址",
    //       "jumpType": "self"
    //
    //     },
    //     {
    //       "nemuName": "经营分析",
    //       "nemuId": "2",
    //       "memuIcon": "managementIcon",
    //       "url" : "跳转地址",
    //       "jumpType": "self"
    //     }
    const { firstMenuData } = this.props;
    const shortDom = this.treeMenuHandleData(firstMenuData, 'short');
    const longDom = this.treeMenuHandleData(firstMenuData, 'long');
    return (
      <Fragment>
        {
          longOrShort === 'short' &&
          <div
            className={styles.firstMenu}
            onMouseEnter={() => this.showButton(true)}
            onMouseLeave={() => this.showButton(false)}
          >
            {tixing &&
            <div className={styles.shortButton} onClick={() => this.openLongMenu('long')}>
              <div className={styles.shortButtonContent}>
                <Icon type="right" />
              </div>
            </div>
            }
            {shortDom}
          </div>
        }
        {
          longOrShort === 'long' &&
          <div
            className={styles.firstMenuLong}
            onMouseEnter={() => this.showButton(true)}
            onMouseLeave={() => this.showButton(false)}
          >
            <div className={styles.shortButton} onClick={() => this.openLongMenu('short')}>
              <div className={styles.shortButtonContent}>
                <Icon type="left" />
              </div>
            </div>
            {longDom}
          </div>
        }
      </Fragment>

    );
  }
}

export default FirstMenuContent;
