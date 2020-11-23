/**
 * @Description: 报表列表组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/17
 */
import React,{PureComponent} from 'react';
import { Row, Col, Tag, Icon} from 'antd';
import { connect } from 'dva';
import Cookie from '@/utils/cookie';
// import router from 'umi/router';
import { routerState } from '@/utils/tool';
import iconFont from '../../icon/Icons/iconfont';

import styles from './reportForms.less'

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
class ReportForms extends PureComponent{

  componentDidMount() {

  }

  /**
   * @date: 2019/1/21
   * @author liuxiuqian
   * @Description: 跳转报表页面
   * @method jumpHandle
   * @param data 跳转包含的数据
   */
  jumpHandle = (data) =>{
    const { dispatch } = this.props;
    const { url, id } = data;
    const {token} = Cookie.getCookie('loginStatus');
    const re=/^http.+/;
    const pre=/^http.+\?.+/;
    if(re.test(url)){
      // 报表日志记录
      dispatch({
        type: 'logModels/reportTableLogFetch',
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
    }else {
      routerState(url,{})
      // router.push({
      //   pathname: url,
      // });
    }

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
    // 清理数据
    dispatch({
      type: 'searchPageModels/getCleanData',
    });
    dispatch({
      type: 'searchModels/setSelectType',
      payload: {
        id: "4",
        name: "报表"
      },
    });
    const params = {
      searchType: "4",
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
    if(!Object.keys(data).includes("tabName")) return  null;
    let iconImg = data.img;
    if(data.img === "monthreport.png"){
      iconImg = "icon-yuebao";
      // iconImg = "icon-baobiaoM";
    }else if(data.img === "dayreport.png"){
      iconImg = "icon-baobiaoD";
    }
    return (
      <div className={styles.reportForms}>
        <Row className={styles.Row}>
          <Col md={4} className={styles.leftContent}>
            <div className={styles.echartPic}>
              <IconFont className={styles.iconFont} type={iconImg} />
            </div>
          </Col>
          <Col md={20}>
            <div className={styles.titleContent}>
              <span className={styles.title} onClick={()=>this.jumpHandle(data)}>{data.title}</span>
              <Tag color="#ce7b7b">{data.type}</Tag>
              <Tag color="#999999">{data.tabName.slice(0,-1)}</Tag>
            </div>

            <Row className={styles.rowList}>
              <Col md={8} className={styles.colText}>
                {data.tableHead[0]}：{data.tableData[0]}
              </Col>
              <Col md={8} className={styles.colText}>
                {data.tableHead[1]}：{data.tableData[1]}
              </Col>
              <Col md={8} className={styles.colText}>
                {data.tableHead[2]}：{data.tableData[2]}
              </Col>
            </Row>
            <Row className={styles.rowList}>
              <Col md={8} className={styles.colText}>
                {data.tableHead[3]}：{data.tableData[3]}
              </Col>
              <Col md={8} className={styles.colText}>
                {data.tableHead[4]}：{data.tableData[4]}
              </Col>
              <Col md={8} className={styles.colText}>
                {data.tableHead[5]}：{data.tableData[5]}
              </Col>
            </Row>
            <p className={styles.rowList}>{data.tableHead[6]}：{data.tableData[6]}</p>
          </Col>
          {moreBtnShow ? <div onClick={()=>{this.moreHandle()}} className={styles.moreBtn}>更多&gt;&gt;</div> : null }
        </Row>
      </div>
    )
  }
}
export default ReportForms;
