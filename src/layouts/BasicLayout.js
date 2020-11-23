import React, { Suspense } from 'react';
import { Layout, message } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import PageLoading from '@/components/PageLoading';
import SiderMenu from '@/components/SiderMenu';
import Notes from '@/components/Notes/Notes';
import FeedBackCommit from '@/components/ProblemFeedback/ProblemCommit';
import XiaoZhiResponse from '@/components/XiaoZhiResponse/XiaoZhiResponse';
import Cookie from '@/utils/cookie';
import styles from './BasicLayout.less';
import router from 'umi/router';
import Loading from "@/components/PageLoading/loading"
import AddWarning from '../components/warningConfig/addWarning';
import MyWarningImage from '../components/warningConfig/myWarningImage';
import LeftMenu from '@/components/LeftMenu/index'; // 菜单组件

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};


class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    this.state={}
  }

  componentWillMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    Cookie.setCookie('loginStatus','41231')
    const token = Cookie.getCookie('loginStatus');
    if (token !== undefined && token !== null && token !== '') {
      // dispatch({
      //   type: 'user/fetchCurrent',
      // });
      dispatch({
        type: 'setting/getSetting',
      });
      // dispatch({
      //   type: 'menu/getMenuData',
      //   payload: { routes, authority },
      // });
      // dispatch({
      //   type: 'menu/getAllMenuData',
      //   payload: {
      //     token :token.token,
      //     userId:token.userId
      //   },
      // });
      dispatch({
        type: 'menu/getTitleData',
        payload: {
          token :token.token,
          userId:token.userId
        },
      });
    }else{
        router.push('/login')
    }
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return '新一代经营分析系统';
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `新一代经营分析系统`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        // paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  /**
   * @date: 2019/12/25
   * @author xingxiaodong
   * @Description: 设置显示或者隐藏添加预警弹出层
   * @method addWarningHandleClick
   */
  addWarningHandleClick=(params)=>{
    // 设置显示添加预警弹出层
    const {dispatch} = this.props;
    dispatch({
      type: `warningModels/setVisible`,
      payload: {visible:params},
    });
  };

  // 关闭我的预警弹出层
  warningClose=(params)=>{
    this.setState({
      myWarning:params ,
      dotShow:false
    });
  };

  // 去掉设置功能
  // renderSettingDrawer = () => {
  //   // Do not render SettingDrawer in production
  //   // unless it is deployed in preview.pro.ant.design as demo
  //   if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
  //     return null;
  //   }
  //   return <SettingDrawer />;
  // };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menu:{menuData,allMenuData},
      breadcrumbNameMap,
      route: { routes },
      fixedHeader,
      loading,
      visibleAddWarning, // 控制添加预警是否展示

    } = this.props;
    let loadingValue = loading.global;
     // console.log(loading)
    // 过滤掉getRecommendList请求。

    if(loading.effects['searchModels/getRecommendList'] ||
      loading.effects['productViewModels/fetchProductNameHint'] ||
      loading.effects['evaluateTab/fetchChannelNameHint'] ||
      loading.effects['indicatorsTab/fetchChannelNameHint'] ||
      loading.effects['newMenuModel/getDownData'] ||
      loading.effects['searchPageModels/getCollectionData'] ||
      loading.effects['buildingModels/getArcgisData'] ||
      loading.models['logModels'] ||
      loading.models['xiaozhiModels']
    ){
      loadingValue = false
    }
    // const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.getRouterAuthority(pathname, routes);
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout className={styles.headers}>
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
            display:'flex',
            flexDirection:'column',
            backgroundColor:'#fff'
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            {/*{isTop && !isMobile ? null : (*/}
            {/*  <SiderMenu*/}
            {/*    logo={logo}*/}
            {/*    theme={navTheme}*/}
            {/*    onCollapse={this.handleMenuCollapse}*/}
            {/*    menuData={menuData}*/}
            {/*    isMobile={isMobile}*/}
            {/*    {...this.props}*/}
            {/*  />*/}
            {/*)}*/}
            <LeftMenu />
            <Authorized authority={routerConfig} noMatch={<Exception403 />}>
              {children}
            </Authorized>
          </Content>
          <Notes />
          <FeedBackCommit />
          <XiaoZhiResponse />
          {/*以下为添加我的预警图片 喵帕斯 20191230 挂载*/}
            <MyWarningImage />
          {/*以下为添加预警弹出层 喵帕斯 20191225 挂载*/}
          {visibleAddWarning && <AddWarning onClose={() => {this.addWarningHandleClick(false);}} />}

          {/*<Footer />*/}
        </Layout>
      </Layout>
    );
    Cookie.setCookie('loginStatus','41231')
    const token = Cookie.getCookie('loginStatus');
    if (token !== undefined && token !== null && token !== '') {
      return (
        <React.Fragment>
          <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
            <ContainerQuery query={query}>
              {params => (
                <Context.Provider value={this.getContext()}>
                  <div className={classNames(params)}>{layout}</div>
                </Context.Provider>
              )}
            </ContainerQuery>
          </DocumentTitle>
          {/* <Suspense fallback={<PageLoading/>}>{this.renderSettingDrawer()}</Suspense> */}
          {loadingValue && <Loading /> }
        </React.Fragment>
      );
    }else{
      return null
    }
    // return (
    //   <React.Fragment>
    //     <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
    //       <ContainerQuery query={query}>
    //         {params => (
    //           <Context.Provider value={this.getContext()}>
    //             <div className={classNames(params)}>{layout}</div>
    //           </Context.Provider>
    //         )}
    //       </ContainerQuery>
    //     </DocumentTitle>
    //     {/* <Suspense fallback={<PageLoading/>}>{this.renderSettingDrawer()}</Suspense> */}
    //     {loadingValue && <Loading /> }
    //   </React.Fragment>
    // );
  }
}

export default connect(({ global, setting, menu, loading,warningModels }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menu: menu,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  visibleAddWarning:warningModels.visible, // 控制添加预警弹出层是否显示
  loading,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
