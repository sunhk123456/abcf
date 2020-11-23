/**
 * @Description: 报告列表组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/12
 */
import React,{PureComponent} from 'react';
import { Row, Col, Tag, message } from 'antd';
import { connect } from 'dva';
import DownloadUrl from '@/services/downloadUrl.json';

import styles from './report.less'

@connect(({ searchModels, loading }) => ({
  searchModels,
  loading: loading.models.searchModels,
}))
@connect(({ searchPageModels, loading }) => ({
  searchPageModels,
  loading: loading.models.searchPageModels,
}))
class report extends PureComponent{

  componentDidMount() {

  }

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
    }
    dispatch({
      type: 'searchPageModels/getSearchData',
      payload: params,
      sign: true, // 是否为点击查询
    });
  }

  /**
   * @date: 2019/3/1
   * @author liuxiuqian
   * @Description: 报告预览
   * @method previewHandle
   * @param {id} string 报告id
   */
  previewHandle(id){
    const { dispatch } = this.props;
    // message.error("测试环境预览同一个固定文件");
    // const w =window.open('about:blank');
    // w.location.href=`http://10.244.4.185:6069/web/viewer.html?file=http://10.244.4.185:6069/DW3.0.pdf`;
    dispatch({
      type: 'myReportCardModel/getFetchOnlineViewReport',
      payload: {markType: id},
      callback: (res) => {
        if(res.path){
          const w =window.open('about:blank');
          w.location.href=`${DownloadUrl.urls[1].url}?file=${res.path}`;
        }else {
          message.error("预览失败，权限不足")
        }
      }
    });
  }

  render(){
    const { data, moreBtnShow } = this.props;
    return (
      <div className={styles.report}>
        <Row className={styles.Row}>
          <Col md={6} className={styles.leftContent}>
            <div className={styles.echartPic}>
              <img src={data.img} alt={data.title} onClick={()=>this.previewHandle(data.id)} />
            </div>
          </Col>
          <Col md={18}>
            <div className={styles.titleContent}>
              <span className={styles.title} onClick={()=>this.previewHandle(data.id)}>{data.title}</span>
              <Tag color="#C099A9">{data.type}</Tag>
              <Tag color="#999999">{data.tabName}</Tag>
            </div>

            <Row className={styles.rowList}>
              <Col md={8}>
                录入人：{data.issue}
              </Col>
              <Col md={16}>
                分析部门：{data.deptName}
              </Col>
            </Row>
            <Row className={styles.rowList}>
              <Col md={8}>
                报告类型：{data.reportType}
              </Col>
              <Col md={8}>
                数据来源：{data.dataSource}
              </Col>
              <Col md={8}>
                报告时间：{data.reportTime}
              </Col>
            </Row>
            <Row className={styles.rowList}>
              <Col md={8}>
                报告周期：{data.reportCycle}
              </Col>
              <Col md={16}>
                浏览次数：{data.viewCount}
              </Col>
            </Row>
          </Col>
          {moreBtnShow ? <div onClick={()=>{this.moreHandle()}} className={styles.moreBtn}>更多&gt;&gt;</div> : null }
        </Row>
      </div>
    )
  }
}
export default report;
