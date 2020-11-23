/**
 * @Description: 报表列表组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/17
 */
import React,{PureComponent} from 'react';
import { Row, Col, Tag, Icon } from 'antd';
import { connect } from 'dva';
// import router from 'umi/router';
import { routerState } from '@/utils/tool';
import iconFont from '../../icon/Icons/iconfont';
import Cookie from '@/utils/cookie';

import styles from './specialProject.less'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

@connect(({ searchModels, loading }) => ({
  searchModels,
  loading: loading.models.searchModels,
}))
@connect(({ searchPageModels, loading }) => ({
  searchPageModels,
  loading: loading.models.searchPageModels,
}))
class SpecialProject extends PureComponent{

  componentDidMount() {

  }

  /**
   * @date: 2019/1/21
   * @author liuxiuqian
   * @Description: 跳转专题页面
   * @method jumpHandle
   * @param data 跳转包含的数据
   */
  jumpHandle = (data) =>{
    const { dispatch } = this.props;
    const {dimension, url, id, title, tabName} = data;
    const {token} = Cookie.getCookie('loginStatus');
    const re=/^http.+/;
    const pre=/^http.+\?.+/;
    if(re.test(url)){
      // 日志记录
      dispatch({
        type: 'logModels/specialReportLogFetch',
        payload: {
          markType: id,
          requestUrlPath: url,
          hot: "0"
        },
      });
      if(pre.test(url)){
        window.open(`${url}&ticket=${token}&source=cloud&token=${token}`)
      }else {
        window.open(`${url}?ticket=${token}&source=cloud&token=${token}`)
      }
    }else if(id === "menuOut" || id === "basestationview"){// 渠道分布：menuOut；基站：basestationview
      this.JumpBaseStation(url);
    }else {
      routerState(url,{
        dimension,
        id,
        title,
        dateType: tabName === "日报" ? "1" : "2"
      })
      // router.push({
      //   pathname:url,
      //   state:{
      //     dimension,
      //     id,
      //     title,
      //     dateType: tabName === "日报" ? "1" : "2"
      //   }
      // })
    }

  };

  JumpBaseStation = (path) =>{
    const {token, userId, power, provOrCityId, provOrCityName} = Cookie.getCookie("loginStatus");
    const { hostname, protocol} = window.document.location;
    const hostnameIp = hostname === "localhost" ? "10.244.4.185" : hostname; // 如果是本地环境localhost 跳转到 测试环境的"10.244.4.185"
    const port = hostnameIp.indexOf("10.244.4.185") === -1 ? 8304 : 6064; // 测试环境6064  正式环境8304
    window.open(`${protocol}//${hostnameIp}:${port}/login?userId=${userId}&token=${token}&power=${power}&provOrCityId=${provOrCityId}&provOrCityName=${provOrCityName}&path=${path}`,  "_blank");
  };


  /**
   * @date: 2019/1/29
   * @author liuxiuqian
   * @Description: 处理更多事件
   * @method moreHandle
   */
  moreHandle(){
    const { dispatch, searchModels } = this.props;
    const { selectName } = searchModels;
    window.scrollTo(0,0);
    dispatch({
      type: 'searchPageModels/setSearchPage',
      payload: {page:1},
    });
    // 清理数据
    dispatch({
      type: 'searchPageModels/getCleanData',
    });
    dispatch({
      type: 'searchModels/setSelectType',
      payload: {
        id: "3",
        name: "报告"
      },
    });
    const params = {
      searchType: "3",
      search: selectName,
      tabId:"-1",
      numStart:1,
      num:"10"
    };
    dispatch({
      type: 'searchPageModels/getSearchData',
      payload: params,
      sign: true, // 是否为点击查询
    });
  }

  render(){
    const { data, moreBtnShow } = this.props;
    let iconImg = data.src;
    if(data.src === "u977.png"){ // 日
      iconImg = "icon-baobiaoD";
    }else if(data.src === "u1010.png"){// 月
      iconImg = "icon-yuebao";
    }else if(data.src === "u999.png"){ // 上升图标
      iconImg = "icon-zhuanti2";
    }

    return (
      <div className={styles.specialProject}>
        <Row className={styles.Row}>
          <Col md={4} className={styles.leftContent}>
            <div className={styles.echartPic}>
              <IconFont className={styles.iconFont} type={iconImg} />
            </div>
          </Col>
          <Col md={20}>
            <div className={styles.titleContent}>
              <span className={styles.title} onClick={()=>this.jumpHandle(data)}>{data.title}</span>
              <Tag color="#96B18B">{data.type}</Tag>
              <Tag color="#999999">{data.tabName!==undefined?data.tabName.slice(0,-1):""}</Tag>
            </div>
            <p className={styles.rowList}>{data.content}</p>
          </Col>
          {
            moreBtnShow ? (<div onClick={()=>{this.moreHandle()}} className={styles.moreBtn}>更多&gt;&gt;</div>) : null
          }
        </Row>
      </div>
    )
  }
}
export default SpecialProject;
